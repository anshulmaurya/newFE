import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu } from 'lucide-react';

export interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  return (
    <header className={`px-4 h-16 flex items-center justify-between border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="flex items-center">
        <Link href="/">
          <a className="font-bold text-xl flex items-center">
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <rect width="32" height="32" rx="4" fill="#C2EE4A" />
              <path d="M8 10H24V12H8V10Z" fill="black" />
              <path d="M8 14H18V16H8V14Z" fill="black" />
              <path d="M8 18H24V20H8V18Z" fill="black" />
              <path d="M8 22H14V24H8V22Z" fill="black" />
            </svg>
            <span>DSPCoder</span>
          </a>
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full"
        >
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}