export type DeficienciaTipo =
  | 'Deficiência física'
  | 'Deficiência visual'
  | 'Deficiência auditiva'
  | 'Deficiência intelectual'
  | 'Transtorno do Espectro Autista (TEA)'
  | 'Paralisia cerebral'
  | 'Múltiplas deficiências';

export type StatusIniciativa = 'publicado' | 'pendente' | 'rejeitado';

export interface Iniciativa {
  id: string;
  nome: string;
  descricao: string;
  uf: string;               // Sigla da UF, ex: "PB", "SP"
  municipio: string;        // Nome do município, ex: "João Pessoa"
  endereco?: string;        // Endereço completo / complexo esportivo
  esportes: string[];       // Modalidades, ex: ["Atletismo", "Bocha paralímpica"]
  deficienciasAtendidas: string[];
  gratuito: boolean;
  telefone?: string;        // Telefone fixo institucional
  celular?: string;         // Celular de atendimento
  whatsapp?: string;        // Número formatado para WhatsApp click-to-chat
  instagram?: string;       // Handle ou link do Instagram (ex: @ipp_paradesporto)
  email?: string;           // E-mail institucional
  site?: string;            // Site oficial (se houver)
  googleMapsUrl?: string;   // Link no Google Maps (usado especialmente quando não houver site próprio)
  contato?: string;         // String consolidada legada (opcional)
  fonte: string;            // URL ou menção da fonte pública/oficial
  status: StatusIniciativa; // 'publicado' | 'pendente' | 'rejeitado'
  dataCadastro?: string;    // Data ISO de submissão
}

export type IniciativaInput = Omit<Iniciativa, 'id' | 'status' | 'dataCadastro'>;

export interface UFInfo {
  sigla: string;
  nome: string;
  codigoIbge: string;
  regiao: string;
  totalIniciativas: number;
  municipiosComIniciativas: number;
}

export interface MunicipioInfo {
  nome: string;
  uf: string;
  codigoIbge?: string;
  totalIniciativas: number;
  esportes: string[];
  deficiencias: string[];
}

export interface NationalSummary {
  totalIniciativas: number;
  totalEstadosComIniciativas: number;
  totalMunicipiosComIniciativas: number;
  totalEsportesUnicos: number;
  percentualGratuito: number;
  totalPendentes: number;
  estadosMaisAtivos: { uf: string; nome: string; count: number }[];
  esportesMaisPraticados: { esporte: string; count: number }[];
}

export type NavigationState =
  | { view: 'brasil' }
  | { view: 'estado'; uf: string }
  | { view: 'cidade'; uf: string; municipio: string };

export type SortOrder = 'nome-asc' | 'nome-desc' | 'iniciativas-desc' | 'iniciativas-asc';

export interface FilterState {
  esporte: string;
  deficiencia: string;
  somenteGratuito: boolean;
  busca: string;
  ordenacao: SortOrder;
}

export interface GeoFeatureProperties {
  codarea?: string;
  codigoIbge?: string;
  sigla?: string;
  nome?: string;
  uf?: string;
  regiao?: string;
  [key: string]: unknown;
}
