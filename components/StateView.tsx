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
import { Map, List, Building2, ArrowLeft, Plus } from 'lucide-react';

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
  const { data: municipios = [] } = useMunicipiosByUF(uf);
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
    <div className="space-y-6">
      {/* Banner / Header do Estado */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-md bg-[#0f2d4a] text-white font-bold text-base flex items-center justify-center flex-shrink-0">
            {uf}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {ufInfo.nome}
              </h1>
              <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md border border-slate-200">
                Região {ufInfo.regiao}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-3 flex-wrap">
              <span>
                <strong>{municipios.length}</strong>{' '}
                {municipios.length === 1 ? 'município atrito' : 'municípios com polos'}
              </span>
              <span>•</span>
              <span>
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
            className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium px-3 py-1.5 rounded-md border border-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Brasil</span>
          </button>
          <button
            type="button"
            onClick={onOpenRegister}
            className="inline-flex items-center gap-1.5 text-xs text-white bg-[#0f2d4a] hover:bg-[#163a63] font-medium px-3.5 py-1.5 rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar</span>
          </button>
        </div>
      </div>

      {/* Tabs para Mobile */}
      <div className="flex md:hidden bg-slate-100 p-1 rounded-md gap-1 border border-slate-200">
        <button
          type="button"
          onClick={() => setMobileTab('lista')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
            mobileTab === 'lista'
              ? 'bg-white text-slate-900 border border-slate-300 shadow-2xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>Municípios ({municipios.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('mapa')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
            mobileTab === 'mapa'
              ? 'bg-white text-slate-900 border border-slate-300 shadow-2xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Mapa</span>
        </button>
      </div>

      {/* Grid Lado a Lado (Desktop) / Abas (Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
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
