import { useState } from "react";
import { ArrowLeft, Book, Terminal, Cpu, MessageSquare, Search, Github, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const notesTopics = [
  { id: "getting-started", label: "Getting Started" },
  { id: "communication-protocols", label: "Communication Protocols" },
  { id: "memory-management", label: "Memory Management" },
  { id: "rtos-fundamentals", label: "RTOS Fundamentals" },
  { id: "interrupt-handling", label: "Interrupt Handling" },
  { id: "driver-development", label: "Driver Development" },
  { id: "peripherals", label: "Peripherals & Interfaces" },
  { id: "debugging-techniques", label: "Debugging Techniques" },
  { id: "optimization", label: "Optimization Strategies" },
  { id: "firmware-design", label: "Firmware Design Patterns" },
  { id: "code-examples", label: "Code Examples" },
  { id: "faq", label: "Frequently Asked Questions" },
];

export default function Notes() {
  const [selectedTopic, setSelectedTopic] = useState("communication-protocols");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top navigation bar */}
      <div className="bg-[rgb(24,24,26)] text-white py-4 px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Link to="/">
            <button className="flex items-center gap-2 text-sm hover:text-[rgb(214,251,65)] transition-colors">
              <ArrowLeft size={18} />
              Back to dspcoder
            </button>
          </Link>
          <div className="h-5 border-l border-gray-500 mx-2"></div>
          <div className="flex items-center gap-1.5">
            <Cpu size={16} className="text-[rgb(214,251,65)]" />
            <span className="font-semibold text-sm">Embedded Systems Documentation</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/dspcoder/embedded-docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm flex items-center gap-1.5 hover:text-[rgb(214,251,65)] transition-colors"
          >
            <Github size={16} />
            Edit on GitHub
          </a>
        </div>
      </div>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 p-4 flex flex-col border-r border-gray-200">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search docs..."
              className="w-full pl-8 pr-3 py-2 rounded-md border border-gray-300 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="font-medium text-gray-700 mb-2 text-sm">Documentation</div>
              <nav className="space-y-1">
                {notesTopics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`block w-full text-left px-3 py-2 rounded text-sm ${
                      selectedTopic === topic.id 
                        ? "bg-[rgb(214,251,65)]/20 text-gray-800 font-medium border-l-2 border-[rgb(214,251,65)]" 
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {topic.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {selectedTopic === "communication-protocols" && (
              <>
                <div className="flex items-center mb-2 text-gray-500 text-sm">
                  <span>Docs</span>
                  <span className="mx-2">›</span>
                  <span className="text-gray-800">Communication Protocols</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Communication Protocols</h1>

                <div className="prose prose-slate max-w-none">
                  <p className="lead">
                    Communication protocols are standardized methods that allow different devices to exchange data in embedded systems. 
                    Understanding these protocols is essential for building reliable interconnected systems.
                  </p>

                  <h2 id="uart">UART (Universal Asynchronous Receiver/Transmitter)</h2>
                  <p>
                    UART is a simple serial communication protocol that uses two wires for data transmission: TX (transmit) and RX (receive). 
                    It's asynchronous, meaning there's no shared clock signal between devices.
                  </p>

                  <div className="bg-gray-50 p-4 border border-gray-200 rounded-md my-6">
                    <h3 className="font-semibold text-gray-700 mb-2">Key Characteristics:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Asynchronous communication (no clock signal)</li>
                      <li>Full-duplex communication (simultaneous transmission and reception)</li>
                      <li>Typically uses 2 wires (TX and RX)</li>
                      <li>Common baud rates: 9600, 19200, 115200</li>
                      <li>Start and stop bits frame each data byte</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-5 border-l-4 border-blue-400 rounded-r my-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Note</h3>
                        <div className="text-sm text-blue-700">
                          <p>UART is often used for debugging purposes, connecting to a PC via USB-to-UART converters, and for simple device-to-device communication where speed is not critical.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3>UART Code Example</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
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

                  <div className="bg-gray-50 p-4 border border-gray-200 rounded-md my-6">
                    <h3 className="font-semibold text-gray-700 mb-2">Key Characteristics:</h3>
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

                  <div className="bg-gray-50 p-4 border border-gray-200 rounded-md my-6">
                    <h3 className="font-semibold text-gray-700 mb-2">Key Characteristics:</h3>
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

                  <div className="bg-gray-50 p-4 border border-gray-200 rounded-md my-6">
                    <h3 className="font-semibold text-gray-700 mb-2">Key Characteristics:</h3>
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
                      className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <Book className="mr-3 text-[rgb(24,24,26)]" size={20} />
                      <div>
                        <h3 className="font-medium text-gray-900">Serial Communication Guide</h3>
                        <p className="text-sm text-gray-500">Comprehensive guide on implementing various serial protocols</p>
                      </div>
                    </a>
                    <a 
                      href="#" 
                      className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <Terminal className="mr-3 text-[rgb(24,24,26)]" size={20} />
                      <div>
                        <h3 className="font-medium text-gray-900">Code Examples Repository</h3>
                        <p className="text-sm text-gray-500">Collection of protocol implementation examples</p>
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