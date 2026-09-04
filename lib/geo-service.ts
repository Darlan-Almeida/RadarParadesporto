import { FeatureCollection, Geometry } from 'geojson';
import { GeoFeatureProperties } from './types';
import { UFS_BRASIL } from './constants';

export type BrazilGeoJSON = FeatureCollection<Geometry, GeoFeatureProperties>;

class GeoService {
  private cache = new Map<string, BrazilGeoJSON>();

  async getBrazilUFsGeoJSON(): Promise<BrazilGeoJSON> {
    if (this.cache.has('BR')) {
      return this.cache.get('BR')!;
    }

    try {
      const res = await fetch('/geo/brazil-ufs.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: BrazilGeoJSON = await res.json();
      this.cache.set('BR', data);
      return data;
    } catch (err) {
      console.warn('Fallback para API do IBGE para o Brasil:', err);
      const res = await fetch(
        'https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json&qualidade=minima&intrarregiao=UF'
      );
      const data: BrazilGeoJSON = await res.json();
      data.features.forEach((f) => {
        const code = String(f.properties?.codarea || '');
        const uf = Object.values(UFS_BRASIL).find((u) => u.codigoIbge === code);
        if (uf && f.properties) {
          f.properties.sigla = uf.sigla;
          f.properties.nome = uf.nome;
          f.properties.regiao = uf.regiao;
          f.properties.codigoIbge = code;
        }
      });
      this.cache.set('BR', data);
      return data;
    }
  }

  async getStateMunicipalitiesGeoJSON(uf: string): Promise<BrazilGeoJSON> {
    const upperUF = uf.toUpperCase();
    const key = `UF_${upperUF}`;
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    try {
      const res = await fetch(`/geo/municipios-${upperUF.toLowerCase()}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: BrazilGeoJSON = await res.json();
      this.cache.set(key, data);
      return data;
    } catch (err) {
      console.warn(`Fallback para API do IBGE para UF ${upperUF}:`, err);
      const ufInfo = UFS_BRASIL[upperUF];
      if (!ufInfo) throw new Error(`UF inválida: ${upperUF}`);

      const res = await fetch(
        `https://servicodados.ibge.gov.br/api/v3/malhas/estados/${ufInfo.codigoIbge}?formato=application/vnd.geo+json&qualidade=minima&intrarregiao=municipio`
      );
      const data: BrazilGeoJSON = await res.json();

      // Buscar nomes dos municípios
      try {
        const munRes = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufInfo.codigoIbge}/municipios`
        );
        const munList: Array<{ id: number; nome: string }> = await munRes.json();
        const map = new Map<string, string>();
        munList.forEach((m) => map.set(String(m.id), m.nome));

        data.features.forEach((f) => {
          const id = String(f.properties?.codarea || '');
          if (f.properties) {
            f.properties.nome = map.get(id) || `Município ${id}`;
            f.properties.uf = upperUF;
            f.properties.codigoIbge = id;
          }
        });
      } catch (munErr) {
        console.warn('Erro ao associar nomes aos municípios:', munErr);
      }

      this.cache.set(key, data);
      return data;
    }
  }
}

export const geoService = new GeoService();
