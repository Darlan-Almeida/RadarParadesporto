'use client';

import { useState, useEffect, useCallback } from 'react';
import { NavigationState } from '@/lib/types';
import { UFS_BRASIL } from '@/lib/constants';

function parseUrlToNavState(): NavigationState {
  if (typeof window === 'undefined') return { view: 'brasil' };

  const params = new URLSearchParams(window.location.search);
  const ufParam = params.get('uf')?.toUpperCase();
  const municipioParam = params.get('municipio');

  if (ufParam && UFS_BRASIL[ufParam]) {
    if (municipioParam && municipioParam.trim().length > 0) {
      return {
        view: 'cidade',
        uf: ufParam,
        municipio: decodeURIComponent(municipioParam.trim()),
      };
    }
    return {
      view: 'estado',
      uf: ufParam,
    };
  }

  return { view: 'brasil' };
}

function updateUrl(state: NavigationState) {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  if (state.view === 'brasil') {
    url.searchParams.delete('uf');
    url.searchParams.delete('municipio');
  } else if (state.view === 'estado') {
    url.searchParams.set('uf', state.uf);
    url.searchParams.delete('municipio');
  } else if (state.view === 'cidade') {
    url.searchParams.set('uf', state.uf);
    url.searchParams.set('municipio', state.municipio);
  }

  const newRelativePathQuery = url.pathname + (url.search ? url.search : '');
  window.history.pushState(state, '', newRelativePathQuery);
}

export function useNavigationState() {
  const [navState, setNavState] = useState<NavigationState>({ view: 'brasil' });
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    const initial = parseUrlToNavState();
    setNavState(initial);
    setIsClientReady(true);

    const handlePopState = (e: PopStateEvent) => {
      if (e.state) {
        setNavState(e.state as NavigationState);
      } else {
        setNavState(parseUrlToNavState());
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goToBrasil = useCallback(() => {
    const nextState: NavigationState = { view: 'brasil' };
    setNavState(nextState);
    updateUrl(nextState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToEstado = useCallback((uf: string) => {
    const cleanUF = uf.toUpperCase();
    const nextState: NavigationState = { view: 'estado', uf: cleanUF };
    setNavState(nextState);
    updateUrl(nextState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToCidade = useCallback((uf: string, municipio: string) => {
    const cleanUF = uf.toUpperCase();
    const nextState: NavigationState = { view: 'cidade', uf: cleanUF, municipio };
    setNavState(nextState);
    updateUrl(nextState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    navState,
    isClientReady,
    goToBrasil,
    goToEstado,
    goToCidade,
  };
}
