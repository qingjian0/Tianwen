import type { Metadata } from 'next';
import { Inter, Noto_Serif_SC } from 'next/font/google';
import { AppShell } from '@/components/layout/AppShell';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const notoSerif = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
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
