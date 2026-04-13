import React from 'react';

export default function ParameterInput({ label, value, unit, min, max, step, onChange }) {
  return (
    <div className="flex items-center gap-2 group">
      <label className="text-xs text-slate-400 min-w-[100px] truncate" title={label}>
        {label}
      </label>
      <div className="flex-1 flex items-center gap-1.5 bg-dark-900/60 border border-dark-500/50 rounded-lg px-2 py-1.5 
                       focus-within:border-neon-cyan/40 focus-within:shadow-[0_0_10px_rgba(6,214,224,0.1)] transition-all duration-200">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent text-white text-sm font-mono outline-none 
                     [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-[10px] text-neon-cyan/60 font-mono whitespace-nowrap">{unit}</span>
      </div>
    </div>
  );
}
