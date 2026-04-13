# OptiSim Components Package
from .sources import LaserDFB, LaserFP, LED
from .fibers import FiberSMF, FiberMMF, FiberDCF, Pigtail
from .amplifiers import EDFA, SOA, RamanAmplifier
from .passive import Connector, Splice, Coupler, Isolator, Circulator
from .modulators import ModulatorMZM, ModulatorEAM, PhaseModulator
from .filters import GaussianFilter, ButterworthFilter, FBG, AWG
from .detectors import PhotodiodePIN, PhotodiodeAPD
from .wdm import WDMMux, WDMDemux
from .attenuators import VOA, FixedAttenuator

# Registry: maps frontend type strings to backend classes
COMPONENT_REGISTRY = {
    'laser_dfb': LaserDFB,
    'laser_fp': LaserFP,
    'led': LED,
    'modulator_mzm': ModulatorMZM,
    'modulator_eam': ModulatorEAM,
    'modulator_phase': PhaseModulator,
    'fiber_smf': FiberSMF,
    'fiber_mmf': FiberMMF,
    'fiber_dcf': FiberDCF,
    'pigtail': Pigtail,
    'edfa': EDFA,
    'soa': SOA,
    'raman': RamanAmplifier,
    'connector': Connector,
    'splice': Splice,
    'coupler': Coupler,
    'isolator': Isolator,
    'circulator': Circulator,
    'voa': VOA,
    'attenuator_fixed': FixedAttenuator,
    'filter_gaussian': GaussianFilter,
    'filter_butterworth': ButterworthFilter,
    'fbg': FBG,
    'awg': AWG,
    'wdm_mux': WDMMux,
    'wdm_demux': WDMDemux,
    'photodiode_pin': PhotodiodePIN,
    'photodiode_apd': PhotodiodeAPD,
}
