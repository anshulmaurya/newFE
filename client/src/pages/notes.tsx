import { useState, useEffect } from "react";
import { 
  Menu, X, Search, Moon, Sun, ChevronDown, 
  Clock, Star, BookOpen, Code, FileCode, 
  Clock3, Calendar, Users, Info, Zap, 
  Shield, Cpu, Terminal, Activity
} from "lucide-react";
import { Link, useLocation } from "wouter";

// Define topic sections and their subsections
const notesTopics = [
  { 
    id: "getting-started", 
    label: "Getting Started",
    icon: <Zap size={16} />,
    description: "Learn how to set up your environment and create your first embedded project",
    difficulty: "Beginner",
    estimatedTime: "30 min",
    subsections: [
      { id: "setup-environment", label: "Setup Environment" },
      { id: "toolchains", label: "Toolchains" },
      { id: "hello-world", label: "Hello World" }
    ]
  },
  { 
    id: "communication-protocols", 
    label: "Communication Protocols",
    icon: <Code size={16} />,
    description: "Understand how embedded devices communicate with each other and the outside world",
    difficulty: "Intermediate",
    estimatedTime: "45 min",
    subsections: [
      { id: "uart", label: "UART" },
      { id: "i2c", label: "I²C" },
      { id: "spi", label: "SPI" },
      { id: "can", label: "CAN" }
    ]
  },
  { 
    id: "memory-management", 
    label: "Memory Management",
    icon: <FileCode size={16} />,
    description: "Master efficient memory usage in resource-constrained embedded systems",
    difficulty: "Advanced",
    estimatedTime: "60 min",
    subsections: [
      { id: "memory-types", label: "Memory Types" },
      { id: "allocation-techniques", label: "Allocation Techniques" },
      { id: "fragmentation", label: "Fragmentation" }
    ]
  },
  { 
    id: "rtos-fundamentals", 
    label: "RTOS Fundamentals",
    icon: <Clock size={16} />,
    description: "Learn the basics of real-time operating systems for embedded applications",
    difficulty: "Advanced",
    estimatedTime: "75 min",
    subsections: [
      { id: "tasks", label: "Tasks & Scheduling" },
      { id: "semaphores", label: "Semaphores" },
      { id: "mutexes", label: "Mutexes" }
    ]
  },
  { 
    id: "interrupt-handling", 
    label: "Interrupt Handling",
    icon: <Activity size={16} />,
    description: "Understand how to efficiently handle hardware interrupts in embedded systems",
    difficulty: "Intermediate",
    estimatedTime: "50 min",
    subsections: [
      { id: "isr", label: "ISR Structure" },
      { id: "priority", label: "Priority & Nesting" },
      { id: "latency", label: "Latency & Performance" }
    ]
  },
  { 
    id: "driver-development", 
    label: "Driver Development",
    icon: <Cpu size={16} />,
    description: "Learn how to write efficient device drivers for embedded hardware",
    difficulty: "Advanced",
    estimatedTime: "65 min",
    subsections: [
      { id: "driver-models", label: "Driver Models" },
      { id: "hardware-abstraction", label: "Hardware Abstraction" }
    ]
  },
  { 
    id: "peripherals", 
    label: "Peripherals & Interfaces",
    icon: <Terminal size={16} />,
    description: "Master the integration and control of various peripheral devices",
    difficulty: "Intermediate",
    estimatedTime: "45 min",
    subsections: [
      { id: "gpio", label: "GPIO" },
      { id: "adc-dac", label: "ADC/DAC" },
      { id: "timers", label: "Timers" }
    ]
  },
  { 
    id: "debugging-techniques", 
    label: "Debugging Techniques",
    icon: <BookOpen size={16} />,
    description: "Learn advanced debugging strategies for embedded systems",
    difficulty: "Intermediate",
    estimatedTime: "40 min",
    subsections: [
      { id: "jtag", label: "JTAG & SWD" },
      { id: "logging", label: "Logging Strategies" }
    ]
  },
  { 
    id: "optimization", 
    label: "Optimization Strategies",
    icon: <Clock3 size={16} />,
    description: "Techniques to optimize code size, performance, and power consumption",
    difficulty: "Advanced",
    estimatedTime: "55 min",
    subsections: [
      { id: "code-optimization", label: "Code Optimization" },
      { id: "power-optimization", label: "Power Optimization" }
    ]
  },
  { 
    id: "firmware-design", 
    label: "Firmware Design Patterns",
    icon: <Shield size={16} />,
    description: "Learn architectural patterns for robust embedded firmware",
    difficulty: "Advanced",
    estimatedTime: "60 min",
    subsections: [
      { id: "state-machines", label: "State Machines" },
      { id: "event-driven", label: "Event-Driven Design" }
    ]
  },
  { 
    id: "code-examples", 
    label: "Code Examples",
    icon: <Terminal size={16} />,
    description: "Real-world embedded code examples with detailed explanations",
    difficulty: "Mixed",
    estimatedTime: "Varies",
    subsections: [
      { id: "c-examples", label: "C Examples" },
      { id: "cpp-examples", label: "C++ Examples" }
    ]
  },
  { 
    id: "faq", 
    label: "Frequently Asked Questions",
    icon: <Info size={16} />,
    description: "Common questions and answers about embedded systems development",
    difficulty: "Beginner",
    estimatedTime: "20 min",
    subsections: []
  },
];

export default function Notes() {
  const [selectedTopic, setSelectedTopic] = useState("communication-protocols");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [location, setLocation] = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);

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
        bg: "bg-[rgb(24,24,26)]",
        text: "text-gray-300",
        textDark: "text-gray-500",
        sidebarBg: "bg-[rgb(36,36,38)]",
        borderColor: "border-gray-700",
        highlight: "bg-[rgb(214,251,65)]/20",
        codeBlock: "bg-gray-900 text-gray-100",
        infoBlock: "bg-[rgb(40,50,70)] border-[rgb(60,130,210)]",
        infoText: "text-blue-300",
        infoTextDark: "text-blue-400",
        card: "bg-[rgb(36,36,38)] border-gray-700 hover:bg-[rgb(45,45,47)]"
      }
    : {
        bg: "bg-white",
        text: "text-gray-700",
        textDark: "text-gray-500",
        sidebarBg: "bg-gray-100",
        borderColor: "border-gray-200",
        highlight: "bg-[rgb(214,251,65)]/20",
        codeBlock: "bg-gray-900 text-gray-100",
        infoBlock: "bg-blue-50 border-blue-400",
        infoText: "text-blue-700",
        infoTextDark: "text-blue-800",
        card: "bg-gray-50 border-gray-200 hover:bg-gray-100"
      };

  // Find the current topic
  const currentTopic = notesTopics.find(topic => topic.id === selectedTopic) || notesTopics[0];

  return (
    <div className={`flex flex-col min-h-screen ${themeClasses.bg} ${themeClasses.text} transition-colors duration-200`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${headerBackground} shadow-md`}>
        <div className="max-w-[1400px] mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <div onClick={() => setLocation('/')} className="cursor-pointer">
              <div className="flex items-center">
                <div className="h-8 w-8 flex items-center justify-center">
                  <svg version="1.1" viewBox="0.0 0.0 100.0 100.0" fill="none" stroke="none" strokeLinecap="square" strokeMiterlimit="10" width="32" height="32">
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
                <h1 className="font-display font-bold text-lg tracking-tight ml-1">
                  <span className="text-white">dsp</span><span className="text-[rgb(214,251,65)]">coder.com</span>
                </h1>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <div onClick={() => setLocation('/notes')}>
              <div className="nav-link group px-3 py-1.5 font-medium text-sm text-[rgb(214,251,65)] transition-colors cursor-pointer">
                Notes
              </div>
            </div>
            <div onClick={() => setLocation('/dashboard')}>
              <div className={`nav-link group px-3 py-1.5 font-medium text-sm ${location.includes("/dashboard") ? "text-[rgb(214,251,65)]" : "text-gray-300 hover:text-white"} transition-colors cursor-pointer`}>
                Problems
              </div>
            </div>
            
            {/* Theme toggle */}
            <button 
              onClick={toggleTheme}
              className="ml-2 p-1.5 rounded-md text-gray-300 hover:text-white hover:bg-[rgb(36,36,38)] transition-colors"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <a 
              href="#" 
              className="ml-3 px-4 py-1.5 bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)] rounded-md text-xs text-black font-bold transition-all inline-flex items-center gap-1.5 shadow-[0_0_10px_rgba(214,251,65,0.4)] hover:shadow-[0_0_15px_rgba(214,251,65,0.6)] border border-[rgb(224,255,75)]"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="13" 
                height="13" 
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Login
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
        <div className={`md:hidden absolute w-full z-20 py-3 px-4 ${mobileMenuOpen ? 'block' : 'hidden'} bg-[rgb(24,24,26)]`}>
          <nav className="flex flex-col space-y-3">

            <div onClick={() => { setLocation('/notes'); setMobileMenuOpen(false); }}>
              <div className="text-[rgb(214,251,65)] py-1.5 border-b border-gray-700/30 text-sm font-medium cursor-pointer">
                Notes
              </div>
            </div>
            <div onClick={() => { setLocation('/dashboard'); setMobileMenuOpen(false); }}>
              <div className={`${location.includes("/dashboard") ? "text-[rgb(214,251,65)]" : "text-gray-300 hover:text-white"} py-1.5 border-b border-gray-700/30 text-sm cursor-pointer`}>
                Problems
              </div>
            </div>
            
            <div className="flex items-center justify-between py-1.5 border-b border-gray-700/30">
              <span className="text-sm text-gray-400">Theme</span>
              <button 
                onClick={toggleTheme}
                className="p-1 rounded-md text-gray-300 hover:text-white hover:bg-[rgb(36,36,38)] transition-colors"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
            
            <a 
              href="#"
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

      <div className="flex flex-col lg:flex-row flex-1 mt-16">
        {/* Left Sidebar - Navigation */}
        <div className={`w-64 ${themeClasses.sidebarBg} p-4 flex-shrink-0 border-r ${themeClasses.borderColor} h-[calc(100vh-4rem)] overflow-y-auto`}>
          <div className="sticky top-4">
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
                <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 text-sm pl-1.5`}>Documentation</div>
                <nav>
                  {notesTopics.map(topic => (
                    <div key={topic.id} className="mb-2">
                      <button
                        onClick={() => setSelectedTopic(topic.id)}
                        className={`flex justify-between items-center w-full text-left px-2.5 py-1.5 rounded text-sm ${
                          selectedTopic === topic.id 
                            ? `${themeClasses.highlight} ${darkMode ? 'text-[rgb(214,251,65)]' : 'text-gray-800'} font-medium border-l-2 border-[rgb(214,251,65)]` 
                            : `${darkMode ? 'text-gray-300 hover:bg-[rgb(40,40,42)]' : 'text-gray-600 hover:bg-gray-200'}`
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">
                            {topic.icon}
                          </span>
                          <span>{topic.label}</span>
                        </div>
                        {topic.subsections.length > 0 && (
                          <ChevronDown className={`h-3.5 w-3.5 transform transition-transform ${selectedTopic === topic.id ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                      
                      {/* Subsections */}
                      {selectedTopic === topic.id && topic.subsections.length > 0 && (
                        <div className="pl-4 mt-0.5 mb-1 space-y-0.5 border-l border-dashed border-gray-600 ml-2.5">
                          {topic.subsections.map(subsection => (
                            <a 
                              key={subsection.id}
                              href={`#${subsection.id}`}
                              className={`block pl-3 pr-2 py-1 text-xs rounded hover:bg-opacity-20 ${
                                darkMode 
                                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                              }`}
                            >
                              {subsection.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow px-6 py-6 overflow-auto">
          <div className="max-w-3xl mx-auto">
            {selectedTopic === "communication-protocols" && (
              <>
                <div className="flex items-center mb-1 text-gray-500 text-sm">
                  <span>Docs</span>
                  <span className="mx-2">›</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-800'}>Communication Protocols</span>
                </div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-5`}>Communication Protocols</h1>

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
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-5`}>Memory Management</h1>

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
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right sidebar - Topic information */}
        <div className={`w-72 ${themeClasses.sidebarBg} p-4 border-l ${themeClasses.borderColor} h-[calc(100vh-4rem)] overflow-y-auto hidden lg:block`}>
          <div className="sticky top-4">
            <h3 className="text-lg font-semibold mb-4">About this topic</h3>
            
            <div className="space-y-5">
              <div className={`${themeClasses.card} p-4 rounded-md border ${themeClasses.borderColor}`}>
                <h4 className="font-medium mb-3">Topic Information</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3 text-[rgb(214,251,65)]">
                      <Info size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Description</p>
                      <p className="text-sm">{currentTopic.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3 text-[rgb(214,251,65)]">
                      <Star size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Difficulty</p>
                      <p className="text-sm">{currentTopic.difficulty}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3 text-[rgb(214,251,65)]">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Estimated Time</p>
                      <p className="text-sm">{currentTopic.estimatedTime}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Contents</h4>
                <ul className="space-y-1.5">
                  {currentTopic.subsections.map((subsection) => (
                    <li key={subsection.id}>
                      <a 
                        href={`#${subsection.id}`}
                        className="text-sm hover:text-[rgb(214,251,65)] flex items-center"
                      >
                        <div className="w-1 h-1 rounded-full bg-gray-500 mr-2"></div>
                        {subsection.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={`${themeClasses.card} p-4 rounded-md border ${themeClasses.borderColor}`}>
                <h4 className="font-medium mb-3">Related Topics</h4>
                {notesTopics.filter(topic => topic.id !== selectedTopic).slice(0, 3).map(topic => (
                  <button 
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className="block w-full text-left mb-2.5 group"
                  >
                    <div className="flex items-center">
                      <div className="mr-2 text-gray-400 group-hover:text-[rgb(214,251,65)]">
                        {topic.icon}
                      </div>
                      <div>
                        <p className="text-sm group-hover:text-[rgb(214,251,65)]">{topic.label}</p>
                        <p className="text-xs text-gray-500">{topic.difficulty}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}