"""
WDM Components: Multiplexer and Demultiplexer
"""

import numpy as np
from ..base import OpticalComponent


class WDMMux(OpticalComponent):
    """
    WDM Multiplexer — combines multiple wavelength channels.
    In single-channel simulation: applies insertion loss.
    """

    def __init__(self, params: dict):
        super().__init__('WDM MUX', 'wdm_mux', params)

    def process(self, signal: dict) -> dict:
        insertion_loss_db = self.params.get('insertionLoss', 3.5)
        channels = int(self.params.get('channels', 8))
        spacing_ghz = self.params.get('spacing', 100)
        
        loss_linear = 10 ** (-insertion_loss_db / 10)
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * loss_linear
        signal['power_dbm'] -= insertion_loss_db
        signal['metadata'] = {
            **signal['metadata'],
            'wdm_type': 'MUX',
            'channels': channels,
            'spacing_ghz': spacing_ghz,
        }
        return signal


class WDMDemux(OpticalComponent):
    """
    WDM Demultiplexer — extracts a specific channel.
    Applies insertion loss + channel filtering.
    """

    def __init__(self, params: dict):
        super().__init__('WDM DEMUX', 'wdm_demux', params)

    def process(self, signal: dict) -> dict:
        insertion_loss_db = self.params.get('insertionLoss', 3.5)
        channels = int(self.params.get('channels', 8))
        spacing_ghz = self.params.get('spacing', 100)
        selected = int(self.params.get('selectedChannel', 1))
        
        loss_linear = 10 ** (-insertion_loss_db / 10)
        
        # Apply channel filtering (Gaussian passband around selected channel)
        f = signal['frequency_array']
        center = signal['center_frequency']
        
        # Channel center for selected channel
        channel_offset = (selected - (channels + 1) / 2) * spacing_ghz * 1e9
        channel_center = center + channel_offset
        channel_bw = spacing_ghz * 1e9 * 0.8  # 80% of spacing
        
        sigma = channel_bw / (2 * np.sqrt(2 * np.log(2)))
        H = np.exp(-((f - channel_center) ** 2) / (2 * sigma ** 2))
        
        signal = signal.copy()
        signal['power_spectral_density'] = signal['power_spectral_density'].copy() * H * loss_linear
        signal['power_dbm'] -= insertion_loss_db
        signal['metadata'] = {
            **signal['metadata'],
            'wdm_type': 'DEMUX',
            'selected_channel': selected,
        }
        return signal
