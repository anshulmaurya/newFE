import { useState } from "react";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  onNavigateFeatures: () => void;
  onNavigateProblems: () => void;
  onNavigateWaitlist: () => void;
}

export default function Header({ onNavigateFeatures, onNavigateProblems, onNavigateWaitlist }: HeaderProps) {
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
            DSP
          </div>
          <h1 className="font-display font-bold text-xl sm:text-2xl tracking-tight">
            <span className="text-white">DSP</span><span className="text-primary">CODER</span>
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
          <button onClick={() => handleNavClick(onNavigateWaitlist)} className="nav-link group flex flex-col">
            <span className="font-medium text-slate-300 hover:text-white transition-colors">Join Waitlist</span>
            <span className="nav-indicator group-hover:w-full"></span>
          </button>
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
          <button 
            onClick={() => handleNavClick(onNavigateWaitlist)} 
            className="text-slate-300 hover:text-white py-2"
          >
            Join Waitlist
          </button>
        </nav>
      </div>
    </header>
  );
}
