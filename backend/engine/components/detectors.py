"""
Photodetectors: PIN and APD
Convert optical signal to electrical domain.
"""

import numpy as np
from ..base import OpticalComponent
from ..signal import dbm_to_watts, get_total_power_dbm


class PhotodiodePIN(OpticalComponent):
    """
    PIN Photodiode
    
    Photocurrent: I_ph = R · P_opt
    Shot noise: σ²_shot = 2·q·(I_ph + I_dark)·B_e
    Thermal noise: σ²_thermal = (4·k·T/R_L)·B_e
    """

    def __init__(self, params: dict):
        super().__init__('PIN Photodiode', 'photodiode_pin', params)

    def process(self, signal: dict) -> dict:
        sensitivity_dbm = self.params.get('sensitivity', -28)
        responsivity = self.params.get('responsivity', 0.9)  # A/W
        bandwidth_ghz = self.params.get('bandwidth', 10)
        dark_current_na = self.params.get('darkCurrent', 2)
        
        bandwidth_hz = bandwidth_ghz * 1e9
        dark_current_a = dark_current_na * 1e-9
        
        # Calculate received optical power
        received_power_dbm = get_total_power_dbm(signal)
        received_power_w = dbm_to_watts(received_power_dbm)
        
        # Photocurrent
        photocurrent = responsivity * received_power_w
        
        # Noise calculations
        q = 1.602e-19  # electron charge
        k = 1.381e-23  # Boltzmann constant
        T = 300         # temperature (K)
        R_L = 50        # load resistance (Ω)
        
        shot_noise_var = 2 * q * (photocurrent + dark_current_a) * bandwidth_hz
        thermal_noise_var = (4 * k * T / R_L) * bandwidth_hz
        total_noise_var = shot_noise_var + thermal_noise_var
        
        # SNR
        snr = (photocurrent ** 2) / total_noise_var if total_noise_var > 0 else float('inf')
        snr_db = 10 * np.log10(snr) if snr > 0 else -100
        
        signal = signal.copy()
        signal['metadata'] = {
            **signal['metadata'],
            'detector_type': 'PIN',
            'received_power_dbm': received_power_dbm,
            'photocurrent_a': photocurrent,
            'snr_db': snr_db,
            'is_above_sensitivity': received_power_dbm >= sensitivity_dbm,
            'margin_db': received_power_dbm - sensitivity_dbm,
        }
        
        return signal


class PhotodiodeAPD(OpticalComponent):
    """
    Avalanche Photodiode
    
    Multiplied photocurrent: I = M · R · P_opt
    Excess noise factor: F(M) = M^x
    Shot noise: σ²_shot = 2·q·M²·F(M)·(R·P_opt + I_dark)·B_e
    """

    def __init__(self, params: dict):
        super().__init__('APD Photodiode', 'photodiode_apd', params)

    def process(self, signal: dict) -> dict:
        sensitivity_dbm = self.params.get('sensitivity', -35)
        responsivity = self.params.get('responsivity', 0.85)
        gain_m = self.params.get('gainM', 10)
        excess_x = self.params.get('excessNoiseFactor', 0.7)
        bandwidth_ghz = self.params.get('bandwidth', 2.5)
        dark_current_na = self.params.get('darkCurrent', 50)
        
        bandwidth_hz = bandwidth_ghz * 1e9
        dark_current_a = dark_current_na * 1e-9
        
        received_power_dbm = get_total_power_dbm(signal)
        received_power_w = dbm_to_watts(received_power_dbm)
        
        # Multiplied photocurrent
        photocurrent = gain_m * responsivity * received_power_w
        
        # Excess noise factor F(M) = M^x
        excess_noise = gain_m ** excess_x
        
        # Noise
        q = 1.602e-19
        k = 1.381e-23
        T = 300
        R_L = 50
        
        shot_noise_var = 2 * q * (gain_m ** 2) * excess_noise * \
                         (responsivity * received_power_w + dark_current_a) * bandwidth_hz
        thermal_noise_var = (4 * k * T / R_L) * bandwidth_hz
        total_noise_var = shot_noise_var + thermal_noise_var
        
        snr = (photocurrent ** 2) / total_noise_var if total_noise_var > 0 else float('inf')
        snr_db = 10 * np.log10(snr) if snr > 0 else -100
        
        signal = signal.copy()
        signal['metadata'] = {
            **signal['metadata'],
            'detector_type': 'APD',
            'received_power_dbm': received_power_dbm,
            'photocurrent_a': photocurrent,
            'avalanche_gain': gain_m,
            'excess_noise_factor': excess_noise,
            'snr_db': snr_db,
            'is_above_sensitivity': received_power_dbm >= sensitivity_dbm,
            'margin_db': received_power_dbm - sensitivity_dbm,
        }
        
        return signal
