'use client';

import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

interface FooterReviewProps {
  onGoBrasil: () => void;
}

export function FooterReview({ onGoBrasil }: FooterReviewProps) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={onGoBrasil}>
            <div className="w-7 h-7 rounded-md bg-[#0F2A4A] flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-[#0F2A4A]">
              Radar<span className="text-blue-600">PCD</span>
            </span>
            <span className="text-[11px] text-slate-400">| Catálogo Nacional de Esporte Adaptado</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <button type="button" onClick={onGoBrasil} className="hover:text-[#0F2A4A] transition-colors">
              Início
            </button>
            <span className="hover:text-[#0F2A4A] transition-colors cursor-pointer">
              Sobre a Plataforma
            </span>
            <span className="hover:text-[#0F2A4A] transition-colors cursor-pointer">
              Como Participar
            </span>
            <span className="hover:text-[#0F2A4A] transition-colors cursor-pointer">
              Acessibilidade
            </span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} RadarPCD. Desenvolvido para validação visual e decisão de design.</p>
          <div className="flex items-center gap-1.5 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>Malhas territoriais do IBGE • Proposta A: Institucional Moderna</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
