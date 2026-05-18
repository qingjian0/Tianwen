/**
 * 根布局
 */

import type { Metadata } from 'next';
import { Inter, Noto_Serif_SC } from 'next/font/google';
import './globals.css';

// 临时内联 AppShell
import { ReactNode } from 'react';
import { CosmicBackground } from '@/components/layout/CosmicBackground';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative">
      <CosmicBackground />
      
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const notoSerif = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: '天问 | TIANWEN OS',
  description: 'AI 华夏术数推演操作系统',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${notoSerif.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
