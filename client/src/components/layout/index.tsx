import React, { ReactNode } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';

export interface LayoutProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  children: ReactNode;
  showSidebar?: boolean;
}

export function Layout({ 
  darkMode, 
  toggleDarkMode, 
  children, 
  showSidebar = true 
}: LayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-950 text-gray-100' : 'bg-white text-gray-900'}`}>
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
      />
      <div className="flex flex-1">
        {showSidebar && (
          <Sidebar darkMode={darkMode} />
        )}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}