/**
 * Complete Optical Component Library for OptiSim
 * 20+ component types with full parameters
 * All power values in dBm, losses in dB, distances in km
 */

export const COMPONENT_TYPES = {
  // Sources
  LASER_DFB: 'laser_dfb',
  LASER_FP: 'laser_fp',
  LED: 'led',
  // Modulators
  MODULATOR_MZM: 'modulator_mzm',
  MODULATOR_EAM: 'modulator_eam',
  MODULATOR_PHASE: 'modulator_phase',
  // Fibers
  FIBER_SMF: 'fiber_smf',
  FIBER_MMF: 'fiber_mmf',
  FIBER_DCF: 'fiber_dcf',
  PIGTAIL: 'pigtail',
  // Amplifiers
  EDFA: 'edfa',
  SOA: 'soa',
  RAMAN: 'raman',
  // Passive / Junctions
  CONNECTOR: 'connector',
  SPLICE: 'splice',
  COUPLER: 'coupler',
  ISOLATOR: 'isolator',
  CIRCULATOR: 'circulator',
  VOA: 'voa',
  ATTENUATOR_FIXED: 'attenuator_fixed',
  // Filters
  FILTER_GAUSSIAN: 'filter_gaussian',
  FILTER_BUTTERWORTH: 'filter_butterworth',
  FBG: 'fbg',
  AWG: 'awg',
  // WDM
  WDM_MUX: 'wdm_mux',
  WDM_DEMUX: 'wdm_demux',
  // Detectors
  PHOTODIODE_PIN: 'photodiode_pin',
  PHOTODIODE_APD: 'photodiode_apd',
};

export const COMPONENT_DEFAULTS = {

  // ═══════════════════════════════════════
  //  SOURCES
  // ═══════════════════════════════════════

  [COMPONENT_TYPES.LASER_DFB]: {
    type: COMPONENT_TYPES.LASER_DFB,
    label: 'Laser DFB',
    shortLabel: 'DFB',
    icon: 'Zap',
    color: '#06d6e0',
    category: 'sources',
    description: 'Laser monomode à rétroaction distribuée',
    params: {
      power: { value: 0, unit: 'dBm', label: 'Puissance de sortie', min: -10, max: 20, step: 0.5 },
      wavelength: { value: 1550, unit: 'nm', label: 'Longueur d\'onde', min: 800, max: 1625, step: 0.01 },
      linewidth: { value: 10, unit: 'MHz', label: 'Largeur spectrale (Δν)', min: 0.1, max: 100, step: 0.1 },
      rin: { value: -155, unit: 'dB/Hz', label: 'RIN', min: -170, max: -120, step: 1 },
    },
  },

  [COMPONENT_TYPES.LASER_FP]: {
    type: COMPONENT_TYPES.LASER_FP,
    label: 'Laser Fabry-Pérot',
    shortLabel: 'FP',
    icon: 'Zap',
    color: '#22d3ee',
    category: 'sources',
    description: 'Laser multimode Fabry-Pérot',
    params: {
      power: { value: -2, unit: 'dBm', label: 'Puissance de sortie', min: -10, max: 15, step: 0.5 },
      wavelength: { value: 1310, unit: 'nm', label: 'Longueur d\'onde centrale', min: 800, max: 1625, step: 1 },
      spectralWidth: { value: 3, unit: 'nm', label: 'Largeur spectrale (Δλ)', min: 0.5, max: 10, step: 0.1 },
      modes: { value: 5, unit: '', label: 'Nombre de modes', min: 1, max: 20, step: 1 },
    },
  },

  [COMPONENT_TYPES.LED]: {
    type: COMPONENT_TYPES.LED,
    label: 'LED',
    shortLabel: 'LED',
    icon: 'Lightbulb',
    color: '#fbbf24',
    category: 'sources',
    description: 'Diode électroluminescente',
    params: {
      power: { value: -15, unit: 'dBm', label: 'Puissance de sortie', min: -30, max: 0, step: 0.5 },
      wavelength: { value: 850, unit: 'nm', label: 'Longueur d\'onde centrale', min: 600, max: 1600, step: 1 },
      spectralWidth: { value: 40, unit: 'nm', label: 'Largeur spectrale (Δλ)', min: 10, max: 100, step: 1 },
    },
  },

  // ═══════════════════════════════════════
  //  MODULATORS
  // ═══════════════════════════════════════

  [COMPONENT_TYPES.MODULATOR_MZM]: {
    type: COMPONENT_TYPES.MODULATOR_MZM,
    label: 'Modulateur Mach-Zehnder',
    shortLabel: 'MZM',
    icon: 'ToggleRight',
    color: '#a78bfa',
    category: 'modulators',
    description: 'Modulateur d\'intensité Mach-Zehnder',
    params: {
      insertionLoss: { value: 4, unit: 'dB', label: 'Perte d\'insertion', min: 1, max: 12, step: 0.5 },
      extinctionRatio: { value: 25, unit: 'dB', label: 'Taux d\'extinction', min: 10, max: 40, step: 1 },
      vPi: { value: 4, unit: 'V', label: 'Tension Vπ', min: 1, max: 10, step: 0.1 },
      bandwidth: { value: 25, unit: 'GHz', label: 'Bande passante', min: 1, max: 100, step: 1 },
    },
  },

  [COMPONENT_TYPES.MODULATOR_EAM]: {
    type: COMPONENT_TYPES.MODULATOR_EAM,
    label: 'Modulateur EAM',
    shortLabel: 'EAM',
    icon: 'ToggleRight',
    color: '#c084fc',
    category: 'modulators',
    description: 'Modulateur à électro-absorption',
    params: {
      insertionLoss: { value: 5, unit: 'dB', label: 'Perte d\'insertion', min: 2, max: 12, step: 0.5 },
      extinctionRatio: { value: 15, unit: 'dB', label: 'Taux d\'extinction', min: 5, max: 30, step: 1 },
      bandwidth: { value: 40, unit: 'GHz', label: 'Bande passante', min: 5, max: 60, step: 1 },
    },
  },

  [COMPONENT_TYPES.MODULATOR_PHASE]: {
    type: COMPONENT_TYPES.MODULATOR_PHASE,
    label: 'Modulateur de Phase',
    shortLabel: 'PM',
    icon: 'ToggleRight',
    color: '#818cf8',
    category: 'modulators',
    description: 'Modulateur de phase électro-optique',
    params: {
      insertionLoss: { value: 3, unit: 'dB', label: 'Perte d\'insertion', min: 1, max: 8, step: 0.5 },
      vPi: { value: 3.5, unit: 'V', label: 'Tension Vπ', min: 1, max: 10, step: 0.1 },
      bandwidth: { value: 30, unit: 'GHz', label: 'Bande passante', min: 5, max: 60, step: 1 },
    },
  },

  // ═══════════════════════════════════════
  //  FIBERS
  // ═══════════════════════════════════════

  [COMPONENT_TYPES.FIBER_SMF]: {
    type: COMPONENT_TYPES.FIBER_SMF,
    label: 'Fibre SMF (G.652)',
    shortLabel: 'SMF',
    icon: 'Cable',
    color: '#3b82f6',
    category: 'fibers',
    description: 'Fibre monomode standard ITU-T G.652',
    params: {
      length: { value: 20, unit: 'km', label: 'Longueur', min: 0.1, max: 200, step: 0.1 },
      attenuation: { value: 0.2, unit: 'dB/km', label: 'Atténuation', min: 0.15, max: 0.5, step: 0.01 },
      dispersion: { value: 17, unit: 'ps/nm·km', label: 'Dispersion chromatique', min: 0, max: 22, step: 0.1 },
      pmd: { value: 0.1, unit: 'ps/√km', label: 'PMD', min: 0.01, max: 1, step: 0.01 },
    },
  },

  [COMPONENT_TYPES.FIBER_MMF]: {
    type: COMPONENT_TYPES.FIBER_MMF,
    label: 'Fibre MMF (OM3)',
    shortLabel: 'MMF',
    icon: 'Cable',
    color: '#60a5fa',
    category: 'fibers',
    description: 'Fibre multimode OM3',
    params: {
      length: { value: 0.3, unit: 'km', label: 'Longueur', min: 0.01, max: 2, step: 0.01 },
      attenuation: { value: 3.5, unit: 'dB/km', label: 'Atténuation (850nm)', min: 1, max: 5, step: 0.1 },
      modalBandwidth: { value: 2000, unit: 'MHz·km', label: 'Bande passante modale', min: 200, max: 5000, step: 100 },
    },
  },

  [COMPONENT_TYPES.FIBER_DCF]: {
    type: COMPONENT_TYPES.FIBER_DCF,
    label: 'Fibre DCF',
    shortLabel: 'DCF',
    icon: 'Cable',
    color: '#2563eb',
    category: 'fibers',
    description: 'Fibre à compensation de dispersion',
    params: {
      length: { value: 5, unit: 'km', label: 'Longueur', min: 0.1, max: 30, step: 0.1 },
      attenuation: { value: 0.5, unit: 'dB/km', label: 'Atténuation', min: 0.3, max: 1, step: 0.01 },
      dispersion: { value: -80, unit: 'ps/nm·km', label: 'Dispersion (négatif)', min: -200, max: -20, step: 1 },
    },
  },

  [COMPONENT_TYPES.PIGTAIL]: {
    type: COMPONENT_TYPES.PIGTAIL,
    label: 'Câble Pigtail',
    shortLabel: 'Pigtail',
    icon: 'Waypoints',
    color: '#93c5fd',
    category: 'fibers',
    description: 'Câble court avec connecteur',
    params: {
      length: { value: 0.002, unit: 'km', label: 'Longueur', min: 0.001, max: 0.05, step: 0.001 },
      attenuation: { value: 0.3, unit: 'dB/km', label: 'Atténuation', min: 0.1, max: 1, step: 0.01 },
    },
  },

  // ═══════════════════════════════════════
  //  AMPLIFIERS
  // ═══════════════════════════════════════

  [COMPONENT_TYPES.EDFA]: {
    type: COMPONENT_TYPES.EDFA,
    label: 'Amplificateur EDFA',
    shortLabel: 'EDFA',
    icon: 'TrendingUp',
    color: '#10b981',
    category: 'amplifiers',
    description: 'Amplificateur à fibre dopée Erbium',
    params: {
      gain: { value: 20, unit: 'dB', label: 'Gain', min: 5, max: 40, step: 0.5 },
      noiseFigure: { value: 5, unit: 'dB', label: 'Facteur de bruit (NF)', min: 3, max: 8, step: 0.1 },
      satPower: { value: 17, unit: 'dBm', label: 'Puissance de saturation', min: 10, max: 25, step: 0.5 },
      bandwidthNm: { value: 35, unit: 'nm', label: 'Bande passante (C-band)', min: 20, max: 80, step: 1 },
    },
  },

  [COMPONENT_TYPES.SOA]: {
    type: COMPONENT_TYPES.SOA,
    label: 'Amplificateur SOA',
    shortLabel: 'SOA',
    icon: 'TrendingUp',
    color: '#34d399',
    category: 'amplifiers',
    description: 'Amplificateur optique à semi-conducteur',
    params: {
      gain: { value: 15, unit: 'dB', label: 'Gain', min: 5, max: 30, step: 0.5 },
      noiseFigure: { value: 8, unit: 'dB', label: 'Facteur de bruit (NF)', min: 5, max: 12, step: 0.1 },
      satPower: { value: 10, unit: 'dBm', label: 'Puissance de saturation', min: 5, max: 20, step: 0.5 },
    },
  },

  [COMPONENT_TYPES.RAMAN]: {
    type: COMPONENT_TYPES.RAMAN,
    label: 'Amplificateur Raman',
    shortLabel: 'Raman',
    icon: 'TrendingUp',
    color: '#6ee7b7',
    category: 'amplifiers',
    description: 'Amplification Raman distribuée',
    params: {
      gain: { value: 10, unit: 'dB', label: 'Gain net', min: 2, max: 25, step: 0.5 },
      pumpPower: { value: 300, unit: 'mW', label: 'Puissance de pompe', min: 50, max: 1000, step: 10 },
      noiseFigure: { value: 1, unit: 'dB', label: 'Facteur de bruit', min: -1, max: 5, step: 0.1 },
    },
  },

  // ═══════════════════════════════════════
  //  PASSIVE / JUNCTIONS
  // ═══════════════════════════════════════

  [COMPONENT_TYPES.CONNECTOR]: {
    type: COMPONENT_TYPES.CONNECTOR,
    label: 'Connecteur (SC/FC/LC)',
    shortLabel: 'Conn',
    icon: 'Plug',
    color: '#f59e0b',
    category: 'passive',
    description: 'Connecteur optique',
    params: {
      loss: { value: 0.5, unit: 'dB', label: 'Perte d\'insertion', min: 0.1, max: 3, step: 0.1 },
      returnLoss: { value: -40, unit: 'dB', label: 'Return loss', min: -60, max: -20, step: 1 },
    },
  },

  [COMPONENT_TYPES.SPLICE]: {
    type: COMPONENT_TYPES.SPLICE,
    label: 'Épissure (Fusion)',
    shortLabel: 'Splice',
    icon: 'Link',
    color: '#fb923c',
    category: 'passive',
    description: 'Épissure par fusion',
    params: {
      loss: { value: 0.1, unit: 'dB', label: 'Perte unitaire', min: 0.01, max: 1, step: 0.01 },
    },
  },

  [COMPONENT_TYPES.COUPLER]: {
    type: COMPONENT_TYPES.COUPLER,
    label: 'Coupleur / Splitter',
    shortLabel: 'Coupl',
    icon: 'GitBranch',
    color: '#fbbf24',
    category: 'passive',
    description: 'Coupleur directionnel / splitter',
    params: {
      ratio: { value: 50, unit: '%', label: 'Ratio de couplage', min: 1, max: 99, step: 1 },
      excessLoss: { value: 0.3, unit: 'dB', label: 'Perte excès', min: 0, max: 2, step: 0.1 },
      ports: { value: 2, unit: '', label: 'Nombre de ports sortie', min: 2, max: 64, step: 1 },
    },
  },

  [COMPONENT_TYPES.ISOLATOR]: {
    type: COMPONENT_TYPES.ISOLATOR,
    label: 'Isolateur Optique',
    shortLabel: 'Isol',
    icon: 'ArrowRightCircle',
    color: '#e879f9',
    category: 'passive',
    description: 'Passage unidirectionnel du signal',
    params: {
      insertionLoss: { value: 0.5, unit: 'dB', label: 'Perte d\'insertion', min: 0.2, max: 2, step: 0.1 },
      isolation: { value: 40, unit: 'dB', label: 'Isolation', min: 20, max: 60, step: 1 },
    },
  },

  [COMPONENT_TYPES.CIRCULATOR]: {
    type: COMPONENT_TYPES.CIRCULATOR,
    label: 'Circulateur',
    shortLabel: 'Circ',
    icon: 'RotateCw',
    color: '#d946ef',
    category: 'passive',
    description: 'Circulateur optique N ports',
    params: {
      insertionLoss: { value: 0.7, unit: 'dB', label: 'Perte d\'insertion', min: 0.3, max: 2, step: 0.1 },
      isolation: { value: 40, unit: 'dB', label: 'Isolation', min: 20, max: 60, step: 1 },
      ports: { value: 3, unit: '', label: 'Nombre de ports', min: 3, max: 4, step: 1 },
    },
  },

  [COMPONENT_TYPES.VOA]: {
    type: COMPONENT_TYPES.VOA,
    label: 'Atténuateur Variable (VOA)',
    shortLabel: 'VOA',
    icon: 'SlidersHorizontal',
    color: '#f97316',
    category: 'passive',
    description: 'Atténuateur optique variable',
    params: {
      attenuation: { value: 5, unit: 'dB', label: 'Atténuation', min: 0, max: 30, step: 0.5 },
      insertionLoss: { value: 0.8, unit: 'dB', label: 'Perte d\'insertion min', min: 0.3, max: 2, step: 0.1 },
    },
  },

  [COMPONENT_TYPES.ATTENUATOR_FIXED]: {
    type: COMPONENT_TYPES.ATTENUATOR_FIXED,
    label: 'Atténuateur Fixe',
    shortLabel: 'Att',
    icon: 'Minus',
    color: '#ea580c',
    category: 'passive',
    description: 'Atténuateur à valeur fixe',
    params: {
      attenuation: { value: 10, unit: 'dB', label: 'Atténuation', min: 1, max: 30, step: 1 },
    },
  },

  // ═══════════════════════════════════════
  //  FILTERS
  // ═══════════════════════════════════════

  [COMPONENT_TYPES.FILTER_GAUSSIAN]: {
    type: COMPONENT_TYPES.FILTER_GAUSSIAN,
    label: 'Filtre Gaussien',
    shortLabel: 'FGauss',
    icon: 'Filter',
    color: '#14b8a6',
    category: 'filters',
    description: 'Filtre passe-bande gaussien',
    params: {
      centerFreq: { value: 193.1, unit: 'THz', label: 'Fréquence centrale', min: 186, max: 201, step: 0.1 },
      bandwidth: { value: 50, unit: 'GHz', label: 'Bande passante (-3dB)', min: 5, max: 200, step: 5 },
      order: { value: 1, unit: '', label: 'Ordre du filtre', min: 1, max: 8, step: 1 },
      insertionLoss: { value: 1, unit: 'dB', label: 'Perte d\'insertion', min: 0.2, max: 5, step: 0.1 },
    },
  },

  [COMPONENT_TYPES.FILTER_BUTTERWORTH]: {
    type: COMPONENT_TYPES.FILTER_BUTTERWORTH,
    label: 'Filtre Butterworth',
    shortLabel: 'FButter',
    icon: 'Filter',
    color: '#2dd4bf',
    category: 'filters',
    description: 'Filtre passe-bande Butterworth (flat-top)',
    params: {
      centerFreq: { value: 193.1, unit: 'THz', label: 'Fréquence centrale', min: 186, max: 201, step: 0.1 },
      bandwidth: { value: 50, unit: 'GHz', label: 'Bande passante (-3dB)', min: 5, max: 200, step: 5 },
      order: { value: 4, unit: '', label: 'Ordre du filtre', min: 1, max: 12, step: 1 },
      insertionLoss: { value: 1.5, unit: 'dB', label: 'Perte d\'insertion', min: 0.5, max: 5, step: 0.1 },
    },
  },

  [COMPONENT_TYPES.FBG]: {
    type: COMPONENT_TYPES.FBG,
    label: 'Réseau de Bragg (FBG)',
    shortLabel: 'FBG',
    icon: 'Waves',
    color: '#0d9488',
    category: 'filters',
    description: 'Filtre par réseau de Bragg fibré',
    params: {
      braggWavelength: { value: 1550, unit: 'nm', label: 'Longueur d\'onde de Bragg', min: 1500, max: 1600, step: 0.01 },
      bandwidth: { value: 0.2, unit: 'nm', label: 'Bande passante (Δλ)', min: 0.05, max: 5, step: 0.01 },
      reflectivity: { value: 99, unit: '%', label: 'Réflectivité', min: 50, max: 99.9, step: 0.1 },
      insertionLoss: { value: 0.3, unit: 'dB', label: 'Perte d\'insertion', min: 0.1, max: 2, step: 0.1 },
    },
  },

  [COMPONENT_TYPES.AWG]: {
    type: COMPONENT_TYPES.AWG,
    label: 'AWG (Arrayed Waveguide)',
    shortLabel: 'AWG',
    icon: 'Layers',
    color: '#5eead4',
    category: 'filters',
    description: 'Routeur spectral AWG',
    params: {
      channels: { value: 8, unit: '', label: 'Nombre de canaux', min: 2, max: 96, step: 1 },
      spacing: { value: 100, unit: 'GHz', label: 'Espacement canaux', min: 25, max: 200, step: 25 },
      insertionLoss: { value: 3, unit: 'dB', label: 'Perte d\'insertion', min: 1, max: 8, step: 0.5 },
      crosstalk: { value: -30, unit: 'dB', label: 'Diaphonie', min: -45, max: -15, step: 1 },
    },
  },

  // ═══════════════════════════════════════
  //  WDM
  // ═══════════════════════════════════════

  [COMPONENT_TYPES.WDM_MUX]: {
    type: COMPONENT_TYPES.WDM_MUX,
    label: 'WDM Multiplexeur',
    shortLabel: 'MUX',
    icon: 'Merge',
    color: '#06b6d4',
    category: 'wdm',
    description: 'Multiplexeur en longueur d\'onde',
    params: {
      channels: { value: 8, unit: '', label: 'Nombre de canaux', min: 2, max: 96, step: 1 },
      spacing: { value: 100, unit: 'GHz', label: 'Espacement canaux', min: 25, max: 200, step: 25 },
      insertionLoss: { value: 3.5, unit: 'dB', label: 'Perte d\'insertion', min: 1, max: 8, step: 0.5 },
    },
  },

  [COMPONENT_TYPES.WDM_DEMUX]: {
    type: COMPONENT_TYPES.WDM_DEMUX,
    label: 'WDM Démultiplexeur',
    shortLabel: 'DEMUX',
    icon: 'Split',
    color: '#0891b2',
    category: 'wdm',
    description: 'Démultiplexeur en longueur d\'onde',
    params: {
      channels: { value: 8, unit: '', label: 'Nombre de canaux', min: 2, max: 96, step: 1 },
      spacing: { value: 100, unit: 'GHz', label: 'Espacement canaux', min: 25, max: 200, step: 25 },
      insertionLoss: { value: 3.5, unit: 'dB', label: 'Perte d\'insertion', min: 1, max: 8, step: 0.5 },
      selectedChannel: { value: 1, unit: '', label: 'Canal sélectionné', min: 1, max: 96, step: 1 },
    },
  },

  // ═══════════════════════════════════════
  //  DETECTORS
  // ═══════════════════════════════════════

  [COMPONENT_TYPES.PHOTODIODE_PIN]: {
    type: COMPONENT_TYPES.PHOTODIODE_PIN,
    label: 'Photodiode PIN',
    shortLabel: 'PIN',
    icon: 'Radio',
    color: '#8b5cf6',
    category: 'detectors',
    description: 'Photodiode PIN InGaAs',
    params: {
      sensitivity: { value: -28, unit: 'dBm', label: 'Sensibilité', min: -40, max: -10, step: 0.5 },
      responsivity: { value: 0.9, unit: 'A/W', label: 'Responsivité', min: 0.3, max: 1.2, step: 0.01 },
      bandwidth: { value: 10, unit: 'GHz', label: 'Bande passante', min: 1, max: 50, step: 1 },
      darkCurrent: { value: 2, unit: 'nA', label: 'Courant d\'obscurité', min: 0.1, max: 50, step: 0.1 },
    },
  },

  [COMPONENT_TYPES.PHOTODIODE_APD]: {
    type: COMPONENT_TYPES.PHOTODIODE_APD,
    label: 'Photodiode APD',
    shortLabel: 'APD',
    icon: 'Radio',
    color: '#7c3aed',
    category: 'detectors',
    description: 'Photodiode à avalanche',
    params: {
      sensitivity: { value: -35, unit: 'dBm', label: 'Sensibilité', min: -45, max: -15, step: 0.5 },
      responsivity: { value: 0.85, unit: 'A/W', label: 'Responsivité', min: 0.3, max: 1.2, step: 0.01 },
      gainM: { value: 10, unit: '', label: 'Gain d\'avalanche (M)', min: 1, max: 100, step: 1 },
      excessNoiseFactor: { value: 0.7, unit: '', label: 'Facteur excès bruit (x)', min: 0.2, max: 1, step: 0.01 },
      bandwidth: { value: 2.5, unit: 'GHz', label: 'Bande passante', min: 0.5, max: 20, step: 0.5 },
      darkCurrent: { value: 50, unit: 'nA', label: 'Courant d\'obscurité', min: 1, max: 200, step: 1 },
    },
  },
};

/**
 * Category metadata for the sidebar
 */
export const CATEGORIES = {
  sources: { label: 'Sources', icon: 'Zap', color: '#06d6e0' },
  modulators: { label: 'Modulateurs', icon: 'ToggleRight', color: '#a78bfa' },
  fibers: { label: 'Fibres & Câbles', icon: 'Cable', color: '#3b82f6' },
  amplifiers: { label: 'Amplificateurs', icon: 'TrendingUp', color: '#10b981' },
  passive: { label: 'Passifs & Jonctions', icon: 'Plug', color: '#f59e0b' },
  filters: { label: 'Filtres', icon: 'Filter', color: '#14b8a6' },
  wdm: { label: 'WDM', icon: 'Layers', color: '#06b6d4' },
  detectors: { label: 'Détecteurs', icon: 'Radio', color: '#8b5cf6' },
};

/**
 * Get list of component types for a given category
 */
export function getComponentsByCategory(category) {
  return Object.values(COMPONENT_DEFAULTS).filter(c => c.category === category);
}

/**
 * Create a new component instance with default values and a unique ID.
 */
let componentIdCounter = 0;
export function createComponent(type) {
  const template = COMPONENT_DEFAULTS[type];
  if (!template) throw new Error(`Unknown component type: ${type}`);

  const params = {};
  for (const [key, param] of Object.entries(template.params)) {
    params[key] = { ...param };
  }

  return {
    id: `${type}-${Date.now()}-${componentIdCounter++}`,
    type: template.type,
    label: template.label,
    shortLabel: template.shortLabel,
    icon: template.icon,
    color: template.color,
    category: template.category,
    description: template.description,
    params,
  };
}
