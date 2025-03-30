import { useState, useEffect } from "react";
import { Menu, X, Search, Moon, Sun, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";

// Define topic sections and their subsections
const notesTopics = [
  { 
    id: "getting-started", 
    label: "Getting Started",
    subsections: [
      { id: "setup-environment", label: "Setup Environment" },
      { id: "toolchains", label: "Toolchains" },
      { id: "hello-world", label: "Hello World" }
    ]
  },
  { 
    id: "communication-protocols", 
    label: "Communication Protocols",
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
    subsections: [
      { id: "memory-types", label: "Memory Types" },
      { id: "allocation-techniques", label: "Allocation Techniques" },
      { id: "fragmentation", label: "Fragmentation" }
    ]
  },
  { 
    id: "rtos-fundamentals", 
    label: "RTOS Fundamentals",
    subsections: [
      { id: "tasks", label: "Tasks & Scheduling" },
      { id: "semaphores", label: "Semaphores" },
      { id: "mutexes", label: "Mutexes" }
    ]
  },
  { 
    id: "interrupt-handling", 
    label: "Interrupt Handling",
    subsections: [
      { id: "isr", label: "ISR Structure" },
      { id: "priority", label: "Priority & Nesting" },
      { id: "latency", label: "Latency & Performance" }
    ]
  },
  { 
    id: "driver-development", 
    label: "Driver Development",
    subsections: [
      { id: "driver-models", label: "Driver Models" },
      { id: "hardware-abstraction", label: "Hardware Abstraction" }
    ]
  },
  { 
    id: "peripherals", 
    label: "Peripherals & Interfaces",
    subsections: [
      { id: "gpio", label: "GPIO" },
      { id: "adc-dac", label: "ADC/DAC" },
      { id: "timers", label: "Timers" }
    ]
  },
  { 
    id: "debugging-techniques", 
    label: "Debugging Techniques",
    subsections: [
      { id: "jtag", label: "JTAG & SWD" },
      { id: "logging", label: "Logging Strategies" }
    ]
  },
  { 
    id: "optimization", 
    label: "Optimization Strategies",
    subsections: [
      { id: "code-optimization", label: "Code Optimization" },
      { id: "power-optimization", label: "Power Optimization" }
    ]
  },
  { 
    id: "firmware-design", 
    label: "Firmware Design Patterns",
    subsections: [
      { id: "state-machines", label: "State Machines" },
      { id: "event-driven", label: "Event-Driven Design" }
    ]
  },
  { 
    id: "code-examples", 
    label: "Code Examples",
    subsections: [
      { id: "c-examples", label: "C Examples" },
      { id: "cpp-examples", label: "C++ Examples" }
    ]
  },
  { 
    id: "faq", 
    label: "Frequently Asked Questions",
    subsections: []
  },
];

export default function Notes() {
  const [selectedTopic, setSelectedTopic] = useState("communication-protocols");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [, setLocation] = useLocation();
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

  return (
    <div className={`flex flex-col min-h-screen ${themeClasses.bg} ${themeClasses.text} transition-colors duration-200`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${headerBackground} border-b border-gray-800/50`}>
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex justify-between items-center">
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
                  <span className="text-white">dsp</span><span className="text-[#56B2FF]">coder.com</span>
                </h1>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <div onClick={() => setLocation('/notes')}>
              <div className="nav-link group px-3 py-1.5 font-medium text-sm text-[#56B2FF] transition-colors cursor-pointer">
                Notes
              </div>
            </div>
            <div onClick={() => setLocation('/#problems')}>
              <div className="nav-link group px-3 py-1.5 font-medium text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
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
              className="ml-3 px-4 py-1.5 bg-[#56B2FF] hover:bg-[#3D9DF5] rounded-md text-xs text-white font-bold transition-all inline-flex items-center gap-1.5 shadow-[0_0_10px_rgba(86,178,255,0.3)] hover:shadow-[0_0_15px_rgba(86,178,255,0.5)] border border-[#78C1FF]"
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
              <div className="text-[#56B2FF] py-1.5 border-b border-gray-700/30 text-sm font-medium cursor-pointer">
                Notes
              </div>
            </div>
            <div onClick={() => { setLocation('/#problems'); setMobileMenuOpen(false); }}>
              <div className="text-gray-300 hover:text-white py-1.5 border-b border-gray-700/30 text-sm cursor-pointer">
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
              className="text-white py-1.5 font-bold flex items-center gap-2 mt-1 rounded-md bg-[#56B2FF] shadow-[0_0_10px_rgba(86,178,255,0.3)] border border-[#78C1FF] text-sm"
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

      <div className="flex flex-grow pt-[62px]">
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
              <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1.5 text-sm pl-1.5`}>Documentation</div>
              <nav>
                {notesTopics.map(topic => (
                  <div key={topic.id} className="mb-1">
                    <button
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`flex justify-between items-center w-full text-left px-2.5 py-1.5 rounded text-sm ${
                        selectedTopic === topic.id 
                          ? `${themeClasses.highlight} ${darkMode ? 'text-[#56B2FF]' : 'text-gray-800'} font-medium border-l-2 border-[#56B2FF]` 
                          : `${darkMode ? 'text-gray-300 hover:bg-[rgb(40,40,42)]' : 'text-gray-600 hover:bg-gray-200'}`
                      }`}
                    >
                      <span>{topic.label}</span>
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

        {/* Main content */}
        <div className="flex-grow px-8 py-4 overflow-auto">
          <div className="max-w-4xl mx-auto">
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
                      <svg className={`mr-3 ${darkMode ? 'text-[#56B2FF]' : 'text-[rgb(24,24,26)]'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      <svg className={`mr-3 ${darkMode ? 'text-[#56B2FF]' : 'text-[rgb(24,24,26)]'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      <svg className={`mr-3 ${darkMode ? 'text-[#56B2FF]' : 'text-[rgb(24,24,26)]'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      <svg className={`mr-3 ${darkMode ? 'text-[#56B2FF]' : 'text-[rgb(24,24,26)]'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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