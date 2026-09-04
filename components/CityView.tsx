'use client';

import React, { useState, useMemo } from 'react';
import { useIniciativasByMunicipio } from '@/hooks/useIniciativas';
import { InitiativeCard } from './InitiativeCard';
import { UFS_BRASIL } from '@/lib/constants';
import { matchSearch } from '@/lib/utils';
import {
  Building2,
  ArrowLeft,
  Plus,
  Search,
  SlidersHorizontal,
  Info,
} from 'lucide-react';

interface CityViewProps {
  uf: string;
  municipio: string;
  onGoBackEstado: () => void;
  onOpenRegister: () => void;
}

export function CityView({
  uf,
  municipio,
  onGoBackEstado,
  onOpenRegister,
}: CityViewProps) {
  const { data: iniciativas = [], isLoading } = useIniciativasByMunicipio(uf, municipio);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('Todos');

  const ufInfo = UFS_BRASIL[uf];

  const availableSports = useMemo(() => {
    const set = new Set<string>();
    iniciativas.forEach((i) => i.esportes.forEach((e) => set.add(e)));
    return Array.from(set).sort();
  }, [iniciativas]);

  const filteredIniciativas = useMemo(() => {
    return iniciativas.filter((i) => {
      const matchText =
        matchSearch(i.nome, searchTerm) ||
        matchSearch(i.descricao, searchTerm) ||
        i.esportes.some((e) => matchSearch(e, searchTerm)) ||
        i.deficienciasAtendidas.some((d) => matchSearch(d, searchTerm));

      const matchSport = selectedSport === 'Todos' || i.esportes.includes(selectedSport);

      return matchText && matchSport;
    });
  }, [iniciativas, searchTerm, selectedSport]);

  return (
    <div className="space-y-6">
      {/* Banner / Header do Município */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-md bg-[#0f2d4a] text-white flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {municipio}
              </h1>
              <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md border border-slate-200">
                {ufInfo?.nome || uf} ({uf})
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Catálogo de projetos, associações e polos de esporte adaptado nesta localidade.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onGoBackEstado}
            className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium px-3 py-1.5 rounded-md border border-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para {ufInfo?.nome || uf}</span>
          </button>

          <button
            type="button"
            onClick={onOpenRegister}
            className="inline-flex items-center gap-1.5 text-xs text-white bg-[#0f2d4a] hover:bg-[#163a63] font-medium px-3.5 py-1.5 rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar iniciativa</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros Interna */}
      {iniciativas.length > 1 && (
        <div className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por modalidade ou nome..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>

          {availableSports.length > 1 && (
            <div className="relative w-full sm:w-60">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <SlidersHorizontal className="w-3 h-3" />
              </div>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 appearance-none cursor-pointer"
              >
                <option value="Todos">Todas as Modalidades ({availableSports.length})</option>
                {availableSports.map((esp) => (
                  <option key={esp} value={esp}>
                    {esp}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Lista de Cards de Iniciativas */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-36 bg-slate-100 rounded-lg border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : filteredIniciativas.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
            <span>
              Exibindo <strong>{filteredIniciativas.length}</strong>{' '}
              {filteredIniciativas.length === 1 ? 'iniciativa' : 'iniciativas'} em {municipio}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredIniciativas.map((iniciativa) => (
              <InitiativeCard key={iniciativa.id} iniciativa={iniciativa} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-10 text-center bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-800 mb-1">
            Nenhuma iniciativa encontrada
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-3">
            Não encontramos iniciativas em {municipio} correspondentes aos filtros.
          </p>
          <button
            type="button"
            onClick={onOpenRegister}
            className="inline-flex items-center gap-1.5 bg-[#0f2d4a] hover:bg-[#163a63] text-white font-medium text-xs px-3.5 py-1.5 rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar iniciativa em {municipio}</span>
          </button>
        </div>
      )}

      {/* Aviso institucional neutro de validação de dados */}
      <div className="bg-slate-100 border border-slate-200 rounded-md p-3.5 flex items-start gap-2.5 text-xs text-slate-700">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-slate-900">Aviso Institucional sobre os Dados</p>
          <p className="text-slate-600 leading-relaxed">
            Os dados foram consolidados a partir de fontes públicas (entidades, federações e secretarias municipais/estaduais). Recomendamos verificar diretamente com a organização responsável antes de comparecer aos locais de treinamento.
          </p>
        </div>
      </div>
    </div>
  );
}
