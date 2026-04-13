import React from 'react';
import {
  CheckCircle, XCircle, Zap, Radio, ArrowDown, ArrowUp, Minus,
  Cable, Plug, ToggleRight, Filter, Layers,
} from 'lucide-react';

function StatCard({ label, value, unit, icon: Icon, color, subtext }) {
  return (
    <div className="glass-panel-strong p-2 flex items-start gap-2">
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
      >
        <Icon size={12} style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[8px] text-slate-500 uppercase tracking-wider">{label}</div>
        <div className="text-sm font-bold font-mono text-white leading-tight">
          {value}
          <span className="text-[9px] text-slate-500 ml-0.5 font-normal">{unit}</span>
        </div>
        {subtext && <div className="text-[8px] text-slate-600 mt-0.5 leading-snug">{subtext}</div>}
      </div>
    </div>
  );
}

export default function ResultsPanel({ budget }) {
  if (!budget || (budget.emittedPower === 0 && budget.points.length === 0)) {
    return (
      <div className="glass-panel p-4 h-full flex items-center justify-center">
        <p className="text-[10px] text-slate-600 text-center">
          Les résultats du bilan de puissance apparaîtront ici
        </p>
      </div>
    );
  }

  const isViable = budget.isViable;

  // Build loss breakdown
  const lossParts = [];
  if (budget.fiberLoss > 0) lossParts.push(`Fibre: ${budget.fiberLoss}`);
  if (budget.connectorLoss > 0) lossParts.push(`Conn: ${budget.connectorLoss}`);
  if (budget.spliceLoss > 0) lossParts.push(`Épi: ${budget.spliceLoss}`);
  if (budget.modulatorLoss > 0) lossParts.push(`Mod: ${budget.modulatorLoss}`);
  if (budget.pigtailLoss > 0) lossParts.push(`Pig: ${budget.pigtailLoss}`);
  if (budget.filterLoss > 0) lossParts.push(`Filt: ${budget.filterLoss}`);
  if (budget.wdmLoss > 0) lossParts.push(`WDM: ${budget.wdmLoss}`);
  if (budget.passiveLoss > 0) lossParts.push(`Pass: ${budget.passiveLoss}`);

  return (
    <div className="glass-panel p-3 flex flex-col gap-1.5 overflow-y-auto h-full">
      <h3 className="text-xs font-semibold text-slate-300">📊 Bilan de Puissance</h3>

      {/* Viability */}
      <div className={`flex items-center gap-2 p-2 rounded-xl border transition-all duration-500 ${
        isViable
          ? 'bg-emerald-500/5 border-emerald-500/20 glow-green'
          : 'bg-red-500/5 border-red-500/20 glow-red'
      }`}>
        {isViable ? <CheckCircle size={16} className="text-neon-green shrink-0" /> : <XCircle size={16} className="text-neon-red shrink-0" />}
        <div>
          <div className={`text-xs font-semibold ${isViable ? 'text-neon-green text-glow-green' : 'text-neon-red text-glow-red'}`}>
            {isViable ? 'Liaison Viable ✓' : 'Liaison Non Viable ✗'}
          </div>
          <div className="text-[9px] text-slate-500">
            Marge : {budget.safetyMargin >= 0 ? '+' : ''}{budget.safetyMargin} dB
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-1">
        <StatCard label="P émise" value={budget.emittedPower} unit="dBm" icon={Zap} color="#06d6e0" />
        <StatCard label="P reçue" value={budget.receivedPower} unit="dBm" icon={Radio} color="#8b5cf6" />
        <StatCard
          label="Pertes totales"
          value={budget.totalLoss}
          unit="dB"
          icon={ArrowDown}
          color="#ef4444"
          subtext={lossParts.join(' · ')}
        />
        {budget.totalGain > 0 && (
          <StatCard label="Gain total" value={`+${budget.totalGain}`} unit="dB" icon={ArrowUp} color="#10b981" />
        )}
        <StatCard label="Sensibilité" value={budget.sensitivity} unit="dBm" icon={Minus} color="#f59e0b" />
        <StatCard
          label="Marge"
          value={`${budget.safetyMargin >= 0 ? '+' : ''}${budget.safetyMargin}`}
          unit="dB"
          icon={isViable ? CheckCircle : XCircle}
          color={isViable ? '#10b981' : '#ef4444'}
        />
      </div>

      {/* Formula */}
      <div className="mt-auto pt-2">
        <div className="h-px bg-gradient-to-r from-transparent via-dark-500/50 to-transparent mb-1.5" />
        <div className="text-[8px] text-slate-600 font-mono leading-relaxed p-1.5 bg-dark-900/40 rounded-md border border-dark-500/20">
          P<sub>rx</sub> = P<sub>tx</sub> − ΣL<sub>fibre</sub> − ΣL<sub>conn</sub> − ΣL<sub>mod</sub> − ΣL<sub>filt</sub> + ΣG<sub>amp</sub>
        </div>
      </div>
    </div>
  );
}
