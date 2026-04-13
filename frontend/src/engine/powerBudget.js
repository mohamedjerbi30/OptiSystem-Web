import { COMPONENT_TYPES } from '../data/defaults';

/**
 * Calculate the optical power budget for a given chain of components.
 * Supports all 28 component types.
 * 
 * Returns points for chart + full loss/gain breakdown.
 */
export function calculatePowerBudget(chain) {
  const result = {
    points: [],
    emittedPower: 0,
    receivedPower: 0,
    totalLoss: 0,
    totalGain: 0,
    sensitivity: -28,
    safetyMargin: 0,
    isViable: false,
    // Loss breakdown
    fiberLoss: 0,
    connectorLoss: 0,
    spliceLoss: 0,
    modulatorLoss: 0,
    pigtailLoss: 0,
    filterLoss: 0,
    wdmLoss: 0,
    passiveLoss: 0,
  };

  if (!chain || chain.length === 0) return result;

  // Find first source
  const sourceTypes = [
    COMPONENT_TYPES.LASER_DFB, COMPONENT_TYPES.LASER_FP, COMPONENT_TYPES.LED,
  ];
  const source = chain.find(c => sourceTypes.includes(c.type));
  if (!source) return result;

  // Find first detector
  const detectorTypes = [COMPONENT_TYPES.PHOTODIODE_PIN, COMPONENT_TYPES.PHOTODIODE_APD];
  const detector = chain.find(c => detectorTypes.includes(c.type));

  const emittedPower = source.params.power.value;
  result.emittedPower = emittedPower;

  if (detector) {
    result.sensitivity = detector.params.sensitivity.value;
  }

  let currentPower = emittedPower;
  let currentDistance = 0;

  // Start point
  result.points.push({ distance: 0, power: currentPower, label: source.label });

  for (const component of chain) {
    // Skip sources (already handled as starting point)
    if (sourceTypes.includes(component.type)) continue;

    const type = component.type;

    // ─── FIBERS (linear loss over distance) ─────────────────────────
    if ([COMPONENT_TYPES.FIBER_SMF, COMPONENT_TYPES.FIBER_MMF, COMPONENT_TYPES.FIBER_DCF].includes(type)) {
      const length = component.params.length.value;
      const attenuation = component.params.attenuation.value;
      const fiberLoss = length * attenuation;
      result.fiberLoss += fiberLoss;
      result.totalLoss += fiberLoss;

      const steps = Math.max(Math.ceil(length / 2), 5);
      const stepLength = length / steps;
      const stepLoss = stepLength * attenuation;

      for (let i = 1; i <= steps; i++) {
        currentDistance += stepLength;
        currentPower -= stepLoss;
        result.points.push({
          distance: round(currentDistance),
          power: round(currentPower),
          label: i === steps ? `Fin ${component.shortLabel}` : null,
        });
      }
      continue;
    }

    // ─── PIGTAIL (short fiber) ──────────────────────────────────────
    if (type === COMPONENT_TYPES.PIGTAIL) {
      const length = component.params.length.value;
      const attenuation = component.params.attenuation.value;
      const loss = length * attenuation;
      result.pigtailLoss += loss;
      result.totalLoss += loss;

      currentDistance += length;
      currentPower -= loss;
      result.points.push({
        distance: round(currentDistance),
        power: round(currentPower),
        label: component.shortLabel,
      });
      continue;
    }

    // ─── MODULATORS (insertion loss) ────────────────────────────────
    if ([COMPONENT_TYPES.MODULATOR_MZM, COMPONENT_TYPES.MODULATOR_EAM, COMPONENT_TYPES.MODULATOR_PHASE].includes(type)) {
      const loss = component.params.insertionLoss.value;
      result.modulatorLoss += loss;
      result.totalLoss += loss;

      addPointLoss(result, component, currentDistance, currentPower, loss);
      currentPower -= loss;
      continue;
    }

    // ─── CONNECTORS ────────────────────────────────────────────────
    if (type === COMPONENT_TYPES.CONNECTOR) {
      const loss = component.params.loss.value;
      result.connectorLoss += loss;
      result.totalLoss += loss;

      addPointLoss(result, component, currentDistance, currentPower, loss);
      currentPower -= loss;
      continue;
    }

    // ─── SPLICES ───────────────────────────────────────────────────
    if (type === COMPONENT_TYPES.SPLICE) {
      const loss = component.params.loss.value;
      result.spliceLoss += loss;
      result.totalLoss += loss;

      addPointLoss(result, component, currentDistance, currentPower, loss);
      currentPower -= loss;
      continue;
    }

    // ─── COUPLER/SPLITTER ─────────────────────────────────────────
    if (type === COMPONENT_TYPES.COUPLER) {
      const ratio = component.params.ratio.value / 100;
      const excessLoss = component.params.excessLoss.value;
      // Coupling loss = -10*log10(ratio) + excess loss
      const couplingLoss = -10 * Math.log10(ratio) + excessLoss;
      result.passiveLoss += couplingLoss;
      result.totalLoss += couplingLoss;

      addPointLoss(result, component, currentDistance, currentPower, couplingLoss);
      currentPower -= couplingLoss;
      continue;
    }

    // ─── ISOLATOR ─────────────────────────────────────────────────
    if (type === COMPONENT_TYPES.ISOLATOR) {
      const loss = component.params.insertionLoss.value;
      result.passiveLoss += loss;
      result.totalLoss += loss;

      addPointLoss(result, component, currentDistance, currentPower, loss);
      currentPower -= loss;
      continue;
    }

    // ─── CIRCULATOR ───────────────────────────────────────────────
    if (type === COMPONENT_TYPES.CIRCULATOR) {
      const loss = component.params.insertionLoss.value;
      result.passiveLoss += loss;
      result.totalLoss += loss;

      addPointLoss(result, component, currentDistance, currentPower, loss);
      currentPower -= loss;
      continue;
    }

    // ─── VOA ──────────────────────────────────────────────────────
    if (type === COMPONENT_TYPES.VOA) {
      const loss = component.params.attenuation.value + component.params.insertionLoss.value;
      result.passiveLoss += loss;
      result.totalLoss += loss;

      addPointLoss(result, component, currentDistance, currentPower, loss);
      currentPower -= loss;
      continue;
    }

    // ─── FIXED ATTENUATOR ─────────────────────────────────────────
    if (type === COMPONENT_TYPES.ATTENUATOR_FIXED) {
      const loss = component.params.attenuation.value;
      result.passiveLoss += loss;
      result.totalLoss += loss;

      addPointLoss(result, component, currentDistance, currentPower, loss);
      currentPower -= loss;
      continue;
    }

    // ─── FILTERS (insertion loss) ─────────────────────────────────
    if ([COMPONENT_TYPES.FILTER_GAUSSIAN, COMPONENT_TYPES.FILTER_BUTTERWORTH, COMPONENT_TYPES.FBG].includes(type)) {
      const loss = component.params.insertionLoss.value;
      result.filterLoss += loss;
      result.totalLoss += loss;

      addPointLoss(result, component, currentDistance, currentPower, loss);
      currentPower -= loss;
      continue;
    }

    // ─── AWG ──────────────────────────────────────────────────────
    if (type === COMPONENT_TYPES.AWG) {
      const loss = component.params.insertionLoss.value;
      result.filterLoss += loss;
      result.totalLoss += loss;

      addPointLoss(result, component, currentDistance, currentPower, loss);
      currentPower -= loss;
      continue;
    }

    // ─── WDM MUX / DEMUX ─────────────────────────────────────────
    if ([COMPONENT_TYPES.WDM_MUX, COMPONENT_TYPES.WDM_DEMUX].includes(type)) {
      const loss = component.params.insertionLoss.value;
      result.wdmLoss += loss;
      result.totalLoss += loss;

      addPointLoss(result, component, currentDistance, currentPower, loss);
      currentPower -= loss;
      continue;
    }

    // ─── AMPLIFIERS (gain) ────────────────────────────────────────
    if ([COMPONENT_TYPES.EDFA, COMPONENT_TYPES.SOA, COMPONENT_TYPES.RAMAN].includes(type)) {
      const gain = component.params.gain.value;
      result.totalGain += gain;

      result.points.push({
        distance: round(currentDistance),
        power: round(currentPower),
        label: `Avant ${component.shortLabel}`,
        isAmplifier: true,
      });
      currentPower += gain;
      result.points.push({
        distance: round(currentDistance),
        power: round(currentPower),
        label: `Après ${component.shortLabel}`,
        isAmplifier: true,
      });
      continue;
    }

    // ─── DETECTORS ────────────────────────────────────────────────
    if (detectorTypes.includes(type)) {
      result.points.push({
        distance: round(currentDistance),
        power: round(currentPower),
        label: component.label,
        isReceiver: true,
      });
      continue;
    }
  }

  // Final results
  result.receivedPower = round(currentPower);
  result.safetyMargin = round(result.receivedPower - result.sensitivity);
  result.isViable = result.safetyMargin >= 0;
  result.totalLoss = round(result.totalLoss);
  result.totalGain = round(result.totalGain);
  result.fiberLoss = round(result.fiberLoss);
  result.connectorLoss = round(result.connectorLoss);
  result.spliceLoss = round(result.spliceLoss);
  result.modulatorLoss = round(result.modulatorLoss);
  result.pigtailLoss = round(result.pigtailLoss);
  result.filterLoss = round(result.filterLoss);
  result.wdmLoss = round(result.wdmLoss);
  result.passiveLoss = round(result.passiveLoss);

  return result;
}

// ─── Helper functions ────────────────────────────────────────────────

function round(v, decimals = 4) {
  return parseFloat(v.toFixed(decimals));
}

/**
 * Add a point loss (junction-style: before + after) to the points array
 */
function addPointLoss(result, component, distance, powerBefore, loss) {
  result.points.push({
    distance: round(distance),
    power: round(powerBefore),
    label: `Avant ${component.shortLabel}`,
    isJunction: true,
  });
  result.points.push({
    distance: round(distance),
    power: round(powerBefore - loss),
    label: `Après ${component.shortLabel}`,
    isJunction: true,
  });
}
