'use client';

import React from 'react';
import { Eye, Map, Globe, Layers, Sparkles } from 'lucide-react';

export type ReviewViewMode = 'brasil' | 'estado' | 'cards';

interface ReviewToolbarProps {
  currentView: ReviewViewMode;
  onChangeView: (view: ReviewViewMode) => void;
  selectedMuniName?: string;
}

export function ReviewToolbar({
  currentView,
  onChangeView,
  selectedMuniName,
}: ReviewToolbarProps) {
  return (
    <aside
      aria-label="Barra de controle do protótipo de validação visual"
      className="bg-slate-900 text-slate-100 border-b border-slate-800 px-4 py-2.5 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Identificação da etapa */}
        <div className="flex items-center gap-2 flex-wrap text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 bg-blue-900 text-blue-200 font-semibold px-2.5 py-1 rounded border border-blue-700/60 uppercase tracking-wide text-[11px]">
            <Eye className="w-3.5 h-3.5 text-blue-300" />
            Protótipo de Validação Visual
          </span>
          <span className="text-slate-300 font-medium">
            RadarPCD — Proposta A: Institucional Moderna
          </span>
          <span className="text-slate-500 hidden lg:inline">•</span>
          <span className="text-slate-400 hidden lg:inline">
            Avalie hierarquia, tipografia, mapa, espaçamento e cards antes do MVP.
          </span>
        </div>

        {/* Alternador de Vistas */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            type="button"
            onClick={() => onChangeView('brasil')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              currentView === 'brasil'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Vista 1: Brasil</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeView('estado')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              currentView === 'estado'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Vista 2: Paraíba</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeView('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              currentView === 'cards'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Amostra de Cards</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
