'use client';

import React, { useMemo, useState, useRef } from 'react';
import * as d3Geo from 'd3-geo';
import { useStateMunicipalitiesGeoJSON } from '@/hooks/useIniciativas';
import { MunicipioInfo } from '@/lib/types';
import { UFS_BRASIL } from '@/lib/constants';
import { normalizeText } from '@/lib/utils';
import { MapPin, ArrowRight, Layers } from 'lucide-react';

interface StateMapProps {
  uf: string;
  municipiosWithData: MunicipioInfo[];
  highlightedMunicipio?: string | null;
  onSelectMunicipio: (municipio: string) => void;
}

interface TooltipData {
  x: number;
  y: number;
  nome: string;
  count: number;
  esportes: string[];
}

export function StateMap({
  uf,
  municipiosWithData,
  highlightedMunicipio,
  onSelectMunicipio,
}: StateMapProps) {
  const { data: geoData, isLoading } = useStateMunicipalitiesGeoJSON(uf);
  const [hoveredMuni, setHoveredMuni] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const muniMap = useMemo(() => {
    const map = new Map<string, MunicipioInfo>();
    municipiosWithData.forEach((m) => {
      map.set(normalizeText(m.nome), m);
    });
    return map;
  }, [municipiosWithData]);

  const width = 540;
  const height = 480;

  const { paths } = useMemo(() => {
    if (!geoData || !geoData.features) return { paths: [] };

    const projection = d3Geo
      .geoMercator()
      .fitSize([width, height], geoData as unknown as d3Geo.ExtendedFeatureCollection);
    const pathGen = d3Geo.geoPath().projection(projection);

    const list = geoData.features.map((feature) => {
      const nome = (feature.properties?.nome || '') as string;
      const d = pathGen(feature as unknown as d3Geo.ExtendedFeature) || '';
      return {
        feature,
        nome,
        normNome: normalizeText(nome),
        d,
      };
    });

    return { paths: list };
  }, [geoData]);

  const handleMouseMove = (
    e: React.MouseEvent<SVGPathElement>,
    nome: string,
    normNome: string
  ) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const info = muniMap.get(normNome);

    setHoveredMuni(normNome);
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      nome: info?.nome || nome,
      count: info?.totalIniciativas || 0,
      esportes: info?.esportes || [],
    });
  };

  const handleMouseLeave = () => {
    setHoveredMuni(null);
    setTooltip(null);
  };

  if (isLoading || !paths.length) {
    return (
      <div className="h-[420px] bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-500 animate-pulse">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs sm:text-sm font-medium text-slate-600">
          Carregando malha municipal de {UFS_BRASIL[uf]?.nome || uf}...
        </p>
      </div>
    );
  }

  const ufInfo = UFS_BRASIL[uf];

  return (
    <div
      ref={containerRef}
      className="relative bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs overflow-hidden flex flex-col justify-between"
    >
      {/* Header do Mapa do Estado */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Malha Municipal de {ufInfo?.nome || uf}</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-normal">
              {paths.length} municípios
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Municípios com projetos destacados em esmeralda.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-xs" />
          <span>{municipiosWithData.length} com iniciativa(s)</span>
        </div>
      </div>

      {/* SVG do Estado */}
      <div className="relative flex items-center justify-center min-h-[380px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[500px] h-auto select-none"
          role="region"
          aria-label={`Mapa dos municípios de ${ufInfo?.nome || uf}`}
        >
          <g>
            {paths.map(({ nome, normNome, d }) => {
              const info = muniMap.get(normNome);
              const count = info?.totalIniciativas || 0;
              const hasData = count > 0;
              const isHovered = hoveredMuni === normNome;
              const isExternalHighlight =
                highlightedMunicipio && normalizeText(highlightedMunicipio) === normNome;

              let fill = '#f1f5f9'; // slate-100
              let stroke = '#cbd5e1'; // slate-300
              let strokeWidth = 0.5;

              if (hasData) {
                fill = '#059669'; // emerald-600
                stroke = '#065f46'; // emerald-800
                strokeWidth = 1.2;

                if (isHovered || isExternalHighlight) {
                  fill = '#0d9488'; // teal-600
                  stroke = '#042f2e';
                  strokeWidth = 2.2;
                }
              } else if (isHovered) {
                fill = '#e2e8f0';
                stroke = '#94a3b8';
                strokeWidth = 1.2;
              }

              return (
                <path
                  key={normNome}
                  d={d}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="map-polygon transition-functional"
                  tabIndex={hasData ? 0 : -1}
                  role={hasData ? 'button' : 'presentation'}
                  aria-label={`${nome}: ${
                    hasData
                      ? `${count} iniciativa(s) cadastrada(s)`
                      : 'Nenhuma iniciativa cadastrada'
                  }`}
                  onClick={() => {
                    if (hasData) {
                      onSelectMunicipio(info?.nome || nome);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (hasData && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onSelectMunicipio(info?.nome || nome);
                    }
                  }}
                  onMouseMove={(e) => handleMouseMove(e, nome, normNome)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </g>
        </svg>

        {/* Tooltip Flutuante */}
        {tooltip && (
          <div
            className="pointer-events-none absolute z-50 bg-slate-900 text-white rounded-lg shadow-xl px-3 py-2 border border-slate-700 min-w-[170px] -translate-x-1/2 -translate-y-full mb-2"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
            }}
          >
            <p className="text-xs font-bold text-white mb-0.5">{tooltip.nome}</p>

            {tooltip.count > 0 ? (
              <div>
                <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>
                    {tooltip.count} {tooltip.count === 1 ? 'iniciativa' : 'iniciativas'}
                  </span>
                </p>
                {tooltip.esportes.length > 0 && (
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">
                    {tooltip.esportes.slice(0, 3).join(', ')}
                  </p>
                )}
                <p className="text-[10px] text-teal-300 mt-1 flex items-center gap-1 font-medium">
                  <span>Clique para ver detalhes</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">Sem iniciativas registradas</p>
            )}
          </div>
        )}
      </div>

      {/* Legenda e Dica */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          Dica: clique em um município verde para abrir suas iniciativas
        </span>
      </div>
    </div>
  );
}
