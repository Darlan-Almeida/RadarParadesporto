'use client';

import React from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Award,
  Users,
  Compass,
} from 'lucide-react';

interface CardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName?: string;
}

const SAMPLE_INITIATIVES: Record<
  string,
  Array<{
    nome: string;
    descricao: string;
    esportes: string[];
    deficiencias: string[];
    gratuito: boolean;
    endereco: string;
    telefone: string;
    email: string;
    site: string;
    fonte: string;
  }>
> = {
  'João Pessoa': [
    {
      nome: 'Instituto Paraibano de Paradesporto (IPP)',
      descricao:
        'Centro de formação esportiva adaptada e treinamento de alto rendimento paralímpico com polos na Vila Olímpica Parahyba, atendendo atletas com deficiência física e visual.',
      esportes: ['Atletismo', 'Natação', 'Bocha paralímpica', 'Basquete em cadeira de rodas'],
      deficiencias: ['Deficiência física', 'Deficiência visual'],
      gratuito: true,
      endereco: 'Vila Olímpica Parahyba - Rua Professora Maria Sales, Bairro dos Estados',
      telefone: '(83) 3218-4000',
      email: 'contato@ipparadesporto.org.br',
      site: 'https://ipparadesporto.org.br',
      fonte: 'https://paraiba.pb.gov.br/noticias/paradesporto',
    },
    {
      nome: 'Associação Paraibana de Cegos (APACE)',
      descricao:
        'Pioneira no futebol de 5 e goalball na Paraíba, mantendo equipes masculina e feminina e núcleo de iniciação esportiva para crianças e jovens cegos.',
      esportes: ['Futebol de 5', 'Goalball', 'Atletismo para cegos'],
      deficiencias: ['Deficiência visual'],
      gratuito: true,
      endereco: 'Rua das Trincheiras, 450 - Centro',
      telefone: '(83) 3241-1500',
      email: 'apace.pb@gmail.com',
      site: 'https://apacepb.org.br',
      fonte: 'https://cbdv.org.br/clubes-filiados',
    },
  ],
  'Campina Grande': [
    {
      nome: 'Associação Campinense de Esportes Adaptados (ACEA)',
      descricao:
        'Programa contínuo em parceria com a UEPB ofertando iniciação em atletismo, bocha e natação para pessoas com deficiências físicas e intelectuais no Agreste Paraibano.',
      esportes: ['Atletismo', 'Natação', 'Bocha paralímpica', 'Tênis de mesa'],
      deficiencias: ['Deficiência física', 'Deficiência intelectual'],
      gratuito: true,
      endereco: 'Complexo Esportivo UEPB - Bodocongó',
      telefone: '(83) 3315-3300',
      email: 'acea.campina@gmail.com',
      site: 'https://uepb.edu.br/projetos/paradesporto',
      fonte: 'https://cpb.org.br/centros-de-referencia',
    },
    {
      nome: 'Núcleo Paralímpico da Borborema',
      descricao:
        'Centro de treinamento e formação de halterofilismo paralímpico e parabadminton para jovens com deficiência motora.',
      esportes: ['Halterofilismo', 'Parabadminton', 'Atletismo'],
      deficiencias: ['Deficiência física'],
      gratuito: true,
      endereco: 'Parque da Liberdade - Liberdade',
      telefone: '(83) 3341-2020',
      email: 'nucleopara@campinagrande.pb.gov.br',
      site: 'https://campinagrande.pb.gov.br',
      fonte: 'https://cpb.org.br',
    },
  ],
};

export function CardPreviewModal({
  isOpen,
  onClose,
  cityName = 'João Pessoa',
}: CardPreviewModalProps) {
  if (!isOpen) return null;

  const list = SAMPLE_INITIATIVES[cityName] || SAMPLE_INITIATIVES['João Pessoa'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0F2A4A] text-white px-5 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 id="card-preview-title" className="text-base sm:text-lg font-bold">
                Iniciativas em {cityName} (Paraíba)
              </h2>
              <p className="text-xs text-blue-200">
                Amostra visual de cards de iniciativas para avaliação de hierarquia e tipografia
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

        {/* Lista de Cards */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {list.map((item, idx) => (
            <article
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3.5"
            >
              {/* Título e Gratuidade */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#0F2A4A]">{item.nome}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.endereco}</span>
                  </p>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Gratuito</span>
                </span>
              </div>

              {/* Descrição */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.descricao}
              </p>

              {/* Modalidades */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Modalidades Oferecidas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.esportes.map((esp) => (
                    <span
                      key={esp}
                      className="text-xs font-semibold bg-blue-50 text-blue-900 px-2.5 py-1 rounded-md border border-blue-200/70"
                    >
                      {esp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deficiências */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Público / Deficiências Atendidas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.deficiencias.map((def) => (
                    <span
                      key={def}
                      className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                    >
                      {def}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contato & Fonte */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-3 text-slate-600">
                  <a
                    href={`tel:${item.telefone.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-1 text-slate-700 hover:text-blue-800 font-medium"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.telefone}</span>
                  </a>
                  <a
                    href={`mailto:${item.email}`}
                    className="inline-flex items-center gap-1 text-slate-700 hover:text-blue-800 font-medium underline"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.email}</span>
                  </a>
                  <a
                    href={item.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Site oficial</span>
                  </a>
                </div>

                <a
                  href={item.fonte}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 text-[11px] bg-slate-50 px-2 py-1 rounded border border-slate-200"
                >
                  <span>Fonte oficial</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Footer do Modal */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#0F2A4A] text-white text-xs font-semibold rounded-lg hover:bg-[#163A63] transition-colors"
          >
            Fechar Amostra
          </button>
        </div>
      </div>
    </div>
  );
}
