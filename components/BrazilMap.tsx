'use client';

import React, { useMemo, useState, useRef } from 'react';
import { PRECOMPUTED_BRAZIL_PATHS } from '@/data/precomputed-maps';
import { UFInfo } from '@/lib/types';
import { UFS_BRASIL } from '@/lib/constants';
import { MapPin, ArrowRight } from 'lucide-react';

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
      fill: count > 0 ? '#1d4ed8' : '#cbd5e1',
      stroke: '#0f2a4a',
      strokeWidth: 2,
    };
  }

  if (count >= 4) {
    return {
      fill: '#1e3a8a',
      stroke: '#0f2a4a',
      strokeWidth: 1.2,
    };
  }

  if (count >= 2) {
    return {
      fill: '#2563eb',
      stroke: '#0f2a4a',
      strokeWidth: 1.2,
    };
  }

  if (count >= 1) {
    return {
      fill: '#60a5fa',
      stroke: '#0f2a4a',
      strokeWidth: 1.1,
    };
  }

  return {
    fill: '#f1f5f9',
    stroke: '#475569',
    strokeWidth: 1,
  };
}

export function BrazilMap({ ufsSummary, onSelectState }: BrazilMapProps) {
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
      className="relative bg-white rounded-lg border border-slate-200 p-5 overflow-hidden"
    >
      {/* Cabeçalho do Mapa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Mapa Interativo do Brasil</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              26 Estados + DF
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Clique em qualquer estado para visualizar os municípios e projetos catalogados.
          </p>
        </div>
      </div>

      {/* SVG Container do Mapa */}
      <div className="relative flex items-center justify-center min-h-[360px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[500px] h-auto select-none"
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
                  className="map-polygon transition-colors duration-150"
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

        {/* Tooltip Flutuante Neutro */}
        {tooltip && (
          <div
            className="pointer-events-none absolute z-50 bg-slate-900 text-white rounded-md shadow-md px-3 py-2 border border-slate-800 min-w-[160px] -translate-x-1/2 -translate-y-full mb-2 text-xs"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1 mb-1">
              <span className="font-semibold text-white">
                {tooltip.nome} ({tooltip.uf})
              </span>
              <span className="text-[10px] text-slate-400 uppercase">
                {tooltip.regiao}
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              {tooltip.count > 0 ? (
                <span className="font-medium text-slate-200">
                  {tooltip.count} {tooltip.count === 1 ? 'iniciativa' : 'iniciativas'} ({tooltip.municipiosCount}{' '}
                  {tooltip.municipiosCount === 1 ? 'cidade' : 'cidades'})
                </span>
              ) : (
                <span className="text-slate-400">Sem iniciativas</span>
              )}
            </div>

            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Abrir estado</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </p>
          </div>
        )}
      </div>

      {/* Legenda Institucional */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#1e3a8a] border border-[#0f2a4a]" />
          <span>Alta densidade</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#2563eb] border border-[#0f2a4a]" />
          <span>Média densidade</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#60a5fa] border border-[#0f2a4a]" />
          <span>Baixa densidade</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#f1f5f9] border border-[#475569]" />
          <span>Sem iniciativas</span>
        </div>
      </div>
    </div>
  );
}
