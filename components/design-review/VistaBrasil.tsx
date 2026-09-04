'use client';

import React, { useState, useRef } from 'react';
import { PRECOMPUTED_BRAZIL_PATHS, PrecomputedPath } from '@/data/precomputed-maps';
import { UFS_BRASIL } from '@/lib/constants';
import {
  Search,
  CheckCircle2,
  MapPin,
  Compass,
  ArrowRight,
  Info,
  Map as MapIcon,
  Sparkles,
  Users,
  Building2,
} from 'lucide-react';

interface VistaBrasilProps {
  onSelectState: (uf: string) => void;
  onOpenRegister: () => void;
}

interface TooltipInfo {
  x: number;
  y: number;
  uf: string;
  nome: string;
  regiao: string;
  iniciativas: number;
}

import { useAllUFsSummary, useNationalSummary } from '@/hooks/useIniciativas';

// Mock de fallback para validação visual se ainda não carregado
const MOCK_ESTADOS_INICIATIVAS: Record<string, number> = {
  SP: 420,
  RJ: 190,
  MG: 160,
  RS: 110,
  PB: 85,
  PE: 75,
  SC: 60,
  PR: 55,
  BA: 40,
  CE: 28,
  DF: 25,
};

// Escala institucional de azul conforme Item 2 da especificação
function getStateColors(count: number, isHovered: boolean) {
  if (isHovered) {
    return {
      fill: count > 0 ? '#1D4ED8' : '#CBD5E1',
      stroke: '#0F2A4A',
      strokeWidth: 2.5,
    };
  }

  if (count >= 4) {
    // Alta densidade (>=4 iniciativas, ex: SP, PB, RJ, MG): Azul Marinho Profundo
    return {
      fill: '#1E3A8A',
      stroke: '#0F2A4A',
      strokeWidth: 1.5,
    };
  }

  if (count >= 2) {
    // Média densidade (2 a 3 iniciativas): Azul Royal Vibrante
    return {
      fill: '#2563EB',
      stroke: '#0F2A4A',
      strokeWidth: 1.4,
    };
  }

  if (count >= 1) {
    // Baixa densidade / Iniciação (1 iniciativa): Azul Celeste Claro
    return {
      fill: '#60A5FA',
      stroke: '#0F2A4A',
      strokeWidth: 1.3,
    };
  }

  // Sem dados cadastrados: Slate Neutro
  return {
    fill: '#F1F5F9',
    stroke: '#334155',
    strokeWidth: 1.2,
  };
}

export function VistaBrasil({ onSelectState, onOpenRegister }: VistaBrasilProps) {
  const { data: ufsSummary = [] } = useAllUFsSummary();
  const { data: nationalSummary } = useNationalSummary();
  const [hoveredUF, setHoveredUF] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const ufsMap = React.useMemo(() => {
    const map = new Map<string, number>();
    ufsSummary.forEach((u) => {
      map.set(u.sigla.toUpperCase(), u.totalIniciativas);
    });
    return map;
  }, [ufsSummary]);

  const getCountForUF = (sigla: string) => {
    const key = sigla.toUpperCase();
    if (ufsMap.has(key)) {
      return ufsMap.get(key)!;
    }
    return MOCK_ESTADOS_INICIATIVAS[key] || 0;
  };

  const width = 560;
  const height = 580;

  const handleMouseMove = (
    e: React.MouseEvent<SVGPathElement>,
    item: PrecomputedPath
  ) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const sigla = item.sigla || '';
    const count = getCountForUF(sigla);
    const ufInfo = UFS_BRASIL[sigla];

    setHoveredUF(sigla);
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      uf: sigla,
      nome: ufInfo?.nome || item.nome,
      regiao: ufInfo?.regiao || item.regiao || 'Brasil',
      iniciativas: count,
    });
  };

  const handleMouseLeave = () => {
    setHoveredUF(null);
    setTooltip(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim().toUpperCase();
    if (!clean) return;

    // Tenta encontrar por sigla exata ou por nome do estado
    for (const [sigla, info] of Object.entries(UFS_BRASIL)) {
      if (
        sigla === clean ||
        info.nome.toUpperCase().includes(clean) ||
        clean.includes(sigla)
      ) {
        onSelectState(sigla);
        return;
      }
    }
    onSelectState('PB');
  };

  return (
    <div className="space-y-10">
      {/* Seção Principal: Hero com Composição Integrada (Texto à esquerda, Mapa à direita) */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Coluna Esquerda: Texto, Busca e Indicador */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              {/* Eyebrow */}
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700 block">
                CATÁLOGO NACIONAL
              </span>

              {/* Título Principal com peso equilibrado */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] tracking-tight leading-snug">
                Encontre iniciativas esportivas para pessoas com deficiência em todo o Brasil
              </h1>

              {/* Descrição Curta */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                Explore projetos, organizações e oportunidades esportivas inclusivas próximas de você.
              </p>
            </div>

            {/* Campo de Busca Leve e Direto */}
            <form onSubmit={handleSearchSubmit} className="space-y-2">
              <div className="relative flex items-center max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar estado ou cidade..."
                  className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F2A4A] font-semibold text-xs rounded-md transition-colors border border-slate-300"
                >
                  Explorar
                </button>
              </div>
            </form>

            {/* Indicador Nacional */}
            <div className="flex items-center gap-3 flex-wrap pt-1">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-200/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold tracking-tight">
                  {(nationalSummary?.totalIniciativas || 1248).toLocaleString('pt-BR')} iniciativas cadastradas
                </span>
              </div>

              <span className="text-xs text-slate-500 font-medium">
                Catálogo em constante atualização
              </span>
            </div>

            {/* Atalho rápido de validação para a Paraíba */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onSelectState('PB')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors"
              >
                <span>Navegar para a demonstração da Paraíba (PB)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Coluna Direita: Mapa Real do Brasil com moldura sutil integrada */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div
              ref={containerRef}
              className="relative w-full max-w-[500px] bg-slate-50/50 rounded-xl border border-slate-200 p-4 sm:p-5"
            >
              {/* Cabeçalho sutil do mapa */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 text-xs text-slate-600">
                <span className="font-semibold text-[#0F2A4A] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-blue-700" />
                  <span>Mapa Nacional Interativo</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Clique para explorar a UF
                </span>
              </div>

              {/* Renderização dos 27 polígonos individuais */}
              <div className="relative flex items-center justify-center min-h-[360px]">
                {PRECOMPUTED_BRAZIL_PATHS && PRECOMPUTED_BRAZIL_PATHS.length > 0 ? (
                  <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-auto max-h-[440px] select-none"
                    role="region"
                    aria-label="Mapa do Brasil com 26 estados e Distrito Federal"
                  >
                    <g>
                      {PRECOMPUTED_BRAZIL_PATHS.map((item) => {
                        const sigla = item.sigla || '';
                        const count = getCountForUF(sigla);
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
                            aria-label={`${item.nome} (${sigla}): ${
                              count > 0
                                ? `${count} iniciativas cadastradas`
                                : 'Sem iniciativas registradas'
                            }`}
                            onClick={() => onSelectState(sigla)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSelectState(sigla === 'PB' ? 'PB' : sigla);
                              }
                            }}
                            onMouseMove={(e) => handleMouseMove(e, item)}
                            onMouseLeave={handleMouseLeave}
                          />
                        );
                      })}
                    </g>
                  </svg>
                ) : (
                  <div className="p-8 text-center text-xs text-red-600 border border-red-200 bg-red-50 rounded-lg">
                    Erro na renderização dos vetores geográficos do Brasil.
                  </div>
                )}

                {/* Tooltip Flutuante */}
                {tooltip && (
                  <div
                    className="pointer-events-none absolute z-40 bg-[#0F2A4A] text-white rounded-lg shadow-lg px-3 py-2 border border-slate-700 min-w-[160px] -translate-x-1/2 -translate-y-full mb-2 text-xs"
                    style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1 mb-1">
                      <span className="font-bold text-white">
                        {tooltip.nome} ({tooltip.uf})
                      </span>
                      <span className="text-[10px] text-blue-300 uppercase">{tooltip.regiao}</span>
                    </div>
                    <p className="text-emerald-400 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {tooltip.iniciativas > 0
                          ? `${tooltip.iniciativas} iniciativas`
                          : 'Nenhuma iniciativa cadastrada'}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-300 mt-1 flex items-center gap-1">
                      <span>Clique para abrir</span>
                      <ArrowRight className="w-2.5 h-2.5 text-blue-300" />
                    </p>
                  </div>
                )}
              </div>

              {/* Legenda Institucional com a Escala de Azul */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 font-medium">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#1E3A8A] border border-[#0F2A4A]" />
                  <span>Alta densidade (4+)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#2563EB] border border-[#0F2A4A]" />
                  <span>Média (2–3)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#60A5FA] border border-[#0F2A4A]" />
                  <span>Iniciação (1)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#F1F5F9] border border-[#334155]" />
                  <span>Sem cadastros</span>
                </div>
              </div>

              {/* Indicação Discreta da Fonte de Dados */}
              <div className="mt-2 text-[10px] text-slate-400 text-center">
                Dados demonstrativos para validação da interface. Fonte: entidades e federações públicas.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Orientação ao Usuário (4 Pilares - Sóbrio, orientação sem poluição de métricas) */}
      <section aria-label="Orientações de Navegação" className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <h2 className="text-base font-bold text-[#0F2A4A]">Como funciona o RadarPCD</h2>
          <p className="text-xs text-slate-500">
            Acesso público e facilitado à informação paradesportiva em quatro etapas simples.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Bloco 1: Navegue no mapa */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200/60">
                1
              </div>
              <h3 className="text-sm font-bold text-[#0F2A4A]">Navegue no mapa</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore por Estado e descubra os municípios que já contam com projetos esportivos e polos de treinamento ativos.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onSelectState('PB')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
              >
                <span>Ver Paraíba</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Bloco 2: Descubra oportunidades */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200/60">
                2
              </div>
              <h3 className="text-sm font-bold text-[#0F2A4A]">Descubra oportunidades</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consulte modalidades disponíveis como atletismo, natação, bocha, basquete em cadeira de rodas, goalball e futebol de 5.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium">Múltiplas modalidades</span>
            </div>
          </div>

          {/* Bloco 3: Participe */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200/60">
                3
              </div>
              <h3 className="text-sm font-bold text-[#0F2A4A]">Participe</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Acesse canais diretos de contato (telefone, e-mail e endereço) para verificar vagas, turmas gratuitas e requisitos.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs text-emerald-700 font-semibold">Projetos gratuitos</span>
            </div>
          </div>

          {/* Bloco 4: Para organizações */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200/60">
                4
              </div>
              <h3 className="text-sm font-bold text-[#0F2A4A]">Para organizações</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Associações, clubes e secretarias de esporte podem submeter novas iniciativas para homologação e publicação no catálogo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onOpenRegister}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
              >
                <span>Cadastrar projeto</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
