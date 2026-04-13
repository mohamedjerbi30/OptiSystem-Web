"""
Optical Fibers: SMF, MMF, DCF, Pigtail
Applies attenuation, dispersion, and PMD to the signal.
"""

import numpy as np
from ..base import OpticalComponent
from ..signal import wavelength_to_frequency


class FiberSMF(OpticalComponent):
    """
    Single-Mode Fiber (ITU-T G.652)
    
    Attenuation: Linear loss α (dB/km)
    Chromatic Dispersion: Phase shift φ(f) = -π·D·L·λ²·(f-f₀)²/c
    PMD: Differential group delay ΔΤ = PMD_coeff × √L
    """

    def __init__(self, params: dict):
        super().__init__('Fibre SMF', 'fiber_smf', params)

    def process(self, signal: dict) -> dict:
        length_km = self.params.get('length', 20)
        attenuation = self.params.get('attenuation', 0.2)  # dB/km
        dispersion = self.params.get('dispersion', 17)  # ps/(nm·km)
        pmd_coeff = self.params.get('pmd', 0.1)  # ps/√km
        
        f = signal['frequency_array']
        psd = signal['power_spectral_density'].copy()
        phase = signal['phase'].copy()
        
        # ── Attenuation ──
        total_loss_db = attenuation * length_km
        loss_linear = 10 ** (-total_loss_db / 10)
        psd *= loss_linear
        
        # ── Chromatic Dispersion (phase effect) ──
        center_freq = signal['center_frequency']
        c = 299792458.0
        wavelength_m = c / center_freq
        
        # D in s/(m·m) → convert from ps/(nm·km)
        D_si = dispersion * 1e-6  # s/(m·m) approximately
        
        # Phase shift: φ(f) = -π · D · L · λ² · (f - f₀)² / c
        delta_f = f - center_freq
        dispersion_phase = -np.pi * D_si * (length_km * 1e3) * \
                           (wavelength_m ** 2) * (delta_f ** 2) / c
        phase += dispersion_phase
        
        # ── PMD ──
        dgd = pmd_coeff * np.sqrt(length_km) * 1e-12  # convert ps to s
        
        # Update signal
        signal = signal.copy()
        signal['power_spectral_density'] = psd
        signal['phase'] = phase
        signal['power_dbm'] = signal['power_dbm'] - total_loss_db
        signal['metadata'] = {
            **signal['metadata'],
            'fiber_type': 'SMF',
            'total_attenuation_db': total_loss_db,
            'accumulated_dispersion': dispersion * length_km,
            'dgd_ps': dgd * 1e12,
        }
        
        return signal


class FiberMMF(OpticalComponent):
    """
    Multi-Mode Fiber (OM3/OM4)
    Higher attenuation, modal bandwidth limited.
    """

    def __init__(self, params: dict):
        super().__init__('Fibre MMF', 'fiber_mmf', params)

    def process(self, signal: dict) -> dict:
        length_km = self.params.get('length', 0.3)
        attenuation = self.params.get('attenuation', 3.5)
        modal_bw = self.params.get('modalBandwidth', 2000)  # MHz·km
        
        total_loss_db = attenuation * length_km
        loss_linear = 10 ** (-total_loss_db / 10)
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * loss_linear
        signal['power_dbm'] -= total_loss_db
        signal['metadata'] = {
            **signal['metadata'],
            'fiber_type': 'MMF',
            'total_attenuation_db': total_loss_db,
            'effective_bandwidth_mhz': modal_bw / length_km if length_km > 0 else modal_bw,
        }
        
        return signal


class FiberDCF(OpticalComponent):
    """
    Dispersion Compensating Fiber
    Has NEGATIVE dispersion to compensate for SMF dispersion.
    Higher attenuation than SMF.
    """

    def __init__(self, params: dict):
        super().__init__('Fibre DCF', 'fiber_dcf', params)

    def process(self, signal: dict) -> dict:
        length_km = self.params.get('length', 5)
        attenuation = self.params.get('attenuation', 0.5)
        dispersion = self.params.get('dispersion', -80)  # NEGATIVE ps/(nm·km)
        
        f = signal['frequency_array']
        psd = signal['power_spectral_density'].copy()
        phase = signal['phase'].copy()
        
        # Attenuation
        total_loss_db = attenuation * length_km
        loss_linear = 10 ** (-total_loss_db / 10)
        psd *= loss_linear
        
        # Dispersion compensation (negative D)
        center_freq = signal['center_frequency']
        c = 299792458.0
        wavelength_m = c / center_freq
        D_si = dispersion * 1e-6
        delta_f = f - center_freq
        dispersion_phase = -np.pi * D_si * (length_km * 1e3) * \
                           (wavelength_m ** 2) * (delta_f ** 2) / c
        phase += dispersion_phase
        
        signal = signal.copy()
        signal['power_spectral_density'] = psd
        signal['phase'] = phase
        signal['power_dbm'] -= total_loss_db
        signal['metadata'] = {
            **signal['metadata'],
            'fiber_type': 'DCF',
            'total_attenuation_db': total_loss_db,
            'dispersion_compensation': dispersion * length_km,
        }
        
        return signal


class Pigtail(OpticalComponent):
    """Short fiber pigtail cable."""

    def __init__(self, params: dict):
        super().__init__('Pigtail', 'pigtail', params)

    def process(self, signal: dict) -> dict:
        length_km = self.params.get('length', 0.002)
        attenuation = self.params.get('attenuation', 0.3)
        
        total_loss_db = attenuation * length_km
        loss_linear = 10 ** (-total_loss_db / 10)
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * loss_linear
        signal['power_dbm'] -= total_loss_db
        
        return signal
