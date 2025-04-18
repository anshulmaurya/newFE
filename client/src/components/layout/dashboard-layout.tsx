import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { ChevronDown, ChevronRight, Search, Code, Zap, Database, FileCode, Grid3X3, LayoutGrid, BookOpen, Briefcase, Box, ListChecks } from 'lucide-react';
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
  expandable?: boolean;
  subsections: Subsection[];
}

// Define dashboard sections and their subsections
const dashboardTopics: TopicSection[] = [
  { 
    id: "problems", 
    label: "Problems",
    subsections: [
      {
        id: "all-problems",
        label: "All Problems",
        icon: <ListChecks className="h-4 w-4 mr-2" />,
        path: "/dashboard",
      }
    ]
  },
  { 
    id: "quick-prep", 
    label: "Quick Prep Bundles",
    category: true,
    subsections: [
      {
        id: "three-months",
        label: "3 Months",
        icon: <Zap className="h-4 w-4 mr-2" />,
        path: "/dashboard/quick-prep/three-months",
      },
      {
        id: "one-month",
        label: "1 Month",
        icon: <Zap className="h-4 w-4 mr-2" />,
        path: "/dashboard/quick-prep/one-month",
      },
      {
        id: "one-week",
        label: "1 Week",
        icon: <Zap className="h-4 w-4 mr-2" />,
        path: "/dashboard/quick-prep/one-week",
      }
    ]
  },
  { 
    id: "company-bundles", 
    label: "Company Bundles",
    category: true,
    subsections: [
      {
        id: "apple",
        label: "Apple",
        icon: <Briefcase className="h-4 w-4 mr-2" />,
        path: "/dashboard/company/apple",
      },
      {
        id: "nvidia",
        label: "Nvidia",
        icon: <Briefcase className="h-4 w-4 mr-2" />,
        path: "/dashboard/company/nvidia",
      },
      {
        id: "tesla",
        label: "Tesla",
        icon: <Briefcase className="h-4 w-4 mr-2" />,
        path: "/dashboard/company/tesla",
      }
    ]
  }
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleTheme: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, darkMode, toggleTheme }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedSubsection, setSelectedSubsection] = useState<string>("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [location, setLocation] = useLocation();
  const currentPath = location;

  // Determine theme classes
  const themeClasses = darkMode 
    ? {
        bg: "bg-[rgb(12,12,14)]",
        text: "text-gray-300",
        textDark: "text-gray-500",
        sidebarBg: "bg-[rgb(18,18,20)]",
        borderColor: "border-gray-800",
        menuBg: "bg-[rgb(14,14,16)]",
        card: "bg-[rgb(18,18,20)] border-gray-800",
        activeItem: "bg-[rgb(24,24,27)] text-[rgb(214,251,65)]",
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
        activeItem: "bg-[rgb(24,24,27)] text-[rgb(214,251,65)]",
        infoBlock: "bg-blue-50 border-blue-200",
        infoText: "text-gray-600"
      };

  useEffect(() => {
    // Auto-expand sections based on current path
    // Initialize expanded sections
    let newExpandedSections: Record<string, boolean> = { ...expandedSections };
    
    // Check if currentPath matches any subsection paths and expand their parent sections
    dashboardTopics.forEach(topic => {
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
        <div className={`w-56 ${themeClasses.sidebarBg} p-4 flex flex-col border-r-0 shadow-md z-10 fixed left-0 bottom-0 top-14`}>
          <div className="space-y-2 mt-2">
            <div>
              <nav className="space-y-1.5">
                {dashboardTopics.map(topic => (
                  <div key={topic.id} className="mb-6">
                    {!topic.category && topic.subsections && topic.subsections.map((section) => {
                      const active = currentPath === section.path;
                      
                      return (
                        <div key={section.id} className="mb-1.5">
                          <div
                            className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium cursor-pointer transition-colors ${
                              active
                                ? themeClasses.activeItem
                                : `${darkMode ? 'hover:bg-[rgb(40,40,44)]' : 'hover:bg-gray-100'}`
                            }`}
                            onClick={() => handleNavClick(() => section.path && setLocation(section.path))}
                          >
                            <div className="flex items-center">
                              {section.icon}
                              <span>{section.label}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Category with items */}
                    {topic.category && (
                      <>
                        <div className={`text-xs font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'} mb-2 ml-1 uppercase tracking-wider`}>
                          {topic.label}
                        </div>
                        <div className="space-y-1">
                          {topic.subsections && topic.subsections.map((section) => {
                            const active = currentPath === section.path;
                            
                            return (
                              <div
                                key={section.id}
                                className={`flex items-center rounded-md px-2 py-1.5 text-sm font-medium cursor-pointer transition-colors ${
                                  active
                                    ? themeClasses.activeItem
                                    : `${darkMode ? 'hover:bg-[rgb(40,40,44)]' : 'hover:bg-gray-100'}`
                                }`}
                                onClick={() => handleNavClick(() => section.path && setLocation(section.path))}
                              >
                                <div className="flex items-center">
                                  {section.icon}
                                  <span>{section.label}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content - Adding ml-56 to create space for the fixed sidebar */}
        <div className="flex-1 overflow-y-auto px-0 py-4 ml-56 scrollable-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;