'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataRepository } from '@/lib/data-repository';
import { geoService } from '@/lib/geo-service';
import { IniciativaInput } from '@/lib/types';

export function useNationalSummary() {
  return useQuery({
    queryKey: ['nationalSummary'],
    queryFn: () => dataRepository.getNationalSummary(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAllUFsSummary() {
  return useQuery({
    queryKey: ['allUFsSummary'],
    queryFn: () => dataRepository.getAllUFsSummary(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUFSummary(uf?: string) {
  return useQuery({
    queryKey: ['ufSummary', uf],
    queryFn: () => (uf ? dataRepository.getUFSummary(uf) : null),
    enabled: !!uf,
    staleTime: 1000 * 60 * 5,
  });
}

export function useMunicipiosByUF(uf?: string) {
  return useQuery({
    queryKey: ['municipiosByUF', uf],
    queryFn: () => (uf ? dataRepository.getMunicipiosByUF(uf) : []),
    enabled: !!uf,
    staleTime: 1000 * 60 * 5,
  });
}

export function useIniciativasByMunicipio(uf?: string, municipio?: string) {
  return useQuery({
    queryKey: ['iniciativasByMunicipio', uf, municipio],
    queryFn: () =>
      uf && municipio ? dataRepository.getIniciativasByMunicipio(uf, municipio) : [],
    enabled: !!uf && !!municipio,
    staleTime: 1000 * 60 * 5,
  });
}

export function useEsportesByUF(uf?: string) {
  return useQuery({
    queryKey: ['esportesByUF', uf],
    queryFn: () => dataRepository.getEsportesByUF(uf),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePendingIniciativas() {
  return useQuery({
    queryKey: ['pendingIniciativas'],
    queryFn: () => dataRepository.getPendingIniciativas(),
  });
}

export function useAllIniciativasAdmin() {
  return useQuery({
    queryKey: ['allIniciativasAdmin'],
    queryFn: () => dataRepository.getAllIniciativasAdmin(),
  });
}

export function useAddIniciativa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IniciativaInput) => dataRepository.addIniciativa(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nationalSummary'] });
      queryClient.invalidateQueries({ queryKey: ['pendingIniciativas'] });
      queryClient.invalidateQueries({ queryKey: ['allIniciativasAdmin'] });
    },
  });
}

export function useApproveIniciativa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dataRepository.approveIniciativa(id),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useRejectIniciativa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dataRepository.rejectIniciativa(id),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useDeleteIniciativa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dataRepository.deleteIniciativa(id),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useBrazilGeoJSON() {
  return useQuery({
    queryKey: ['geoJSON_BR'],
    queryFn: () => geoService.getBrazilUFsGeoJSON(),
    staleTime: Infinity,
  });
}

export function useStateMunicipalitiesGeoJSON(uf?: string) {
  return useQuery({
    queryKey: ['geoJSON_UF', uf],
    queryFn: () => (uf ? geoService.getStateMunicipalitiesGeoJSON(uf) : null),
    enabled: !!uf,
    staleTime: Infinity,
  });
}
