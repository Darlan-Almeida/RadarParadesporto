import { Iniciativa, IniciativaInput, UFInfo, MunicipioInfo, NationalSummary, StatusIniciativa } from './types';
import { UFS_BRASIL, LISTA_UFS } from './constants';
import seedData from '@/data/iniciativas.json';
import { normalizeText } from './utils';

const STORAGE_KEY = 'radar_pcd_iniciativas_prod_v4';

class DataRepository {
  private inMemoryData: Iniciativa[] = [];
  private isInitialized = false;

  private init() {
    if (this.isInitialized) return;

    let stored: Iniciativa[] = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          stored = JSON.parse(raw);
        }
      } catch (err) {
        console.warn('Erro ao ler localStorage:', err);
      }
    }

    const merged = [...(seedData as Iniciativa[])];
    stored.forEach((item) => {
      const existingIdx = merged.findIndex((m) => m.id === item.id);
      if (existingIdx >= 0) {
        merged[existingIdx] = item;
      } else {
        merged.push(item);
      }
    });

    this.inMemoryData = merged;
    this.isInitialized = true;
  }

  private persistAll() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemoryData));
      } catch (err) {
        console.warn('Erro ao salvar no localStorage:', err);
      }
    }
  }

  async getAllIniciativas(includePending = false): Promise<Iniciativa[]> {
    this.init();
    return this.inMemoryData.filter((i) => includePending || i.status === 'publicado');
  }

  async getAllIniciativasAdmin(): Promise<Iniciativa[]> {
    this.init();
    return [...this.inMemoryData];
  }

  async getPendingIniciativas(): Promise<Iniciativa[]> {
    this.init();
    return this.inMemoryData.filter((i) => i.status === 'pendente');
  }

  async getIniciativasByUF(uf: string, includePending = false): Promise<Iniciativa[]> {
    this.init();
    const upperUF = uf.toUpperCase();
    return this.inMemoryData.filter(
      (i) => i.uf.toUpperCase() === upperUF && (includePending || i.status === 'publicado')
    );
  }

  async getIniciativasByMunicipio(
    uf: string,
    municipio: string,
    includePending = false
  ): Promise<Iniciativa[]> {
    this.init();
    const upperUF = uf.toUpperCase();
    const normMuni = normalizeText(municipio);
    return this.inMemoryData.filter(
      (i) =>
        i.uf.toUpperCase() === upperUF &&
        normalizeText(i.municipio) === normMuni &&
        (includePending || i.status === 'publicado')
    );
  }

  async getAllUFsSummary(): Promise<UFInfo[]> {
    this.init();
    const published = this.inMemoryData.filter((i) => i.status === 'publicado');

    return LISTA_UFS.map((uf) => {
      const items = published.filter((i) => i.uf.toUpperCase() === uf.sigla.toUpperCase());
      const muniSet = new Set(items.map((i) => normalizeText(i.municipio)));

      return {
        sigla: uf.sigla,
        nome: uf.nome,
        codigoIbge: uf.codigoIbge,
        regiao: uf.regiao,
        totalIniciativas: items.length,
        municipiosComIniciativas: muniSet.size,
      };
    });
  }

  async getUFSummary(uf: string): Promise<UFInfo | null> {
    const list = await this.getAllUFsSummary();
    return list.find((u) => u.sigla.toUpperCase() === uf.toUpperCase()) || null;
  }

  async getMunicipiosByUF(uf: string): Promise<MunicipioInfo[]> {
    this.init();
    const items = await this.getIniciativasByUF(uf);
    const groups = new Map<string, { nome: string; items: Iniciativa[] }>();

    items.forEach((item) => {
      const norm = normalizeText(item.municipio);
      if (!groups.has(norm)) {
        groups.set(norm, { nome: item.municipio, items: [] });
      }
      groups.get(norm)!.items.push(item);
    });

    const result: MunicipioInfo[] = [];
    groups.forEach((value) => {
      const esportesSet = new Set<string>();
      const deficienciasSet = new Set<string>();

      value.items.forEach((i) => {
        i.esportes.forEach((e) => esportesSet.add(e));
        i.deficienciasAtendidas.forEach((d) => deficienciasSet.add(d));
      });

      result.push({
        nome: value.nome,
        uf: uf.toUpperCase(),
        totalIniciativas: value.items.length,
        esportes: Array.from(esportesSet).sort(),
        deficiencias: Array.from(deficienciasSet).sort(),
      });
    });

    return result.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  async getEsportesByUF(uf?: string): Promise<string[]> {
    this.init();
    const items = uf ? await this.getIniciativasByUF(uf) : await this.getAllIniciativas();
    const set = new Set<string>();
    items.forEach((item) => {
      item.esportes.forEach((e) => set.add(e));
    });
    return Array.from(set).sort();
  }

  async getNationalSummary(): Promise<NationalSummary> {
    this.init();
    const published = await this.getAllIniciativas(false);
    const pendentes = await this.getPendingIniciativas();

    const ufsWithData = new Set(published.map((i) => i.uf.toUpperCase()));
    const munisWithData = new Set(published.map((i) => `${i.uf.toUpperCase()}-${normalizeText(i.municipio)}`));

    const esportesCount = new Map<string, number>();
    published.forEach((i) => {
      i.esportes.forEach((e) => {
        esportesCount.set(e, (esportesCount.get(e) || 0) + 1);
      });
    });

    const ufCount = new Map<string, number>();
    published.forEach((i) => {
      const uf = i.uf.toUpperCase();
      ufCount.set(uf, (ufCount.get(uf) || 0) + 1);
    });

    const estadosMaisAtivos = Array.from(ufCount.entries())
      .map(([sigla, count]) => ({
        uf: sigla,
        nome: UFS_BRASIL[sigla]?.nome || sigla,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    const esportesMaisPraticados = Array.from(esportesCount.entries())
      .map(([esporte, count]) => ({ esporte, count }))
      .sort((a, b) => b.count - a.count);

    const totalGratuito = published.filter((i) => i.gratuito).length;
    const percentualGratuito = published.length > 0 ? Math.round((totalGratuito / published.length) * 100) : 100;

    return {
      totalIniciativas: published.length,
      totalEstadosComIniciativas: ufsWithData.size,
      totalMunicipiosComIniciativas: munisWithData.size,
      totalEsportesUnicos: esportesCount.size,
      percentualGratuito,
      totalPendentes: pendentes.length,
      estadosMaisAtivos,
      esportesMaisPraticados,
    };
  }

  async addIniciativa(input: IniciativaInput): Promise<Iniciativa> {
    this.init();
    const newId = `iniciativa-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newItem: Iniciativa = {
      ...input,
      id: newId,
      status: 'pendente',
      dataCadastro: new Date().toISOString().split('T')[0],
    };

    this.inMemoryData.push(newItem);
    this.persistAll();

    return newItem;
  }

  async approveIniciativa(id: string): Promise<Iniciativa> {
    this.init();
    const item = this.inMemoryData.find((i) => i.id === id);
    if (!item) throw new Error('Iniciativa não encontrada');

    item.status = 'publicado';
    this.persistAll();
    return item;
  }

  async rejectIniciativa(id: string): Promise<Iniciativa> {
    this.init();
    const item = this.inMemoryData.find((i) => i.id === id);
    if (!item) throw new Error('Iniciativa não encontrada');

    item.status = 'rejeitado';
    this.persistAll();
    return item;
  }

  async deleteIniciativa(id: string): Promise<boolean> {
    this.init();
    const prevLen = this.inMemoryData.length;
    this.inMemoryData = this.inMemoryData.filter((i) => i.id !== id);
    if (this.inMemoryData.length !== prevLen) {
      this.persistAll();
      return true;
    }
    return false;
  }

  async searchGlobal(query: string): Promise<Iniciativa[]> {
    this.init();
    if (!query || query.trim().length === 0) return [];
    const norm = normalizeText(query);
    const published = this.inMemoryData.filter((i) => i.status === 'publicado');

    return published.filter((item) => {
      return (
        normalizeText(item.nome).includes(norm) ||
        normalizeText(item.municipio).includes(norm) ||
        item.uf.toLowerCase().includes(norm) ||
        item.esportes.some((e) => normalizeText(e).includes(norm)) ||
        item.deficienciasAtendidas.some((d) => normalizeText(d).includes(norm))
      );
    });
  }
}

export const dataRepository = new DataRepository();
