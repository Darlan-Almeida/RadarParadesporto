'use client';

import React, { useMemo, useState, useRef } from 'react';
import * as d3Geo from 'd3-geo';
import { useStateMunicipalitiesGeoJSON } from '@/hooks/useIniciativas';
import { MunicipioInfo } from '@/lib/types';
import { UFS_BRASIL } from '@/lib/constants';
import { normalizeText } from '@/lib/utils';
import { MapPin, ArrowRight } from 'lucide-react';

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
      <div className="h-[420px] bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-500 animate-pulse">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs font-medium text-slate-600">
          Carregando malha municipal de {UFS_BRASIL[uf]?.nome || uf}...
        </p>
      </div>
    );
  }

  const ufInfo = UFS_BRASIL[uf];

  return (
    <div
      ref={containerRef}
      className="relative bg-white rounded-lg border border-slate-200 p-4 overflow-hidden flex flex-col justify-between"
    >
      {/* Header do Mapa do Estado */}
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-2 border-b border-slate-100">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Malha Municipal de {ufInfo?.nome || uf}</span>
            <span className="text-[11px] font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              {paths.length} municípios
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cidades com projetos destacados em azul.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span>{municipiosWithData.length} com polos</span>
        </div>
      </div>

      {/* SVG do Estado */}
      <div className="relative flex items-center justify-center min-h-[360px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[480px] h-auto select-none"
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

              let fill = '#f8fafc';
              let stroke = '#64748b';
              let strokeWidth = 0.8;

              if (hasData) {
                fill = '#2563eb';
                stroke = '#1e3a8a';
                strokeWidth = 1.2;

                if (isHovered || isExternalHighlight) {
                  fill = '#1d4ed8';
                  stroke = '#0f2a4a';
                  strokeWidth = 2;
                }
              } else if (isHovered) {
                fill = '#e2e8f0';
                stroke = '#0f172a';
                strokeWidth = 1.4;
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
                  className="map-polygon transition-colors duration-150"
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
            className="pointer-events-none absolute z-50 bg-slate-900 text-white rounded-md shadow-md px-3 py-2 border border-slate-800 min-w-[150px] -translate-x-1/2 -translate-y-full mb-2 text-xs"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
            }}
          >
            <p className="font-semibold text-white mb-0.5">{tooltip.nome}</p>

            {tooltip.count > 0 ? (
              <div>
                <p className="text-xs text-blue-300 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>
                    {tooltip.count} {tooltip.count === 1 ? 'iniciativa' : 'iniciativas'}
                  </span>
                </p>
                {tooltip.esportes.length > 0 && (
                  <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                    {tooltip.esportes.slice(0, 3).join(', ')}
                  </p>
                )}
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                  <span>Abrir município</span>
                  <ArrowRight className="w-2.5 h-2.5 text-slate-300" />
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">Sem iniciativas</p>
            )}
          </div>
        )}
      </div>

      {/* Legenda e Dica */}
      <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 text-center">
        Clique em uma cidade destacada para ver as iniciativas
      </div>
    </div>
  );
}
