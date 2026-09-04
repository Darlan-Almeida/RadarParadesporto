'use client';

import React from 'react';
import { Iniciativa } from '@/lib/types';
import {
  MapPin,
  ExternalLink,
  Phone,
  Smartphone,
  Mail,
  Globe,
  Award,
  Users,
  Clock,
  CheckCircle2,
  MessageSquare,
  Navigation,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';

interface InitiativeCardProps {
  iniciativa: Iniciativa;
}

export function InitiativeCard({ iniciativa }: InitiativeCardProps) {
  const formatWhatsappLink = (num?: string) => {
    if (!num) return '';
    const clean = num.replace(/\D/g, '');
    const withCountry = clean.startsWith('55') ? clean : `55${clean}`;
    return `https://wa.me/${withCountry}?text=${encodeURIComponent(
      `Olá! Encontrei o projeto ${iniciativa.nome} através do RadarPCD e gostaria de mais informações.`
    )}`;
  };

  const formatInstagramLink = (insta?: string) => {
    if (!insta) return '';
    const clean = insta.replace('@', '').trim();
    return `https://instagram.com/${clean}`;
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between gap-4">
      <div>
        {/* Cabeçalho do Card */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-[#0F2A4A] tracking-tight">
                {iniciativa.nome}
              </h3>
              {iniciativa.status === 'pendente' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  <Clock className="w-3 h-3" /> Aguardando moderação
                </span>
              )}
            </div>

            {iniciativa.endereco && (
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>
                  {iniciativa.endereco} — {iniciativa.municipio}/{iniciativa.uf}
                </span>
              </p>
            )}
          </div>

          {/* Badge de Gratuidade */}
          <div>
            {iniciativa.gratuito ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Gratuito</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                Parcialmente gratuito
              </span>
            )}
          </div>
        </div>

        {/* Descrição */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          {iniciativa.descricao}
        </p>

        {/* Modalidades Esportivas */}
        <div className="mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-blue-700" /> Modalidades Atendidas
          </span>
          <div className="flex flex-wrap gap-1.5">
            {iniciativa.esportes.map((esp) => (
              <span
                key={esp}
                className="text-xs font-semibold bg-blue-50 text-blue-900 px-2.5 py-1 rounded-md border border-blue-200/70"
              >
                {esp}
              </span>
            ))}
          </div>
        </div>

        {/* Tipos de Deficiência */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-600" /> Deficiências Atendidas
          </span>
          <div className="flex flex-wrap gap-1.5">
            {iniciativa.deficienciasAtendidas.map((def) => (
              <span
                key={def}
                className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
              >
                {def}
              </span>
            ))}
          </div>
        </div>

        {/* História, Fundação e Impacto Social */}
        {(iniciativa.historiaEImpacto || iniciativa.anoFundacao || iniciativa.horariosAtendimento || iniciativa.responsavelTecnico) && (
          <div className="mt-3.5 p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F2A4A] flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-700" /> Sobre a Associação & Histórico
              </span>
              {iniciativa.anoFundacao && (
                <span className="text-[10px] font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-200">
                  Fundada em {iniciativa.anoFundacao}
                </span>
              )}
            </div>

            {iniciativa.historiaEImpacto && (
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{iniciativa.historiaEImpacto}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 pt-1 border-t border-slate-200/40">
              {iniciativa.horariosAtendimento && (
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-slate-500" /> {iniciativa.horariosAtendimento}
                </span>
              )}
              {iniciativa.responsavelTecnico && (
                <span className="flex items-center gap-1 font-medium text-emerald-800">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> {iniciativa.responsavelTecnico}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Seção de Contatos e Ações Diretas */}
      <div className="pt-3.5 border-t border-slate-100 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* WhatsApp Click-to-Chat */}
          {(iniciativa.whatsapp || iniciativa.celular) && (
            <a
              href={formatWhatsappLink(iniciativa.whatsapp || iniciativa.celular)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          )}

          {/* Telefone Fixo */}
          {iniciativa.telefone && (
            <a
              href={`tel:${iniciativa.telefone.replace(/\D/g, '')}`}
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{iniciativa.telefone}</span>
            </a>
          )}

          {/* Celular */}
          {iniciativa.celular && (
            <a
              href={`tel:${iniciativa.celular.replace(/\D/g, '')}`}
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              <span>{iniciativa.celular}</span>
            </a>
          )}

          {/* Instagram */}
          {iniciativa.instagram && (
            <a
              href={formatInstagramLink(iniciativa.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-pink-50 hover:bg-pink-100 text-pink-700 font-medium px-2.5 py-1.5 rounded-lg transition-colors border border-pink-200"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
              <span>{iniciativa.instagram.startsWith('@') ? iniciativa.instagram : `@${iniciativa.instagram}`}</span>
            </a>
          )}

          {/* E-mail */}
          {iniciativa.email && (
            <a
              href={`mailto:${iniciativa.email}`}
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{iniciativa.email}</span>
            </a>
          )}

          {/* Site Oficial ou Indicação de Google Maps */}
          {iniciativa.site ? (
            <a
              href={iniciativa.site.startsWith('http') ? iniciativa.site : `https://${iniciativa.site}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2.5 py-1.5 rounded-lg transition-colors border border-blue-200"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Site oficial</span>
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-400 text-[11px] px-2 py-1">
              (Sem site próprio)
            </span>
          )}

          {/* Link do Google Maps */}
          {iniciativa.googleMapsUrl && (
            <a
              href={iniciativa.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200"
              title="Abrir localização no Google Maps"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-700" />
              <span>Ver no Google Maps</span>
            </a>
          )}
        </div>

        {/* Link da Fonte Pública */}
        {iniciativa.fonte && (
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Fonte de comprovação pública:</span>
            <a
              href={iniciativa.fonte.startsWith('http') ? iniciativa.fonte : `https://${iniciativa.fonte}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium underline"
            >
              <span>{iniciativa.fonte.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
