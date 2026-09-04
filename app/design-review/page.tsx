'use client';

import React, { useState } from 'react';
import { ReviewToolbar, ReviewViewMode } from '@/components/design-review/ReviewToolbar';
import { HeaderReview } from '@/components/design-review/HeaderReview';
import { VistaBrasil } from '@/components/design-review/VistaBrasil';
import { VistaEstadoPB } from '@/components/design-review/VistaEstadoPB';
import { CardPreviewModal } from '@/components/design-review/CardPreviewModal';
import { RegisterPreviewModal } from '@/components/design-review/RegisterPreviewModal';
import { FooterReview } from '@/components/design-review/FooterReview';

export default function DesignReviewPage() {
  const [viewMode, setViewMode] = useState<ReviewViewMode>('brasil');
  const [selectedCityCard, setSelectedCityCard] = useState<string | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Início');

  const handleSelectState = (uf: string) => {
    // Para validação visual, leva para a Vista 2 (Paraíba)
    setViewMode('estado');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCityCard = (cityName: string) => {
    setSelectedCityCard(cityName);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-900 selection:text-white">
      {/* Barra de Controle de Validação Visual (Topo) */}
      <ReviewToolbar
        currentView={viewMode}
        onChangeView={(v) => {
          setViewMode(v);
          if (v === 'cards') {
            setSelectedCityCard('João Pessoa');
          }
        }}
        selectedMuniName={selectedCityCard || undefined}
      />

      {/* Header Institucional RadarPCD */}
      <HeaderReview
        activeNav={activeNav}
        onSelectNav={(item) => setActiveNav(item)}
        onGoHome={() => {
          setViewMode('brasil');
          setActiveNav('Início');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => {
          // Rápida orientação ou foco de busca
          setViewMode('brasil');
        }}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Conteúdo Principal de Acordo com a Vista Selecionada */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {viewMode === 'brasil' && (
          <div className="animate-fadeIn">
            <VistaBrasil
              onSelectState={handleSelectState}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />
          </div>
        )}

        {viewMode === 'estado' && (
          <div className="animate-fadeIn">
            <VistaEstadoPB
              onGoBrasil={() => {
                setViewMode('brasil');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectCityCard={handleSelectCityCard}
            />
          </div>
        )}

        {viewMode === 'cards' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-[#0F2A4A]">
                  Amostra de Cards de Iniciativas (João Pessoa / Paraíba)
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Avaliação da anatomia de cards: tipografia, badges de modalidades, gratuidades, ações de contato e fontes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('estado')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200"
              >
                ← Voltar para Vista 2 (Paraíba)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <article className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-[#0F2A4A]">
                      Instituto Paraibano de Paradesporto (IPP)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Vila Olímpica Parahyba - Rua Professora Maria Sales, Bairro dos Estados
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                    100% Gratuito
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Centro de formação esportiva adaptada e treinamento de alto rendimento paralímpico com polos na Vila Olímpica Parahyba, atendendo atletas com deficiência física e visual.
                </p>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Modalidades Oferecidas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Atletismo', 'Natação', 'Bocha paralímpica', 'Basquete em cadeira de rodas'].map(
                      (esp) => (
                        <span
                          key={esp}
                          className="text-xs font-semibold bg-blue-50 text-blue-900 px-2.5 py-1 rounded-md border border-blue-200/70"
                        >
                          {esp}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Público Atendido
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Deficiência física', 'Deficiência visual'].map((def) => (
                      <span
                        key={def}
                        className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {def}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>(83) 3218-4000 • contato@ipparadesporto.org.br</span>
                  <span className="text-blue-700 font-semibold underline">Fonte oficial</span>
                </div>
              </article>

              <article className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-[#0F2A4A]">
                      Associação Paraibana de Cegos (APACE)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Rua das Trincheiras, 450 - Centro — João Pessoa/PB
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                    100% Gratuito
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pioneira no futebol de 5 e goalball na Paraíba, mantendo equipes masculina e feminina e núcleo de iniciação esportiva para crianças e jovens cegos.
                </p>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Modalidades Oferecidas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Futebol de 5', 'Goalball', 'Atletismo para cegos'].map((esp) => (
                      <span
                        key={esp}
                        className="text-xs font-semibold bg-blue-50 text-blue-900 px-2.5 py-1 rounded-md border border-blue-200/70"
                      >
                        {esp}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Público Atendido
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Deficiência visual (cegos e baixa visão)'].map((def) => (
                      <span
                        key={def}
                        className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {def}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>(83) 3241-1500 • apace.pb@gmail.com</span>
                  <span className="text-blue-700 font-semibold underline">Fonte oficial</span>
                </div>
              </article>
            </div>
          </div>
        )}
      </main>

      {/* Modais de Demonstração */}
      <CardPreviewModal
        isOpen={!!selectedCityCard}
        cityName={selectedCityCard || 'João Pessoa'}
        onClose={() => setSelectedCityCard(null)}
      />

      <RegisterPreviewModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      {/* Footer */}
      <FooterReview
        onGoBrasil={() => {
          setViewMode('brasil');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
