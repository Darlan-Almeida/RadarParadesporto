'use client';

import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, ShieldCheck, Tag, Users } from 'lucide-react';
import { LISTA_UFS, DEFICIENCIAS_DISPONIVEIS } from '@/lib/constants';

interface RegisterPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterPreviewModal({ isOpen, onClose }: RegisterPreviewModalProps) {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0F2A4A] text-white px-5 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Cadastrar Iniciativa Paradesportiva</h2>
              <p className="text-xs text-blue-200">
                Protótipo de validação de formulário (Mock de interface)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F2A4A]">Envio Simulado com Sucesso</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Nesta etapa de validação visual, os campos funcionam como demonstração de layout, espaçamento e acessibilidade.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-5 py-2 bg-[#0F2A4A] text-white text-xs font-semibold rounded-lg hover:bg-[#163A63]"
            >
              Fechar Demonstração
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome da Organização ou Projeto *
              </label>
              <input
                type="text"
                defaultValue="Associação Paraibana de Desporto Adaptado"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Descrição Curta das Atividades *
              </label>
              <textarea
                rows={2}
                defaultValue="Projeto de formação de base e desenvolvimento motor em atletismo e bocha paralímpica para jovens."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estado (UF) *</label>
                <select
                  defaultValue="PB"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                >
                  {LISTA_UFS.map((u) => (
                    <option key={u.sigla} value={u.sigla}>
                      {u.sigla} - {u.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Município *</label>
                <input
                  type="text"
                  defaultValue="João Pessoa"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Modalidades Oferecidas *
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                {['Atletismo', 'Bocha paralímpica', 'Natação', 'Basquete em cadeira de rodas'].map(
                  (esp) => (
                    <span
                      key={esp}
                      className="text-xs bg-blue-100 text-blue-900 font-semibold px-2 py-0.5 rounded border border-blue-200"
                    >
                      ✓ {esp}
                    </span>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Deficiências Atendidas *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                {DEFICIENCIAS_DISPONIVEIS.slice(0, 4).map((def) => (
                  <label key={def} className="flex items-center gap-2 text-xs text-slate-700">
                    <input type="checkbox" defaultChecked className="text-blue-700 rounded" />
                    <span>{def}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fonte Pública / Link Oficial *
              </label>
              <input
                type="text"
                defaultValue="https://paraiba.pb.gov.br/noticias/paradesporto"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0F2A4A] text-white text-xs font-semibold rounded-lg hover:bg-[#163A63]"
              >
                Simular Envio
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
