'use client';

import React, { useState } from 'react';
import { UFInfo } from '@/lib/types';
import { ArrowRight, Search } from 'lucide-react';
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
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Unidades Federativas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Selecione um estado para explorar municípios e modalidades
          </p>
        </div>

        {/* Filtro de Região */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {regions.map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => setSelectedRegion(reg)}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-colors flex-shrink-0 ${
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
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-3.5 h-3.5" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filtrar por estado ou sigla..."
          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
        />
      </div>

      {/* Lista Estruturada de Estados com Dados */}
      {ufsWithData.length > 0 && (
        <div className="mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Com projetos catalogados ({ufsWithData.length})
          </span>

          <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto pr-1">
            {ufsWithData.map((uf) => (
              <div
                key={uf.sigla}
                onClick={() => onSelectState(uf.sigla)}
                className="py-2.5 px-2 hover:bg-slate-50 rounded-md cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-md bg-[#0f2d4a] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {uf.sigla}
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-900">
                      {uf.nome}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      <strong>{uf.totalIniciativas}</strong> {uf.totalIniciativas === 1 ? 'iniciativa' : 'iniciativas'} em{' '}
                      <strong>{uf.municipiosComIniciativas}</strong> {uf.municipiosComIniciativas === 1 ? 'cidade' : 'cidades'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-xs font-medium text-slate-600 group-hover:text-slate-900 gap-1">
                  <span>Explorar</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Simplificado de Outros Estados */}
      {ufsWithoutData.length > 0 && (
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Demais estados ({ufsWithoutData.length})
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {ufsWithoutData.map((uf) => (
              <button
                key={uf.sigla}
                type="button"
                onClick={() => onSelectState(uf.sigla)}
                className="p-2 text-left rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-xs text-slate-700 mr-1">{uf.sigla}</span>
                  <span className="text-[11px] text-slate-500 line-clamp-1">{uf.nome}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700" />
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredUFs.length === 0 && (
        <div className="py-6 text-center text-slate-500 text-xs">
          Nenhum estado encontrado para o filtro.
        </div>
      )}
    </div>
  );
}
