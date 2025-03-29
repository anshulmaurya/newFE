import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";

interface HeaderProps {
  onNavigateFeatures: () => void;
  onNavigateProblems: () => void;
  isScrolled?: boolean;
}

export default function Header({ onNavigateFeatures, onNavigateProblems, isScrolled = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Interview");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);

  // Add scroll listener for header background opacity if not provided via props
  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener("scroll", updatePosition);
    updatePosition();
    
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setDropdownOpen(false);
    
    // Navigate to coming-soon page if Project is selected
    if (option === "Project") {
      setLocation("/coming-soon");
    }
  };

  const handleNavClick = (callback: () => void) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    callback();
  };
  
  const navigateToNotes = () => {
    setLocation("/notes");
  };

  const headerBackground = scrollPosition > 10 || isScrolled 
    ? "bg-[rgb(24,24,26)]" 
    : "bg-[rgb(24,24,26)]/90 backdrop-blur-sm";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${headerBackground} shadow-md`}>
      <div className="container mx-auto px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 flex items-center justify-center">
            <svg version="1.1" viewBox="0.0 0.0 100.0 100.0" fill="none" stroke="none" strokeLinecap="square" strokeMiterlimit="10" width="28" height="28">
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
          <h1 className="font-display font-bold text-base tracking-tight">
            <span className="text-white">dsp</span><span className="text-[rgb(214,251,65)]">coder.com</span>
          </h1>
          
          {/* Vertical Separator */}
          <div className="h-5 border-l border-gray-600 mx-2"></div>
          
          {/* Dropdown */}
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors py-1 px-2 rounded focus:outline-none"
            >
              <span className="text-sm">{selectedOption}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-[rgb(36,36,38)] rounded-md shadow-lg overflow-hidden z-20">
                <button 
                  onClick={() => handleOptionSelect("Interview")}
                  className={`block w-full text-left px-4 py-2 text-sm ${selectedOption === "Interview" ? "bg-[rgb(214,251,65)]/10 text-[rgb(214,251,65)]" : "text-gray-300 hover:bg-[rgb(40,40,42)]"}`}
                >
                  Interview
                </button>
                <button 
                  onClick={() => handleOptionSelect("Project")}
                  className={`block w-full text-left px-4 py-2 text-sm ${selectedOption === "Project" ? "bg-[rgb(214,251,65)]/10 text-[rgb(214,251,65)]" : "text-gray-300 hover:bg-[rgb(40,40,42)]"}`}
                >
                  Project
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-3">
          <button onClick={() => handleNavClick(() => window.scrollTo(0, 0))} className="nav-link group px-2 py-1">
            <span className="font-medium text-sm text-gray-300 hover:text-white transition-colors">Home</span>
          </button>
          <button onClick={() => navigateToNotes()} className="nav-link group px-2 py-1">
            <span className="font-medium text-sm text-gray-300 hover:text-white transition-colors">Notes</span>
          </button>
          <button onClick={() => handleNavClick(onNavigateProblems)} className="nav-link group px-2 py-1">
            <span className="font-medium text-sm text-gray-300 hover:text-white transition-colors">Problems</span>
          </button>
          <a 
            href="https://discord.gg/HxAqXd8Xwt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-1 bg-[#5865F2] hover:bg-[#4752C4] rounded-md text-xs text-white font-bold transition-all inline-flex items-center gap-1 shadow-[0_0_10px_rgba(88,101,242,0.4)] hover:shadow-[0_0_15px_rgba(88,101,242,0.6)] border border-[#454FBF]"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="12" 
              height="12" 
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/>
            </svg>
            Join Discord
          </a>
          
          <a 
            href="/api/auth/github" 
            className="ml-2 px-3 py-1 bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)] rounded-md text-xs text-black font-bold transition-all inline-flex items-center gap-1 shadow-[0_0_10px_rgba(214,251,65,0.4)] hover:shadow-[0_0_15px_rgba(214,251,65,0.6)] border border-[rgb(224,255,75)]"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="12" 
              height="12" 
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
      <div className={`md:hidden glass absolute w-full z-20 py-3 px-4 ${mobileMenuOpen ? 'block' : 'hidden'} bg-[rgb(24,24,26)]`}>
        <nav className="flex flex-col space-y-3">
          <div className="flex flex-col space-y-1.5 mb-2">
            <p className="text-xs text-gray-500">Mode:</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleOptionSelect("Interview")}
                className={`px-3 py-1 text-xs rounded ${selectedOption === "Interview" ? "bg-[rgb(214,251,65)] text-black" : "bg-[rgb(36,36,38)] text-gray-300"}`}
              >
                Interview
              </button>
              <button
                onClick={() => handleOptionSelect("Project")}
                className={`px-3 py-1 text-xs rounded ${selectedOption === "Project" ? "bg-[rgb(214,251,65)] text-black" : "bg-[rgb(36,36,38)] text-gray-300"}`}
              >
                Project
              </button>
            </div>
          </div>
          <button 
            onClick={() => handleNavClick(() => window.scrollTo(0, 0))} 
            className="text-gray-300 hover:text-white py-1.5 border-b border-gray-700/30 text-sm"
          >
            Home
          </button>
          <button 
            onClick={() => navigateToNotes()}
            className="text-gray-300 hover:text-white py-1.5 border-b border-gray-700/30 text-sm"
          >
            Notes
          </button>
          <button 
            onClick={() => handleNavClick(onNavigateProblems)} 
            className="text-gray-300 hover:text-white py-1.5 border-b border-gray-700/30 text-sm"
          >
            Problems
          </button>
          <a 
            href="https://discord.gg/HxAqXd8Xwt" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white py-1.5 font-bold flex items-center gap-2 mt-1 rounded-md bg-[#5865F2] shadow-[0_0_10px_rgba(88,101,242,0.4)] border border-[#454FBF] text-sm"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-2"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/>
            </svg>
            <span className="ml-1 mr-2">Join Discord</span>
          </a>
          
          <a 
            href="/api/auth/github"
            className="text-black py-1.5 font-bold flex items-center gap-2 mt-1 rounded-md bg-[rgb(214,251,65)] shadow-[0_0_10px_rgba(214,251,65,0.4)] border border-[rgb(224,255,75)] text-sm"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
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
