"""
Optical Sources: Laser DFB, Laser FP, LED
Generates optical signals with proper spectral profiles.
"""

import numpy as np
from ..base import OpticalComponent
from ..signal import create_signal, dbm_to_watts, wavelength_to_frequency


class LaserDFB(OpticalComponent):
    """
    DFB Laser Source — Single-mode laser with Lorentzian spectral profile.
    
    PSD: S(f) = (P_total / π) * (γ / ((f - f₀)² + γ²))
    where γ = Δν / 2 (half-width at half-maximum)
    """

    def __init__(self, params: dict):
        super().__init__('Laser DFB', 'laser_dfb', params)

    def process(self, signal: dict = None) -> dict:
        power_dbm = self.params.get('power', 0)
        wavelength_nm = self.params.get('wavelength', 1550)
        linewidth_mhz = self.params.get('linewidth', 10)
        
        center_freq = wavelength_to_frequency(wavelength_nm)
        linewidth_hz = linewidth_mhz * 1e6
        gamma = linewidth_hz / 2  # HWHM
        
        # Create signal with appropriate span (100x linewidth, min 10 GHz)
        freq_span = max(linewidth_hz * 100, 10e9)
        sig = create_signal(center_freq, power_dbm, num_points=4096, freq_span=freq_span)
        
        # Lorentzian PSD
        f = sig['frequency_array']
        total_power_watts = dbm_to_watts(power_dbm)
        
        psd = (total_power_watts / np.pi) * (gamma / ((f - center_freq) ** 2 + gamma ** 2))
        
        sig['power_spectral_density'] = psd
        sig['power_dbm'] = power_dbm
        sig['metadata']['source_type'] = 'DFB'
        sig['metadata']['wavelength_nm'] = wavelength_nm
        sig['metadata']['linewidth_hz'] = linewidth_hz
        sig['metadata']['rin_db_hz'] = self.params.get('rin', -155)
        
        return sig


class LaserFP(OpticalComponent):
    """
    Fabry-Pérot Laser — Multi-mode laser with multiple Lorentzian peaks.
    """

    def __init__(self, params: dict):
        super().__init__('Laser FP', 'laser_fp', params)

    def process(self, signal: dict = None) -> dict:
        power_dbm = self.params.get('power', -2)
        wavelength_nm = self.params.get('wavelength', 1310)
        spectral_width_nm = self.params.get('spectralWidth', 3)
        num_modes = int(self.params.get('modes', 5))
        
        center_freq = wavelength_to_frequency(wavelength_nm)
        
        # Convert spectral width from nm to Hz
        c = 299792458.0
        spectral_width_hz = (c / wavelength_nm ** 2) * spectral_width_nm * 1e9  # in Hz
        
        freq_span = spectral_width_hz * 5
        sig = create_signal(center_freq, power_dbm, num_points=4096, freq_span=freq_span)
        
        f = sig['frequency_array']
        total_power_watts = dbm_to_watts(power_dbm)
        power_per_mode = total_power_watts / num_modes
        
        # Mode spacing
        mode_spacing = spectral_width_hz / max(num_modes - 1, 1)
        mode_linewidth = spectral_width_hz / (num_modes * 10)  # narrow individual modes
        gamma = mode_linewidth / 2
        
        psd = np.zeros_like(f)
        for i in range(num_modes):
            f_mode = center_freq + (i - (num_modes - 1) / 2) * mode_spacing
            psd += (power_per_mode / np.pi) * (gamma / ((f - f_mode) ** 2 + gamma ** 2))
        
        sig['power_spectral_density'] = psd
        sig['power_dbm'] = power_dbm
        sig['metadata']['source_type'] = 'FP'
        sig['metadata']['wavelength_nm'] = wavelength_nm
        sig['metadata']['num_modes'] = num_modes
        
        return sig


class LED(OpticalComponent):
    """
    LED — Broad spectrum Gaussian emission profile.
    
    PSD: S(f) = (P / (σ√(2π))) * exp(-(f - f₀)² / (2σ²))
    """

    def __init__(self, params: dict):
        super().__init__('LED', 'led', params)

    def process(self, signal: dict = None) -> dict:
        power_dbm = self.params.get('power', -15)
        wavelength_nm = self.params.get('wavelength', 850)
        spectral_width_nm = self.params.get('spectralWidth', 40)
        
        center_freq = wavelength_to_frequency(wavelength_nm)
        
        # Convert spectral width nm → Hz
        c = 299792458.0
        spectral_width_hz = (c / wavelength_nm ** 2) * spectral_width_nm * 1e9
        
        sigma = spectral_width_hz / (2 * np.sqrt(2 * np.log(2)))  # FWHM to sigma
        
        freq_span = spectral_width_hz * 5
        sig = create_signal(center_freq, power_dbm, num_points=4096, freq_span=freq_span)
        
        f = sig['frequency_array']
        total_power_watts = dbm_to_watts(power_dbm)
        
        # Gaussian PSD
        psd = (total_power_watts / (sigma * np.sqrt(2 * np.pi))) * \
              np.exp(-((f - center_freq) ** 2) / (2 * sigma ** 2))
        
        sig['power_spectral_density'] = psd
        sig['power_dbm'] = power_dbm
        sig['metadata']['source_type'] = 'LED'
        sig['metadata']['wavelength_nm'] = wavelength_nm
        
        return sig
