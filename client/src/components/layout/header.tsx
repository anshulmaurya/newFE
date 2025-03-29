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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgb(24,24,26)]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 flex items-center justify-center">
            <svg version="1.1" viewBox="0.0 0.0 100.0 100.0" fill="none" stroke="none" strokeLinecap="square" strokeMiterlimit="10" width="40" height="40">
              <clipPath id="p.0">
                <path d="m0 0l100.0 0l0 100.0l-100.0 0l0 -100.0z" clipRule="nonzero"/>
              </clipPath>
              <g clipPath="url(#p.0)">
                <path fill="#000000" fillOpacity="0.0" d="m0 0l100.0 0l0 100.0l-100.0 0z" fillRule="evenodd"/>
                <path fill="#000000" fillOpacity="0.0" d="m10.431272 9.52057l75.28909 0l0 80.957825l-75.28909 0z" fillRule="evenodd"/>
                <path stroke="#d6fb41" strokeWidth="2.0" strokeLinejoin="round" strokeLinecap="butt" strokeDasharray="8.0,3.0,1.0,3.0" d="m10.431272 9.52057l75.28909 0l0 80.957825l-75.28909 0z" fillRule="evenodd"/>
                <path fill="#000000" fillOpacity="0.0" d="m21.61335 20.375572l52.90764 0l0 59.226234l-52.90764 0z" fillRule="evenodd"/>
                <path stroke="#d6fb41" strokeWidth="2.0" strokeLinejoin="round" strokeLinecap="butt" d="m21.61335 20.375572l52.90764 0l0 59.226234l-52.90764 0z" fillRule="evenodd"/>
              </g>
            </svg>
          </div>
          <h1 className="font-display font-bold text-xl sm:text-2xl tracking-tight">
            <span className="text-white">dsp</span><span className="text-[rgb(214,251,65)]">coder.com</span>
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button onClick={() => handleNavClick(() => window.scrollTo(0, 0))} className="nav-link group flex flex-col">
            <span className="font-medium text-gray-300 hover:text-white transition-colors">Home</span>
            <span className="nav-indicator group-hover:w-full"></span>
          </button>
          <button onClick={() => handleNavClick(onNavigateFeatures)} className="nav-link group flex flex-col">
            <span className="font-medium text-gray-300 hover:text-white transition-colors">Features</span>
            <span className="nav-indicator group-hover:w-full"></span>
          </button>
          <button onClick={() => handleNavClick(onNavigateProblems)} className="nav-link group flex flex-col">
            <span className="font-medium text-gray-300 hover:text-white transition-colors">Problems</span>
            <span className="nav-indicator group-hover:w-full"></span>
          </button>
          <a 
            href="#" 
            className="ml-2 px-4 py-2 bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)] rounded-lg text-sm text-black font-bold transition-all inline-flex items-center gap-2 shadow-[0_0_15px_rgba(214,251,65,0.5)] hover:shadow-[0_0_20px_rgba(214,251,65,0.7)] border border-[rgb(224,255,75)]"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Login with GitHub
          </a>

        </nav>
        
        <button 
          className="md:hidden text-gray-300 focus:outline-none" 
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
            className="text-gray-300 hover:text-white py-2 border-b border-gray-700/30"
          >
            Home
          </button>
          <button 
            onClick={() => handleNavClick(onNavigateFeatures)} 
            className="text-gray-300 hover:text-white py-2 border-b border-gray-700/30"
          >
            Features
          </button>
          <button 
            onClick={() => handleNavClick(onNavigateProblems)} 
            className="text-gray-300 hover:text-white py-2 border-b border-gray-700/30"
          >
            Problems
          </button>
          <a 
            href="#"
            className="text-black py-2 font-bold flex items-center gap-2 mt-2 rounded-lg bg-[rgb(214,251,65)] shadow-[0_0_15px_rgba(214,251,65,0.5)] border border-[rgb(224,255,75)]"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="22" 
              height="22" 
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-2"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="ml-1 mr-2">Login with GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
