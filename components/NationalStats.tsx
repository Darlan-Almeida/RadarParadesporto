'use client';

import React from 'react';
import { Award, MapPin, Building2, Flame, HeartHandshake } from 'lucide-react';
import { NationalSummary } from '@/lib/types';

interface NationalStatsProps {
  summary?: NationalSummary;
  isLoading?: boolean;
}

export function NationalStats({ summary, isLoading }: NationalStatsProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 my-6">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className="h-24 bg-slate-200/70 animate-pulse rounded-xl border border-slate-200"
          />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: 'Iniciativas Mapeadas',
      value: summary.totalIniciativas,
      sub: 'projetos ativos no MVP',
      icon: Award,
      color: 'text-teal-700 bg-teal-50 border-teal-200',
    },
    {
      label: 'Estados com Presença',
      value: `${summary.totalEstadosComIniciativas} de 27`,
      sub: 'cobertura em 4 regiões',
      icon: MapPin,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      label: 'Municípios Atendidos',
      value: summary.totalMunicipiosComIniciativas,
      sub: 'cidades com polos esportivos',
      icon: Building2,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    },
    {
      label: 'Modalidades Paradesportivas',
      value: summary.totalEsportesUnicos,
      sub: 'esportes adaptados catalogados',
      icon: Flame,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      label: 'Atendimento Gratuito',
      value: `${summary.percentualGratuito}%`,
      sub: 'projetos sociais sem custo',
      icon: HeartHandshake,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 my-6">
      {items.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between transition-functional hover:border-slate-300 hover:shadow-sm ${
              idx === 4 ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-600 line-clamp-1">{stat.label}</span>
              <div className={`p-1.5 rounded-lg border ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">{stat.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
