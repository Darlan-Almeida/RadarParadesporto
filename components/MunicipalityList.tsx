'use client';

import React, { useState, useMemo } from 'react';
import { MunicipioInfo, SortOrder } from '@/lib/types';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowRight,
  Plus,
  X,
} from 'lucide-react';
import { matchSearch } from '@/lib/utils';
import { UFS_BRASIL } from '@/lib/constants';

interface MunicipalityListProps {
  uf: string;
  municipios: MunicipioInfo[];
  availableSports: string[];
  onSelectMunicipio: (municipio: string) => void;
  onHoverMunicipio: (municipio: string | null) => void;
  onOpenRegister: () => void;
}

export function MunicipalityList({
  uf,
  municipios,
  availableSports,
  onSelectMunicipio,
  onHoverMunicipio,
  onOpenRegister,
}: MunicipalityListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('Todos');
  const [sortOrder, setSortOrder] = useState<SortOrder>('nome-asc');

  const filteredAndSortedMunicipios = useMemo(() => {
    let list = [...municipios];

    if (searchTerm.trim()) {
      list = list.filter((m) => matchSearch(m.nome, searchTerm));
    }

    if (selectedSport !== 'Todos') {
      list = list.filter((m) => m.esportes.includes(selectedSport));
    }

    list.sort((a, b) => {
      if (sortOrder === 'nome-asc') {
        return a.nome.localeCompare(b.nome);
      } else if (sortOrder === 'nome-desc') {
        return b.nome.localeCompare(a.nome);
      } else if (sortOrder === 'iniciativas-desc') {
        return b.totalIniciativas - a.totalIniciativas || a.nome.localeCompare(b.nome);
      } else if (sortOrder === 'iniciativas-asc') {
        return a.totalIniciativas - b.totalIniciativas || a.nome.localeCompare(b.nome);
      }
      return 0;
    });

    return list;
  }, [municipios, searchTerm, selectedSport, sortOrder]);

  const ufInfo = UFS_BRASIL[uf];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col h-full">
      {/* Header e Controles */}
      <div className="pb-3 mb-3 border-b border-slate-100 space-y-2.5">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
            Municípios com Iniciativas ({municipios.length})
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Polos esportivos em {ufInfo?.nome || uf}
          </p>
        </div>

        {/* Busca */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar município..."
            className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtros em linha */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-400">
              <SlidersHorizontal className="w-3 h-3" />
            </div>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full pl-7 pr-6 py-1 bg-slate-50 border border-slate-300 rounded-md text-[11px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 appearance-none cursor-pointer"
            >
              <option value="Todos">Todas as Modalidades ({availableSports.length})</option>
              {availableSports.map((esporte) => (
                <option key={esporte} value={esporte}>
                  {esporte}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-3 h-3" />
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="w-full pl-7 pr-6 py-1 bg-slate-50 border border-slate-300 rounded-md text-[11px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 appearance-none cursor-pointer"
            >
              <option value="nome-asc">Ordem A - Z</option>
              <option value="nome-desc">Ordem Z - A</option>
              <option value="iniciativas-desc">Mais Iniciativas</option>
              <option value="iniciativas-asc">Menos Iniciativas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista Dividida de Municípios */}
      <div className="flex-1 overflow-y-auto max-h-[440px] divide-y divide-slate-100 pr-1">
        {filteredAndSortedMunicipios.length > 0 ? (
          filteredAndSortedMunicipios.map((muni) => (
            <div
              key={muni.nome}
              onClick={() => onSelectMunicipio(muni.nome)}
              onMouseEnter={() => onHoverMunicipio(muni.nome)}
              onMouseLeave={() => onHoverMunicipio(null)}
              className="py-2.5 px-2 hover:bg-slate-50 rounded-md cursor-pointer transition-colors flex items-center justify-between group"
            >
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-900">
                  {muni.nome}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  <strong>{muni.totalIniciativas}</strong>{' '}
                  {muni.totalIniciativas === 1 ? 'iniciativa' : 'iniciativas'}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {muni.esportes.slice(0, 3).map((esp) => (
                    <span
                      key={esp}
                      className="text-[10px] font-medium bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md border border-slate-200"
                    >
                      {esp}
                    </span>
                  ))}
                  {muni.esportes.length > 3 && (
                    <span className="text-[10px] font-medium text-slate-500 self-center">
                      +{muni.esportes.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center text-xs font-medium text-slate-600 group-hover:text-slate-900 gap-1 flex-shrink-0">
                <span>Ver</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))
        ) : municipios.length === 0 ? (
          <div className="py-8 px-4 text-center bg-slate-50 rounded-md border border-slate-200 my-auto">
            <h4 className="text-xs font-bold text-slate-800 mb-1">
              Nenhuma iniciativa cadastrada neste estado ainda
            </h4>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto mb-3">
              Ajude a mapear o paradesporto em {ufInfo?.nome || uf}.
            </p>
            <button
              type="button"
              onClick={onOpenRegister}
              className="inline-flex items-center gap-1 bg-[#0f2d4a] text-white font-medium text-xs px-3 py-1.5 rounded-md hover:bg-[#163a63] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cadastrar primeira iniciativa</span>
            </button>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs">
            Nenhum município encontrado com os filtros atuais.
          </div>
        )}
      </div>
    </div>
  );
}
