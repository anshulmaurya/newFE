import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home, 
  Code, 
  BookOpen, 
  Settings, 
  LogOut, 
  Github,
  LineChart
} from 'lucide-react';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  darkMode: boolean;
}

function SidebarLink({ 
  href, 
  icon, 
  label, 
  active, 
  onClick, 
  darkMode 
}: SidebarLinkProps) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={`w-full justify-start gap-2 ${
          active 
            ? 'bg-[#c2ee4a] text-black hover:bg-[#b8e248] hover:text-black' 
            : ''
        }`}
        onClick={onClick}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
}

interface SidebarProps {
  darkMode: boolean;
}

export function Sidebar({ darkMode }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div className={`w-64 border-r ${darkMode ? 'border-gray-800' : 'border-gray-200'} hidden md:block`}>
      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="p-4 space-y-2">
          <SidebarLink
            href="/"
            icon={<Home className="h-5 w-5" />}
            label="Home"
            active={location === '/'}
            darkMode={darkMode}
          />
          <SidebarLink
            href="/problems"
            icon={<Code className="h-5 w-5" />}
            label="Problems"
            active={location.startsWith('/problems')}
            darkMode={darkMode}
          />
          <SidebarLink
            href="/stats"
            icon={<LineChart className="h-5 w-5" />}
            label="Stats"
            active={location === '/stats'}
            darkMode={darkMode}
          />
          <SidebarLink
            href="/docs"
            icon={<BookOpen className="h-5 w-5" />}
            label="Documentation"
            active={location.startsWith('/docs')}
            darkMode={darkMode}
          />
          
          <div className="py-2">
            <div className={`h-px w-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
          </div>
          
          <SidebarLink
            href="/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            active={location === '/settings'}
            darkMode={darkMode}
          />
          
          <div className="py-2">
            <div className={`h-px w-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
          </div>
          
          <Link href="/auth">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => {}}>
              <Github className="h-5 w-5" />
              <span>Sign in with GitHub</span>
            </Button>
          </Link>
        </div>
      </ScrollArea>
    </div>
  );
}