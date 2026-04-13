import React from 'react';
import {
  Zap, Cable, Plug, Link, TrendingUp, Radio, ToggleRight, Waypoints,
  Lightbulb, GitBranch, ArrowRightCircle, RotateCw, SlidersHorizontal, Minus,
  Filter, Waves, Layers, Merge, Split, Trash2, X,
} from 'lucide-react';
import ParameterInput from './ParameterInput';

const iconMap = {
  Zap, Cable, Plug, Link, TrendingUp, Radio, ToggleRight, Waypoints,
  Lightbulb, GitBranch, ArrowRightCircle, RotateCw, SlidersHorizontal, Minus,
  Filter, Waves, Layers, Merge, Split,
};

export default function ComponentCard({ component, index, isSelected, onSelect, onUpdate, onRemove }) {
  const IconComponent = iconMap[component.icon] || Zap;

  const handleParamChange = (paramKey, newValue) => {
    onUpdate(component.id, paramKey, newValue);
  };

  return (
    <div className="flex flex-col items-center relative group">
      {/* Component node */}
      <button
        onClick={() => onSelect(component.id)}
        className={`relative flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl cursor-pointer
                     transition-all duration-200 border
                     ${isSelected
                       ? 'bg-dark-600/80 border-opacity-60 scale-105'
                       : 'bg-dark-700/50 border-dark-500/20 hover:bg-dark-600/60 hover:scale-102'
                     }`}
        style={{
          borderColor: isSelected ? `${component.color}50` : undefined,
          boxShadow: isSelected ? `0 0 20px ${component.color}20` : undefined,
        }}
      >
        {/* Delete button */}
        <div
          onClick={(e) => { e.stopPropagation(); onRemove(component.id); }}
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-dark-700 border border-dark-500/50 
                     flex items-center justify-center opacity-0 group-hover:opacity-100 
                     hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-150 cursor-pointer z-10"
        >
          <X size={8} className="text-slate-400 hover:text-red-400" />
        </div>

        {/* Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: `${component.color}12`,
            border: `1.5px solid ${component.color}35`,
          }}
        >
          <IconComponent size={18} style={{ color: component.color }} />
        </div>

        {/* Label */}
        <span className="text-[9px] font-medium text-slate-400 text-center leading-tight max-w-[70px] truncate">
          {component.shortLabel}
        </span>

        {/* Index badge */}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[7px] font-mono text-slate-600 
                         bg-dark-800 px-1 rounded-sm border border-dark-500/20">
          {index + 1}
        </span>
      </button>

      {/* Expanded parameters panel */}
      {isSelected && (
        <div
          className="absolute top-full mt-3 z-20 glass-panel-strong p-3 min-w-[240px] animate-fade-in-up"
          style={{ borderColor: `${component.color}20` }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <IconComponent size={12} style={{ color: component.color }} />
              <span className="text-xs font-semibold text-slate-300">{component.label}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(component.id); }}
              className="p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 size={12} />
            </button>
          </div>

          {component.description && (
            <p className="text-[9px] text-slate-500 mb-2 italic">{component.description}</p>
          )}

          <div className="w-full h-px mb-2" style={{ background: `linear-gradient(to right, ${component.color}30, transparent)` }} />

          {/* Parameters */}
          <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
            {Object.entries(component.params).map(([key, param]) => (
              <ParameterInput
                key={key}
                label={param.label}
                value={param.value}
                unit={param.unit}
                min={param.min}
                max={param.max}
                step={param.step}
                onChange={(val) => handleParamChange(key, val)}
              />
            ))}
          </div>

          {/* Arrow pointer */}
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
            style={{
              background: 'rgba(26, 26, 46, 0.9)',
              borderLeft: `1px solid ${component.color}20`,
              borderTop: `1px solid ${component.color}20`,
            }}
          />
        </div>
      )}
    </div>
  );
}
