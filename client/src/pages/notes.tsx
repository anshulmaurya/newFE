import { useState, useEffect } from "react";
import { Search, Moon, Sun, ChevronDown, Menu, X, BookOpen, Code, Database, FileText, Zap, Upload, GitBranch, Pencil, Grid3X3, Puzzle, Link as LinkIcon, Search as SearchIcon, Terminal, FileCode, FileBox, LayoutGrid, Globe } from "lucide-react";
import { useLocation, Link } from "wouter";
import Header from "@/components/layout/header";

interface Subsection {
  id: string;
  label: string;
  path: string;
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

// Define topic sections and their subsections
const notesTopics: TopicSection[] = [
  { 
    id: "getting-started", 
    label: "GETTING STARTED",
    path: "/notes/getting-started",
    category: true,
    subsections: [
      {
        id: "getting-started-main",
        label: "Getting Started",
        icon: <Zap className="h-4 w-4 mr-2" />,
        path: "/notes/getting-started",
      }
    ]
  },
  { 
    id: "communication-protocols", 
    label: "COMMUNICATION PROTOCOLS",
    path: "/notes/communication-protocols",
    category: true,
    subsections: [
      {
        id: "comm-protocols-main",
        label: "Communication Protocols",
        icon: <GitBranch className="h-4 w-4 mr-2" />,
        path: "/notes/communication-protocols",
        subsections: [
          { id: "spi", label: "SPI", path: "/notes/communication-protocols/spi" },
          { id: "i2c", label: "I2C", path: "/notes/communication-protocols/i2c" },
          { id: "uart", label: "UART", path: "/notes/communication-protocols/uart" }
        ]
      }
    ]
  },
  { 
    id: "data-structures", 
    label: "DATA STRUCTURES",
    path: "/notes/data-structures",
    category: true,
    subsections: [
      {
        id: "data-structures-main",
        label: "Data Structures",
        icon: <Database className="h-4 w-4 mr-2" />,
        path: "/notes/data-structures",
        subsections: [
          { id: "linked-list", label: "Linked List", path: "/notes/data-structures/linked-list" },
          { id: "array", label: "Array", path: "/notes/data-structures/array" },
          { id: "string", label: "String", path: "/notes/data-structures/string" }
        ]
      }
    ]
  }
];

export default function Notes() {
  const [selectedTopic, setSelectedTopic] = useState("communication-protocols");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [location, setLocation] = useLocation();
  const [currentPath] = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    "comm-protocols-main": true,
    "data-structures-main": true
  });
  
  // Update selected topic based on current path
  useEffect(() => {
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

      <div className="flex flex-grow pt-0 scrollable-content">
        {/* Sidebar */}
        <div className={`w-64 ${themeClasses.sidebarBg} p-4 pt-2 mt-1 flex flex-col border-r-0 shadow-md z-10`}>
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
                              if (section.path) {
                                setLocation(section.path);
                              }
                              if (hasSubsections) {
                                setExpandedSections(prev => ({
                                  ...prev,
                                  [section.id]: !isExpanded
                                }));
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
                            {hasSubsections && (
                              <ChevronDown 
                                className={`h-4 w-4 ml-auto transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
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
                          {hasSubsections && isExpanded && (
                            <div className="py-1 ml-9 space-y-1">
                              {section.subsections!.map((subsection: Subsection) => (
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
            {selectedTopic === "getting-started" && currentPath !== "/notes" && (
              <>
                <div className="flex items-center mb-1 text-gray-500 text-sm">
                  <span>Docs</span>
                  <span className="mx-2">›</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-800'}>Getting Started</span>
                </div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Getting Started with DSPCoder</h1>

                <div className={`prose ${darkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
                  <p className="lead">
                    Welcome to DSPCoder, the ultimate platform for solving embedded systems questions directly in VS Code! Follow this guide to set up your environment and start coding.
                  </p>

                  <h2 id="step-1-install-vs-code">🚀 Step 1: Install VS Code</h2>
                  <p>
                    Make sure you have Visual Studio Code installed on your system. If not, <a href="https://code.visualstudio.com/download" target="_blank" rel="noopener noreferrer">download it from here</a>.
                  </p>

                  <h2 id="step-2-install-dspcoder-extension">🔌 Step 2: Install DSPCoder Extension</h2>
                  <ol>
                    <li>Open VS Code.</li>
                    <li>Go to the Extensions Marketplace (Ctrl + Shift + X / Cmd + Shift + X on Mac).</li>
                    <li>Search for DSPCoder.</li>
                    <li>Click Install to add the DSPCoder extension.</li>
                  </ol>

                  <h2 id="step-3-setup-workspace">📂 Step 3: Set Up Your Workspace</h2>
                  <ol>
                    <li>Open a new folder in VS Code where you want to store your code.</li>
                    <li>Click on DSPCoder from the sidebar and sign in with your account.</li>
                    <li>Select an embedded systems problem from the problem list.</li>
                    <li>The extension will set up the necessary project structure automatically.</li>
                  </ol>

                  <h2 id="step-4-select-environment">🛠 Step 4: Select a Target Environment</h2>
                  <p>
                    DSPCoder supports multiple embedded system environments. Choose one:
                  </p>
                  <div className={`${themeClasses.card} p-4 border rounded-md my-4`}>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Bare Metal (C/C++)</li>
                      <li>FreeRTOS</li>
                      <li>ARM Cortex Emulation (via QEMU)</li>
                      <li>Renode Simulation</li>
                    </ul>
                  </div>

                  <h2 id="step-5-write-run-code">📝 Step 5: Write & Run Code</h2>
                  <ol>
                    <li>Open the generated main.c or main.cpp file.</li>
                    <li>Write your solution using the provided template.</li>
                    <li>Click Run to execute your code in the simulated environment.</li>
                    <li>View the console output and memory profiling results.</li>
                  </ol>

                  <h2 id="step-6-submit-solution">✅ Step 6: Submit Your Solution</h2>
                  <ol>
                    <li>Once your code runs successfully, click Submit.</li>
                    <li>Your solution will be evaluated for correctness, memory usage, and performance.</li>
                    <li>Track your progress on the DSPCoder dashboard.</li>
                  </ol>

                  <h2 id="bonus-debugging-profiling">🎯 Bonus: Debugging & Profiling</h2>
                  <ul>
                    <li>Use Valgrind integration for memory leak detection.</li>
                    <li>Step through your code using the built-in debugger.</li>
                    <li>Optimize code with compiler feedback & performance metrics.</li>
                  </ul>

                  <div className={`${themeClasses.infoBlock} p-5 border-l-4 rounded-r my-6`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${themeClasses.infoTextDark}`}>🎉 You're All Set!</h3>
                        <div className={`text-sm ${themeClasses.infoText}`}>
                          <p>Start solving embedded systems problems efficiently with DSPCoder & VS Code. 🚀<br /><br />
                          For more details, visit <a href="#" className="underline hover:no-underline">DSPCoder Docs</a> or reach out to <a href="mailto:support@dspcoder.com" className="underline hover:no-underline">support@dspcoder.com</a>.</p>
                        </div>
                      </div>
                    </div>
                  </div>
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