'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building2,
  Tag,
  Users,
  MessageSquare,
  Navigation,
  Phone,
  Smartphone,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';
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
      newErrors.esportes = 'Selecione ao menos uma modalidade esportiva.';
    if (selectedDeficiencias.length === 0)
      newErrors.deficiencias = 'Selecione ao menos um tipo de deficiência atendida.';
    if (!fonte.trim())
      newErrors.fonte =
        'Indique o link oficial de comprovação desta iniciativa.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 overflow-y-auto animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Cabeçalho do Modal */}
        <div className="bg-[#0f2d4a] text-white px-5 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-700 flex items-center justify-center text-white">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 id="register-modal-title" className="text-sm sm:text-base font-bold">
                Cadastrar Nova Iniciativa Paradesportiva
              </h2>
              <p className="text-xs text-slate-300">
                Contribua com o catálogo público de esporte adaptado
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
            aria-label="Fechar janela"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo: Formulário ou Sucesso */}
        {isSuccess ? (
          <div className="p-6 text-center space-y-4 overflow-y-auto">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Candidatura Enviada com Sucesso</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                Seu registro foi enviado com status de{' '}
                <strong className="text-slate-800 font-semibold">&quot;Aguardando moderação&quot;</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 text-left text-xs space-y-1.5 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span>
                  <strong>Projeto:</strong> {nome}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span>
                  <strong>Localização:</strong> {municipio}/{uf}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span>
                  <strong>Aprovação:</strong> Acesse o{' '}
                  <Link href="/admin" className="text-blue-700 underline font-semibold" onClick={onClose}>
                    Painel de Admin
                  </Link>{' '}
                  para homologar o registro.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <Link
                href="/admin"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 bg-[#0f2d4a] hover:bg-[#163a63] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Abrir Painel Admin</span>
              </Link>
              <button
                type="button"
                onClick={handleFinish}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-md border border-slate-300"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1 text-xs sm:text-sm">
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
                className={`w-full px-3 py-1.5 rounded-md border text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all ${
                  errors.nome ? 'border-red-400 bg-red-50/30' : 'border-slate-300 bg-white'
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
                placeholder="Descreva o propósito, modalidades ofertadas e público atendido..."
                className={`w-full px-3 py-1.5 rounded-md border text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all ${
                  errors.descricao ? 'border-red-400 bg-red-50/30' : 'border-slate-300 bg-white'
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
                  className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
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
                  className={`w-full px-3 py-1.5 rounded-md border text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all ${
                    errors.municipio ? 'border-red-400 bg-red-50/30' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.municipio && <p className="text-[11px] text-red-600 mt-1">{errors.municipio}</p>}
              </div>
            </div>

            {/* Endereço */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Endereço / Polo de Treinamento
              </label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Ex: Vila Olímpica - Rua Professora Maria Sales"
                className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
              />
            </div>

            {/* Modalidades Esportivas */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>Modalidades Esportivas *</span>
              </label>
              <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border border-slate-200 rounded-md max-h-28 overflow-y-auto">
                {MODALIDADES_COMUNS.map((esp) => {
                  const isSelected = selectedEsportes.includes(esp);
                  return (
                    <button
                      key={esp}
                      type="button"
                      onClick={() => handleToggleEsporte(esp)}
                      className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                        isSelected
                          ? 'bg-[#0f2d4a] text-white font-semibold'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? `✓ ${esp}` : `+ ${esp}`}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 mt-1.5">
                <input
                  type="text"
                  value={customEsporte}
                  onChange={(e) => setCustomEsporte(e.target.value)}
                  placeholder="Outra modalidade..."
                  className="flex-1 px-2.5 py-1 rounded-md border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
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
                  className="px-2.5 py-1 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 transition-colors"
                >
                  Adicionar
                </button>
              </div>
              {errors.esportes && <p className="text-[11px] text-red-600 mt-1">{errors.esportes}</p>}
            </div>

            {/* Deficiências Atendidas */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Tipos de Deficiência Atendidos *</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-md">
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
                        className="w-3.5 h-3.5 text-blue-700 rounded border-slate-300 focus:ring-slate-900"
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
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Gratuidade do Atendimento</span>
                <span className="text-[11px] text-slate-500">
                  {gratuito ? 'Atividades 100% gratuitas.' : 'Possui taxa ou coparticipação.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setGratuito(!gratuito)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  gratuito ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    gratuito ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Canais de Contato */}
            <div className="border border-slate-200 rounded-md p-3 space-y-2.5 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-900 block">
                Canais de Contato
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                    WhatsApp (com DDD)
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ex: (83) 98845-1200"
                    className="w-full px-2.5 py-1 rounded-md border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                    Celular
                  </label>
                  <input
                    type="text"
                    value={celular}
                    onChange={(e) => setCelular(e.target.value)}
                    placeholder="Ex: (83) 98845-1200"
                    className="w-full px-2.5 py-1 rounded-md border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                    Telefone Fixo
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="Ex: (83) 3218-4000"
                    className="w-full px-2.5 py-1 rounded-md border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                    Instagram (@perfil)
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Ex: @ipp_paradesporto"
                    className="w-full px-2.5 py-1 rounded-md border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: contato@ipparadesporto.org.br"
                    className="w-full px-2.5 py-1 rounded-md border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">Site Oficial</label>
                  <input
                    type="text"
                    value={site}
                    onChange={(e) => setSite(e.target.value)}
                    placeholder="Ex: https://ipparadesporto.org.br"
                    className="w-full px-2.5 py-1 rounded-md border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                  Link da Localização no Google Maps
                </label>
                <input
                  type="text"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="Ex: https://maps.google.com/?q=Vila+Olimpica"
                  className="w-full px-2.5 py-1 rounded-md border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Fonte Pública */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Fonte Pública de Comprovação *</span>
              </label>
              <input
                type="text"
                value={fonte}
                onChange={(e) => setFonte(e.target.value)}
                placeholder="Ex: https://paraiba.pb.gov.br ou https://cpb.org.br"
                className={`w-full px-3 py-1.5 rounded-md border text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all ${
                  errors.fonte ? 'border-red-400 bg-red-50/30' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.fonte && <p className="text-[11px] text-red-600 mt-1">{errors.fonte}</p>}
            </div>

            {/* Botões de Ação */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors border border-slate-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={addMutation.isPending}
                className="inline-flex items-center gap-1.5 bg-[#0f2d4a] hover:bg-[#163a63] text-white font-medium text-xs px-4 py-1.5 rounded-md transition-colors disabled:opacity-50"
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
