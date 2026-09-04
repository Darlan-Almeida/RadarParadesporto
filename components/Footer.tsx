'use client';

import React from 'react';
import { Activity, ShieldCheck, Heart, ExternalLink, ArrowUp } from 'lucide-react';

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Identidade */}
          <div className="md:col-span-2 space-y-3">
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={onGoHome}
            >
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Radar<span className="text-teal-400">Paradesporto</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              Plataforma pública e interativa desenvolvida para mapear, democratizar e facilitar o acesso a iniciativas de paradesporto e esporte adaptado em todos os estados e municípios do Brasil.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Malhas geográficas oficiais fornecidas pelo IBGE.</span>
            </div>
          </div>

          {/* Col 2: Diretrizes & Dados */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Sobre a Base de Dados
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              O catálogo inicial é composto por dados públicos de federações e confederações esportivas. Trate como base demonstrativa (MVP); consulte as entidades para validação final.
            </p>
          </div>

          {/* Col 3: Navegação e Contribuição */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navegação & Suporte
            </h4>
            <ul className="text-xs space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onGoHome}
                  className="hover:text-teal-300 transition-colors"
                >
                  Mapa Nacional do Brasil
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hover:text-teal-300 transition-colors inline-flex items-center gap-1"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Voltar ao topo</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha inferior */}
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
