'use client';

import React, { useMemo, useState, useRef } from 'react';
import * as d3Geo from 'd3-geo';
import { useBrazilGeoJSON } from '@/hooks/useIniciativas';
import { PRECOMPUTED_BRAZIL_PATHS } from '@/data/precomputed-maps';
import { UFInfo } from '@/lib/types';
import { UFS_BRASIL } from '@/lib/constants';
import { MapPin, Info, ArrowRight, Compass } from 'lucide-react';

interface BrazilMapProps {
  ufsSummary: UFInfo[];
  onSelectState: (uf: string) => void;
}

interface TooltipData {
  x: number;
  y: number;
  uf: string;
  nome: string;
  regiao: string;
  count: number;
  municipiosCount: number;
}

function getStateColors(count: number, isHovered: boolean) {
  if (isHovered) {
    return {
      fill: count > 0 ? '#2563EB' : '#E2E8F0',
      stroke: '#0F2A4A',
      strokeWidth: 1.8,
    };
  }

  if (count >= 10) {
    // Alta densidade: azul mais intenso
    return {
      fill: '#1E40AF',
      stroke: '#1E3A8A',
      strokeWidth: 0.9,
    };
  }

  if (count >= 3) {
    // Média densidade: azul médio
    return {
      fill: '#60A5FA',
      stroke: '#3B82F6',
      strokeWidth: 0.8,
    };
  }

  if (count > 0) {
    // Baixa densidade: azul muito claro
    return {
      fill: '#BFDBFE',
      stroke: '#93C5FD',
      strokeWidth: 0.75,
    };
  }

  // Sem iniciativas: neutro muito claro
  return {
    fill: '#F8FAFC',
    stroke: '#CBD5E1',
    strokeWidth: 0.75,
  };
}

export function BrazilMap({ ufsSummary, onSelectState }: BrazilMapProps) {
  const { data: geoData } = useBrazilGeoJSON();
  const [hoveredUF, setHoveredUF] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const ufsMap = useMemo(() => {
    const map = new Map<string, UFInfo>();
    ufsSummary.forEach((u) => map.set(u.sigla.toUpperCase(), u));
    return map;
  }, [ufsSummary]);

  const width = 560;
  const height = 580;

  const handleMouseMove = (
    e: React.MouseEvent<SVGPathElement>,
    sigla: string
  ) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const info = ufsMap.get(sigla) || {
      sigla,
      nome: UFS_BRASIL[sigla]?.nome || sigla,
      codigoIbge: '',
      regiao: UFS_BRASIL[sigla]?.regiao || '',
      totalIniciativas: 0,
      municipiosComIniciativas: 0,
    };

    setHoveredUF(sigla);
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      uf: sigla,
      nome: info.nome,
      regiao: info.regiao,
      count: info.totalIniciativas,
      municipiosCount: info.municipiosComIniciativas,
    });
  };

  const handleMouseLeave = () => {
    setHoveredUF(null);
    setTooltip(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs overflow-hidden"
    >
      {/* Cabeçalho do Mapa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#0F2A4A] flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-700" />
            <span>Mapa Interativo do Brasil</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              26 Estados + DF
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Clique em qualquer estado com destaque para explorar os municípios e projetos.
          </p>
        </div>
      </div>

      {/* SVG Container do Mapa */}
      <div className="relative flex items-center justify-center min-h-[380px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[520px] h-auto select-none drop-shadow-2xs"
          role="region"
          aria-label="Mapa interativo dos estados do Brasil"
        >
          <g>
            {PRECOMPUTED_BRAZIL_PATHS.map((item) => {
              const sigla = (item.sigla || '').toUpperCase();
              const ufInfo = ufsMap.get(sigla);
              const count = ufInfo?.totalIniciativas || 0;
              const isHovered = hoveredUF === sigla;
              const colors = getStateColors(count, isHovered);

              return (
                <path
                  key={sigla || item.codigoIbge}
                  d={item.d}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={colors.strokeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="cursor-pointer transition-colors duration-150 focus:outline-none"
                  tabIndex={0}
                  role="button"
                  aria-label={`${UFS_BRASIL[sigla]?.nome || sigla}: ${
                    count > 0
                      ? `${count} iniciativa(s) cadastrada(s)`
                      : 'Nenhuma iniciativa cadastrada'
                  }`}
                  onClick={() => onSelectState(sigla)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectState(sigla);
                    }
                  }}
                  onMouseMove={(e) => handleMouseMove(e, sigla)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </g>
        </svg>

        {/* Tooltip Flutuante */}
        {tooltip && (
          <div
            className="pointer-events-none absolute z-50 bg-[#0F2A4A] text-white rounded-lg shadow-xl px-3.5 py-2.5 border border-slate-700 min-w-[180px] -translate-x-1/2 -translate-y-full mb-3 text-xs"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-1.5">
              <span className="font-bold tracking-tight text-white">
                {tooltip.nome} ({tooltip.uf})
              </span>
              <span className="text-[10px] text-blue-300 uppercase font-semibold">
                {tooltip.regiao}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              {tooltip.count > 0 ? (
                <span className="font-semibold text-emerald-300">
                  {tooltip.count} {tooltip.count === 1 ? 'iniciativa' : 'iniciativas'} (
                  {tooltip.municipiosCount} {tooltip.municipiosCount === 1 ? 'cidade' : 'cidades'})
                </span>
              ) : (
                <span className="text-slate-400">Nenhuma iniciativa no momento</span>
              )}
            </div>

            <p className="text-[11px] text-slate-300 mt-1.5 flex items-center gap-1">
              <span>Clique para abrir o estado</span>
              <ArrowRight className="w-3 h-3 text-blue-300" />
            </p>
          </div>
        )}
      </div>

      {/* Legenda Institucional */}
      <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 font-medium">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#1E40AF] border border-[#1E3A8A]" />
          <span>Alta densidade</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#60A5FA] border border-[#3B82F6]" />
          <span>Média densidade</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#BFDBFE] border border-[#93C5FD]" />
          <span>Baixa densidade</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#F8FAFC] border border-[#CBD5E1]" />
          <span>Sem iniciativas cadastradas</span>
        </div>
      </div>
    </div>
  );
}
