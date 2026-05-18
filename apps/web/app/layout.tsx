import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '天问 - 东方时空认知操作系统',
  description: 'AI华夏术数推演操作系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-cosmic-black text-white">
        {children}
      </body>
    </html>
  );
}
