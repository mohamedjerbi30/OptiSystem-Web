"""
Modulators: MZM, EAM, Phase Modulator
Apply insertion loss to the signal.
Advanced: modulates the spectral profile.
"""

import numpy as np
from ..base import OpticalComponent


class ModulatorMZM(OpticalComponent):
    """
    Mach-Zehnder Modulator
    In power budget mode: applies insertion loss.
    In spectral mode: can broaden the spectrum based on modulation.
    """

    def __init__(self, params: dict):
        super().__init__('Modulateur MZM', 'modulator_mzm', params)

    def process(self, signal: dict) -> dict:
        insertion_loss_db = self.params.get('insertionLoss', 4)
        extinction_ratio_db = self.params.get('extinctionRatio', 25)
        
        loss_linear = 10 ** (-insertion_loss_db / 10)
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * loss_linear
        signal['power_dbm'] -= insertion_loss_db
        signal['metadata'] = {
            **signal['metadata'],
            'modulator_type': 'MZM',
            'extinction_ratio_db': extinction_ratio_db,
        }
        return signal


class ModulatorEAM(OpticalComponent):
    """
    Electro-Absorption Modulator
    Compact, monolithically integrable with laser.
    """

    def __init__(self, params: dict):
        super().__init__('Modulateur EAM', 'modulator_eam', params)

    def process(self, signal: dict) -> dict:
        insertion_loss_db = self.params.get('insertionLoss', 5)
        
        loss_linear = 10 ** (-insertion_loss_db / 10)
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * loss_linear
        signal['power_dbm'] -= insertion_loss_db
        return signal


class PhaseModulator(OpticalComponent):
    """
    Phase Modulator — applies insertion loss.
    Phase modulation affects the phase array, not the PSD magnitude.
    """

    def __init__(self, params: dict):
        super().__init__('Modulateur Phase', 'modulator_phase', params)

    def process(self, signal: dict) -> dict:
        insertion_loss_db = self.params.get('insertionLoss', 3)
        
        loss_linear = 10 ** (-insertion_loss_db / 10)
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * loss_linear
        signal['power_dbm'] -= insertion_loss_db
        return signal
