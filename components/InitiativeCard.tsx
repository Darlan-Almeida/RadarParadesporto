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
  MessageSquare,
  Navigation,
  Check,
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
      `Olá! Encontrei o projeto ${iniciativa.nome} através do RadarParadesporto e gostaria de mais informações.`
    )}`;
  };

  const formatInstagramLink = (insta?: string) => {
    if (!insta) return '';
    const clean = insta.replace('@', '').trim();
    return `https://instagram.com/${clean}`;
  };

  return (
    <article className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between gap-4 hover:border-slate-300 transition-colors">
      <div className="space-y-3">
        {/* Cabeçalho do Card */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {iniciativa.nome}
              </h3>
              {iniciativa.status === 'pendente' && (
                <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Em moderação
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
          <div className="flex-shrink-0">
            {iniciativa.gratuito ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Gratuito</span>
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                Parcialmente gratuito
              </span>
            )}
          </div>
        </div>

        {/* Descrição */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {iniciativa.descricao}
        </p>

        {/* Modalidades & Deficiências (Linhas de Alta Densidade) */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
              Modalidades:
            </span>
            <div className="flex flex-wrap gap-1">
              {iniciativa.esportes.map((esp) => (
                <span
                  key={esp}
                  className="text-xs font-medium bg-blue-50 text-blue-900 px-2 py-0.5 rounded-md border border-blue-200/70"
                >
                  {esp}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
              Público:
            </span>
            <div className="flex flex-wrap gap-1">
              {iniciativa.deficienciasAtendidas.map((def) => (
                <span
                  key={def}
                  className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                >
                  {def}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Histórico & Informações Institucionais (Divisor Sutil sem Card Interno) */}
        {(iniciativa.historiaEImpacto || iniciativa.anoFundacao || iniciativa.horariosAtendimento || iniciativa.responsavelTecnico) && (
          <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                Histórico & Impacto Social
              </span>
              {iniciativa.anoFundacao && (
                <span className="text-[10px] text-slate-500 font-medium">
                  Fundação: {iniciativa.anoFundacao}
                </span>
              )}
            </div>

            {iniciativa.historiaEImpacto && (
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{iniciativa.historiaEImpacto}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-0.5">
              {iniciativa.horariosAtendimento && (
                <span>Horários: {iniciativa.horariosAtendimento}</span>
              )}
              {iniciativa.responsavelTecnico && (
                <span>Coordenação: {iniciativa.responsavelTecnico}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Contatos & Ações Diretas */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* WhatsApp */}
          {(iniciativa.whatsapp || iniciativa.celular) && (
            <a
              href={formatWhatsappLink(iniciativa.whatsapp || iniciativa.celular)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-2.5 py-1 rounded-md transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          )}

          {/* Telefone Fixo */}
          {iniciativa.telefone && (
            <a
              href={`tel:${iniciativa.telefone.replace(/\D/g, '')}`}
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{iniciativa.telefone}</span>
            </a>
          )}

          {/* Celular */}
          {iniciativa.celular && (
            <a
              href={`tel:${iniciativa.celular.replace(/\D/g, '')}`}
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
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
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>{iniciativa.instagram.startsWith('@') ? iniciativa.instagram : `@${iniciativa.instagram}`}</span>
            </a>
          )}

          {/* E-mail */}
          {iniciativa.email && (
            <a
              href={`mailto:${iniciativa.email}`}
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{iniciativa.email}</span>
            </a>
          )}

          {/* Site Oficial */}
          {iniciativa.site && (
            <a
              href={iniciativa.site.startsWith('http') ? iniciativa.site : `https://${iniciativa.site}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>Site</span>
            </a>
          )}

          {/* Google Maps */}
          {iniciativa.googleMapsUrl && (
            <a
              href={iniciativa.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-slate-500" />
              <span>Mapa</span>
            </a>
          )}
        </div>

        {/* Fonte */}
        {iniciativa.fonte && (
          <a
            href={iniciativa.fonte.startsWith('http') ? iniciativa.fonte : `https://${iniciativa.fonte}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 underline"
          >
            <span>Fonte oficial</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </article>
  );
}
