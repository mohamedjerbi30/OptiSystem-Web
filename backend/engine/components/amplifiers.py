"""
Optical Amplifiers: EDFA, SOA, Raman
Adds gain and ASE noise to the signal.
"""

import numpy as np
from ..base import OpticalComponent
from ..signal import dbm_to_watts, watts_to_dbm


class EDFA(OpticalComponent):
    """
    Erbium-Doped Fiber Amplifier
    
    Gain: G (dB), flat over bandwidth
    ASE Noise: P_ase = 2 · n_sp · h · ν · (G-1) · Δν
    Noise Figure: NF = 2·n_sp (ideal quantum limit NF=3dB)
    """

    def __init__(self, params: dict):
        super().__init__('EDFA', 'edfa', params)

    def process(self, signal: dict) -> dict:
        gain_db = self.params.get('gain', 20)
        noise_figure_db = self.params.get('noiseFigure', 5)
        sat_power_dbm = self.params.get('satPower', 17)
        bandwidth_nm = self.params.get('bandwidthNm', 35)
        
        gain_linear = 10 ** (gain_db / 10)
        nf_linear = 10 ** (noise_figure_db / 10)
        
        f = signal['frequency_array']
        psd = signal['power_spectral_density'].copy()
        
        # Apply gain
        psd_amplified = psd * gain_linear
        
        # Add ASE noise
        h = 6.626e-34  # Planck constant
        center_freq = signal['center_frequency']
        
        # n_sp from noise figure: NF = 2·n_sp·(1 - 1/G) for high gain ≈ 2·n_sp
        n_sp = nf_linear / 2
        
        # ASE PSD (per polarization, both polarizations)
        ase_psd = 2 * n_sp * h * center_freq * (gain_linear - 1)
        
        psd_out = psd_amplified + ase_psd
        
        # Saturation check
        new_power_dbm = signal['power_dbm'] + gain_db
        if new_power_dbm > sat_power_dbm:
            # Clamp to saturation power
            excess = new_power_dbm - sat_power_dbm
            actual_gain_db = gain_db - excess
            gain_actual = 10 ** (actual_gain_db / 10)
            psd_out = psd * gain_actual + ase_psd
            new_power_dbm = sat_power_dbm
        
        signal = signal.copy()
        signal['power_spectral_density'] = psd_out
        signal['power_dbm'] = new_power_dbm
        signal['metadata'] = {
            **signal['metadata'],
            'edfa_gain_db': gain_db,
            'edfa_nf_db': noise_figure_db,
            'ase_psd_per_hz': ase_psd,
        }
        
        return signal


class SOA(OpticalComponent):
    """
    Semiconductor Optical Amplifier
    Similar to EDFA but with higher noise and lower saturation.
    """

    def __init__(self, params: dict):
        super().__init__('SOA', 'soa', params)

    def process(self, signal: dict) -> dict:
        gain_db = self.params.get('gain', 15)
        noise_figure_db = self.params.get('noiseFigure', 8)
        sat_power_dbm = self.params.get('satPower', 10)
        
        gain_linear = 10 ** (gain_db / 10)
        nf_linear = 10 ** (noise_figure_db / 10)
        
        psd = signal['power_spectral_density'].copy()
        
        # Apply gain + ASE
        h = 6.626e-34
        n_sp = nf_linear / 2
        ase_psd = 2 * n_sp * h * signal['center_frequency'] * (gain_linear - 1)
        psd_out = psd * gain_linear + ase_psd
        
        new_power = min(signal['power_dbm'] + gain_db, sat_power_dbm)
        
        signal = signal.copy()
        signal['power_spectral_density'] = psd_out
        signal['power_dbm'] = new_power
        
        return signal


class RamanAmplifier(OpticalComponent):
    """
    Raman Amplifier — Distributed amplification.
    Lower noise figure than EDFA.
    """

    def __init__(self, params: dict):
        super().__init__('Raman', 'raman', params)

    def process(self, signal: dict) -> dict:
        gain_db = self.params.get('gain', 10)
        noise_figure_db = self.params.get('noiseFigure', 1)
        
        gain_linear = 10 ** (gain_db / 10)
        nf_linear = 10 ** (noise_figure_db / 10)
        
        psd = signal['power_spectral_density'].copy()
        
        h = 6.626e-34
        n_sp = nf_linear / 2
        ase_psd = 2 * n_sp * h * signal['center_frequency'] * (gain_linear - 1)
        psd_out = psd * gain_linear + ase_psd
        
        signal = signal.copy()
        signal['power_spectral_density'] = psd_out
        signal['power_dbm'] += gain_db
        
        return signal
