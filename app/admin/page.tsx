'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  useAllIniciativasAdmin,
  useApproveIniciativa,
  useRejectIniciativa,
  useDeleteIniciativa,
  useNationalSummary,
} from '@/hooks/useIniciativas';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  ArrowLeft,
  Clock,
  MapPin,
  Globe,
  ExternalLink,
  Phone,
  Smartphone,
  MessageSquare,
  Instagram,
  Navigation,
  Search,
  Filter,
  Eye,
} from 'lucide-react';
import { StatusIniciativa, Iniciativa } from '@/lib/types';
import { matchSearch } from '@/lib/utils';
import { HeaderReview } from '@/components/design-review/HeaderReview';
import { FooterReview } from '@/components/design-review/FooterReview';

export default function AdminPage() {
  const { data: allIniciativas = [], isLoading } = useAllIniciativasAdmin();
  const { data: nationalSummary } = useNationalSummary();

  const approveMutation = useApproveIniciativa();
  const rejectMutation = useRejectIniciativa();
  const deleteMutation = useDeleteIniciativa();

  const [activeTab, setActiveTab] = useState<StatusIniciativa | 'todas'>('pendente');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const pendentes = allIniciativas.filter((i) => i.status === 'pendente');
  const publicadas = allIniciativas.filter((i) => i.status === 'publicado');
  const rejeitadas = allIniciativas.filter((i) => i.status === 'rejeitado');

  const filteredList = allIniciativas.filter((item) => {
    const matchStatus = activeTab === 'todas' || item.status === activeTab;
    const matchQuery =
      matchSearch(item.nome, searchTerm) ||
      matchSearch(item.municipio, searchTerm) ||
      matchSearch(item.uf, searchTerm) ||
      item.esportes.some((e) => matchSearch(e, searchTerm));
    return matchStatus && matchQuery;
  });

  const handleApprove = async (item: Iniciativa) => {
    try {
      await approveMutation.mutateAsync(item.id);
      setActionSuccessMsg(`A iniciativa "${item.nome}" foi aprovada e já está publicada no catálogo!`);
      setTimeout(() => setActionSuccessMsg(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (item: Iniciativa) => {
    try {
      await rejectMutation.mutateAsync(item.id);
      setActionSuccessMsg(`A iniciativa "${item.nome}" foi marcada como rejeitada.`);
      setTimeout(() => setActionSuccessMsg(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (item: Iniciativa) => {
    if (confirm(`Tem certeza que deseja excluir permanentemente "${item.nome}"?`)) {
      try {
        await deleteMutation.mutateAsync(item.id);
        setActionSuccessMsg(`Registro excluído.`);
        setTimeout(() => setActionSuccessMsg(null), 4000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao RadarPCD</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight">Painel de Moderação & Gestão</span>
              <span className="text-[10px] font-semibold bg-blue-900 text-blue-200 px-2 py-0.5 rounded border border-blue-700">
                Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Aprovações entram ao vivo instantaneamente</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Banner com Métricas de Curadoria */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F2A4A] tracking-tight">
              Curadoria e Aceitação de Iniciativas
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Gerencie submissões de organizações paradesportivas enviadas pela comunidade e homologue dados para publicação pública.
            </p>
          </div>

          {/* Contadores */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <span className="text-xs font-semibold text-amber-800 block">Pendentes</span>
              <span className="text-xl font-bold text-amber-900">{pendentes.length}</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-xs font-semibold text-emerald-800 block">Publicadas</span>
              <span className="text-xl font-bold text-emerald-900">{publicadas.length}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-semibold text-slate-600 block">Total Geral</span>
              <span className="text-xl font-bold text-slate-800">{allIniciativas.length}</span>
            </div>
          </div>
        </div>

        {/* Mensagem de Feedback */}
        {actionSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fadeIn shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Barra de Filtros e Busca */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Tabs por Status */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab('pendente')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'pendente'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pendentes de Moderação ({pendentes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('publicado')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'publicado'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Publicadas ao Vivo ({publicadas.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('todas')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'todas'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todas ({allIniciativas.length})
            </button>
          </div>

          {/* Campo de Busca */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, cidade, UF..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>
        </div>

        {/* Lista de Registros para Moderação */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400">
              <div className="w-8 h-8 border-3 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs">Carregando registros do banco...</p>
            </div>
          ) : filteredList.length > 0 ? (
            filteredList.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition-all space-y-4 ${
                  item.status === 'pendente'
                    ? 'border-amber-300 ring-2 ring-amber-500/10'
                    : 'border-slate-200'
                }`}
              >
                {/* Header do Card Admin */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-[#0F2A4A]">{item.nome}</h3>
                      {item.status === 'pendente' && (
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                          Aguardando Aceitação
                        </span>
                      )}
                      {item.status === 'publicado' && (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          ✓ Publicado ao Vivo
                        </span>
                      )}
                      {item.status === 'rejeitado' && (
                        <span className="text-[11px] font-bold text-red-800 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200">
                          Rejeitado
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                      <span>
                        <strong>{item.municipio}</strong> - {item.uf} | {item.endereco || 'Endereço não informado'}
                      </span>
                      {item.dataCadastro && (
                        <span className="text-slate-400">• Submetido em {item.dataCadastro}</span>
                      )}
                    </p>
                  </div>

                  {/* Botões de Ação de Moderação */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.status !== 'publicado' && (
                      <button
                        type="button"
                        onClick={() => handleApprove(item)}
                        disabled={approveMutation.isPending}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Aprovar (Aceitar Candidatura)</span>
                      </button>
                    )}

                    {item.status === 'pendente' && (
                      <button
                        type="button"
                        onClick={() => handleReject(item)}
                        disabled={rejectMutation.isPending}
                        className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-slate-200"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Rejeitar</span>
                      </button>
                    )}

                    <Link
                      href={`/?uf=${item.uf}&municipio=${encodeURIComponent(item.municipio)}`}
                      className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 bg-blue-50 px-2.5 py-2 rounded-lg text-xs font-semibold border border-blue-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver no Catálogo</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir Registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Conteúdo do Registro */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.descricao}
                </p>

                {/* Modalidades e Deficiências */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                      Modalidades:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.esportes.map((esp) => (
                        <span
                          key={esp}
                          className="bg-blue-50 text-blue-900 font-semibold px-2 py-0.5 rounded border border-blue-200/70 text-xs"
                        >
                          {esp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                      Público Atendido:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.deficienciasAtendidas.map((def) => (
                        <span
                          key={def}
                          className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200 text-xs"
                        >
                          {def}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Canais de Contato */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  {item.whatsapp && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp: {item.whatsapp}
                    </span>
                  )}
                  {item.celular && (
                    <span className="inline-flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Celular: {item.celular}
                    </span>
                  )}
                  {item.telefone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Tel: {item.telefone}
                    </span>
                  )}
                  {item.instagram && (
                    <span className="inline-flex items-center gap-1 text-pink-700 font-medium">
                      <Instagram className="w-3.5 h-3.5 text-pink-500" /> {item.instagram}
                    </span>
                  )}
                  {item.email && (
                    <span className="inline-flex items-center gap-1">
                      Email: {item.email}
                    </span>
                  )}
                  {item.site ? (
                    <a
                      href={item.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-700 font-semibold underline"
                    >
                      <Globe className="w-3.5 h-3.5" /> Site oficial
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">(Sem site próprio)</span>
                  )}
                  {item.googleMapsUrl && (
                    <a
                      href={item.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-700 font-medium underline"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Google Maps
                    </a>
                  )}
                  {item.fonte && (
                    <a
                      href={item.fonte.startsWith('http') ? item.fonte : `https://${item.fonte}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 ml-auto"
                    >
                      <span>Fonte: {item.fonte}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">Nenhum registro encontrado</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Não há iniciativas nesta categoria ou filtro.
              </p>
            </div>
          )}
        </div>
      </main>

      <FooterReview onGoBrasil={() => {}} />
    </div>
  );
}
