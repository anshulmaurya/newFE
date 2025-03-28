import { useState } from "react";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  onNavigateFeatures: () => void;
  onNavigateProblems: () => void;
}

export default function Header({ onNavigateFeatures, onNavigateProblems }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (callback: () => void) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    callback();
  };

  return (
    <header className="relative z-10 border-b border-slate-700/30">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-900 font-bold font-display text-xl">
            ES
          </div>
          <h1 className="font-display font-bold text-xl sm:text-2xl tracking-tight">
            <span className="text-white">Embedded</span><span className="text-primary">Systems</span>
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button onClick={() => handleNavClick(() => window.scrollTo(0, 0))} className="nav-link group flex flex-col">
            <span className="font-medium text-slate-300 hover:text-white transition-colors">Home</span>
            <span className="nav-indicator group-hover:w-full"></span>
          </button>
          <button onClick={() => handleNavClick(onNavigateFeatures)} className="nav-link group flex flex-col">
            <span className="font-medium text-slate-300 hover:text-white transition-colors">Features</span>
            <span className="nav-indicator group-hover:w-full"></span>
          </button>
          <button onClick={() => handleNavClick(onNavigateProblems)} className="nav-link group flex flex-col">
            <span className="font-medium text-slate-300 hover:text-white transition-colors">Problems</span>
            <span className="nav-indicator group-hover:w-full"></span>
          </button>
          <a 
            href="https://discord.gg/embeddeddev" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="ml-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4a57e0] rounded-lg text-sm text-white transition-colors inline-flex items-center gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 127.14 96.36"
              fill="currentColor"
            >
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
            </svg>
            Join Discord
          </a>

        </nav>
        
        <button 
          className="md:hidden text-slate-300 focus:outline-none" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden glass absolute w-full z-20 py-4 px-4 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <nav className="flex flex-col space-y-4">
          <button 
            onClick={() => handleNavClick(() => window.scrollTo(0, 0))} 
            className="text-slate-300 hover:text-white py-2 border-b border-slate-700/30"
          >
            Home
          </button>
          <button 
            onClick={() => handleNavClick(onNavigateFeatures)} 
            className="text-slate-300 hover:text-white py-2 border-b border-slate-700/30"
          >
            Features
          </button>
          <button 
            onClick={() => handleNavClick(onNavigateProblems)} 
            className="text-slate-300 hover:text-white py-2 border-b border-slate-700/30"
          >
            Problems
          </button>
          <a 
            href="https://discord.gg/embeddeddev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white py-2 font-medium flex items-center gap-2 mt-2 rounded-lg bg-[#5865F2]"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="22" 
              height="22" 
              viewBox="0 0 127.14 96.36"
              fill="currentColor"
              className="ml-2"
            >
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
            </svg>
            <span className="ml-1 mr-2">Join Discord</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
