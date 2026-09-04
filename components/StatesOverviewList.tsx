'use client';

import React, { useState } from 'react';
import { UFInfo } from '@/lib/types';
import { MapPin, ArrowRight, Search, CheckCircle2 } from 'lucide-react';
import { matchSearch } from '@/lib/utils';

interface StatesOverviewListProps {
  ufsSummary: UFInfo[];
  onSelectState: (uf: string) => void;
}

export function StatesOverviewList({
  ufsSummary,
  onSelectState,
}: StatesOverviewListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas');

  const regions = ['Todas', 'Sudeste', 'Nordeste', 'Sul', 'Centro-Oeste', 'Norte'];

  const filteredUFs = ufsSummary.filter((uf) => {
    const matchesQuery =
      matchSearch(uf.nome, searchTerm) ||
      matchSearch(uf.sigla, searchTerm) ||
      matchSearch(uf.regiao, searchTerm);
    const matchesRegion = selectedRegion === 'Todas' || uf.regiao === selectedRegion;
    return matchesQuery && matchesRegion;
  });

  const ufsWithData = filteredUFs.filter((u) => u.totalIniciativas > 0);
  const ufsWithoutData = filteredUFs.filter((u) => u.totalIniciativas === 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Estados com Iniciativas Catalogadas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Selecione uma Unidade Federativa para visualizar municípios e modalidades
          </p>
        </div>

        {/* Filtro de Região */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {regions.map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => setSelectedRegion(reg)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-functional flex-shrink-0 ${
                selectedRegion === reg
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Busca de Estado */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filtrar por nome do estado ou sigla..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
        />
      </div>

      {/* Grid de Estados com Dados */}
      {ufsWithData.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Com Projetos Mapeados ({ufsWithData.length})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ufsWithData.map((uf) => (
              <div
                key={uf.sigla}
                onClick={() => onSelectState(uf.sigla)}
                className="group p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-50 hover:border-teal-400 cursor-pointer transition-functional shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-800 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {uf.sigla}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-950 transition-colors">
                      {uf.nome}
                    </h3>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-teal-700" />
                      <span>
                        <strong className="text-teal-900">{uf.totalIniciativas}</strong>{' '}
                        {uf.totalIniciativas === 1 ? 'iniciativa' : 'iniciativas'} em{' '}
                        <strong>{uf.municipiosComIniciativas}</strong>{' '}
                        {uf.municipiosComIniciativas === 1 ? 'cidade' : 'cidades'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-teal-700 font-semibold text-xs gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Acessar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid de Outros Estados */}
      {ufsWithoutData.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Demais Estados ({ufsWithoutData.length})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {ufsWithoutData.map((uf) => (
              <button
                key={uf.sigla}
                type="button"
                onClick={() => onSelectState(uf.sigla)}
                className="p-2 text-left rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 transition-functional flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-xs text-slate-700 mr-1.5">{uf.sigla}</span>
                  <span className="text-xs text-slate-500 line-clamp-1">{uf.nome}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredUFs.length === 0 && (
        <div className="py-8 text-center text-slate-500 text-sm">
          Nenhum estado encontrado para os filtros selecionados.
        </div>
      )}
    </div>
  );
}
