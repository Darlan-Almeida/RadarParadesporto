'use client';

import React, { useState } from 'react';
import { useNavigationState } from '@/hooks/useNavigationState';
import { useAllUFsSummary, useNationalSummary } from '@/hooks/useIniciativas';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { NationalStats } from '@/components/NationalStats';
import { BrazilMap } from '@/components/BrazilMap';
import { StatesOverviewList } from '@/components/StatesOverviewList';
import { StateView } from '@/components/StateView';
import { CityView } from '@/components/CityView';
import { RegisterModal } from '@/components/RegisterModal';
import { Footer } from '@/components/Footer';

export default function Home() {
  const { navState, isClientReady, goToBrasil, goToEstado, goToCidade } =
    useNavigationState();

  const { data: ufsSummary = [] } = useAllUFsSummary();
  const { data: nationalSummary, isLoading: isLoadingSummary } = useNationalSummary();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  if (!isClientReady) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-300 font-medium">
          Carregando RadarParadesporto...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-[#0f2d4a] selection:text-white">
      {/* Header Institucional Global */}
      <Header
        onGoHome={goToBrasil}
        onSelectState={goToEstado}
        onSelectCity={goToCidade}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Trilha de Navegação Fixa */}
      <Breadcrumb
        navState={navState}
        onGoBrasil={goToBrasil}
        onGoEstado={goToEstado}
      />

      {/* Conteúdo Principal Dinâmico */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* CAMADA 1: BRASIL */}
        {navState.view === 'brasil' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Institucional da Página */}
            <section aria-label="Apresentação do Catálogo" className="bg-white rounded-lg border border-slate-200 p-5 sm:p-6">
              <div className="max-w-3xl space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Catálogo Nacional Interativo
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0f2a4a] tracking-tight">
                  Mapeamento do Esporte Adaptado e Paradesporto no Brasil
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Consulte escolinhas, associações desportivas, centros de treinamento paralímpico e projetos sociais para Pessoas com Deficiência (PCD) organizados em 3 níveis navegáveis (**Brasil → Estado → Cidade**).
                </p>
              </div>
            </section>

            {/* Painel Consolidado de Estatísticas Nacionais */}
            <NationalStats summary={nationalSummary} isLoading={isLoadingSummary} />

            {/* Layout Cartográfico: Mapa Interativo & Lista por Região */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <BrazilMap
                  ufsSummary={ufsSummary}
                  onSelectState={goToEstado}
                />
              </div>

              <div className="lg:col-span-5">
                <StatesOverviewList
                  ufsSummary={ufsSummary}
                  onSelectState={goToEstado}
                />
              </div>
            </div>
          </div>
        )}

        {/* CAMADA 2: ESTADO */}
        {navState.view === 'estado' && (
          <div className="animate-fadeIn">
            <StateView
              uf={navState.uf}
              onSelectMunicipio={(muni) => goToCidade(navState.uf, muni)}
              onGoBack={goToBrasil}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />
          </div>
        )}

        {/* CAMADA 3: CIDADE */}
        {navState.view === 'cidade' && (
          <div className="animate-fadeIn">
            <CityView
              uf={navState.uf}
              municipio={navState.municipio}
              onGoBackEstado={() => goToEstado(navState.uf)}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Modal de Cadastro */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      {/* Rodapé Institucional */}
      <Footer onGoHome={goToBrasil} />
    </div>
  );
}
