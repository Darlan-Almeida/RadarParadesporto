'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building2,
  Tag,
  Users,
  MessageSquare,
  Instagram,
  Navigation,
  Phone,
  Smartphone,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { IniciativaInput } from '@/lib/types';
import {
  LISTA_UFS,
  DEFICIENCIAS_DISPONIVEIS,
  MODALIDADES_COMUNS,
} from '@/lib/constants';
import { useAddIniciativa } from '@/hooks/useIniciativas';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUF?: string;
  defaultMunicipio?: string;
  onSuccessNavigate?: (uf: string, municipio: string) => void;
}

export function RegisterModal({
  isOpen,
  onClose,
  defaultUF,
  defaultMunicipio,
  onSuccessNavigate,
}: RegisterModalProps) {
  const addMutation = useAddIniciativa();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [uf, setUf] = useState(defaultUF || 'PB');
  const [municipio, setMunicipio] = useState(defaultMunicipio || '');
  const [endereco, setEndereco] = useState('');
  const [selectedEsportes, setSelectedEsportes] = useState<string[]>([]);
  const [customEsporte, setCustomEsporte] = useState('');
  const [selectedDeficiencias, setSelectedDeficiencias] = useState<string[]>([]);
  const [gratuito, setGratuito] = useState(true);
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [email, setEmail] = useState('');
  const [site, setSite] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [fonte, setFonte] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (defaultUF) setUf(defaultUF);
    if (defaultMunicipio) setMunicipio(defaultMunicipio);
  }, [defaultUF, defaultMunicipio]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleEsporte = (esp: string) => {
    if (selectedEsportes.includes(esp)) {
      setSelectedEsportes(selectedEsportes.filter((e) => e !== esp));
    } else {
      setSelectedEsportes([...selectedEsportes, esp]);
    }
  };

  const handleAddCustomEsporte = () => {
    if (customEsporte.trim() && !selectedEsportes.includes(customEsporte.trim())) {
      setSelectedEsportes([...selectedEsportes, customEsporte.trim()]);
      setCustomEsporte('');
    }
  };

  const handleToggleDeficiencia = (def: string) => {
    if (selectedDeficiencias.includes(def)) {
      setSelectedDeficiencias(selectedDeficiencias.filter((d) => d !== def));
    } else {
      setSelectedDeficiencias([...selectedDeficiencias, def]);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!nome.trim()) newErrors.nome = 'O nome da instituição ou projeto é obrigatório.';
    if (!descricao.trim() || descricao.trim().length < 15)
      newErrors.descricao = 'Forneça uma descrição curta com pelo menos 15 caracteres.';
    if (!uf) newErrors.uf = 'Selecione a Unidade Federativa.';
    if (!municipio.trim()) newErrors.municipio = 'Informe o nome do município.';
    if (selectedEsportes.length === 0)
      newErrors.esportes = 'Selecione ou adicione ao menos uma modalidade esportiva.';
    if (selectedDeficiencias.length === 0)
      newErrors.deficiencias = 'Selecione ao menos um tipo de deficiência atendida.';
    if (!fonte.trim())
      newErrors.fonte =
        'Indique a URL pública, reportagem ou documento oficial de comprovação desta iniciativa.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Se não tiver link do maps gerado mas tiver endereço ou município, gera link de busca no maps
    let finalMapsUrl = googleMapsUrl.trim();
    if (!finalMapsUrl && (endereco || municipio)) {
      finalMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(
        `${nome}, ${endereco || ''}, ${municipio} - ${uf}`
      )}`;
    }

    const input: IniciativaInput = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      uf: uf.toUpperCase(),
      municipio: municipio.trim(),
      endereco: endereco.trim() || undefined,
      esportes: selectedEsportes,
      deficienciasAtendidas: selectedDeficiencias,
      gratuito,
      telefone: telefone.trim() || undefined,
      celular: celular.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      instagram: instagram.trim() || undefined,
      email: email.trim() || undefined,
      site: site.trim() || undefined,
      googleMapsUrl: finalMapsUrl || undefined,
      fonte: fonte.trim(),
    };

    try {
      await addMutation.mutateAsync(input);
      setIsSuccess(true);
    } catch (err) {
      console.error('Erro ao cadastrar iniciativa:', err);
    }
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onClose();
    if (onSuccessNavigate) {
      onSuccessNavigate(uf, municipio);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Cabeçalho do Modal */}
        <div className="bg-[#0F2A4A] text-white px-5 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="register-modal-title" className="text-base sm:text-lg font-bold">
                Cadastrar Nova Iniciativa Paradesportiva
              </h2>
              <p className="text-xs text-blue-200">
                Contribua para o mapeamento público do esporte adaptado no Brasil
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo: Formulário ou Sucesso */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#0F2A4A]">Candidatura Enviada com Sucesso!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                Seu registro foi enviado para o fluxo de curadoria com status de{' '}
                <strong className="text-amber-800 font-semibold">&quot;Aguardando moderação&quot;</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0" />
                <span>
                  <strong>Projeto:</strong> {nome}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Building2 className="w-4 h-4 text-blue-700 flex-shrink-0" />
                <span>
                  <strong>Localização:</strong> {municipio}/{uf}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>
                  <strong>Aprovação:</strong> Acesse o{' '}
                  <Link href="/admin" className="text-blue-700 underline font-bold" onClick={onClose}>
                    Painel de Admin
                  </Link>{' '}
                  para homologar e publicar instantaneamente.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/admin"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 bg-[#0F2A4A] hover:bg-[#163A63] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Abrir Painel Admin para Aceitar</span>
              </Link>
              <button
                type="button"
                onClick={handleFinish}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
            {/* Nome da Iniciativa */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nome da Organização ou Projeto Paradesportivo *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Associação Paraibana de Desporto Adaptado"
                className={`w-full px-3.5 py-2 rounded-lg border text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all ${
                  errors.nome ? 'border-red-400 bg-red-50/30' : 'border-slate-300 bg-slate-50'
                }`}
              />
              {errors.nome && <p className="text-[11px] text-red-600 mt-1">{errors.nome}</p>}
            </div>

            {/* Descrição Curta */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Descrição Curta das Atividades *
              </label>
              <textarea
                rows={2}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o propósito, modalidades ofertadas e público-alvo atendido..."
                className={`w-full px-3.5 py-2 rounded-lg border text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all ${
                  errors.descricao ? 'border-red-400 bg-red-50/30' : 'border-slate-300 bg-slate-50'
                }`}
              />
              {errors.descricao && <p className="text-[11px] text-red-600 mt-1">{errors.descricao}</p>}
            </div>

            {/* Estado e Município */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Estado (UF) *</label>
                <select
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all"
                >
                  {LISTA_UFS.map((u) => (
                    <option key={u.sigla} value={u.sigla}>
                      {u.sigla} - {u.nome}
                    </option>
                  ))}
                </select>
                {errors.uf && <p className="text-[11px] text-red-600 mt-1">{errors.uf}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">Município *</label>
                <input
                  type="text"
                  value={municipio}
                  onChange={(e) => setMunicipio(e.target.value)}
                  placeholder="Ex: João Pessoa"
                  className={`w-full px-3.5 py-2 rounded-lg border text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all ${
                    errors.municipio ? 'border-red-400 bg-red-50/30' : 'border-slate-300 bg-slate-50'
                  }`}
                />
                {errors.municipio && <p className="text-[11px] text-red-600 mt-1">{errors.municipio}</p>}
              </div>
            </div>

            {/* Endereço / Bairro */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Endereço / Complexo Esportivo
              </label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Ex: Vila Olímpica Parahyba - Rua Professora Maria Sales, Bairro dos Estados"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all"
              />
            </div>

            {/* Modalidades Esportivas */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-blue-700" />
                <span>Modalidades Esportivas Oferecidas * (clique para selecionar)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg max-h-32 overflow-y-auto">
                {MODALIDADES_COMUNS.map((esp) => {
                  const isSelected = selectedEsportes.includes(esp);
                  return (
                    <button
                      key={esp}
                      type="button"
                      onClick={() => handleToggleEsporte(esp)}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                        isSelected
                          ? 'bg-[#0F2A4A] text-white font-semibold shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? `✓ ${esp}` : `+ ${esp}`}
                    </button>
                  );
                })}
              </div>

              {/* Adicionar modalidade personalizada */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={customEsporte}
                  onChange={(e) => setCustomEsporte(e.target.value)}
                  placeholder="Outra modalidade não listada..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomEsporte();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomEsporte}
                  className="px-3 py-1.5 bg-[#0F2A4A] text-white rounded-lg text-xs font-semibold hover:bg-[#163A63] transition-colors"
                >
                  Adicionar
                </button>
              </div>
              {errors.esportes && <p className="text-[11px] text-red-600 mt-1">{errors.esportes}</p>}
            </div>

            {/* Deficiências Atendidas */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-600" />
                <span>Tipos de Deficiência Atendidos *</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                {DEFICIENCIAS_DISPONIVEIS.map((def) => {
                  const isChecked = selectedDeficiencias.includes(def);
                  return (
                    <label
                      key={def}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleDeficiencia(def)}
                        className="w-4 h-4 text-blue-700 rounded border-slate-300 focus:ring-blue-700"
                      />
                      <span>{def}</span>
                    </label>
                  );
                })}
              </div>
              {errors.deficiencias && (
                <p className="text-[11px] text-red-600 mt-1">{errors.deficiencias}</p>
              )}
            </div>

            {/* Gratuidade */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Gratuidade do Atendimento</span>
                <span className="text-[11px] text-slate-500">
                  {gratuito
                    ? 'As atividades são 100% gratuitas aos participantes.'
                    : 'Há taxa de matrícula ou coparticipação financeira.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setGratuito(!gratuito)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-700 ${
                  gratuito ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    gratuito ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Seção de Contatos e Redes (Campos novos solicitados) */}
            <div className="border border-slate-200 rounded-xl p-3.5 space-y-3 bg-slate-50/50">
              <span className="text-xs font-bold text-[#0F2A4A] block">
                Canais de Contato & Redes Sociais
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp (com DDD)</span>
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ex: (83) 98845-1200"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                </div>

                {/* Celular */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Celular de Atendimento</span>
                  </label>
                  <input
                    type="text"
                    value={celular}
                    onChange={(e) => setCelular(e.target.value)}
                    placeholder="Ex: (83) 98845-1200"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                </div>

                {/* Telefone Fixo */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Telefone Fixo</span>
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="Ex: (83) 3218-4000"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span>Instagram (@perfil)</span>
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Ex: @ipp_paradesporto"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                </div>

                {/* E-mail */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: contato@ipparadesporto.org.br"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                </div>

                {/* Site Oficial */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Site Oficial (se houver)</span>
                  </label>
                  <input
                    type="text"
                    value={site}
                    onChange={(e) => setSite(e.target.value)}
                    placeholder="Ex: https://ipparadesporto.org.br"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                </div>
              </div>

              {/* Link do Google Maps */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-blue-700" />
                  <span>Link da Localização no Google Maps</span>
                </label>
                <input
                  type="text"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="Ex: https://maps.google.com/?q=Vila+Olimpica+Parahyba"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Dica: Se a organização não possuir site próprio, o link do Google Maps é exibido como referência principal.
                </p>
              </div>
            </div>

            {/* Fonte Pública de Comprovação */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Fonte Pública / Link Oficial de Comprovação *</span>
              </label>
              <input
                type="text"
                value={fonte}
                onChange={(e) => setFonte(e.target.value)}
                placeholder="Ex: https://paraiba.pb.gov.br/noticias/paradesporto ou https://cpb.org.br"
                className={`w-full px-3.5 py-2 rounded-lg border text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all ${
                  errors.fonte ? 'border-red-400 bg-red-50/30' : 'border-slate-300 bg-slate-50'
                }`}
              />
              {errors.fonte && <p className="text-[11px] text-red-600 mt-1">{errors.fonte}</p>}
            </div>

            {/* Aviso de Moderação */}
            <div className="bg-slate-100 p-3 rounded-lg flex items-start gap-2 text-[11px] text-slate-600 border border-slate-200">
              <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <span>
                Novas candidaturas entram como <strong>&quot;Pendente de moderação&quot;</strong> e são homologadas no Painel Admin antes da exibição definitiva.
              </span>
            </div>

            {/* Botões de Ação */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={addMutation.isPending}
                className="inline-flex items-center gap-2 bg-[#0F2A4A] hover:bg-[#163A63] active:bg-[#0C1E36] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-2xs transition-all disabled:opacity-50"
              >
                {addMutation.isPending ? 'Enviando...' : 'Enviar Candidatura'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
