'use client';

import React from 'react';
import { NationalSummary } from '@/lib/types';

interface NationalStatsProps {
  summary?: NationalSummary;
  isLoading?: boolean;
}

export function NationalStats({ summary, isLoading }: NationalStatsProps) {
  if (isLoading || !summary) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-4 h-20 animate-pulse" />
    );
  }

  const items = [
    {
      label: 'Iniciativas Mapeadas',
      value: summary.totalIniciativas,
      sub: 'Projetos catalogados',
    },
    {
      label: 'Estados com Cobertura',
      value: `${summary.totalEstadosComIniciativas} / 27`,
      sub: 'Unidades federativas',
    },
    {
      label: 'Municípios Atendidos',
      value: summary.totalMunicipiosComIniciativas,
      sub: 'Cidades com polos ativos',
    },
    {
      label: 'Modalidades Esportivas',
      value: summary.totalEsportesUnicos,
      sub: 'Esportes adaptados',
    },
    {
      label: 'Gratuidade nos Projetos',
      value: `${summary.percentualGratuito}%`,
      sub: 'Atendimento sem custo',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((stat, idx) => (
        <div key={idx} className="p-3.5 sm:p-4 flex flex-col justify-center">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
            {stat.label}
          </span>
          <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {stat.value}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5">{stat.sub}</span>
        </div>
      ))}
    </div>
  );
}
