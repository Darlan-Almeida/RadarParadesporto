'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Activity, Plus, Search, MapPin, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { dataRepository } from '@/lib/data-repository';
import { Iniciativa } from '@/lib/types';
import { UFS_BRASIL } from '@/lib/constants';

interface HeaderProps {
  onOpenRegister: () => void;
  onSelectState: (uf: string) => void;
  onSelectCity: (uf: string, municipio: string) => void;
  onGoHome: () => void;
}

export function Header({
  onOpenRegister,
  onSelectState,
  onSelectCity,
  onGoHome,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Iniciativa[]>([]);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const data = await dataRepository.searchGlobal(searchQuery);
      setResults(data);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpenSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (item: Iniciativa) => {
    onSelectCity(item.uf, item.municipio);
    setSearchQuery('');
    setIsOpenSearch(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo e Identidade */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onGoHome}>
            <div className="w-8 h-8 rounded-md bg-teal-600 flex items-center justify-center text-white flex-shrink-0">
              <Activity className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Radar<span className="text-teal-400">Paradesporto</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider bg-slate-800 text-teal-300 px-2 py-0.5 rounded-md border border-slate-700">
                  <ShieldCheck className="w-3 h-3" /> Catálogo Nacional
                </span>
              </div>
            </div>
          </div>

          {/* Busca Global rápida */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpenSearch(true);
                }}
                onFocus={() => setIsOpenSearch(true)}
                placeholder="Buscar por cidade, esporte ou instituição..."
                className="w-full pl-9 pr-8 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown de resultados */}
            {isOpenSearch && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white text-slate-900 rounded-md shadow-lg border border-slate-200 max-h-96 overflow-y-auto z-50 divide-y divide-slate-100">
                {results.length > 0 ? (
                  results.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectResult(item)}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900">{item.nome}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-600 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>
                              {item.municipio} - {item.uf} ({UFS_BRASIL[item.uf]?.nome})
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.esportes.slice(0, 3).map((e) => (
                              <span
                                key={e}
                                className="text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md font-medium border border-slate-200"
                              >
                                {e}
                              </span>
                            ))}
                            {item.esportes.length > 3 && (
                              <span className="text-[11px] text-slate-500">
                                +{item.esportes.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Nenhuma iniciativa encontrada para &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ação Primária de Destaque */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenRegister}
              className="inline-flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-medium text-xs sm:text-sm px-3.5 py-1.5 sm:py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar iniciativa</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
