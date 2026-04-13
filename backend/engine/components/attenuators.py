"""
Attenuators: VOA and Fixed Attenuator
P_out = P_in · 10^(-A/10)
"""

import numpy as np
from ..base import OpticalComponent


class VOA(OpticalComponent):
    """
    Variable Optical Attenuator
    P_out = P_in · 10^(-(attenuation + insertion_loss) / 10)
    """

    def __init__(self, params: dict):
        super().__init__('VOA', 'voa', params)

    def process(self, signal: dict) -> dict:
        attenuation_db = self.params.get('attenuation', 5)
        insertion_loss_db = self.params.get('insertionLoss', 0.8)
        
        total_loss_db = attenuation_db + insertion_loss_db
        loss_linear = 10 ** (-total_loss_db / 10)
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * loss_linear
        signal['power_dbm'] -= total_loss_db
        return signal


class FixedAttenuator(OpticalComponent):
    """
    Fixed Optical Attenuator
    P_out = P_in · 10^(-A/10)
    """

    def __init__(self, params: dict):
        super().__init__('Atténuateur Fixe', 'attenuator_fixed', params)

    def process(self, signal: dict) -> dict:
        attenuation_db = self.params.get('attenuation', 10)
        loss_linear = 10 ** (-attenuation_db / 10)
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * loss_linear
        signal['power_dbm'] -= attenuation_db
        return signal
