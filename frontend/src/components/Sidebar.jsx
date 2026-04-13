import React, { useState } from 'react';
import { COMPONENT_DEFAULTS, CATEGORIES, getComponentsByCategory } from '../data/defaults';
import {
  Zap, Cable, Plug, Link, TrendingUp, Radio, Plus, ToggleRight, Waypoints,
  Lightbulb, GitBranch, ArrowRightCircle, RotateCw, SlidersHorizontal, Minus,
  Filter, Waves, Layers, Merge, Split, ChevronDown, ChevronRight,
} from 'lucide-react';

const iconMap = {
  Zap, Cable, Plug, Link, TrendingUp, Radio, ToggleRight, Waypoints,
  Lightbulb, GitBranch, ArrowRightCircle, RotateCw, SlidersHorizontal, Minus,
  Filter, Waves, Layers, Merge, Split,
};

const categoryOrder = ['sources', 'modulators', 'fibers', 'amplifiers', 'passive', 'filters', 'wdm', 'detectors'];

export default function Sidebar({ onAddComponent }) {
  const [openCategories, setOpenCategories] = useState(() => {
    const initial = {};
    categoryOrder.forEach(c => initial[c] = true);
    return initial;
  });

  const toggleCategory = (cat) => {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <aside className="w-[240px] min-w-[240px] h-full glass-panel p-3 flex flex-col gap-0.5 overflow-y-auto">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-xs font-semibold text-neon-cyan text-glow-cyan tracking-wider uppercase">
          Composants Optiques
        </h2>
        <p className="text-[9px] text-slate-500 mt-0.5">
          {Object.keys(COMPONENT_DEFAULTS).length} composants disponibles
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-neon-cyan/20 via-neon-purple/20 to-transparent mb-1" />

      {/* Categorized component buttons */}
      {categoryOrder.map((catKey) => {
        const cat = CATEGORIES[catKey];
        const components = getComponentsByCategory(catKey);
        const isOpen = openCategories[catKey];
        const CatIcon = iconMap[cat.icon];

        return (
          <div key={catKey} className="mb-0.5">
            {/* Category header — clickable to toggle */}
            <button
              onClick={() => toggleCategory(catKey)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg
                         hover:bg-dark-600/30 transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                {isOpen ? (
                  <ChevronDown size={11} className="text-slate-500 shrink-0" />
                ) : (
                  <ChevronRight size={11} className="text-slate-500 shrink-0" />
                )}
                <CatIcon size={12} style={{ color: cat.color }} className="shrink-0" />
                <span className="text-[10px] font-semibold uppercase tracking-wider truncate"
                      style={{ color: cat.color }}>
                  {cat.label}
                </span>
              </div>
              <span className="text-[9px] text-slate-600 font-mono shrink-0">
                {components.length}
              </span>
            </button>

            {/* Components in this category */}
            {isOpen && (
              <div className="flex flex-col gap-0.5 ml-2 mt-0.5 mb-1 animate-fade-in-up">
                {components.map((comp) => {
                  const IconComponent = iconMap[comp.icon];
                  return (
                    <button
                      key={comp.type}
                      id={`add-${comp.type}`}
                      onClick={() => onAddComponent(comp.type)}
                      className="group flex items-center gap-2 px-2 py-1.5 rounded-lg 
                                 bg-dark-700/30 border border-dark-500/20
                                 hover:bg-dark-600/50 hover:border-opacity-50
                                 active:scale-[0.98]
                                 transition-all duration-150 cursor-pointer text-left"
                    >
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all duration-200
                                   group-hover:shadow-[0_0_8px_var(--comp-color)]"
                        style={{
                          backgroundColor: `${comp.color}12`,
                          border: `1px solid ${comp.color}25`,
                          '--comp-color': comp.color,
                        }}
                      >
                        {IconComponent && <IconComponent size={12} style={{ color: comp.color }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium text-slate-300 group-hover:text-white transition-colors truncate">
                          {comp.label}
                        </div>
                      </div>
                      <Plus size={11} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Footer */}
      <div className="mt-auto pt-2">
        <div className="h-px bg-gradient-to-r from-transparent via-dark-500/50 to-transparent mb-2" />
        <div className="text-[8px] text-slate-600 leading-relaxed">
          💡 <span className="text-slate-500">Source → Modulateur → Fibre → Passifs → Détecteur</span>
        </div>
      </div>
    </aside>
  );
}
