'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { CosmicBackground } from './CosmicBackground';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative">
      <CosmicBackground />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
