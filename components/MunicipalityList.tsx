'use client';

import React, { useState, useMemo } from 'react';
import { MunicipioInfo, SortOrder } from '@/lib/types';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Building2,
  ArrowRight,
  PlusCircle,
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

    // Filtro de Busca
    if (searchTerm.trim()) {
      list = list.filter((m) => matchSearch(m.nome, searchTerm));
    }

    // Filtro de Esporte
    if (selectedSport !== 'Todos') {
      list = list.filter((m) => m.esportes.includes(selectedSport));
    }

    // Ordenação
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
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col h-full">
      {/* Header e Controles */}
      <div className="pb-3.5 mb-3.5 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-700" />
              <span>Municípios com Iniciativas ({municipios.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore os polos esportivos de {ufInfo?.nome || uf}
            </p>
          </div>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="space-y-2.5">
          {/* Campo de Busca */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar município..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtros em linha: Esporte e Ordenação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Filtro por Esporte */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="Todos">Todas as Modalidades ({availableSports.length})</option>
                {availableSports.map((esporte) => (
                  <option key={esporte} value={esporte}>
                    {esporte}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="nome-asc">Ordem Alfabética (A - Z)</option>
                <option value="nome-desc">Ordem Alfabética (Z - A)</option>
                <option value="iniciativas-desc">Mais Iniciativas</option>
                <option value="iniciativas-asc">Menos Iniciativas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Municípios */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[460px] pr-1">
        {filteredAndSortedMunicipios.length > 0 ? (
          filteredAndSortedMunicipios.map((muni) => (
            <div
              key={muni.nome}
              onClick={() => onSelectMunicipio(muni.nome)}
              onMouseEnter={() => onHoverMunicipio(muni.nome)}
              onMouseLeave={() => onHoverMunicipio(null)}
              className="group p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-teal-50/40 hover:border-teal-300 cursor-pointer transition-functional shadow-2xs flex flex-col justify-between gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-950 transition-colors">
                    {muni.nome}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {muni.totalIniciativas}{' '}
                    {muni.totalIniciativas === 1
                      ? 'iniciativa cadastrada'
                      : 'iniciativas cadastradas'}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 bg-teal-100/70 px-2.5 py-1 rounded-full group-hover:bg-teal-200 transition-colors">
                  <span>Abrir</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>

              {/* Tags de Modalidades no Município */}
              <div className="flex flex-wrap gap-1 mt-1">
                {muni.esportes.slice(0, 3).map((esp) => (
                  <span
                    key={esp}
                    className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200/80"
                  >
                    {esp}
                  </span>
                ))}
                {muni.esportes.length > 3 && (
                  <span className="text-[11px] font-medium text-slate-500 self-center px-1">
                    +{muni.esportes.length - 3} mais
                  </span>
                )}
              </div>
            </div>
          ))
        ) : municipios.length === 0 ? (
          /* Estado sem dados cadastrados */
          <div className="py-12 px-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 my-auto">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              Nenhuma iniciativa cadastrada neste estado ainda
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Ajude a mapear o paradesporto em {ufInfo?.nome || uf}. Você pode cadastrar um projeto ou centro de treinamento agora mesmo.
            </p>
            <button
              type="button"
              onClick={onOpenRegister}
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs px-3.5 py-2 rounded-lg transition-functional shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Cadastrar primeira iniciativa</span>
            </button>
          </div>
        ) : (
          /* Filtros não retornaram resultados */
          <div className="py-10 text-center text-slate-500">
            <p className="text-xs sm:text-sm font-medium">
              Nenhum município encontrado com os filtros atuais.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedSport('Todos');
              }}
              className="mt-2 text-xs text-teal-700 font-semibold underline hover:text-teal-900"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
