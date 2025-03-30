import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { SiGithub } from "react-icons/si";

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
  const { user, logoutMutation } = useAuth();

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${headerBackground} border-b border-gray-800/50`}>
      <div className="container mx-auto px-4 py-0.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 flex items-center justify-center">
            <svg version="1.1" viewBox="0.0 0.0 100.0 100.0" fill="none" stroke="none" strokeLinecap="square" strokeMiterlimit="10" width="20" height="20">
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
          <h1 className="font-display font-bold text-xl tracking-tight">
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
          <button onClick={() => setLocation("/dashboard")} className="nav-link group px-2 py-1">
            <span className="font-medium text-sm text-gray-300 hover:text-white transition-colors">Problems</span>
          </button>
          {/* Discord button removed as requested */}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-2 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[rgb(214,251,65)] focus:ring-offset-2 focus:ring-offset-background">
                  <Avatar className="h-8 w-8 border-2 border-[rgb(214,251,65)]">
                    <AvatarImage 
                      src={user.avatarUrl || "https://github.com/identicons/app/oauth_app/1234"} 
                      alt={user.username || "User"}
                    />
                    <AvatarFallback className="bg-[rgb(36,36,38)] text-[rgb(214,251,65)]">
                      {user.username ? user.username.substring(0, 2).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[rgb(36,36,38)] border-[rgb(46,46,48)] text-white">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email || "GitHub User"}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-[rgb(46,46,48)]" />
                <DropdownMenuItem 
                  className="cursor-pointer focus:bg-[rgb(46,46,48)] focus:text-[rgb(214,251,65)]"
                  onClick={() => setLocation("/dashboard")}
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer focus:bg-[rgb(46,46,48)] focus:text-[rgb(214,251,65)]"
                  onClick={() => setLocation("/notes")}
                >
                  My Notes
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[rgb(46,46,48)]" />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-400 focus:bg-[rgb(46,46,48)] focus:text-red-400"
                  onClick={() => logoutMutation.mutate()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <a 
              href="/api/auth/github" 
              className="ml-2 px-3 py-1 bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)] rounded-md text-xs text-black font-bold transition-all inline-flex items-center gap-1 shadow-[0_0_10px_rgba(214,251,65,0.4)] hover:shadow-[0_0_15px_rgba(214,251,65,0.6)] border border-[rgb(224,255,75)]"
            >
              <SiGithub className="h-3 w-3" />
              Login with GitHub
            </a>
          )}

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
            onClick={() => { setMobileMenuOpen(false); setLocation("/dashboard"); }} 
            className="text-gray-300 hover:text-white py-1.5 border-b border-gray-700/30 text-sm"
          >
            Problems
          </button>
          {/* User profile or login button */}
          {user ? (
            <>
              <div className="flex items-center gap-3 py-1.5 border-b border-gray-700/30">
                <Avatar className="h-8 w-8 border-2 border-[rgb(214,251,65)]">
                  <AvatarImage 
                    src={user.avatarUrl || "https://github.com/identicons/app/oauth_app/1234"} 
                    alt={user.username || "User"}
                  />
                  <AvatarFallback className="bg-[rgb(36,36,38)] text-[rgb(214,251,65)]">
                    {user.username ? user.username.substring(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">{user.username}</span>
                  <span className="text-xs text-gray-400 truncate">{user.email || "GitHub User"}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  logoutMutation.mutate();
                }}
                className="text-red-400 py-1.5 font-medium flex items-center gap-2 text-sm"
              >
                <LogOut className="ml-2 h-4 w-4" />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <a 
              href="/api/auth/github"
              className="text-black py-1.5 font-bold flex items-center gap-2 mt-1 rounded-md bg-[rgb(214,251,65)] shadow-[0_0_10px_rgba(214,251,65,0.4)] border border-[rgb(224,255,75)] text-sm"
            >
              <SiGithub className="h-4 w-4 ml-2" />
              <span className="ml-1 mr-2">Login with GitHub</span>
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
