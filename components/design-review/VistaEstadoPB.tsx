'use client';

import React, { useState, useMemo, useRef } from 'react';
import { PRECOMPUTED_PB_PATHS, PrecomputedPath } from '@/data/precomputed-maps';
import {
  Globe,
  ChevronRight,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  ArrowRight,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { normalizeText } from '@/lib/utils';

interface VistaEstadoPBProps {
  onGoBrasil: () => void;
  onSelectCityCard: (cityName: string) => void;
}

interface MunicipalityData {
  nome: string;
  iniciativas: number;
  esportes: string[];
}

const MUNICIPALES_PB: MunicipalityData[] = [
  {
    nome: 'João Pessoa',
    iniciativas: 21,
    esportes: ['Atletismo', 'Natação', 'Bocha paralímpica', 'Basquete em cadeira de rodas', 'Futebol de 5'],
  },
  {
    nome: 'Campina Grande',
    iniciativas: 28,
    esportes: ['Atletismo', 'Natação', 'Goalball', 'Tênis de mesa', 'Halterofilismo'],
  },
  {
    nome: 'Patos',
    iniciativas: 8,
    esportes: ['Bocha paralímpica', 'Atletismo', 'Esporte adaptado'],
  },
  {
    nome: 'Sousa',
    iniciativas: 6,
    esportes: ['Atletismo', 'Natação adaptada', 'Iniciação esportiva'],
  },
  {
    nome: 'Cajazeiras',
    iniciativas: 5,
    esportes: ['Iniciação esportiva adaptada', 'Futsal para deficientes'],
  },
  {
    nome: 'Guarabira',
    iniciativas: 4,
    esportes: ['Bocha paralímpica', 'Atletismo'],
  },
  {
    nome: 'Santa Rita',
    iniciativas: 3,
    esportes: ['Esporte adaptado', 'Atletismo'],
  },
];

const TODAS_MODALIDADES = [
  'Todos os esportes',
  'Atletismo',
  'Basquete em cadeira de rodas',
  'Bocha paralímpica',
  'Futebol de 5',
  'Goalball',
  'Halterofilismo',
  'Natação',
  'Tênis de mesa',
];

interface TooltipData {
  x: number;
  y: number;
  nome: string;
  iniciativas: number;
  esportes: string[];
}

export function VistaEstadoPB({ onGoBrasil, onSelectCityCard }: VistaEstadoPBProps) {
  const [selectedSport, setSelectedSport] = useState('Todos os esportes');
  const [sortOrder, setSortOrder] = useState<'A-Z' | 'Z-A' | 'Mais' | 'Menos'>('A-Z');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredMuni, setHoveredMuni] = useState<string | null>(null);
  const [selectedMuni, setSelectedMuni] = useState<string>('João Pessoa');
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mapeamento rápido de municípios com dados
  const muniMap = useMemo(() => {
    const map = new Map<string, MunicipalityData>();
    MUNICIPALES_PB.forEach((m) => {
      map.set(normalizeText(m.nome), m);
    });
    return map;
  }, []);

  const width = 560;
  const height = 440;

  const handleMouseMove = (
    e: React.MouseEvent<SVGPathElement>,
    item: PrecomputedPath
  ) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normNome = normalizeText(item.nome);
    const info = muniMap.get(normNome);

    setHoveredMuni(normNome);
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      nome: info?.nome || item.nome,
      iniciativas: info?.iniciativas || 0,
      esportes: info?.esportes || [],
    });
  };

  const handleMouseLeave = () => {
    setHoveredMuni(null);
    setTooltip(null);
  };

  // Filtragem e ordenação da lista
  const filteredList = useMemo(() => {
    let result = [...MUNICIPALES_PB];

    if (searchTerm.trim()) {
      const q = normalizeText(searchTerm);
      result = result.filter((m) => normalizeText(m.nome).includes(q));
    }

    if (selectedSport !== 'Todos os esportes') {
      result = result.filter((m) => m.esportes.includes(selectedSport));
    }

    result.sort((a, b) => {
      if (sortOrder === 'A-Z') return a.nome.localeCompare(b.nome);
      if (sortOrder === 'Z-A') return b.nome.localeCompare(a.nome);
      if (sortOrder === 'Mais') return b.iniciativas - a.iniciativas;
      if (sortOrder === 'Menos') return a.iniciativas - b.iniciativas;
      return 0;
    });

    return result;
  }, [searchTerm, selectedSport, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb em destaque para Estado */}
      <nav
        aria-label="Trilha de navegação territorial"
        className="flex items-center text-xs font-semibold text-slate-600 gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-2xs"
      >
        <button
          type="button"
          onClick={onGoBrasil}
          className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Brasil</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0F2A4A] font-bold">Paraíba</span>
      </nav>

      {/* Cabeçalho do Estado */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] tracking-tight">
              Paraíba
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Região Nordeste</span>
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-600 mt-1">
            85 iniciativas cadastradas
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={onGoBrasil}
            className="text-xs font-semibold text-slate-700 hover:text-[#0F2A4A] bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg transition-colors border border-slate-200"
          >
            ← Voltar ao Mapa Nacional
          </button>
        </div>
      </div>

      {/* Barra de Ações e Filtros */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          {/* Dropdown: Todos os esportes */}
          <div className="relative flex-1 sm:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full sm:w-56 pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-700 appearance-none cursor-pointer"
            >
              {TODAS_MODALIDADES.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown: Ordenar */}
          <div className="relative flex-1 sm:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'A-Z' | 'Z-A' | 'Mais' | 'Menos')}
              className="w-full sm:w-44 pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-700 appearance-none cursor-pointer"
            >
              <option value="A-Z">Ordenar: A-Z</option>
              <option value="Z-A">Ordenar: Z-A</option>
              <option value="Mais">Mais iniciativas</option>
              <option value="Menos">Menos iniciativas</option>
            </select>
          </div>
        </div>

        {/* Campo de Busca de Município */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar município..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>
      </div>

      {/* Layout Dividido: Esquerda (Mapa da Paraíba) e Direita (Lista de Municípios) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ESQUERDA: Mapa da Paraíba com Municípios */}
        <div className="lg:col-span-7">
          <div
            ref={containerRef}
            className="relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs overflow-hidden"
          >
            {/* Header do Box do Mapa */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-[#0F2A4A] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-700" />
                <span>Malha Territorial da Paraíba</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                223 municípios mapeados
              </span>
            </div>

            {/* SVG Instantâneo do Estado da Paraíba */}
            <div className="relative flex items-center justify-center min-h-[360px]">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full max-w-[520px] h-auto select-none"
                role="region"
                aria-label="Mapa dos municípios da Paraíba com destaque para cidades com iniciativas"
              >
                <g>
                  {PRECOMPUTED_PB_PATHS.map((item) => {
                    const normNome = normalizeText(item.nome);
                    const info = muniMap.get(normNome);
                    const hasData = !!info && info.iniciativas > 0;
                    const isHovered = hoveredMuni === normNome;
                    const isSelected = normalizeText(selectedMuni) === normNome;

                    let fill = '#F8FAFC'; // neutro muito claro base
                    let stroke = '#CBD5E1';
                    let strokeWidth = 0.5;

                    if (hasData) {
                      fill = '#3B82F6'; // Azul institucional
                      stroke = '#1D4ED8';
                      strokeWidth = 1.0;

                      if (isSelected || isHovered) {
                        fill = '#1E40AF'; // Azul mais intenso na seleção
                        stroke = '#0F2A4A';
                        strokeWidth = 2.0;
                      }
                    } else if (isHovered) {
                      fill = '#E2E8F0';
                      stroke = '#94A3B8';
                      strokeWidth = 0.8;
                    }

                    return (
                      <path
                        key={item.codigoIbge || normNome}
                        d={item.d}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className="cursor-pointer transition-colors duration-150 focus:outline-none"
                        tabIndex={hasData ? 0 : -1}
                        role={hasData ? 'button' : 'presentation'}
                        aria-label={`${item.nome}: ${
                          hasData ? `${info.iniciativas} iniciativas` : 'Sem iniciativas registradas'
                        }`}
                        onClick={() => {
                          if (hasData) {
                            setSelectedMuni(info.nome);
                            onSelectCityCard(info.nome);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (hasData && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            setSelectedMuni(info.nome);
                            onSelectCityCard(info.nome);
                          }
                        }}
                        onMouseMove={(e) => handleMouseMove(e, item)}
                        onMouseLeave={handleMouseLeave}
                      />
                    );
                  })}
                </g>
              </svg>

              {/* Tooltip do Município */}
              {tooltip && (
                <div
                  className="pointer-events-none absolute z-40 bg-[#0F2A4A] text-white rounded-lg shadow-lg px-3 py-2 border border-slate-700 min-w-[160px] -translate-x-1/2 -translate-y-full mb-2 text-xs"
                  style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
                >
                  <p className="font-bold text-white mb-0.5">{tooltip.nome}</p>
                  {tooltip.iniciativas > 0 ? (
                    <div>
                      <p className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{tooltip.iniciativas} iniciativas cadastradas</span>
                      </p>
                      <p className="text-[10px] text-blue-300 mt-1 flex items-center gap-1">
                        <span>Clique para ver cards</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-[11px]">Nenhuma iniciativa no catálogo</p>
                  )}
                </div>
              )}
            </div>

            {/* Legenda do Mapa Estadual */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-[#3B82F6] border border-[#1D4ED8]" />
                <span>Municípios com iniciativas ({MUNICIPALES_PB.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-[#1E40AF] border border-[#0F2A4A]" />
                <span>Selecionado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-[#F8FAFC] border border-[#CBD5E1]" />
                <span>Sem dados</span>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-400 text-center">
              Dados demonstrativos para validação da interface. Fonte: entidades e federações públicas.
            </div>
          </div>
        </div>

        {/* DIREITA: Lista de Municípios */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0F2A4A] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>Municípios</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {filteredList.length} exibidos
              </span>
            </div>

            {/* Lista dos Municípios */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredList.length > 0 ? (
                filteredList.map((muni) => {
                  const isSelected = selectedMuni === muni.nome;

                  return (
                    <div
                      key={muni.nome}
                      onClick={() => {
                        setSelectedMuni(muni.nome);
                        onSelectCityCard(muni.nome);
                      }}
                      onMouseEnter={() => setHoveredMuni(normalizeText(muni.nome))}
                      onMouseLeave={() => setHoveredMuni(null)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-[#0F2A4A] group-hover:text-blue-900 transition-colors">
                          {muni.nome}
                        </h3>

                        <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" />
                          <span>{muni.iniciativas} iniciativas</span>
                        </p>

                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {muni.esportes.slice(0, 2).map((esp) => (
                            <span
                              key={esp}
                              className="text-[10px] font-medium bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200"
                            >
                              {esp}
                            </span>
                          ))}
                          {muni.esportes.length > 2 && (
                            <span className="text-[10px] text-slate-500 font-medium">
                              +{muni.esportes.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center text-xs font-semibold text-blue-700 group-hover:translate-x-0.5 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">
                  Nenhum município encontrado para os filtros selecionados.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
