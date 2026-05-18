/**
 * 应用外壳
 */

'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CosmicBackground } from './CosmicBackground';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
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
