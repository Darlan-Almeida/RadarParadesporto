export interface UFMetadata {
  sigla: string;
  nome: string;
  codigoIbge: string;
  regiao: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';
}

export const UFS_BRASIL: Record<string, UFMetadata> = {
  RO: { sigla: 'RO', nome: 'Rondônia', codigoIbge: '11', regiao: 'Norte' },
  AC: { sigla: 'AC', nome: 'Acre', codigoIbge: '12', regiao: 'Norte' },
  AM: { sigla: 'AM', nome: 'Amazonas', codigoIbge: '13', regiao: 'Norte' },
  RR: { sigla: 'RR', nome: 'Roraima', codigoIbge: '14', regiao: 'Norte' },
  PA: { sigla: 'PA', nome: 'Pará', codigoIbge: '15', regiao: 'Norte' },
  AP: { sigla: 'AP', nome: 'Amapá', codigoIbge: '16', regiao: 'Norte' },
  TO: { sigla: 'TO', nome: 'Tocantins', codigoIbge: '17', regiao: 'Norte' },
  MA: { sigla: 'MA', nome: 'Maranhão', codigoIbge: '21', regiao: 'Nordeste' },
  PI: { sigla: 'PI', nome: 'Piauí', codigoIbge: '22', regiao: 'Nordeste' },
  CE: { sigla: 'CE', nome: 'Ceará', codigoIbge: '23', regiao: 'Nordeste' },
  RN: { sigla: 'RN', nome: 'Rio Grande do Norte', codigoIbge: '24', regiao: 'Nordeste' },
  PB: { sigla: 'PB', nome: 'Paraíba', codigoIbge: '25', regiao: 'Nordeste' },
  PE: { sigla: 'PE', nome: 'Pernambuco', codigoIbge: '26', regiao: 'Nordeste' },
  AL: { sigla: 'AL', nome: 'Alagoas', codigoIbge: '27', regiao: 'Nordeste' },
  SE: { sigla: 'SE', nome: 'Sergipe', codigoIbge: '28', regiao: 'Nordeste' },
  BA: { sigla: 'BA', nome: 'Bahia', codigoIbge: '29', regiao: 'Nordeste' },
  MG: { sigla: 'MG', nome: 'Minas Gerais', codigoIbge: '31', regiao: 'Sudeste' },
  ES: { sigla: 'ES', nome: 'Espírito Santo', codigoIbge: '32', regiao: 'Sudeste' },
  RJ: { sigla: 'RJ', nome: 'Rio de Janeiro', codigoIbge: '33', regiao: 'Sudeste' },
  SP: { sigla: 'SP', nome: 'São Paulo', codigoIbge: '35', regiao: 'Sudeste' },
  PR: { sigla: 'PR', nome: 'Paraná', codigoIbge: '41', regiao: 'Sul' },
  SC: { sigla: 'SC', nome: 'Santa Catarina', codigoIbge: '42', regiao: 'Sul' },
  RS: { sigla: 'RS', nome: 'Rio Grande do Sul', codigoIbge: '43', regiao: 'Sul' },
  MS: { sigla: 'MS', nome: 'Mato Grosso do Sul', codigoIbge: '50', regiao: 'Centro-Oeste' },
  MT: { sigla: 'MT', nome: 'Mato Grosso', codigoIbge: '51', regiao: 'Centro-Oeste' },
  GO: { sigla: 'GO', nome: 'Goiás', codigoIbge: '52', regiao: 'Centro-Oeste' },
  DF: { sigla: 'DF', nome: 'Distrito Federal', codigoIbge: '53', regiao: 'Centro-Oeste' },
};

export const LISTA_UFS = Object.values(UFS_BRASIL).sort((a, b) => a.nome.localeCompare(b.nome));

export const DEFICIENCIAS_DISPONIVEIS = [
  'Deficiência física',
  'Deficiência visual',
  'Deficiência auditiva',
  'Deficiência intelectual',
  'Transtorno do Espectro Autista (TEA)',
  'Paralisia cerebral',
  'Múltiplas deficiências',
];

export const MODALIDADES_COMUNS = [
  'Atletismo',
  'Basquete em cadeira de rodas',
  'Bocha paralímpica',
  'Ciclismo adaptado',
  'Esporte adaptado',
  'Futebol de 5',
  'Goalball',
  'Halterofilismo paralímpico',
  'Handebol em cadeira de rodas',
  'Iniciação esportiva adaptada',
  'Natação',
  'Parabadminton',
  'Parataekwondo',
  'Remo adaptado',
  'Tênis de mesa',
  'Tênis em cadeira de rodas',
  'Tiro com arco',
  'Vôlei sentado',
];
