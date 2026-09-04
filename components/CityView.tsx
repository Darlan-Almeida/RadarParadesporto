'use client';

import React, { useState, useMemo } from 'react';
import { useIniciativasByMunicipio } from '@/hooks/useIniciativas';
import { InitiativeCard } from './InitiativeCard';
import { UFS_BRASIL } from '@/lib/constants';
import { matchSearch } from '@/lib/utils';
import {
  Building2,
  ArrowLeft,
  PlusCircle,
  Search,
  SlidersHorizontal,
  Info,
  ShieldAlert,
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

  // Extrair esportes presentes nessa cidade
  const availableSports = useMemo(() => {
    const set = new Set<string>();
    iniciativas.forEach((i) => i.esportes.forEach((e) => set.add(e)));
    return Array.from(set).sort();
  }, [iniciativas]);

  // Filtragem local
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
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-xs flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {municipio}
              </h1>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
                {ufInfo?.nome || uf} ({uf})
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Catálogo de projetos, associações e centros de treinamento paralímpico nesta localidade.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onGoBackEstado}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium px-3.5 py-2 rounded-lg transition-functional"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para {ufInfo?.nome || uf}</span>
          </button>

          <button
            type="button"
            onClick={onOpenRegister}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-white bg-teal-600 hover:bg-teal-500 font-medium px-4 py-2 rounded-lg shadow-xs transition-functional"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cadastrar Iniciativa</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros Interna */}
      {iniciativas.length > 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por modalidade ou nome..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          {availableSports.length > 1 && (
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
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
              className="h-44 bg-slate-200/70 rounded-2xl border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : filteredIniciativas.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-1">
            <span>
              Exibindo <strong>{filteredIniciativas.length}</strong>{' '}
              {filteredIniciativas.length === 1 ? 'iniciativa' : 'iniciativas'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredIniciativas.map((iniciativa) => (
              <InitiativeCard key={iniciativa.id} iniciativa={iniciativa} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-6">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Nenhuma iniciativa encontrada
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
            Não encontramos iniciativas em {municipio} correspondentes aos filtros selecionados.
          </p>
          <button
            type="button"
            onClick={onOpenRegister}
            className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg transition-functional"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cadastrar iniciativa em {municipio}</span>
          </button>
        </div>
      )}

      {/* Aviso institucional de validação de dados */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950">Aviso Institucional sobre os Dados</p>
          <p className="text-amber-800 leading-relaxed">
            Os dados deste MVP foram consolidados a partir de fontes públicas institucionais (sites oficiais de entidades, federações e confederações). Antes de comparecer a um local ou participar de treinamentos, recomendamos entrar em contato direto com a organização responsável para confirmar turmas, vagas e documentação exigida.
          </p>
        </div>
      </div>
    </div>
  );
}
