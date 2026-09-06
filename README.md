# RadarParadesporto 🇧🇷
> **Catálogo Nacional Interativo de Iniciativas de Paradesporto e Esporte Adaptado no Brasil**

O **RadarParadesporto** é uma plataforma web pública desenvolvida para mapear, catalogar e democratizar o acesso a projetos sociais, associações desportivas, centros de treinamento e escolinhas de esporte adaptado para **Pessoas com Deficiência (PCD)** em todo o território brasileiro.

A aplicação estrutura a descoberta em uma experiência cartográfica e navegável em 3 níveis (**Brasil → Estado → Cidade**) com transição instantânea e fluida no lado do cliente.

---

## 🎯 Impacto Social e Propósito

No Brasil, o esporte adaptado é um dos mais poderosos instrumentos de **reabilitação psicossocial, autonomia, inclusão cidadã e desenvolvimento humano**. Embora o país seja uma potência paralímpica mundial, milhares de famílias e pessoas com deficiência enfrentam severas barreiras para encontrar oportunidades esportivas em seus próprios municípios.

### Objetivos do RadarParadesporto:
1. **Centralização da Informação**: Reunir em um único ponto de consulta as modalidades disponíveis, endereços, canais de contato e gratuidades.
2. **Visibilidade Territorial**: Identificar desertos esportivos (regiões e municípios desassistidos) para orientar investimentos públicos e do terceiro setor.
3. **Incentivo à Prática de Base**: Conectar crianças, jovens e adultos a núcleos de iniciação esportiva adaptada próximos de suas residências.
4. **Mapeamento Colaborativo**: Permitir que entidades e cidadãos cadastrem novos projetos para homologação e curadoria contínua.

---

## 🏛️ Arquitetura Técnica e Decisões de Engenharia

A solução foi desenvolvida com foco em **alta performance, seriedade institucional, acessibilidade e experiência de navegação sem recargas de página**:

### 1. Stack Tecnológica
- **Next.js 16+ (App Router)** com **TypeScript Estrito (`strict: true`)**: Permite renderização otimizada, SEO amigável para catálogo público e arquitetura moderna de componentes.
- **React 19 com Client Components**: Para as camadas de renderização vetorial e orquestração do estado interativo.
- **TailwindCSS**: Design system sóbrio e limpo (paleta institucional: Azul Petróleo `#0f2d4a`, Ardósia/Slate neutro e Verde Esmeralda `#059669` para destaques de iniciativas ativas).
- **Mapas com Malhas Oficiais do IBGE + d3-geo**:
  - Malhas territoriais simplificadas do IBGE para as 27 Unidades Federativas e municípios brasileiros.
  - Projeções vetoriais calculadas no cliente via `d3-geo` (`geoMercator` com `fitSize`), garantindo fidelidade cartográfica e SVG leve sem dependência de tiles pesados.
- **Gerenciamento de Estado e Cache**:
  - **TanStack Query (React Query)**: Cache inteligente de dados geográficos e das consultas por estado e cidade.
  - **Client UI State Machine (`useNavigationState`)**: Gerencia o estado ativo (`brasil` | `estado` | `cidade`) sem reloads de página, sincronizando de forma rasa com a URL (`window.history.pushState`) para possibilitar compartilhamento de links diretos.
- **Data Repository Pattern (`lib/data-repository.ts`)**:
  - Camada de abstração de dados desacoplada que permite alternar do JSON local/localStorage para uma API RESTful ou banco PostgreSQL/PostGIS sem alterar componentes de interface.

---

## 🧭 Navegação em 3 Camadas (Zero Reload)

1. **Camada 1 — Brasil**:
   - Mapa SVG nacional interativo com as 26 UFs + DF.
   - Destaque visual para estados com iniciativas registradas.
   - Tooltips com dados agregados por região e contadores.
   - Painel consolidado de estatísticas nacionais (total de iniciativas, municípios, modalidades e gratuidade).
2. **Camada 2 — Estado (Visão Lado a Lado / Abas no Mobile)**:
   - **Coluna Esquerda (Mapa)**: Malha dos municípios do estado selecionado com destaque em esmeralda para cidades com iniciativas.
   - **Coluna Direita (Listagem)**: Municípios em ordem alfabética por padrão, com contadores de iniciativas, badges das modalidades, filtro dinâmico por esporte e ordenação personalizada (A-Z, Z-A, maior/menor volume).
   - Breadcrumb permanente: `Brasil > [Nome do Estado]`.
3. **Camada 3 — Cidade**:
   - Catálogo das iniciativas da cidade selecionada.
   - Cards detalhados com: nome do projeto, descrição, modalidades esportivas, deficiências atendidas, endereço, formas de contato com links diretos (`tel:`, `mailto:`, `https://`), badge de gratuidade e link da fonte oficial.
   - Breadcrumb: `Brasil > [Estado] > [Município]`.


## 📁 Estrutura de Pastas

```
/
├── app/
│   ├── globals.css            # Design tokens institucionais e diretivas do TailwindCSS
│   ├── layout.tsx             # Root layout com SEO meta tags, fonte Inter e TanStack Query Provider
│   ├── page.tsx               # Orquestrador da aplicação (Camadas 1, 2 e 3)
│   └── providers.tsx          # Configuração do QueryClient do TanStack Query
├── components/
│   ├── Header.tsx             # Topbar com busca global e CTA "+ Cadastrar Iniciativa"
│   ├── Breadcrumb.tsx         # Trilha de navegação fixa com transições instantâneas
│   ├── NationalStats.tsx      # Métricas nacionais consolidadas
│   ├── BrazilMap.tsx          # Mapa SVG interativo do Brasil (27 UFs via D3-geo)
│   ├── StatesOverviewList.tsx # Lista rápida de estados e regiões
│   ├── StateView.tsx          # Camada 2: Container responsivo (mapa + listagem)
│   ├── StateMap.tsx           # Mapa SVG dos municípios da UF selecionada
│   ├── MunicipalityList.tsx   # Lista de municípios com filtro por esporte e ordenação
│   ├── CityView.tsx           # Camada 3: Catálogo completo de iniciativas do município
│   ├── InitiativeCard.tsx     # Card rico com badges de esporte, deficiência, gratuidade e contatos
│   ├── RegisterModal.tsx      # Modal acessível de cadastro de nova iniciativa
│   └── Footer.tsx             # Rodapé institucional com avisos e créditos
├── hooks/
│   ├── useNavigationState.ts  # State machine de navegação sem reload com sync na URL
│   └── useIniciativas.ts      # Hooks do React Query com cache territorial
├── lib/
│   ├── constants.ts           # Metadados das 27 UFs do Brasil, modalidades e deficiências
│   ├── data-repository.ts     # Repositório de dados com simulação de persistência
│   ├── geo-service.ts         # Carregador de malhas GeoJSON locais e fallback IBGE
│   ├── types.ts               # Tipagem TypeScript estrita
│   └── utils.ts               # Helpers de normalização de texto e classes
├── public/
│   └── geo/                   # Malhas GeoJSON enriquecidas do Brasil e dos 27 estados
├── data/
│   └── iniciativas.json       # Seed data com os 10 registros reais
├── package.json
└── tsconfig.json
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18.17+ ou 20+
- npm 9+ ou yarn/pnpm

### 1. Clonar o repositório e instalar dependências:
```bash
git clone https://github.com/Darlan-Almeida/radar.git
cd radar
npm install
```

### 2. Executar em modo de desenvolvimento:
```bash
npm run dev
```
Acesse `http://localhost:3000` no seu navegador.

### 3. Compilar para produção:
```bash
npm run build
npm run start
```

---

## 🌐 Publicação no GitHub Pages (`github.io`)

1. No GitHub, acesse **Settings → Pages** e selecione **Source: GitHub Actions**.
2. Faça commit das configurações deste repositório (Next.js estático + workflow).
3. Envie para a branch `main` para disparar o workflow **Deploy to GitHub Pages**.
4. Após a execução, acesse:
   - **https://darlan-almeida.github.io/RadarParadesporto/**
5. Se notar assets quebrados (CSS/imagens/dados), valide `basePath` e o prefixo usado para recursos públicos e rode novo deploy.

---

## 🗺️ Roadmap para Produção

- [ ] **Persistência Relacional & Geoespacial**: Migração da camada de dados para PostgreSQL com extensão **PostGIS** para consultas por raio quilométrico (ex.: "Encontrar iniciativas a até 20km da minha localização").
- [ ] **Módulo de Moderação Administrativa**: Painel restrito para curadores governamentais / ONGs aprovarem novos cadastros submetidos por cidadãos.
- [ ] **Integração Automática com Federações**: Conexão com bases do Comitê Paralímpico Brasileiro (CPB), ANDE, CBTM e secretarias estaduais de esporte.
- [ ] **Acessibilidade WCAG 2.1 Nível AA**: Auditoria aprofundada para navegação completa por leitores de tela (NVDA, TalkBack, VoiceOver) e modo de alto contraste.

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
