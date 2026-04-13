"""
OptiSim Signal Data Structure
Represents an optical signal as spectral vectors (NumPy arrays).
"""

import numpy as np
from typing import Optional, Dict, Any


def create_signal(
    center_frequency: float,
    power_dbm: float,
    num_points: int = 4096,
    freq_span: float = 1e12,  # 1 THz default span
) -> Dict[str, Any]:
    """
    Create a base signal dictionary.
    
    Args:
        center_frequency: Center frequency in Hz
        power_dbm: Total optical power in dBm
        num_points: Number of frequency points
        freq_span: Total frequency span in Hz
    
    Returns:
        Signal dictionary with frequency array, PSD, and phase.
    """
    frequency_array = np.linspace(
        center_frequency - freq_span / 2,
        center_frequency + freq_span / 2,
        num_points
    )
    
    return {
        'power_dbm': power_dbm,
        'center_frequency': center_frequency,  # Hz
        'frequency_array': frequency_array,     # Hz, shape (N,)
        'power_spectral_density': np.zeros(num_points),  # W/Hz, shape (N,)
        'phase': np.zeros(num_points),          # rad, shape (N,)
        'metadata': {
            'num_points': num_points,
            'freq_span': freq_span,
            'freq_resolution': freq_span / num_points,
        },
    }


def dbm_to_watts(power_dbm: float) -> float:
    """Convert dBm to Watts."""
    return 10 ** ((power_dbm - 30) / 10)


def watts_to_dbm(power_watts: float) -> float:
    """Convert Watts to dBm."""
    if power_watts <= 0:
        return -100.0  # floor
    return 10 * np.log10(power_watts) + 30


def wavelength_to_frequency(wavelength_nm: float) -> float:
    """Convert wavelength (nm) to frequency (Hz)."""
    c = 299792458.0  # m/s
    return c / (wavelength_nm * 1e-9)


def frequency_to_wavelength(frequency_hz: float) -> float:
    """Convert frequency (Hz) to wavelength (nm)."""
    c = 299792458.0
    return c / frequency_hz * 1e9


def get_total_power_dbm(signal: Dict[str, Any]) -> float:
    """Calculate total power by integrating the PSD."""
    psd = signal['power_spectral_density']
    freq = signal['frequency_array']
    
    if len(freq) < 2:
        return -100.0
    
    df = np.abs(freq[1] - freq[0])
    total_power_watts = np.sum(psd) * df
    
    return watts_to_dbm(total_power_watts)


def validate_spectral_overlap(signal1: Dict, signal2_freq: np.ndarray) -> bool:
    """
    Check if two frequency arrays have spectral overlap.
    Raises ValueError if no overlap.
    """
    min1, max1 = signal1['frequency_array'][0], signal1['frequency_array'][-1]
    min2, max2 = signal2_freq[0], signal2_freq[-1]
    
    overlap = min(max1, max2) - max(min1, min2)
    if overlap <= 0:
        raise ValueError(
            f"No spectral overlap between signals. "
            f"Signal1: [{min1/1e12:.3f}, {max1/1e12:.3f}] THz, "
            f"Signal2: [{min2/1e12:.3f}, {max2/1e12:.3f}] THz"
        )
    return True
