"""
OptiSim Base Component
Abstract base class for all optical components.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any


class OpticalComponent(ABC):
    """
    Abstract base class for all optical components in the simulation chain.
    
    Each component implements `process(signal_data)` which transforms
    the input signal and returns the modified signal.
    """

    def __init__(self, name: str, component_type: str, params: Dict[str, Any]):
        self.name = name
        self.component_type = component_type
        self.params = params

    @abstractmethod
    def process(self, signal: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process the input signal and return the modified signal.
        
        Args:
            signal: Signal dictionary containing frequency_array, 
                    power_spectral_density, phase, and metadata.
        
        Returns:
            Modified signal dictionary.
        """
        pass

    def get_info(self) -> Dict[str, Any]:
        """Return component information as a dictionary."""
        return {
            'name': self.name,
            'type': self.component_type,
            'params': self.params,
        }

    def __repr__(self):
        return f"{self.__class__.__name__}(name='{self.name}', params={self.params})"
