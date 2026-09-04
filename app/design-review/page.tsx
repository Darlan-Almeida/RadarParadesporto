'use client';

import React, { useState } from 'react';
import { HeaderReview } from '@/components/design-review/HeaderReview';
import { VistaBrasil } from '@/components/design-review/VistaBrasil';
import { StateView } from '@/components/StateView';
import { CityView } from '@/components/CityView';
import { RegisterModal } from '@/components/RegisterModal';
import { FooterReview } from '@/components/design-review/FooterReview';

export default function DesignReviewPage() {
  const [viewMode, setViewMode] = useState<'brasil' | 'estado' | 'cidade'>('brasil');
  const [selectedUF, setSelectedUF] = useState<string>('PB');
  const [selectedMunicipio, setSelectedMunicipio] = useState<string | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Início');

  const handleSelectState = (uf: string) => {
    setSelectedUF(uf);
    setSelectedMunicipio(null);
    setViewMode('estado');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMunicipio = (muni: string) => {
    setSelectedMunicipio(muni);
    setViewMode('cidade');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setViewMode('brasil');
    setSelectedMunicipio(null);
    setActiveNav('Início');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-900 selection:text-white">
      {/* Header Institucional Radar Paradesporto */}
      <HeaderReview
        activeNav={activeNav}
        onSelectNav={(item) => setActiveNav(item)}
        onGoHome={handleGoHome}
        onOpenSearch={() => {
          setViewMode('brasil');
          const searchInput = document.getElementById('search-input');
          if (searchInput) searchInput.focus();
        }}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Conteúdo Principal Dinâmico por Estado */}
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
            <StateView
              uf={selectedUF}
              onSelectMunicipio={handleSelectMunicipio}
              onGoBack={handleGoHome}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />
          </div>
        )}

        {viewMode === 'cidade' && selectedMunicipio && (
          <div className="animate-fadeIn">
            <CityView
              uf={selectedUF}
              municipio={selectedMunicipio}
              onGoBackEstado={() => setViewMode('estado')}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Modal de Cadastro Real */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      {/* Rodapé Institucional */}
      <FooterReview onGoBrasil={handleGoHome} />
    </div>
  );
}
