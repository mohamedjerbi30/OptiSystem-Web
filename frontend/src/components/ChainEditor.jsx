import React, { useState } from 'react';
import ComponentCard from './ComponentCard';
import { Sparkles, ArrowRight, ListX } from 'lucide-react';

export default function ChainEditor({ chain, onUpdate, onRemove, onMoveUp, onMoveDown, onClear }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  // Close panel when clicking background
  const handleBgClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  if (chain.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center" onClick={handleBgClick}>
        <div className="text-center animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-dark-700/50 border border-dark-500/30 
                          flex items-center justify-center">
            <Sparkles size={28} className="text-neon-cyan/30" />
          </div>
          <h3 className="text-base font-semibold text-slate-400 mb-1.5">Chaîne vide</h3>
          <p className="text-xs text-slate-600 max-w-[300px]">
            Ajoutez des composants depuis la barre latérale pour construire votre liaison optique
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" onClick={handleBgClick}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Chaîne de Transmission
          </h3>
          <span className="text-[10px] font-mono text-slate-600 bg-dark-700/50 px-2 py-0.5 rounded-md">
            {chain.length} composant{chain.length > 1 ? 's' : ''}
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] 
                     text-slate-500 hover:text-red-400 hover:bg-red-500/10 
                     transition-all duration-200 cursor-pointer"
        >
          <ListX size={12} />
          Vider
        </button>
      </div>

      {/* Horizontal schematic area */}
      <div className="flex-1 flex items-center overflow-x-auto overflow-y-visible py-8 px-4 relative min-h-[250px]">
        {/* Transmit indicator */}
        <div className="flex flex-col items-center mr-2 shrink-0">
          <div className="text-[8px] text-neon-cyan/60 font-mono uppercase tracking-widest mb-1">TX</div>
          <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-neon-cyan/40 to-neon-cyan/10" />
        </div>

        {/* Components flow */}
        <div className="flex items-center gap-0 relative">
          {chain.map((component, index) => (
            <div key={component.id} className="flex items-center">
              {/* Connecting line before component (except first) */}
              {index > 0 && (
                <div className="flex items-center shrink-0">
                  <div className="w-6 h-[2px] bg-gradient-to-r from-dark-500/60 to-dark-500/40 relative">
                    {/* Signal direction arrow */}
                    <ArrowRight size={8} className="absolute -right-1 top-1/2 -translate-y-1/2 text-slate-600" />
                  </div>
                </div>
              )}

              <ComponentCard
                component={component}
                index={index}
                isSelected={selectedId === component.id}
                onSelect={handleSelect}
                onUpdate={onUpdate}
                onRemove={onRemove}
              />
            </div>
          ))}
        </div>

        {/* Receive indicator */}
        <div className="flex flex-col items-center ml-2 shrink-0">
          <div className="text-[8px] text-neon-purple/60 font-mono uppercase tracking-widest mb-1">RX</div>
          <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-neon-purple/40 to-neon-purple/10" />
        </div>
      </div>

      {/* Schematic baseline */}
      <div className="shrink-0 h-px bg-gradient-to-r from-neon-cyan/10 via-dark-500/30 to-neon-purple/10 -mt-6 mx-4" />

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 px-4 shrink-0">
        <span className="text-[18px] text-white">
          💡 Cliquez sur un composant pour modifier ses paramètres
        </span>
      </div>
    </div>
  );
}
