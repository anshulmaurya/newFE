import { useState, useEffect } from "react";
import { Search, Moon, Sun, ChevronDown, Menu, X, BookOpen, Code, Database, FileText, Zap, Upload, GitBranch, Pencil, Grid3X3, Puzzle, Link as LinkIcon, Search as SearchIcon, Terminal, FileCode, FileBox, LayoutGrid, Globe, BookText, Lightbulb, CheckCircle } from "lucide-react";
import { useLocation, Link } from "wouter";
import Header from "@/components/layout/header";

interface Subsection {
  id: string;
  label: string;
  path?: string; // Make path optional
  icon?: React.ReactNode;
  active?: boolean;
  expandable?: boolean;
  expanded?: boolean;
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
  },
  { 
    id: "data-structures", 
    label: "Data Structures",
    subsections: [
      {
        id: "data-structures-main",
        label: "Data Structures",
        icon: <Database className="h-4 w-4 mr-2" />,
        path: "/notes/data-structures",
        expandable: true,
        subsections: [
          { id: "spi", label: "SPI Protocol", path: "/notes/guides/spi" },
          { id: "i2c", label: "I2C Protocol", path: "/notes/guides/i2c" },
          { id: "uart", label: "UART Protocol", path: "/notes/guides/uart" },
          { id: "linked-list", label: "Linked List", path: "/notes/guides/linked-list" },
          { id: "array", label: "Array", path: "/notes/guides/array" },
          { id: "string", label: "String", path: "/notes/guides/string" }
        ]
      }
    ]
  }
];

export default function Notes() {
  const [selectedTopic, setSelectedTopic] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [location, setLocation] = useLocation();
  const [currentPath] = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    "multithreading-main": false,
    "data-structures-main": false
  });
  
  // Update selected topic based on current path
  useEffect(() => {
    // If path is exactly /notes, redirect to getting-started
    if (currentPath === "/notes") {
      setLocation("/notes/getting-started");
      return;
    }
    
    // Find the topic that matches the current path
    const currentTopic = notesTopics.find(topic => 
      currentPath === topic.path || currentPath.startsWith(`${topic.path}/`)
    );
    
    if (currentTopic) {
      setSelectedTopic(currentTopic.id);
    }
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

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (callback: () => void) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    callback();
  };

  const headerBackground = scrollPosition > 10
    ? "bg-[rgb(24,24,26)]" 
    : "bg-[rgb(24,24,26)]/90 backdrop-blur-sm";

  // Determine theme classes
  const themeClasses = darkMode 
    ? {
        bg: "bg-[rgb(10,10,14)]",
        text: "text-gray-300",
        textDark: "text-gray-500",
        sidebarBg: "bg-[rgb(20,20,25)]",
        borderColor: "border-gray-800",
        highlight: "bg-[rgb(214,251,65)]/20",
        codeBlock: "bg-gray-900 text-gray-100",
        infoBlock: "bg-[rgb(40,50,70)] border-[rgb(60,130,210)]",
        infoText: "text-blue-300",
        infoTextDark: "text-blue-400",
        card: "bg-[rgb(25,25,30)] border-gray-800 hover:bg-[rgb(35,35,40)]",
        activeItem: "bg-[rgb(44,46,50)]"
      }
    : {
        bg: "bg-white",
        text: "text-gray-700",
        textDark: "text-gray-500",
        sidebarBg: "bg-[rgb(252,252,252)]",
        borderColor: "border-gray-200",
        highlight: "bg-[rgb(214,251,65)]/20",
        codeBlock: "bg-gray-900 text-gray-100",
        infoBlock: "bg-blue-50 border-blue-400",
        infoText: "text-blue-700",
        infoTextDark: "text-blue-800",
        card: "bg-gray-50 border-gray-200 hover:bg-gray-100",
        activeItem: "bg-[rgb(248,248,250)]"
      };

  const navigateToFeatures = () => {
    setLocation("/#features");
  };
  
  const navigateToProblems = () => {
    setLocation("/dashboard");
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
                      const isActive = currentPath === section.path;
                      const hasSubsections = section.subsections && section.subsections.length > 0;
                      
                      return (
                        <div key={section.id} className="mb-1">
                          <div 
                            onClick={() => {
                              // If it has subsections and is not expanded, expand it
                              if ((hasSubsections || section.expandable) && !isExpanded) {
                                setExpandedSections(prev => ({
                                  ...prev,
                                  [section.id]: true
                                }));
                              }
                              // Always navigate if there's a path
                              if (section.path) {
                                setLocation(section.path);
                              }
                            }}
                            className={`flex items-center w-full text-left px-3 py-1.5 rounded-md text-sm cursor-pointer ${
                              isActive 
                                ? `${themeClasses.activeItem} ${darkMode ? 'text-white' : 'text-gray-900'} font-medium` 
                                : `${darkMode ? 'text-gray-300 hover:bg-[rgb(35,35,40)]' : 'text-gray-600 hover:bg-gray-200'}`
                            }`}
                          >
                            {section.icon}
                            <span>{section.label}</span>
                            {(hasSubsections || section.expandable) && (
                              <ChevronDown 
                                className={`h-4 w-4 ml-auto transform transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : ''}`} 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedSections(prev => ({
                                    ...prev,
                                    [section.id]: !isExpanded
                                  }));
                                }}
                              />
                            )}
                          </div>
                          
                          {/* Section subsections */}
                          <div 
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              hasSubsections && isExpanded 
                                ? 'max-h-[500px] opacity-100 mt-1' 
                                : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="py-1 ml-9 space-y-1">
                              {section.subsections && section.subsections.map((subsection: Subsection) => (
                                <div
                                  key={subsection.id}
                                  onClick={() => subsection.path && setLocation(subsection.path)}
                                  className={`block text-sm py-1 px-3 rounded-md cursor-pointer ${
                                    currentPath === subsection.path
                                      ? `${themeClasses.activeItem} ${darkMode ? 'text-white' : 'text-gray-900'} font-medium`
                                      : darkMode 
                                        ? 'text-gray-400 hover:text-gray-200 hover:bg-[rgb(35,35,40)]' 
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                  }`}
                                >
                                  {subsection.label}
                                </div>
                              ))}
                            </div>
                          </div>
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
        <div className="flex-grow px-6 pb-10 mt-0 overflow-auto">
          <div className="max-w-4xl mx-auto pt-8">
            {currentPath === "/notes" && (
              <>
                <div className="flex items-center mb-1 text-gray-500 text-sm">
                  <span>Docs</span>
                </div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Welcome to DSPCoder Documentation</h1>

                <div className={`prose ${darkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
                  <p className="lead">
                    Explore our comprehensive documentation to master embedded systems programming with DSPCoder.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className={`${themeClasses.card} p-5 border rounded-lg`}>
                      <div className="flex items-center mb-2">
                        <Zap className="h-5 w-5 mr-2 text-lime-500" />
                        <h2 className="text-lg font-semibold m-0">Getting Started</h2>
                      </div>
                      <p className="text-sm mb-3">Learn how to set up your DSPCoder environment and get coding quickly.</p>
                      <button 
                        onClick={() => setLocation("/notes/getting-started")}
                        className="text-xs px-3 py-1.5 rounded-md bg-lime-500 text-black font-medium hover:bg-lime-600 transition-colors"
                      >
                        View Guide
                      </button>
                    </div>

                    <div className={`${themeClasses.card} p-5 border rounded-lg`}>
                      <div className="flex items-center mb-2">
                        <GitBranch className="h-5 w-5 mr-2 text-lime-500" />
                        <h2 className="text-lg font-semibold m-0">Communication Protocols</h2>
                      </div>
                      <p className="text-sm mb-3">Explore common embedded communication protocols like SPI, I2C, and UART.</p>
                      <button 
                        onClick={() => setLocation("/notes/communication-protocols")}
                        className="text-xs px-3 py-1.5 rounded-md bg-lime-500 text-black font-medium hover:bg-lime-600 transition-colors"
                      >
                        Explore Protocols
                      </button>
                    </div>

                    <div className={`${themeClasses.card} p-5 border rounded-lg`}>
                      <div className="flex items-center mb-2">
                        <Database className="h-5 w-5 mr-2 text-lime-500" />
                        <h2 className="text-lg font-semibold m-0">Data Structures</h2>
                      </div>
                      <p className="text-sm mb-3">Learn about efficient data structures for resource-constrained embedded systems.</p>
                      <button 
                        onClick={() => setLocation("/notes/data-structures")}
                        className="text-xs px-3 py-1.5 rounded-md bg-lime-500 text-black font-medium hover:bg-lime-600 transition-colors"
                      >
                        View Data Structures
                      </button>
                    </div>

                    <div className={`${themeClasses.card} p-5 border rounded-lg`}>
                      <div className="flex items-center mb-2">
                        <Code className="h-5 w-5 mr-2 text-lime-500" />
                        <h2 className="text-lg font-semibold m-0">Coding Environment</h2>
                      </div>
                      <p className="text-sm mb-3">Get familiar with our VS Code-based coding environment for solving embedded challenges.</p>
                      <button 
                        onClick={() => setLocation("/coding-environment")}
                        className="text-xs px-3 py-1.5 rounded-md bg-lime-500 text-black font-medium hover:bg-lime-600 transition-colors"
                      >
                        Try Coding Environment
                      </button>
                    </div>
                  </div>

                  <div className={`${themeClasses.infoBlock} p-5 border-l-4 rounded-r my-8`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${themeClasses.infoTextDark}`}>Need Help?</h3>
                        <div className={`text-sm ${themeClasses.infoText}`}>
                          <p>Join our <a href="#" className="underline hover:no-underline">Discord community</a> to connect with other DSPCoder users and get direct support from our team.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {selectedTopic === "getting-started" && (
              <>
                <div className="flex items-center mb-3 text-gray-500 text-sm">
                  <span>Docs</span>
                  <span className="mx-2">›</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-800'}>Getting Started</span>
                </div>
                
                <div className={`prose ${darkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
                  <div className="flex items-center mb-4">
                    <BookOpen className="h-5 w-5 mr-3 text-gray-300" />
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} m-0`}>Embedded Systems Interview Playbook</h1>
                  </div>
                  
                  <p className="lead">
                    The definitive guide to embedded systems interviews. This document will help you navigate our platform and prepare effectively.
                  </p>
                  
                  <h2 id="platform-overview">Platform Overview</h2>
                  <p>
                    dspcoder.com is designed to help you prepare for embedded systems interviews with confidence. 
                    Our platform consists of three main components:
                  </p>
                  
                  <h3 id="notes-section">Notes Section</h3>
                  <p>
                    You're currently in the Notes section. These notes serve as <strong>quick refreshers just before 
                    your interviews</strong>. The content here is structured in easily digestible sections to help you
                    review key concepts quickly without having to search through lengthy textbooks or online tutorials.
                  </p>
                  <p>
                    Use the navigation panel on the left to browse through different topics:
                  </p>
                  <ul>
                    <li><a href="/notes/communication-protocols" className="text-blue-500 hover:underline">Communication Protocols</a> - UART, I2C, SPI, CAN and more</li>
                    <li><a href="/notes/data-structures" className="text-blue-500 hover:underline">Data Structures</a> - Optimized for embedded systems</li>
                    <li><a href="/notes/rtos" className="text-blue-500 hover:underline">Real-Time Operating Systems</a> - FreeRTOS, scheduling and more</li>
                  </ul>
                  
                  <div className={`${themeClasses.infoBlock} p-5 border-l-4 rounded-r my-6`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${themeClasses.infoTextDark}`}>Pro Tip</h3>
                        <div className={`text-sm ${themeClasses.infoText}`}>
                          <p>Bookmark specific notes pages for quick access during your study sessions.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 id="problem-dashboard">Problem Dashboard</h3>
                  <p>
                    The <a href="/dashboard" className="text-blue-500 hover:underline">Problem Dashboard</a> contains practice questions 
                    organized by difficulty, topic, and company. This is where you'll spend most of your time practicing:
                  </p>
                  <ul>
                    <li>200+ expert-reviewed embedded systems questions</li>
                    <li>Categorized by difficulty (Easy, Medium, Hard)</li>
                    <li>Organized by company (for targeted interview preparation)</li>
                    <li>Covers microcontrollers, real-time systems, memory management and more</li>
                  </ul>
                  
                  <h3 id="vs-code-environment">VS Code Environment</h3>
                  <p>
                    When you select a problem from the dashboard, our VS Code-based editor will open automatically. In this environment, you will:
                  </p>
                  
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Fill in your answer in the function provided (no need to write everything from scratch)</li>
                    <li>Run your code against our test cases by clicking the "Run" button</li>
                    <li>Review test results and memory analysis</li>
                    <li>Submit your solution when you're confident</li>
                  </ol>
                  
                  <p className="mt-4">
                    Our system automatically runs test cases against your solution and performs memory analysis 
                    to simulate real-world embedded constraints.
                  </p>
                  
                  <h2 id="getting-started">Getting Started</h2>
                  <p>
                    For best results, follow this study workflow:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Review relevant notes in this section for key concepts</li>
                    <li>Head to the <a href="/dashboard" className="text-blue-500 hover:underline">Problem Dashboard</a> to practice solving questions</li>
                    <li>Use the VS Code environment to implement your solutions</li>
                    <li>Review memory analysis to optimize your code</li>
                  </ol>
                  
                  <p className="mt-6">
                    Consistency is key! Try to solve at least one problem daily to build your embedded systems proficiency.
                  </p>
                </div>
              </>
            )}

            {selectedTopic === "multithreading" && (
              <>
                <div className="flex items-center mb-1 text-gray-500 text-sm">
                  <span>Docs</span>
                  <span className="mx-2">›</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-800'}>Multithreading</span>
                </div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Multithreading in Embedded Systems</h1>

                <div className={`prose ${darkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
                  <p className="lead">
                    Multithreading is a powerful technique for embedded systems that enables concurrent execution of multiple tasks. 
                    This guide covers fundamental concepts, implementation strategies, and common pitfalls in multithreaded embedded applications.
                  </p>

                  <h2 id="multithreading-overview">Multithreading Overview</h2>
                  <p>
                    In embedded systems, multithreading allows a single processor to execute multiple code sequences (threads) quasi-simultaneously by rapidly switching between them.
                    This can significantly improve responsiveness and resource utilization in real-time applications.
                  </p>

                  <div className={`${themeClasses.card} p-4 border rounded-md my-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Key Benefits of Multithreading:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Improved system responsiveness for real-time applications</li>
                      <li>Better resource utilization and throughput</li>
                      <li>Simplified program structure for complex systems</li>
                      <li>Ability to prioritize critical tasks</li>
                      <li>Isolation of system functions for better reliability</li>
                    </ul>
                  </div>

                  <h2 id="threads-vs-processes">Threads vs. Processes</h2>
                  <p>
                    In embedded systems, understanding the distinction between threads and processes is crucial for efficient design:
                  </p>
                  
                  <table className="min-w-full border border-gray-300 my-4">
                    <thead className={darkMode ? "bg-gray-800" : "bg-gray-100"}>
                      <tr>
                        <th className="px-4 py-2 border-b text-left">Characteristic</th>
                        <th className="px-4 py-2 border-b text-left">Threads</th>
                        <th className="px-4 py-2 border-b text-left">Processes</th>
                      </tr>
                    </thead>
                    <tbody className={darkMode ? "bg-gray-900" : "bg-white"}>
                      <tr>
                        <td className="px-4 py-2 border-b">Memory Space</td>
                        <td className="px-4 py-2 border-b">Shared within process</td>
                        <td className="px-4 py-2 border-b">Separate, isolated</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b">Resource Consumption</td>
                        <td className="px-4 py-2 border-b">Lightweight</td>
                        <td className="px-4 py-2 border-b">Heavyweight</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b">Communication</td>
                        <td className="px-4 py-2 border-b">Direct (shared variables)</td>
                        <td className="px-4 py-2 border-b">IPC mechanisms needed</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b">Context Switch Cost</td>
                        <td className="px-4 py-2 border-b">Low</td>
                        <td className="px-4 py-2 border-b">High</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b">Failure Isolation</td>
                        <td className="px-4 py-2 border-b">Poor (thread failure affects process)</td>
                        <td className="px-4 py-2 border-b">Good (process failure is isolated)</td>
                      </tr>
                    </tbody>
                  </table>

                  <p>
                    In resource-constrained embedded systems, threads are often preferred due to their lower overhead,
                    but proper synchronization becomes essential to prevent data corruption and race conditions.
                  </p>

                  <h2 id="common-challenges">Common Multithreading Challenges</h2>
                  <ul>
                    <li><strong>Race Conditions</strong>: When multiple threads access shared data concurrently</li>
                    <li><strong>Deadlocks</strong>: When threads are waiting indefinitely for resources held by each other</li>
                    <li><strong>Priority Inversion</strong>: When a high-priority thread waits for a low-priority thread</li>
                    <li><strong>Resource Contention</strong>: When multiple threads compete for limited resources</li>
                    <li><strong>Synchronization Overhead</strong>: When excessive locking degrades performance</li>
                  </ul>

                  <div className={`${themeClasses.infoBlock} p-5 border-l-4 rounded-r my-6`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${themeClasses.infoTextDark}`}>Essential RTOS Knowledge</h3>
                        <div className={`text-sm ${themeClasses.infoText}`}>
                          <p>For multithreaded embedded applications, familiarity with a Real-Time Operating System (RTOS) like FreeRTOS or RTX is crucial. 
                          These provide task management, synchronization primitives, and deterministic scheduling capabilities critical for reliable operation.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 id="explore-subtopics">Explore Multithreading Subtopics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <a href="/notes/multithreading/introduction" className={`${themeClasses.card} p-4 rounded-md block border no-underline hover:no-underline`}>
                      <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-1`}>Introduction</h3>
                      <p className={`text-sm ${themeClasses.textDark}`}>Basic concepts and benefits of threading in embedded systems</p>
                    </a>
                    <a href="/notes/multithreading/key-concepts" className={`${themeClasses.card} p-4 rounded-md block border no-underline hover:no-underline`}>
                      <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-1`}>Key Concepts</h3>
                      <p className={`text-sm ${themeClasses.textDark}`}>Synchronization primitives, scheduling, and thread safety</p>
                    </a>
                    <a href="/notes/multithreading/interview-tips" className={`${themeClasses.card} p-4 rounded-md block border no-underline hover:no-underline`}>
                      <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-1`}>Interview Tips</h3>
                      <p className={`text-sm ${themeClasses.textDark}`}>Common interview questions and effective answering strategies</p>
                    </a>
                  </div>
                </div>
              </>
            )}
            
            {currentPath === "/notes/multithreading/introduction" && (
              <>
                <div className="flex items-center mb-1 text-gray-500 text-sm">
                  <span>Docs</span>
                  <span className="mx-2">›</span>
                  <span className="mx-2"><Link href="/notes/multithreading" className="hover:underline">Multithreading</Link></span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-800'}>Introduction</span>
                </div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Introduction to Multithreading</h1>

                <div className={`prose ${darkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
                  <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Definition</h3>
                    <p>
                      Multithreading is the concurrent execution of multiple threads within a single process, 
                      where each thread shares the same memory space. This approach enables efficient utilization of CPU resources.
                    </p>
                  </div>

                  <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Purpose</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Boosts performance by leveraging multiple CPU cores.</li>
                      <li>Enhances responsiveness in applications (e.g., maintaining interactive UIs while processing background tasks).</li>
                    </ul>
                  </div>

                  <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Use Cases</h3>
                    <p>
                      Real-time systems, web servers, gaming, and other applications that require concurrent operations.
                    </p>
                  </div>

                  <h2 id="what-is-multithreading">In Embedded Systems</h2>
                  <p>
                    In embedded systems, multithreading is especially valuable for:
                  </p>
                  <ul>
                    <li>Handling multiple sensors or interfaces simultaneously</li>
                    <li>Maintaining UI responsiveness while processing data</li>
                    <li>Managing time-critical operations alongside regular processing</li>
                    <li>Simplifying complex state machines by dedicating threads to specific functions</li>
                  </ul>

                  <h2 id="thread-lifecycle">Thread Lifecycle</h2>
                  <p>
                    In embedded RTOS environments, threads typically transition through several states:
                  </p>
                  
                  <ol>
                    <li><strong>Created</strong>: Thread is initialized but not yet ready to run</li>
                    <li><strong>Ready</strong>: Thread is ready to run but waiting for CPU time</li>
                    <li><strong>Running</strong>: Thread is currently executing on the CPU</li>
                    <li><strong>Blocked/Waiting</strong>: Thread is waiting for a resource or event</li>
                    <li><strong>Terminated</strong>: Thread has completed execution</li>
                  </ol>

                  <div className={`${themeClasses.infoBlock} p-5 border-l-4 rounded-r my-6`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${themeClasses.infoTextDark}`}>Important Distinction</h3>
                        <div className={`text-sm ${themeClasses.infoText}`}>
                          <p>Don't confuse multithreading (multiple threads in one process) with multiprocessing (multiple processes running independently). 
                          Threads share memory space, making them more efficient but requiring careful synchronization.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 id="performance-benefits">Performance Benefits</h2>
                  <p>
                    Multithreaded applications provide several key advantages:
                  </p>
                  <ul>
                    <li>Continue execution in other threads when one thread is blocked on I/O</li>
                    <li>Take advantage of multiple CPU cores for true parallelism</li>
                    <li>Assign different priorities to different tasks based on criticality</li>
                    <li>Improve responsiveness for user-facing applications</li>
                  </ul>
                </div>
              </>
            )}
            
            {currentPath === "/notes/multithreading/key-concepts" && (
              <>
                <div className="flex items-center mb-1 text-gray-500 text-sm">
                  <span>Docs</span>
                  <span className="mx-2">›</span>
                  <span className="mx-2"><Link href="/notes/multithreading" className="hover:underline">Multithreading</Link></span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-800'}>Key Concepts</span>
                </div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Multithreading Key Concepts</h1>

                <div className={`prose ${darkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
                  <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Thread vs. Process</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Process:</strong> Independent execution unit with its own memory space.</li>
                      <li><strong>Thread:</strong> Lightweight unit within a process sharing memory, making context switches faster.</li>
                    </ul>
                  </div>

                  <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Concurrency vs. Parallelism</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Concurrency:</strong> Overlapping execution of tasks (may be interleaved on a single CPU core).</li>
                      <li><strong>Parallelism:</strong> Simultaneous execution on multiple cores.</li>
                    </ul>
                  </div>

                  <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Thread Life Cycle</h3>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li><strong>Creation:</strong> Threads are spawned.</li>
                      <li><strong>Execution:</strong> Threads run concurrently.</li>
                      <li><strong>Synchronization:</strong> Threads coordinate access to shared resources.</li>
                      <li><strong>Termination:</strong> Threads complete and exit.</li>
                    </ol>
                  </div>

                  <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Synchronization Techniques</h3>
                    <p>
                      Mutexes, semaphores, locks, and condition variables are used to prevent race conditions and ensure thread safety.
                    </p>
                  </div>

                  <h2 id="practical-example">Practical Example with pthread</h2>
                  <p>
                    Below is a simple C code example using the pthread library. It demonstrates creating multiple threads that print a message and then exit.
                  </p>

                  <pre className={`${themeClasses.codeBlock} p-4 rounded-md overflow-x-auto`}>
                    <code className="language-c">
{`#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

// Thread function that prints a message
void* threadFunction(void* arg) {
    int threadNum = *((int*)arg);
    printf("Hello from thread %d\\n", threadNum);
    pthread_exit(NULL);
}

int main() {
    int numThreads = 5;
    pthread_t threads[numThreads];
    int threadArgs[numThreads];

    // Create threads
    for (int i = 0; i < numThreads; i++) {
        threadArgs[i] = i;
        int rc = pthread_create(&threads[i], NULL, threadFunction, (void*)&threadArgs[i]);
        if (rc) {
            printf("ERROR: pthread_create returned %d\\n", rc);
            exit(EXIT_FAILURE);
        }
    }

    // Wait for threads to finish
    for (int i = 0; i < numThreads; i++) {
        pthread_join(threads[i], NULL);
    }

    return 0;
}`}
                    </code>
                  </pre>

                  <div className={`${themeClasses.infoBlock} p-5 border-l-4 rounded-r my-6`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${themeClasses.infoTextDark}`}>Explanation</h3>
                        <div className={`text-sm ${themeClasses.infoText}`}>
                          <ul className="list-disc pl-5 space-y-1">
                            <li><code>pthread_create</code>: Spawns a new thread running threadFunction.</li>
                            <li><code>pthread_join</code>: Waits for each thread to complete before the program exits.</li>
                            <li><strong>Thread Safety:</strong> In more complex applications, ensure shared resources are properly synchronized to avoid race conditions.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 id="common-challenges">Common Multithreading Challenges</h2>
                  <p>
                    Working with threads introduces some key challenges that developers must address:
                  </p>

                  <ol>
                    <li><strong>Race Conditions:</strong> When multiple threads access shared data concurrently, the outcome depends on the timing of their execution.</li>
                    <li><strong>Deadlocks:</strong> When threads are blocked forever, each waiting for resources held by another thread.</li>
                    <li><strong>Priority Inversion:</strong> When a high-priority thread is blocked waiting for a resource held by a low-priority thread.</li>
                    <li><strong>Thread Safety:</strong> Ensuring that code functions correctly during simultaneous execution by multiple threads.</li>
                  </ol>

                </div>
              </>
            )}
            
            {currentPath === "/notes/multithreading/interview-tips" && (
              <>
                <div className="flex items-center mb-1 text-gray-500 text-sm">
                  <span>Docs</span>
                  <span className="mx-2">›</span>
                  <span className="mx-2"><Link href="/notes/multithreading" className="hover:underline">Multithreading</Link></span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-800'}>Interview Tips</span>
                </div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Multithreading Interview Tips</h1>

                <div className={`prose ${darkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
                  <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Understand the Basics</h3>
                    <p>
                      Be prepared to explain what multithreading is, its benefits, and its challenges.
                    </p>
                  </div>

                  <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Discuss Common Problems</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Explain issues like race conditions, deadlocks, and thread starvation.</li>
                      <li>Highlight how synchronization mechanisms (mutexes, semaphores) are used to address these issues.</li>
                    </ul>
                  </div>

                  <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Practical Examples</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Discuss scenarios where multithreading improves application performance or responsiveness.</li>
                      <li>Reference code examples (like the pthread example in Key Concepts) to illustrate thread creation and synchronization.</li>
                    </ul>
                  </div>

                  <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Thread Management</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Understand how threads are created, managed, and terminated in your language of choice.</li>
                      <li>Familiarize yourself with debugging and performance tuning of multithreaded applications.</li>
                    </ul>
                  </div>

                  <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Best Practices</h3>
                    <p>
                      Write thread-safe code, minimize shared resource usage, and design with scalability in mind.
                    </p>
                  </div>

                  <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Stay Updated</h3>
                    <p>
                      Know the threading libraries and frameworks specific to the languages you use, such as pthreads in C/C++.
                    </p>
                  </div>

                  <h2 id="common-questions">Common Interview Questions</h2>
                  <div className={`${themeClasses.card} p-4 border rounded-md my-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Conceptual Questions:</h3>
                    <ol className="list-decimal pl-5 space-y-3">
                      <li>
                        <strong>What is the difference between a process and a thread?</strong>
                        <p className="mt-1 text-sm">
                          Focus on memory space (shared vs. separate), resource overhead, and isolation characteristics.
                          Mention that threads are lightweight with shared memory, while processes are isolated with higher overhead.
                        </p>
                      </li>
                      <li>
                        <strong>Explain mutex vs. semaphore and when to use each.</strong>
                        <p className="mt-1 text-sm">
                          Describe mutex as ownership-based (one owner at a time) and semaphores as signaling mechanisms (potentially multiple resources).
                          Give concrete examples: mutex for shared data protection, semaphore for producer-consumer problems.
                        </p>
                      </li>
                      <li>
                        <strong>What is a race condition and how do you prevent it?</strong>
                        <p className="mt-1 text-sm">
                          Define race conditions as timing-dependent bugs where outcome depends on thread execution order.
                          Discuss synchronization mechanisms, atomic operations, and proper design as prevention strategies.
                        </p>
                      </li>
                    </ol>
                  </div>

                  <div className={`${themeClasses.infoBlock} p-5 border-l-4 rounded-r my-6`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${themeClasses.infoTextDark}`}>Preparation Tip</h3>
                        <div className={`text-sm ${themeClasses.infoText}`}>
                          <p>Before your interview, review the job description carefully to identify what threading technologies and frameworks they use. 
                          For embedded positions, be familiar with RTOS-specific threading models and their implications for critical systems.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 id="answering-strategies">Effective Answering Strategies</h2>
                  <p>
                    Follow these guidelines to structure clear, comprehensive answers:
                  </p>

                  <ol>
                    <li><strong>Start with definitions</strong> - Always begin by defining key terms</li>
                    <li><strong>Provide examples</strong> - Use real-world examples to illustrate concepts</li>
                    <li><strong>Discuss implementation details</strong> - Show your technical depth</li>
                    <li><strong>Address trade-offs</strong> - Demonstrate you understand there's rarely a perfect solution</li>
                    <li><strong>Connect to performance</strong> - Discuss how threading choices impact system performance</li>
                  </ol>

                  <h2 id="code-review">Code Review Skills</h2>
                  <p>
                    Many interviews include code review exercises where you must identify threading issues. Common things to look for:
                  </p>
                  
                  <ul>
                    <li>Unprotected shared variables</li>
                    <li>Potential deadlocks from incorrect lock acquisition order</li>
                    <li>Missing thread cleanup or resource release</li>
                    <li>Improper synchronization for producer-consumer relationships</li>
                    <li>Busy-waiting loops that waste CPU cycles</li>
                  </ul>

                  <pre className={`${themeClasses.codeBlock} p-4 rounded-md overflow-x-auto`}>
                    <code className="language-c">
{`// Producer-Consumer with FreeRTOS
QueueHandle_t dataQueue;
SemaphoreHandle_t mutex;

void producerTask(void *pvParameters) {
    int data = 0;
    while(1) {
        // Produce new item
        data++;
        
        // Send to queue with timeout
        if (xQueueSend(dataQueue, &data, pdMS_TO_TICKS(100)) != pdPASS) {
            // Handle queue full
        }
        
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}

void consumerTask(void *pvParameters) {
    int receivedData;
    while(1) {
        // Wait for item with timeout
        if (xQueueReceive(dataQueue, &receivedData, pdMS_TO_TICKS(200)) == pdPASS) {
            // Process data
            if (xSemaphoreTake(mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
                // Update shared resource with received data
                xSemaphoreGive(mutex);
            }
        }
    }
}`}
                    </code>
                  </pre>

                  <h2 id="system-design">Be Ready for System Design Questions</h2>
                  <p>
                    Senior-level interviews often include designing multithreaded embedded systems. Prepare by:
                  </p>
                  <ul>
                    <li>Practicing thread/task decomposition for different applications</li>
                    <li>Considering priority assignments based on real-time requirements</li>
                    <li>Identifying potential synchronization points and shared resources</li>
                    <li>Planning for error handling and recovery in multithreaded contexts</li>
                    <li>Addressing memory constraints and stack sizing</li>
                  </ul>

                  <h2 id="rtos-knowledge">RTOS Knowledge Is Critical</h2>
                  <p>
                    Be familiar with at least one real-time operating system (FreeRTOS, RTX, ThreadX, etc.) and its:
                  </p>
                  <ul>
                    <li>Task management functions (creation, deletion, suspension)</li>
                    <li>Synchronization primitives (mutex, semaphore, event groups)</li>
                    <li>Communication mechanisms (queues, message buffers)</li>
                    <li>Memory management and protection features</li>
                    <li>Scheduling algorithms and priority handling</li>
                  </ul>
                </div>
              </>
            )}
            
            {selectedTopic === "data-structures" && (
              <>
                <div className="flex items-center mb-1 text-gray-500 text-sm">
                  <span>Docs</span>
                  <span className="mx-2">›</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-800'}>Data Structures</span>
                </div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Data Structures for Embedded Systems</h1>

                <div className={`prose ${darkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
                  <p className="lead">
                    Efficient data structures are crucial in embedded systems where resources are limited. This guide covers common data structures 
                    and their implementation considerations for embedded applications.
                  </p>

                  <h2 id="data-structures-overview">Data Structures Overview</h2>
                  <p>
                    Data structures in embedded systems must be selected with careful consideration of memory usage, processing overhead, and 
                    real-time constraints. Common data structures include arrays, linked lists, queues, stacks, and simple hash tables.
                  </p>

                  <div className={`${themeClasses.card} p-4 border rounded-md my-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Selection Considerations:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Memory footprint and fragmentation potential</li>
                      <li>Execution time determinism</li>
                      <li>Access patterns (random vs. sequential)</li>
                      <li>Complexity of implementation and maintenance</li>
                      <li>Power consumption implications</li>
                    </ul>
                  </div>

                  <h2 id="linked-list">Linked Lists</h2>
                  <p>
                    Linked lists are sequences of data elements, where each element points to the next one in the sequence.
                    They're useful when the size of the collection may change dynamically.
                  </p>

                  <h3>Types of Linked Lists</h3>
                  <ul>
                    <li><strong>Singly Linked Lists</strong>: Each node points to the next node</li>
                    <li><strong>Doubly Linked Lists</strong>: Each node points to both the next and previous nodes</li>
                    <li><strong>Circular Linked Lists</strong>: The last node points back to the first node</li>
                  </ul>

                  <pre className={`${themeClasses.codeBlock} p-4 rounded-md overflow-x-auto`}>
                    <code className="language-c">
{`// Simple singly linked list implementation
typedef struct Node {
    int data;
    struct Node* next;
} Node;

// Create a new node
Node* createNode(int data) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    if (newNode) {
        newNode->data = data;
        newNode->next = NULL;
    }
    return newNode;
}

// Insert at beginning
void insertAtBeginning(Node** head, int data) {
    Node* newNode = createNode(data);
    newNode->next = *head;
    *head = newNode;
}`}
                    </code>
                  </pre>
                </div>
              </>
            )}
            
            {selectedTopic === "communication-protocols" && (
              <>
                <div className="flex items-center mb-1 text-gray-500 text-sm">
                  <span>Docs</span>
                  <span className="mx-2">›</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-800'}>Communication Protocols</span>
                </div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Communication Protocols</h1>

                <div className={`prose ${darkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
                  <p className="lead">
                    Communication protocols are standardized methods that allow different devices to exchange data in embedded systems. 
                    Understanding these protocols is essential for building reliable interconnected systems.
                  </p>

                  <h2 id="uart">UART (Universal Asynchronous Receiver/Transmitter)</h2>
                  <p>
                    UART is a simple serial communication protocol that uses two wires for data transmission: TX (transmit) and RX (receive). 
                    It's asynchronous, meaning there's no shared clock signal between devices.
                  </p>

                  <div className={`${themeClasses.card} p-4 border rounded-md my-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Key Characteristics:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Asynchronous communication (no clock signal)</li>
                      <li>Full-duplex communication (simultaneous transmission and reception)</li>
                      <li>Typically uses 2 wires (TX and RX)</li>
                      <li>Common baud rates: 9600, 19200, 115200</li>
                      <li>Start and stop bits frame each data byte</li>
                    </ul>
                  </div>

                  <div className={`${themeClasses.infoBlock} p-5 border-l-4 rounded-r my-6`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${themeClasses.infoTextDark}`}>Note</h3>
                        <div className={`text-sm ${themeClasses.infoText}`}>
                          <p>UART is often used for debugging purposes, connecting to a PC via USB-to-UART converters, and for simple device-to-device communication where speed is not critical.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3>UART Code Example</h3>
                  <pre className={`${themeClasses.codeBlock} p-4 rounded-md overflow-x-auto`}>
                    <code className="language-c">
{`// UART initialization for STM32
void UART_Init(void) {
  // Enable UART clock
  RCC->APB2ENR |= RCC_APB2ENR_USART1EN;
  
  // Configure UART pins
  GPIOA->CRH &= ~(GPIO_CRH_CNF9 | GPIO_CRH_MODE9);
  GPIOA->CRH |= GPIO_CRH_CNF9_1 | GPIO_CRH_MODE9;
  
  // Set baud rate (115200)
  USART1->BRR = 0x0271;
  
  // Enable UART, transmitter and receiver
  USART1->CR1 = USART_CR1_UE | USART_CR1_TE | USART_CR1_RE;
}

// Send a character via UART
void UART_SendChar(char c) {
  while(!(USART1->SR & USART_SR_TXE));
  USART1->DR = c;
}

// Send a string via UART
void UART_SendString(const char* str) {
  while(*str) {
    UART_SendChar(*str++);
  }
}`}
                    </code>
                  </pre>

                  <h2 id="i2c">I²C (Inter-Integrated Circuit)</h2>
                  <p>
                    I²C is a multi-master, multi-slave, packet-switched serial communication protocol that uses just two bidirectional lines: 
                    SCL (Serial Clock Line) and SDA (Serial Data Line).
                  </p>

                  <div className={`${themeClasses.card} p-4 border rounded-md my-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Key Characteristics:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Synchronous communication (uses clock signal)</li>
                      <li>Uses 2 wires: SCL (clock) and SDA (data)</li>
                      <li>Supports multiple masters and multiple slaves</li>
                      <li>Each device has a unique 7-bit or 10-bit address</li>
                      <li>Typical speeds: 100kHz (Standard), 400kHz (Fast), 1MHz (Fast Plus)</li>
                      <li>Open-drain connections, requiring pull-up resistors</li>
                    </ul>
                  </div>

                  <h2 id="spi">SPI (Serial Peripheral Interface)</h2>
                  <p>
                    SPI is a synchronous serial communication protocol used for short-distance communication, primarily in embedded systems.
                    It uses a master-slave architecture with separate lines for data and clock signals.
                  </p>

                  <div className={`${themeClasses.card} p-4 border rounded-md my-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Key Characteristics:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Synchronous communication (uses clock signal)</li>
                      <li>Uses 4 wires: SCLK (clock), MOSI (Master Out, Slave In), MISO (Master In, Slave Out), SS/CS (Slave Select/Chip Select)</li>
                      <li>Full-duplex communication (simultaneous transmission and reception)</li>
                      <li>One master can communicate with multiple slaves using individual SS/CS lines</li>
                      <li>No acknowledgment mechanism</li>
                      <li>No built-in flow control</li>
                      <li>No addressing scheme like I²C, uses dedicated slave select lines instead</li>
                    </ul>
                  </div>

                  <h2 id="can">CAN (Controller Area Network)</h2>
                  <p>
                    CAN is a robust vehicle bus standard designed for microcontrollers and devices to communicate with each other without a host computer.
                    It's widely used in automotive and industrial applications.
                  </p>

                  <div className={`${themeClasses.card} p-4 border rounded-md my-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Key Characteristics:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Multi-master serial bus with message-based protocol</li>
                      <li>Uses two wires: CAN_H and CAN_L</li>
                      <li>Message-based rather than address-based</li>
                      <li>Built-in prioritization of messages</li>
                      <li>Robust error detection and handling</li>
                      <li>Data rates up to 1 Mbps</li>
                      <li>Excellent noise immunity</li>
                    </ul>
                  </div>

                  <h2 id="resources">Additional Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <a 
                      href="#" 
                      className={`flex items-start p-4 ${themeClasses.card} rounded-lg border transition-colors`}
                    >
                      <svg className={`mr-3 ${darkMode ? 'text-[rgb(214,251,65)]' : 'text-[rgb(24,24,26)]'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Serial Communication Guide</h3>
                        <p className={`text-sm ${themeClasses.textDark}`}>Comprehensive guide on implementing various serial protocols</p>
                      </div>
                    </a>
                    <a 
                      href="#" 
                      className={`flex items-start p-4 ${themeClasses.card} rounded-lg border transition-colors`}
                    >
                      <svg className={`mr-3 ${darkMode ? 'text-[rgb(214,251,65)]' : 'text-[rgb(24,24,26)]'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Code Examples Repository</h3>
                        <p className={`text-sm ${themeClasses.textDark}`}>Collection of protocol implementation examples</p>
                      </div>
                    </a>
                  </div>
                </div>
              </>
            )}
            
            {selectedTopic === "memory-management" && (
              <>
                <div className="flex items-center mb-1 text-gray-500 text-sm">
                  <span>Docs</span>
                  <span className="mx-2">›</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-800'}>Memory Management</span>
                </div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Memory Management</h1>

                <div className={`prose ${darkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
                  <p className="lead">
                    Effective memory management is crucial in embedded systems where resources are constrained. 
                    Understanding different memory types and allocation strategies helps in building robust and efficient embedded applications.
                  </p>

                  <h2 id="memory-types">Memory Types in Embedded Systems</h2>
                  <p>
                    Embedded systems employ various types of memory, each with distinct characteristics suited for specific purposes.
                    Understanding these differences is essential for optimal system design.
                  </p>

                  <div className={`${themeClasses.card} p-4 border rounded-md my-6`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Common Memory Types:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Flash Memory</strong> - Non-volatile storage for program code and constant data</li>
                      <li><strong>SRAM (Static RAM)</strong> - Fast, volatile memory for variables and runtime data</li>
                      <li><strong>EEPROM/FRAM</strong> - Non-volatile memory for configuration settings and calibration data</li>
                      <li><strong>SDRAM/DDR</strong> - Higher capacity external RAM for more complex applications</li>
                      <li><strong>ROM/OTP</strong> - Read-only memory for bootloaders and critical firmware elements</li>
                    </ul>
                  </div>

                  <div className={`${themeClasses.infoBlock} p-5 border-l-4 rounded-r my-6`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${themeClasses.infoTextDark}`}>Memory Map Considerations</h3>
                        <div className={`text-sm ${themeClasses.infoText}`}>
                          <p>When designing memory layouts for embedded systems, always consider alignment requirements, memory protection units (MPUs), and cache behavior to avoid hard-to-debug issues.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 id="allocation-techniques">Memory Allocation Techniques</h2>
                  <p>
                    In resource-constrained embedded systems, efficient memory allocation is critical. Different techniques offer various 
                    trade-offs between performance, fragmentation, and predictability.
                  </p>
                  
                  <h3>Static Allocation</h3>
                  <p>
                    Static allocation assigns memory at compile time, providing deterministic behavior but sacrificing flexibility.
                  </p>
                  
                  <pre className={`${themeClasses.codeBlock} p-4 rounded-md overflow-x-auto`}>
                    <code className="language-c">
{`// Static allocation example
uint8_t buffer[MAX_BUFFER_SIZE];   // Fixed size buffer allocated at compile time
struct SensorData readings[MAX_SENSORS];  // Array of structs with fixed size

void processSensorData(void) {
    // Using statically allocated memory
    for (int i = 0; i < sensorCount; i++) {
        readings[i].temperature = readTemperature(i);
        readings[i].humidity = readHumidity(i);
    }
}`}
                    </code>
                  </pre>

                  <h3>Dynamic Allocation</h3>
                  <p>
                    Dynamic allocation provides flexibility but introduces unpredictability and potential fragmentation.
                    In many embedded systems, especially safety-critical ones, dynamic allocation is avoided or strictly controlled.
                  </p>
                  
                  <pre className={`${themeClasses.codeBlock} p-4 rounded-md overflow-x-auto`}>
                    <code className="language-c">
{`// Dynamic allocation example
struct SensorData* readings;

void processSensorData(int sensorCount) {
    // Dynamically allocate based on runtime requirements
    readings = (struct SensorData*)malloc(sizeof(struct SensorData) * sensorCount);
    
    if (readings != NULL) {
        for (int i = 0; i < sensorCount; i++) {
            readings[i].temperature = readTemperature(i);
            readings[i].humidity = readHumidity(i);
        }
        
        // Process data...
        
        // Free memory when done
        free(readings);
        readings = NULL;
    } else {
        // Handle allocation failure
        reportError(ERROR_MEMORY_ALLOCATION);
    }
}`}
                    </code>
                  </pre>

                  <div className={`${themeClasses.card} p-4 border rounded-md my-6 border-yellow-500/50`}>
                    <h3 className={`font-semibold text-yellow-500 mb-2`}>Warning:</h3>
                    <p className="text-sm">
                      Dynamic memory allocation in embedded systems can lead to memory fragmentation, unpredictable timing, and allocation failures. 
                      Consider using static allocation, memory pools, or stack allocation when possible.
                    </p>
                  </div>
                  
                  <h2 id="fragmentation">Memory Fragmentation</h2>
                  <p>
                    Fragmentation occurs when free memory becomes divided into small, non-contiguous blocks that cannot be used efficiently.
                    This is a common issue in long-running embedded systems that use dynamic memory allocation.
                  </p>
                  
                  <h3>Memory Pool Allocation</h3>
                  <p>
                    Memory pools offer a compromise between static and dynamic allocation by pre-allocating fixed-size blocks,
                    reducing fragmentation while allowing some runtime flexibility.
                  </p>
                  
                  <pre className={`${themeClasses.codeBlock} p-4 rounded-md overflow-x-auto`}>
                    <code className="language-c">
{`// Simple memory pool implementation

#define BLOCK_SIZE  64      // Size of each memory block
#define POOL_SIZE   32      // Number of blocks in the pool

typedef struct {
    uint8_t data[BLOCK_SIZE];
    bool used;
} MemoryBlock;

// The memory pool
static MemoryBlock memPool[POOL_SIZE];

// Initialize the memory pool
void memPoolInit(void) {
    for (int i = 0; i < POOL_SIZE; i++) {
        memPool[i].used = false;
    }
}

// Allocate a block from the pool
void* memPoolAlloc(void) {
    for (int i = 0; i < POOL_SIZE; i++) {
        if (!memPool[i].used) {
            memPool[i].used = true;
            return memPool[i].data;
        }
    }
    return NULL;  // No free blocks available
}

// Free a block back to the pool
void memPoolFree(void* ptr) {
    for (int i = 0; i < POOL_SIZE; i++) {
        if (memPool[i].data == ptr) {
            memPool[i].used = false;
            return;
        }
    }
}`}
                    </code>
                  </pre>
                  
                  <h2 id="resources">Additional Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <a 
                      href="#" 
                      className={`flex items-start p-4 ${themeClasses.card} rounded-lg border transition-colors`}
                    >
                      <svg className={`mr-3 ${darkMode ? 'text-[rgb(214,251,65)]' : 'text-[rgb(24,24,26)]'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Memory Management Guide</h3>
                        <p className={`text-sm ${themeClasses.textDark}`}>Comprehensive guide on memory management for embedded systems</p>
                      </div>
                    </a>
                    <a 
                      href="#" 
                      className={`flex items-start p-4 ${themeClasses.card} rounded-lg border transition-colors`}
                    >
                      <svg className={`mr-3 ${darkMode ? 'text-[rgb(214,251,65)]' : 'text-[rgb(24,24,26)]'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Memory Optimization Techniques</h3>
                        <p className={`text-sm ${themeClasses.textDark}`}>Advanced strategies for optimizing memory usage in constrained environments</p>
                      </div>
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}