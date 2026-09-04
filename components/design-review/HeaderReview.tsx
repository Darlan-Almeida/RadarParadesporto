'use client';

import React, { useState } from 'react';
import { Search, PlusCircle, Menu, X, Compass } from 'lucide-react';

interface HeaderReviewProps {
  onGoHome: () => void;
  onOpenSearch: () => void;
  onOpenRegister: () => void;
  activeNav?: string;
  onSelectNav?: (item: string) => void;
}

export function HeaderReview({
  onGoHome,
  onOpenSearch,
  onOpenRegister,
  activeNav = 'Início',
  onSelectNav,
}: HeaderReviewProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = ['Início', 'Sobre', 'Como participar'];

  const handleNavClick = (item: string) => {
    if (item === 'Início') onGoHome();
    if (onSelectNav) onSelectNav(item);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* Marca / Identidade */}
          <div
            onClick={onGoHome}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0F2A4A] flex items-center justify-center text-white shadow-xs group-hover:bg-[#163A63] transition-colors">
              <Compass className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-[#0F2A4A]">
                Radar<span className="text-blue-600">PCD</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Catálogo Nacional
              </span>
            </div>
          </div>

          {/* Navegação Principal (Desktop) */}
          <nav
            aria-label="Navegação institucional"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {navItems.map((item) => {
              const isActive = activeNav === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`py-1.5 transition-colors relative ${
                    isActive
                      ? 'text-[#0F2A4A] font-bold border-b-2 border-[#0F2A4A]'
                      : 'text-slate-600 hover:text-[#0F2A4A]'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>

          {/* Ações (Buscar & Cadastrar Iniciativa) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenSearch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-[#0F2A4A] hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Buscar</span>
            </button>

            <button
              type="button"
              onClick={onOpenRegister}
              className="inline-flex items-center gap-1.5 bg-[#0F2A4A] hover:bg-[#163A63] active:bg-[#0C1E36] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Cadastrar iniciativa</span>
            </button>

            {/* Menu Hambúrguer (Mobile) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Alternar menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
            {navItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleNavClick(item)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeNav === item
                    ? 'text-[#0F2A4A] font-bold bg-slate-100'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
