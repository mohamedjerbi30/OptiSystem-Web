"""
Optical Filters: Gaussian, Butterworth, FBG, AWG
Apply frequency-dependent transfer functions to the signal.
"""

import numpy as np
from ..base import OpticalComponent
from ..signal import wavelength_to_frequency


class GaussianFilter(OpticalComponent):
    """
    Gaussian Optical Filter
    
    H(f) = exp(-2·ln(2)·((f-f_c)/B)^(2n))
    
    where B is the -3dB bandwidth and n is the order.
    """

    def __init__(self, params: dict):
        super().__init__('Filtre Gaussien', 'filter_gaussian', params)

    def process(self, signal: dict) -> dict:
        center_freq_thz = self.params.get('centerFreq', 193.1)
        bandwidth_ghz = self.params.get('bandwidth', 50)
        order = int(self.params.get('order', 1))
        insertion_loss_db = self.params.get('insertionLoss', 1)
        
        center_freq_hz = center_freq_thz * 1e12
        bandwidth_hz = bandwidth_ghz * 1e9
        
        f = signal['frequency_array']
        
        # Gaussian transfer function
        H = np.exp(-2 * np.log(2) * ((f - center_freq_hz) / bandwidth_hz) ** (2 * order))
        
        # Apply insertion loss
        il_linear = 10 ** (-insertion_loss_db / 10)
        H *= il_linear
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * H
        signal['power_dbm'] -= insertion_loss_db
        signal['metadata'] = {
            **signal['metadata'],
            'filter_type': 'Gaussian',
            'filter_center_thz': center_freq_thz,
            'filter_bw_ghz': bandwidth_ghz,
        }
        return signal


class ButterworthFilter(OpticalComponent):
    """
    Butterworth Optical Filter (flat-top response)
    
    H(f) = 1 / sqrt(1 + ((f-f_c) / (B/2))^(2n))
    """

    def __init__(self, params: dict):
        super().__init__('Filtre Butterworth', 'filter_butterworth', params)

    def process(self, signal: dict) -> dict:
        center_freq_thz = self.params.get('centerFreq', 193.1)
        bandwidth_ghz = self.params.get('bandwidth', 50)
        order = int(self.params.get('order', 4))
        insertion_loss_db = self.params.get('insertionLoss', 1.5)
        
        center_freq_hz = center_freq_thz * 1e12
        half_bw_hz = (bandwidth_ghz * 1e9) / 2
        
        f = signal['frequency_array']
        
        # Butterworth transfer function (power)
        H_power = 1 / (1 + ((f - center_freq_hz) / half_bw_hz) ** (2 * order))
        
        il_linear = 10 ** (-insertion_loss_db / 10)
        H_power *= il_linear
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * H_power
        signal['power_dbm'] -= insertion_loss_db
        return signal


class FBG(OpticalComponent):
    """
    Fiber Bragg Grating
    Reflects a narrow band around the Bragg wavelength.
    In transmission mode: notch filter. In reflection: bandpass.
    Here modeled in reflection mode (bandpass).
    """

    def __init__(self, params: dict):
        super().__init__('FBG', 'fbg', params)

    def process(self, signal: dict) -> dict:
        bragg_wavelength_nm = self.params.get('braggWavelength', 1550)
        bandwidth_nm = self.params.get('bandwidth', 0.2)
        reflectivity = self.params.get('reflectivity', 99) / 100.0
        insertion_loss_db = self.params.get('insertionLoss', 0.3)
        
        bragg_freq = wavelength_to_frequency(bragg_wavelength_nm)
        
        # Convert bandwidth from nm to Hz
        c = 299792458.0
        bw_hz = (c / bragg_wavelength_nm ** 2) * bandwidth_nm * 1e9
        
        f = signal['frequency_array']
        
        # Gaussian reflection profile
        sigma = bw_hz / (2 * np.sqrt(2 * np.log(2)))
        H = reflectivity * np.exp(-((f - bragg_freq) ** 2) / (2 * sigma ** 2))
        
        il_linear = 10 ** (-insertion_loss_db / 10)
        H *= il_linear
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * H
        signal['power_dbm'] -= insertion_loss_db
        return signal


class AWG(OpticalComponent):
    """
    Arrayed Waveguide Grating
    Multi-channel spectral router. Modeled as insertion loss.
    """

    def __init__(self, params: dict):
        super().__init__('AWG', 'awg', params)

    def process(self, signal: dict) -> dict:
        insertion_loss_db = self.params.get('insertionLoss', 3)
        
        loss_linear = 10 ** (-insertion_loss_db / 10)
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * loss_linear
        signal['power_dbm'] -= insertion_loss_db
        return signal
