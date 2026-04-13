"""
Passive Components: Connector, Splice, Coupler, Isolator, Circulator
Simple loss elements applied to the PSD.
"""

import numpy as np
from ..base import OpticalComponent


class Connector(OpticalComponent):
    """Optical Connector — insertion loss + return loss."""

    def __init__(self, params: dict):
        super().__init__('Connecteur', 'connector', params)

    def process(self, signal: dict) -> dict:
        loss_db = self.params.get('loss', 0.5)
        loss_linear = 10 ** (-loss_db / 10)
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * loss_linear
        signal['power_dbm'] -= loss_db
        return signal


class Splice(OpticalComponent):
    """Fusion Splice — small insertion loss."""

    def __init__(self, params: dict):
        super().__init__('Épissure', 'splice', params)

    def process(self, signal: dict) -> dict:
        loss_db = self.params.get('loss', 0.1)
        loss_linear = 10 ** (-loss_db / 10)
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * loss_linear
        signal['power_dbm'] -= loss_db
        return signal


class Coupler(OpticalComponent):
    """
    Optical Coupler / Splitter
    Loss = -10·log10(ratio) + excess_loss
    """

    def __init__(self, params: dict):
        super().__init__('Coupleur', 'coupler', params)

    def process(self, signal: dict) -> dict:
        ratio = self.params.get('ratio', 50) / 100.0
        excess_loss_db = self.params.get('excessLoss', 0.3)
        
        coupling_loss_db = -10 * np.log10(ratio) + excess_loss_db
        loss_linear = 10 ** (-coupling_loss_db / 10)
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * loss_linear
        signal['power_dbm'] -= coupling_loss_db
        signal['metadata'] = {
            **signal['metadata'],
            'coupling_ratio': ratio,
            'coupling_loss_db': coupling_loss_db,
        }
        return signal


class Isolator(OpticalComponent):
    """
    Optical Isolator — directional loss matrix.
    Forward: insertion_loss, Backward: isolation
    """

    def __init__(self, params: dict):
        super().__init__('Isolateur', 'isolator', params)

    def process(self, signal: dict) -> dict:
        insertion_loss_db = self.params.get('insertionLoss', 0.5)
        # isolation = self.params.get('isolation', 40)  # used for backward
        
        loss_linear = 10 ** (-insertion_loss_db / 10)
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * loss_linear
        signal['power_dbm'] -= insertion_loss_db
        return signal


class Circulator(OpticalComponent):
    """
    Optical Circulator — directional routing with insertion loss.
    Port 1→2, 2→3, 3→1 routing.
    """

    def __init__(self, params: dict):
        super().__init__('Circulateur', 'circulator', params)

    def process(self, signal: dict) -> dict:
        insertion_loss_db = self.params.get('insertionLoss', 0.7)
        
        loss_linear = 10 ** (-insertion_loss_db / 10)
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * loss_linear
        signal['power_dbm'] -= insertion_loss_db
        return signal
