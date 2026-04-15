import React, { useState, useMemo, useCallback } from 'react';
import { Activity, XCircle, CheckCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChainEditor from './components/ChainEditor';
import PowerChart from './components/PowerChart';
import ResultsPanel from './components/ResultsPanel';
import { createComponent } from './data/defaults';
import { calculatePowerBudget } from './engine/powerBudget';
import { simulateSpectrum } from './services/api';

export default function App() {
  const [chain, setChain] = useState(() => {
    const saved = localStorage.getItem('optisim-chain');
    return saved ? JSON.parse(saved) : [];
  });
  const [backendData, setBackendData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationError, setSimulationError] = useState(null);

  const handleAddComponent = useCallback((type) => {
    const newComponent = createComponent(type);
    setChain((prev) => [...prev, newComponent]);
  }, []);

  const handleUpdateParam = useCallback((componentId, paramKey, newValue) => {
    setChain((prev) =>
      prev.map((c) => {
        if (c.id !== componentId) return c;
        return {
          ...c,
          params: {
            ...c.params,
            [paramKey]: { ...c.params[paramKey], value: newValue },
          },
        };
      })
    );
  }, []);

  const handleRemove = useCallback((componentId) => {
    setChain((prev) => prev.filter((c) => c.id !== componentId));
  }, []);

  const handleMoveUp = useCallback((componentId) => {
    setChain((prev) => {
      const idx = prev.findIndex((c) => c.id === componentId);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }, []);

  const handleMoveDown = useCallback((componentId) => {
    setChain((prev) => {
      const idx = prev.findIndex((c) => c.id === componentId);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, []);

  const handleClear = useCallback(() => {
    setChain([]);
  }, []);

  // Calculate simple power budget (memoized, instant client-side)
  const budget = useMemo(() => calculatePowerBudget(chain), [chain]);

  // Run advanced simulation on Python Backend
  const runSpectralSimulation = async () => {
    if (chain.length === 0) return;
    setIsSimulating(true);
    setSimulationError(null);
    try {
      const result = await simulateSpectrum(chain);
      setBackendData(result);
    } catch (err) {
      setSimulationError(err.message);
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Run simulation whenever chain changes significantly, or via a button
  React.useEffect(() => {
    // Save to localStorage
    localStorage.setItem('optisim-chain', JSON.stringify(chain));

    const delayDebounceFn = setTimeout(() => {
      if (chain.length > 0) {
        runSpectralSimulation();
      } else {
        setBackendData(null);
      }
    }, 500); // 500ms debounce
    return () => clearTimeout(delayDebounceFn);
  }, [chain]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 border-b border-dark-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-lg shadow-neon-cyan/20">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Opti<span className="text-neon-cyan text-glow-cyan">Sim</span>
              </h1>
              <p className="text-[10px] text-slate-500 -mt-0.5">
                Simulateur de Liaisons Optiques
              </p>
            </div>
          </div>

          {/* Quick stats */}
          {chain.length > 0 && budget.points.length > 0 && (
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-dark-600/50 border border-dark-500/30">
                <span className="text-slate-500">P<sub>émis</sub>:</span>
                <span className="text-neon-cyan font-semibold">{budget.emittedPower} dBm</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-dark-600/50 border border-dark-500/30">
                <span className="text-slate-500">P<sub>reçu</sub>:</span>
                <span className={`font-semibold ${budget.isViable ? 'text-neon-green' : 'text-neon-red'}`}>
                  {budget.receivedPower} dBm
                </span>
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${
                budget.isViable
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-red-500/5 border-red-500/20'
              }`}>
                <span className="text-slate-500">Marge:</span>
                <span className={`font-semibold ${budget.isViable ? 'text-neon-green text-glow-green' : 'text-neon-red text-glow-red'}`}>
                  {budget.safetyMargin >= 0 ? '+' : ''}{budget.safetyMargin} dB
                </span>
              </div>
            </div>
          )}

          {/* Backend Status indicator */}
          <div className="flex items-center gap-2 text-xs ml-4">
              {isSimulating ? (
                  <span className="text-slate-400 flex items-center gap-1.5"><Activity size={12} className="animate-spin text-neon-cyan"/> Simulation spectrale...</span>
              ) : simulationError ? (
                  <span className="text-neon-red flex items-center gap-1"><XCircle size={12}/> Erreur backend ({simulationError})</span>
              ) : backendData ? (
                  <span className="text-neon-green flex items-center gap-1"><CheckCircle size={12}/> Spectre calculé</span>
              ) : null}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar onAddComponent={handleAddComponent} />

        {/* Center area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main content column */}
          <div className="flex-1 flex flex-col overflow-hidden p-3 gap-3">
            {/* Horizontal chain editor */}
            <div className="glass-panel p-3 shrink-0 min-h-[180px]">
              <ChainEditor
                chain={chain}
                onUpdate={handleUpdateParam}
                onRemove={handleRemove}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onClear={handleClear}
              />
            </div>

            {/* Power chart — takes remaining space */}
            <div className="flex-1 min-h-[250px] flex gap-2">
              <div className="flex-1">
                 <PowerChart
                  data={budget.points}
                  sensitivity={budget.sensitivity}
                  title="📉 Puissance Optique vs Distance"
                  xKey="distance"
                  yKey="power"
                  xLabel="Distance (km)"
                  yLabel="Puissance (dBm)"
                  yDomain="auto"
                />
              </div>
              <div className="flex-1">
                 {/* Spectral Chart */}
                 <PowerChart
                    data={backendData ? backendData.spectrum : []}
                    title="🌈 Densité Spectrale de Puissance"
                    xKey="frequency_thz"
                    yKey="psd_dbm_hz"
                    xLabel="Fréquence (THz)"
                    yLabel="PSD (dBm)"
                    yDomain={['auto', 'auto']}
                    color="#8b5cf6"
                 />
              </div>
            </div>
          </div>

          {/* Results panel — right side */}
          <div className="w-[240px] min-w-[240px] p-3 pl-0">
            <ResultsPanel budget={budget} />
          </div>
        </div>
      </div>
    </div>
  );
}
