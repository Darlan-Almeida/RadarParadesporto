'use client';

import React from 'react';
import { ChevronRight, Globe, Map, Building2, ArrowLeft } from 'lucide-react';
import { NavigationState } from '@/lib/types';
import { UFS_BRASIL } from '@/lib/constants';

interface BreadcrumbProps {
  navState: NavigationState;
  onGoBrasil: () => void;
  onGoEstado: (uf: string) => void;
}

export function Breadcrumb({ navState, onGoBrasil, onGoEstado }: BreadcrumbProps) {
  const ufName = navState.view !== 'brasil' ? UFS_BRASIL[navState.uf]?.nome || navState.uf : '';

  return (
    <nav
      aria-label="Trilha de navegação territorial"
      className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-30 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center flex-wrap text-xs sm:text-sm font-medium text-slate-600 gap-1.5 sm:gap-2">
          {/* Nível 1: Brasil */}
          <button
            type="button"
            onClick={onGoBrasil}
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded transition-functional ${
              navState.view === 'brasil'
                ? 'text-teal-900 bg-teal-50 font-semibold ring-1 ring-teal-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-teal-700" />
            <span>Brasil</span>
          </button>

          {/* Nível 2: Estado */}
          {navState.view !== 'brasil' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <button
                type="button"
                onClick={() => onGoEstado(navState.uf)}
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded transition-functional ${
                  navState.view === 'estado'
                    ? 'text-teal-900 bg-teal-50 font-semibold ring-1 ring-teal-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Map className="w-3.5 h-3.5 text-teal-700" />
                <span>
                  {ufName} ({navState.uf})
                </span>
              </button>
            </>
          )}

          {/* Nível 3: Município */}
          {navState.view === 'cidade' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-teal-900 bg-teal-50 font-semibold ring-1 ring-teal-600/20">
                <Building2 className="w-3.5 h-3.5 text-teal-700" />
                <span>{navState.municipio}</span>
              </span>
            </>
          )}
        </div>

        {/* Botão de Retorno Rápido */}
        {navState.view !== 'brasil' && (
          <button
            type="button"
            onClick={() => {
              if (navState.view === 'cidade') {
                onGoEstado(navState.uf);
              } else {
                onGoBrasil();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium py-1 px-2.5 rounded border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-functional"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              Voltar para {navState.view === 'cidade' ? ufName : 'o Mapa Nacional'}
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
