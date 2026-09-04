'use client';

import React from 'react';
import { Activity, ShieldCheck, Heart, ArrowUp, MapPin, Globe } from 'lucide-react';

interface FooterProps {
  onGoHome: () => void;
}

export function Footer({ onGoHome }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Coluna 1: Identidade Institucional */}
          <div className="space-y-3">
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={onGoHome}
            >
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-inner">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Radar<span className="text-teal-400">Paradesporto</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Plataforma pública e interativa desenvolvida para mapear, catalogar e democratizar o acesso a iniciativas de paradesporto e esporte adaptado em todos os estados e municípios do Brasil.
            </p>
          </div>

          {/* Coluna 2: Dados Cartográficos e IBGE */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Bases de Dados & Cartografia</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              As malhas geográficas territoriais dos 27 estados e dos municípios brasileiros são fornecidas oficialmente pelo IBGE. As informações de projetos e polos esportivos são consolidadas e atualizadas continuamente.
            </p>
          </div>

          {/* Coluna 3: Navegação Rápida */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navegação Rápida
            </h4>
            <ul className="text-xs space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onGoHome}
                  className="hover:text-teal-300 transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-teal-400" />
                  <span>Mapa Nacional do Brasil</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hover:text-teal-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Voltar ao topo</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha Inferior */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RadarParadesporto Brasil. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Fomentando a inclusão e o esporte paralímpico</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
