import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'RadarParadesporto | Catálogo Nacional de Iniciativas Paradesportivas',
  description:
    'Plataforma pública e interativa de mapeamento do paradesporto no Brasil. Encontre modalidades, projetos esportivos adaptados e centros de treinamento para pessoas com deficiência (PCD) organizados por Estado e Município.',
  keywords: [
    'paradesporto',
    'esporte adaptado',
    'PCD',
    'pessoas com deficiência',
    'paralímpico',
    'mapa paradesporto brasil',
    'inclusão esportiva',
  ],
  authors: [{ name: 'RadarParadesporto Brasil' }],
  openGraph: {
    title: 'RadarParadesporto | Catálogo Nacional de Iniciativas Paradesportivas',
    description:
      'Mapa interativo de iniciativas de esporte adaptado e paradesporto em todo o território nacional.',
    siteName: 'RadarParadesporto',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} font-sans antialiased text-slate-900 bg-slate-50`}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-900 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
