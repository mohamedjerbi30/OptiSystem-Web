"""
OptiSim Propagation Engine
Takes a chain of components from frontend and simulates the optical signal.
"""

import numpy as np
from typing import List, Dict, Any
from .components import COMPONENT_REGISTRY


class PropagationEngine:
    def __init__(self):
        pass

    def simulate_chain(self, chain_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Simulate an optical signal propagating through a chain of components.
        
        Args:
            chain_data: List of component dictionaries (type, params, id)
            
        Returns:
            Dictionary with final signal, spectrum data for plotting, and budget info.
        """
        if not chain_data:
            return {"error": "Empty chain"}

        # Find the first source component
        source_idx = -1
        for i, comp_data in enumerate(chain_data):
            if comp_data['type'] in ['laser_dfb', 'laser_fp', 'led']:
                source_idx = i
                break
                
        if source_idx == -1:
            return {"error": "No optical source found in the chain."}

        # Initialize the signal using the source
        source_data = chain_data[source_idx]
        source_class = COMPONENT_REGISTRY.get(source_data['type'])
        if not source_class:
            return {"error": f"Unknown source type: {source_data['type']}"}
            
        source_comp = source_class(source_data.get('params', {}))
        
        # We start the simulation here
        signal = source_comp.process()
        
        # Keep track of power at each stage for power budget charting
        power_points = [{
            "distance": 0.0,
            "power": signal['power_dbm'],
            "label": source_data.get('label', source_data['type'])
        }]
        
        current_distance = 0.0
        
        # Process remaining components
        for comp_data in chain_data[source_idx + 1:]:
            comp_type = comp_data['type']
            comp_class = COMPONENT_REGISTRY.get(comp_type)
            
            if not comp_class:
                continue
                
            comp = comp_class(comp_data.get('params', {}))
            
            # Record state before processing if it's a junction or amplifier
            comp_category = comp_type.split('_')[0] if '_' in comp_type else comp_type
            
            # Handle distance tracking for fibers
            is_fiber = comp_type in ['fiber_smf', 'fiber_mmf', 'fiber_dcf', 'pigtail']
            if is_fiber:
                length = comp_data.get('params', {}).get('length', {}).get('value', 0)
                # Instead of step-by-step in backend, we just do start and end points for the budget
                # More detailed step-by-step is handled in frontend for now, or we can add it here.
                # Process the signal
                signal = comp.process(signal)
                current_distance += length
                power_points.append({
                    "distance": current_distance,
                    "power": signal['power_dbm'],
                    "label": f"Fin {comp_data.get('shortLabel', comp_type)}"
                })
            else:
                # Process the signal
                power_before = signal['power_dbm']
                signal = comp.process(signal)
                power_after = signal['power_dbm']
                
                # Add points depending on component type
                if power_before != power_after:
                    power_points.append({
                        "distance": current_distance,
                        "power": power_before,
                        "label": f"Avant {comp_data.get('shortLabel', comp_type)}",
                        "isJunction": True if power_after < power_before else False,
                        "isAmplifier": True if power_after > power_before else False
                    })
                    power_points.append({
                        "distance": current_distance,
                        "power": power_after,
                        "label": f"Après {comp_data.get('shortLabel', comp_type)}",
                         "isJunction": True if power_after < power_before else False,
                        "isAmplifier": True if power_after > power_before else False
                    })
                elif comp_type in ['photodiode_pin', 'photodiode_apd']:
                    power_points.append({
                        "distance": current_distance,
                        "power": signal['power_dbm'],
                        "label": comp_data.get('label', comp_type),
                        "isReceiver": True
                    })

        # Prepare spectral data for frontend (downsample if necessary for JSON)
        # We might have 4096 points, maybe send 500 points to keep JSON small
        f = signal['frequency_array']
        psd = signal['power_spectral_density']
        
        # Downsample for frontend plotting
        target_points = 500
        if len(f) > target_points:
            indices = np.linspace(0, len(f) - 1, target_points, dtype=int)
            f_plot = f[indices]
            psd_plot = psd[indices]
        else:
            f_plot = f
            psd_plot = psd
            
        # Convert frequency to THz and PSD to dBm/nm or normalized for plotting
        f_thz = f_plot / 1e12
        
        # Prevent log(0)
        psd_safe = np.maximum(psd_plot, 1e-20)
        # 10*log10(W) = dBW. dBm = dBW + 30.
        # Note: This is PSD in dBm/Hz. For displaying, might want relative or normalized.
        psd_dbm_hz = 10 * np.log10(psd_safe) + 30
        
        spectrum_data = [
            {"frequency_thz": float(freq), "psd_dbm_hz": float(p)}
            for freq, p in zip(f_thz, psd_dbm_hz)
        ]

        # Extract basic metrics
        metrics = {
            "final_power_dbm": float(signal['power_dbm']),
            "center_frequency_thz": float(signal['center_frequency'] / 1e12),
        }
        if 'metadata' in signal:
            # Filter out numpy arrays or non-serializable objects if any
            for k, v in signal['metadata'].items():
                if isinstance(v, (int, float, str, bool)):
                    metrics[k] = v

        return {
            "status": "success",
            "spectrum": spectrum_data,
            "power_points": power_points,
            "metrics": metrics
        }
