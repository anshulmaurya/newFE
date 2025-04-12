import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, LogOut, Moon, Sun, User, Settings, Bell, Clock, BarChart3 } from "lucide-react";
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
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

export default function Header({ onNavigateFeatures, onNavigateProblems, isScrolled = false, darkMode = false, toggleDarkMode }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Interview");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location, setLocation] = useLocation();
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
  
  // Handle click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown');
      const avatarButton = document.getElementById('user-avatar-button');
      
      if (dropdown && !dropdown.classList.contains('hidden') && 
          avatarButton && !avatarButton.contains(event.target as Node) && 
          !dropdown.contains(event.target as Node)) {
        dropdown.classList.add('hidden');
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
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
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setLocation("/")} 
            className="flex items-center gap-2 focus:outline-none"
            aria-label="Go to home page"
          >
            <div className="h-5 w-5 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left curly brace */}
                <path d="M30 20C24 20 20 25 20 32V40C20 46 16 48 10 48C16 48 20 50 20 56V64C20 71 24 76 30 76" stroke="#d6fb41" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                
                {/* Right curly brace */}
                <path d="M70 20C76 20 80 25 80 32V40C80 46 84 48 90 48C84 48 80 50 80 56V64C80 71 76 76 70 76" stroke="#d6fb41" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                
                {/* Forward slash in the middle */}
                <path d="M50 20L50 80" stroke="#d6fb41" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" transform="rotate(15 50 50)"/>
              </svg>
            </div>
            <h1 className="font-display font-bold text-xl tracking-tight">
              <span className="text-white">dsp</span><span className="text-[rgb(214,251,65)]">coder.com</span>
            </h1>
          </button>
          
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
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              navigateToNotes();
            }} 
            className="nav-link group px-2 py-1"
            type="button"
          >
            <span className={`font-medium text-sm ${location.includes("/notes") ? "text-[rgb(214,251,65)]" : "text-gray-300 hover:text-white"} transition-colors`}>Notes</span>
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              setLocation("/dashboard");
            }} 
            className="nav-link group px-2 py-1"
            type="button"
          >
            <span className={`font-medium text-sm ${location.includes("/dashboard") ? "text-[rgb(214,251,65)]" : "text-gray-300 hover:text-white"} transition-colors`}>Problems</span>
          </button>
          
          
          {user ? (
            <div className="relative ml-2">
              <button
                id="user-avatar-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  document.getElementById('user-dropdown')?.classList.toggle('hidden');
                }}
                className="rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[rgb(214,251,65)] focus:ring-offset-2 focus:ring-offset-background"
                onMouseDown={(e) => e.preventDefault()}
              >
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
              
              <div id="user-dropdown" className="hidden absolute right-0 mt-2 w-64 bg-[rgb(20,22,30)] border border-[rgb(30,32,40)] rounded-md shadow-lg z-50 text-white overflow-hidden">
                <div className="flex flex-col items-center justify-center py-6 px-4 border-b border-[rgb(30,32,40)]">
                  <Avatar className="h-16 w-16 border-2 border-[rgb(214,251,65)] mb-3">
                    <AvatarImage 
                      src={user.avatarUrl || "https://github.com/identicons/app/oauth_app/1234"} 
                      alt={user.username || "User"}
                    />
                    <AvatarFallback className="bg-[rgb(36,36,38)] text-[rgb(214,251,65)]">
                      {user.username ? user.username.substring(0, 2).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-base font-medium text-white">
                    {user.displayName || user.username || "User"}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {user.email && !user.email.includes("@example.com") ? user.email : ""}
                  </p>
                </div>

                <div className="p-1">
                  <button 
                    className="flex w-full items-center py-3 px-3 focus:bg-[rgb(30,32,40)] text-white hover:bg-[rgb(30,32,40)] rounded-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setLocation("/user-statistics");
                    }}
                  >
                    <div className="flex items-center">
                      <BarChart3 className="mr-3 h-5 w-5 text-[rgb(214,251,65)]" />
                      <span>My Statistics</span>
                    </div>
                  </button>
                  
                  <div className="cursor-not-allowed flex items-center justify-between py-3 px-3 focus:bg-[rgb(30,32,40)] text-gray-300">
                    <div className="flex items-center">
                      <User className="mr-3 h-5 w-5 text-gray-500" />
                      <span>Profile</span>
                    </div>
                    <Clock className="h-4 w-4 text-gray-500" />
                  </div>
                  
                  <div className="cursor-not-allowed flex items-center justify-between py-3 px-3 focus:bg-[rgb(30,32,40)] text-gray-300">
                    <div className="flex items-center">
                      <Settings className="mr-3 h-5 w-5 text-gray-500" />
                      <span>Settings</span>
                    </div>
                    <Clock className="h-4 w-4 text-gray-500" />
                  </div>
                  
                  <div className="cursor-not-allowed flex items-center justify-between py-3 px-3 focus:bg-[rgb(30,32,40)] text-gray-300">
                    <div className="flex items-center">
                      <Bell className="mr-3 h-5 w-5 text-gray-500" />
                      <span>Notifications</span>
                    </div>
                    <Clock className="h-4 w-4 text-gray-500" />
                  </div>
                  
                  <div className="my-2 p-3 border border-[rgb(30,35,45)] rounded-md bg-[rgb(18,20,28)] text-center text-sm text-gray-400">
                    Additional features are currently in development and will be available soon.
                  </div>
                </div>
                
                <div className="border-t border-[rgb(30,32,40)] my-1"></div>
                
                <div className="p-1">
                  <button 
                    className="cursor-pointer w-full text-red-400 flex items-center py-3 px-3 focus:bg-[rgb(30,32,40)] hover:bg-[rgb(30,32,40)] rounded-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      logoutMutation.mutate();
                    }}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
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
          onClick={(e) => {
            e.preventDefault();
            toggleMobileMenu();
          }}
          type="button"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden glass absolute w-full z-20 py-4 px-4 ${mobileMenuOpen ? 'block' : 'hidden'} bg-[rgb(24,24,26)]`}>
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

          {/* Dark mode toggle removed */}
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              navigateToNotes();
            }}
            type="button"
            className={`${location.includes("/notes") ? "text-[rgb(214,251,65)]" : "text-gray-300 hover:text-white"} py-1.5 border-b border-gray-700/30 text-sm`}
          >
            Notes
          </button>
          <button 
            onClick={(e) => { 
              e.preventDefault();
              setMobileMenuOpen(false); 
              setLocation("/dashboard"); 
            }}
            type="button" 
            className={`${location.includes("/dashboard") ? "text-[rgb(214,251,65)]" : "text-gray-300 hover:text-white"} py-1.5 border-b border-gray-700/30 text-sm`}
          >
            Problems
          </button>

          <button 
            onClick={(e) => { 
              e.preventDefault();
              setMobileMenuOpen(false); 
              setLocation("/user-statistics"); 
            }}
            type="button"
            className={`${location.includes("/user-statistics") ? "text-[rgb(214,251,65)]" : "text-gray-300 hover:text-white"} py-1.5 border-b border-gray-700/30 text-sm flex items-center`}
          >
            <BarChart3 className="h-4 w-4 mr-2 text-[rgb(214,251,65)]" />
            My Statistics
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
                  <span className="text-sm font-medium text-white">{user.displayName || user.username}</span>
                  <span className="text-xs text-gray-400 truncate">{user.email && !user.email.includes("@example.com") ? user.email : ""}</span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  logoutMutation.mutate();
                }}
                className="text-red-400 py-1.5 font-medium flex items-center gap-2 text-sm"
                type="button"
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
