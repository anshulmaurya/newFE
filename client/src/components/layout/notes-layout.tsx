import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search, Zap, FileCode, Database, Code, LayoutGrid, Grid3X3, ChevronDown, ChevronRight } from 'lucide-react';
import Header from './header';

interface Subsection {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path: string;
  expandable?: boolean;
  subsections?: Subsection[];
}

interface TopicSection {
  id: string;
  label: string;
  category?: boolean;
  icon?: React.ReactNode;
  path?: string;
  subsections: Subsection[];
}

// Define topic sections and their subsections - new structure matching the design
const notesTopics: TopicSection[] = [
  { 
    id: "getting-started", 
    label: "Get started",
    subsections: [
      {
        id: "getting-started-main",
        label: "Get started",
        icon: <Zap className="h-4 w-4 mr-2" />,
        path: "/notes/getting-started",
      }
    ]
  },
  { 
    id: "multithreading", 
    label: "Multithreading",
    subsections: [
      {
        id: "multithreading-main",
        label: "Multithreading",
        icon: <FileCode className="h-4 w-4 mr-2" />,
        path: "/notes/multithreading",
        expandable: true,
        subsections: [
          { id: "introduction", label: "Introduction", icon: <LayoutGrid className="h-4 w-4 mr-2" />, path: "/notes/multithreading/introduction" },
          { id: "key-concepts", label: "Key Concepts", icon: <Grid3X3 className="h-4 w-4 mr-2" />, path: "/notes/multithreading/key-concepts" },
          { id: "interview-tips", label: "Interview Tips", icon: <Code className="h-4 w-4 mr-2" />, path: "/notes/multithreading/interview-tips" }
        ]
      }
    ]
  }
];

interface NotesLayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleTheme: () => void;
}

const NotesLayout: React.FC<NotesLayoutProps> = ({ children, darkMode, toggleTheme }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedSubsection, setSelectedSubsection] = useState<string>("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [location, setLocation] = useLocation();
  const currentPath = location;

  // Determine theme classes
  const themeClasses = darkMode 
    ? {
        bg: "bg-[rgb(10,10,14)]",
        text: "text-gray-300",
        textDark: "text-gray-500",
        sidebarBg: "bg-[rgb(20,20,25)]",
        borderColor: "border-gray-800",
        menuBg: "bg-[rgb(24,24,26)]",
        card: "bg-[rgb(30,30,34)] border-gray-800",
        activeItem: "bg-lime-600 text-white",
        infoBlock: "bg-[rgb(35,35,50)] border-blue-800",
        infoText: "text-gray-300"
      }
    : {
        bg: "bg-white",
        text: "text-gray-600",
        textDark: "text-gray-400",
        sidebarBg: "bg-gray-50",
        borderColor: "border-gray-200",
        menuBg: "bg-white",
        card: "bg-white border-gray-200",
        activeItem: "bg-lime-500 text-white",
        infoBlock: "bg-blue-50 border-blue-200",
        infoText: "text-gray-600"
      };

  useEffect(() => {
    // Auto-expand sections based on current path
    // Initialize expanded sections
    let newExpandedSections: Record<string, boolean> = { ...expandedSections };
    
    // Check if currentPath matches any subsection paths and expand their parent sections
    notesTopics.forEach(topic => {
      topic.subsections.forEach(section => {
        if (section.subsections) {
          section.subsections.forEach(subsection => {
            if (currentPath === subsection.path) {
              newExpandedSections[section.id] = true;
              setSelectedSubsection(subsection.id);
              setSelectedTopic(topic.id);
            }
          });
        }
        
        if (currentPath === section.path) {
          setSelectedTopic(topic.id);
          if (section.expandable && section.subsections) {
            newExpandedSections[section.id] = true;
          }
        }
      });
    });
    
    setExpandedSections(newExpandedSections);
  }, [currentPath]);

  // Add scroll listener for header background opacity
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

  const handleNavClick = (callback: () => void) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    callback();
  };

  const navigateToFeatures = () => {
    setLocation("/#features");
  };
  
  const navigateToProblems = () => {
    setLocation("/dashboard");
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections({
      ...expandedSections,
      [sectionId]: !expandedSections[sectionId]
    });
  };

  return (
    <div className={`flex flex-col h-full ${themeClasses.bg} ${themeClasses.text} transition-colors duration-200 app-container`}>
      <Header 
        onNavigateFeatures={navigateToFeatures} 
        onNavigateProblems={navigateToProblems}
        isScrolled={scrollPosition > 10}
        darkMode={darkMode}
        toggleDarkMode={toggleTheme}
      />

      <div className="flex flex-grow pt-14 scrollable-content"> {/* Adjusted padding-top to prevent navbar overlap without gap */}
        {/* Sidebar */}
        <div className={`w-64 ${themeClasses.sidebarBg} p-4 flex flex-col border-r-0 shadow-md z-10`}>
          <div className="relative mb-3">
            <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search docs..."
              className={`w-full pl-8 pr-3 py-2 rounded-md border ${themeClasses.borderColor} text-sm ${darkMode ? 'bg-[rgb(36,36,38)] text-gray-200' : 'bg-white text-gray-800'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div>
              <nav className="space-y-1.5">
                {notesTopics.map(topic => (
                  <div key={topic.id} className="mb-6">
                    {/* Category Header */}
                    {topic.category && (
                      <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2 pl-1.5`}>
                        {topic.label}
                      </div>
                    )}
                    
                    {/* Main items */}
                    {topic.subsections && topic.subsections.map((section) => {
                      const isExpanded = expandedSections[section.id] || false;
                      const active = selectedTopic === topic.id && (!section.subsections || !selectedSubsection);
                      const hasMatchingSubsections = section.subsections && section.subsections.some(
                        subsection => subsection.path.includes(searchQuery.toLowerCase())
                      );
                      
                      // Skip if doesn't match search
                      if (searchQuery && !section.label.toLowerCase().includes(searchQuery.toLowerCase()) && !hasMatchingSubsections) {
                        return null;
                      }
                      
                      return (
                        <div key={section.id} className="mb-1.5">
                          <div
                            className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium cursor-pointer transition-colors ${
                              active
                                ? themeClasses.activeItem
                                : `${darkMode ? 'hover:bg-[rgb(40,40,44)]' : 'hover:bg-gray-100'}`
                            }`}
                            onClick={() => {
                              if (section.expandable && section.subsections) {
                                toggleSection(section.id);
                              } else {
                                handleNavClick(() => section.path && setLocation(section.path));
                              }
                            }}
                          >
                            <div className="flex items-center">
                              {section.icon}
                              <span>{section.label}</span>
                            </div>
                            {section.expandable && section.subsections && (
                              <div className="flex items-center">
                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </div>
                            )}
                          </div>
                          
                          {/* Nested subsections */}
                          {section.expandable && section.subsections && isExpanded && (
                            <div className="ml-4 pl-2 border-l space-y-1 mt-1">
                              {section.subsections.map(subsection => {
                                const subActive = selectedSubsection === subsection.id;
                                
                                // Skip if doesn't match search
                                if (searchQuery && !subsection.label.toLowerCase().includes(searchQuery.toLowerCase())) {
                                  return null;
                                }
                                
                                return (
                                  <div
                                    key={subsection.id}
                                    className={`flex items-center rounded-md px-2 py-1.5 text-sm font-medium cursor-pointer transition-colors ${
                                      subActive
                                        ? themeClasses.activeItem
                                        : `${darkMode ? 'hover:bg-[rgb(40,40,44)]' : 'hover:bg-gray-100'}`
                                    }`}
                                    onClick={() => {
                                      handleNavClick(() => {
                                        setSelectedSubsection(subsection.id);
                                        subsection.path && setLocation(subsection.path);
                                      });
                                    }}
                                  >
                                    {subsection.icon}
                                    <span>{subsection.label}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 md:px-8 scrollable-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default NotesLayout;