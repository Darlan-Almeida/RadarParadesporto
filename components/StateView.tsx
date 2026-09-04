'use client';

import React, { useState } from 'react';
import { StateMap } from './StateMap';
import { MunicipalityList } from './MunicipalityList';
import {
  useMunicipiosByUF,
  useEsportesByUF,
  useUFSummary,
} from '@/hooks/useIniciativas';
import { UFS_BRASIL } from '@/lib/constants';
import { Map, List, Building2, Award, ArrowLeft, PlusCircle } from 'lucide-react';

interface StateViewProps {
  uf: string;
  onSelectMunicipio: (municipio: string) => void;
  onGoBack: () => void;
  onOpenRegister: () => void;
}

export function StateView({
  uf,
  onSelectMunicipio,
  onGoBack,
  onOpenRegister,
}: StateViewProps) {
  const { data: municipios = [], isLoading: isLoadingMunis } = useMunicipiosByUF(uf);
  const { data: esportes = [] } = useEsportesByUF(uf);
  const { data: ufSummary } = useUFSummary(uf);
  const [highlightedMuni, setHighlightedMuni] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'mapa' | 'lista'>('lista');

  const ufInfo = UFS_BRASIL[uf] || {
    sigla: uf,
    nome: uf,
    codigoIbge: '',
    regiao: '',
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Banner / Header do Estado */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-800 text-white font-bold text-xl flex items-center justify-center shadow-xs flex-shrink-0">
            {uf}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {ufInfo.nome}
              </h1>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
                Região {ufInfo.regiao}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-teal-700" />
                <strong>{municipios.length}</strong>{' '}
                {municipios.length === 1 ? 'município com polo' : 'municípios com polos'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-teal-700" />
                <strong>{ufSummary?.totalIniciativas || 0}</strong>{' '}
                {ufSummary?.totalIniciativas === 1
                  ? 'iniciativa cadastrada'
                  : 'iniciativas cadastradas'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={onGoBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium px-3 py-2 rounded-lg transition-functional"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Mapa do Brasil</span>
          </button>
          <button
            type="button"
            onClick={onOpenRegister}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-white bg-teal-600 hover:bg-teal-500 font-medium px-3.5 py-2 rounded-lg shadow-xs transition-functional"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cadastrar</span>
          </button>
        </div>
      </div>

      {/* Tabs para Mobile */}
      <div className="flex md:hidden bg-slate-200/80 p-1 rounded-xl gap-1">
        <button
          type="button"
          onClick={() => setMobileTab('lista')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-functional ${
            mobileTab === 'lista'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <List className="w-4 h-4" />
          <span>Lista de Municípios ({municipios.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('mapa')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-functional ${
            mobileTab === 'mapa'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>Mapa do Estado</span>
        </button>
      </div>

      {/* Grid Lado a Lado (Desktop) / Abas (Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Coluna A: Mapa do Estado */}
        <div
          className={`md:col-span-6 lg:col-span-7 ${
            mobileTab === 'mapa' ? 'block' : 'hidden md:block'
          }`}
        >
          <StateMap
            uf={uf}
            municipiosWithData={municipios}
            highlightedMunicipio={highlightedMuni}
            onSelectMunicipio={onSelectMunicipio}
          />
        </div>

        {/* Coluna B: Listagem com Filtros e Ordenação */}
        <div
          className={`md:col-span-6 lg:col-span-5 ${
            mobileTab === 'lista' ? 'block' : 'hidden md:block'
          }`}
        >
          <MunicipalityList
            uf={uf}
            municipios={municipios}
            availableSports={esportes}
            onSelectMunicipio={onSelectMunicipio}
            onHoverMunicipio={setHighlightedMuni}
            onOpenRegister={onOpenRegister}
          />
        </div>
      </div>
    </div>
  );
}
