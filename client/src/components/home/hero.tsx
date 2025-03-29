import { motion } from "framer-motion";

interface HeroProps {
  onScrollToFeatures: () => void;
}

export default function Hero({ onScrollToFeatures }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 pb-16 bg-[rgb(24,24,26)]">
      {/* Circuit board decorative elements */}
      <div className="absolute top-1/4 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
      
      <div className="container mx-auto px-2 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 max-w-[1400px] mx-auto">
          {/* Left side: Title, Subheading, Buttons */}
          <motion.div 
            className="lg:w-2/5 text-center lg:text-left mb-8 lg:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight flex flex-col items-start">
              <span className="gradient-text mb-1 block">Learning</span>
              <span className="gradient-text mb-2 block">Embedded Systems</span>
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1.5, 
                  delay: 1.2,
                  ease: [0.22, 1, 0.36, 1] 
                }}
              >
                <span className="gradient-text relative">
                  Redefined . .
                  <motion.span 
                    className="absolute -bottom-2 left-0 w-full h-1 bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ 
                      duration: 2, 
                      delay: 2.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  />
                </span>
              </motion.div>
            </h1>
            
            <p className="text-gray-300 text-lg mb-8 max-w-xl">
              Master embedded programming with our interactive platform. Practice real problems, get instant feedback, and land your dream job.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center lg:justify-start gap-4 mb-6">
              <a 
                href="https://discord.gg/embeddeddev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#5865F2] hover:bg-[#4a57e0] text-white font-bold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-[#5865F2]/20 w-full sm:w-auto inline-flex items-center justify-center gap-2"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 127.14 96.36"
                  fill="currentColor"
                >
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                </svg>
                Join Discord
              </a>
              <button 
                onClick={onScrollToFeatures}
                className="px-6 py-3 border border-[rgb(214,251,65)]/50 text-[rgb(214,251,65)] hover:bg-[rgb(214,251,65)]/10 rounded-lg transition-all w-full sm:w-auto"
              >
                Explore Features
              </button>
            </div>
            
            <motion.div 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-400 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <div className="text-[rgb(214,251,65)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <span>200+ Problems</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[rgb(214,251,65)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <span>C/C++/Assembly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[rgb(214,251,65)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <span>Expert-Reviewed</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right side: Code preview */}
          <motion.div 
            className="lg:w-3/5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="code-block rounded-lg font-mono text-sm sm:text-base shadow-xl overflow-hidden bg-[rgb(18,18,20)] flex flex-col">
              {/* VS Code-like layout */}
              <div className="flex flex-col h-full">
                {/* Top bar with title */}
                <div className="bg-[rgb(30,30,32)] text-white py-2 px-4 text-xs flex items-center justify-between border-b border-gray-800">
                  <div className="flex items-center">
                    <span className="inline-block mr-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13.8 9.8L11.7 7.7c-.2-.2-.5-.2-.7 0L8.2 9.8c-.2.2-.2.5 0 .7l2.1 2.1c.2.2.5.2.7 0l2.8-2.1c.2-.2.2-.5 0-.7z" />
                        <path d="M19.8 15.8l-2.1-2.1c-.2-.2-.5-.2-.7 0l-2.8 2.1c-.2.2-.2.5 0 .7l2.1 2.1c.2.2.5.2.7 0l2.8-2.1c.2-.2.2-.5 0-.7z" />
                        <path d="M9.8 19.8l-2.1-2.1c-.2-.2-.5-.2-.7 0l-2.8 2.1c-.2.2-.2.5 0 .7l2.1 2.1c.2.2.5.2.7 0l2.8-2.1c.2-.2.2-.5 0-.7z" />
                        <path d="M5.2 5.2L3.1 3.1c-.2-.2-.5-.2-.7 0L.5 5.2c-.2.2-.2.5 0 .7l2.1 2.1c.2.2.5.2.7 0L5.2 5.9c.2-.2.2-.5 0-.7z" />
                      </svg>
                    </span>
                    <span className="font-semibold tracking-wide">EXPLORER</span>
                  </div>
                </div>
                
                {/* Main content with sidebar and editor */}
                <div className="flex flex-grow">
                  {/* Left sidebar */}
                  <div className="bg-[rgb(24,24,26)] border-r border-gray-800 p-1 w-12 flex flex-col items-center py-3 space-y-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg"
                      width="18" height="18" viewBox="0 0 24 24" 
                      fill="none" stroke="currentColor" 
                      strokeWidth="2" strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <path d="M9 21H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-1"/>
                      <path d="M16 17H8"/>
                      <path d="M12 11v6"/>
                      <path d="M12 11H9.5a2.5 2.5 0 0 1 0-5H12"/>
                    </svg>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg"
                      width="18" height="18" viewBox="0 0 24 24" 
                      fill="none" stroke="currentColor" 
                      strokeWidth="2" strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg"
                      width="18" height="18" viewBox="0 0 24 24" 
                      fill="none" stroke="currentColor" 
                      strokeWidth="2" strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="text-[rgb(214,251,65)]"
                    >
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="4"/>
                      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/>
                      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/>
                      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/>
                      <line x1="14.83" y1="9.17" x2="18.36" y2="5.64"/>
                      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
                    </svg>
                  </div>
                  
                  {/* File explorer */}
                  <div className="bg-[rgb(24,24,26)] border-r border-gray-800 w-56 pt-3 text-sm text-gray-300">
                    <div className="px-3 flex items-center justify-between">
                      <div className="flex items-center font-semibold">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg"
                          width="12" height="12" viewBox="0 0 24 24" 
                          fill="none" stroke="currentColor" 
                          strokeWidth="2" strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="text-gray-400 mr-1"
                        >
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                        <span>REVERSE_LINKED_LIST_C</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs">
                      <div className="py-1 px-3 flex items-center space-x-1 text-gray-400">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg"
                          width="12" height="12" viewBox="0 0 24 24" 
                          fill="none" stroke="currentColor" 
                          strokeWidth="2" strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                        <span>inc</span>
                      </div>
                      
                      <div className="py-1 px-3 flex items-center space-x-1 text-gray-400">
                        <span className="w-4"></span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg"
                          width="12" height="12" viewBox="0 0 24 24" 
                          fill="none" stroke="currentColor" 
                          strokeWidth="2" strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span>util.h</span>
                      </div>
                      
                      <div className="py-1 px-3 flex items-center space-x-1 text-gray-400">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg"
                          width="12" height="12" viewBox="0 0 24 24" 
                          fill="none" stroke="currentColor" 
                          strokeWidth="2" strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                        <span>lib</span>
                      </div>
                      
                      <div className="py-1 px-3 flex items-center space-x-1 text-gray-400">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg"
                          width="12" height="12" viewBox="0 0 24 24" 
                          fill="none" stroke="currentColor" 
                          strokeWidth="2" strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-1 text-red-400"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span>libdspcodera</span>
                      </div>
                      
                      <div className="py-1 px-3 flex items-center space-x-1 text-gray-400">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg"
                          width="12" height="12" viewBox="0 0 24 24" 
                          fill="none" stroke="currentColor" 
                          strokeWidth="2" strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span>src</span>
                      </div>
                      
                      <div className="py-1 px-3 flex items-center space-x-1 text-[rgb(214,251,65)]">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg"
                          width="12" height="12" viewBox="0 0 24 24" 
                          fill="none" stroke="currentColor" 
                          strokeWidth="2" strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <line x1="10" y1="9" x2="8" y2="9"/>
                        </svg>
                        <span>main.c</span>
                      </div>
                      
                      <div className="py-1 px-3 flex items-center space-x-1 bg-[rgb(30,30,32)]">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg"
                          width="12" height="12" viewBox="0 0 24 24" 
                          fill="none" stroke="currentColor" 
                          strokeWidth="2" strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-1 text-orange-400"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span>Makefile</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Code editor */}
                  <div className="flex-1 bg-[rgb(20,20,22)] p-0">
                    {/* Editor tabs */}
                    <div className="flex bg-[rgb(24,24,26)] border-b border-gray-800">
                      <div className="bg-[rgb(20,20,22)] border-r border-gray-800 px-3 py-1 flex items-center text-xs text-gray-300">
                        <span>main.c</span>
                        <span className="ml-2 px-1.5 bg-gray-700 rounded-md">×</span>
                      </div>
                    </div>
                    
                    {/* Code content */}
                    <div className="flex">
                      {/* Line numbers */}
                      <div className="text-right pr-2 pt-2 select-none text-gray-600 text-xs">
                        <div className="py-px">1</div>
                        <div className="py-px">2</div>
                        <div className="py-px">3</div>
                        <div className="py-px">4</div>
                        <div className="py-px bg-[rgb(30,30,32)]">5</div>
                        <div className="py-px">6</div>
                        <div className="py-px">7</div>
                        <div className="py-px">8</div>
                        <div className="py-px">9</div>
                        <div className="py-px">10</div>
                        <div className="py-px">11</div>
                        <div className="py-px">12</div>
                        <div className="py-px">13</div>
                        <div className="py-px">14</div>
                        <div className="py-px">15</div>
                        <div className="py-px">16</div>
                        <div className="py-px">17</div>
                        <div className="py-px">18</div>
                        <div className="py-px">19</div>
                      </div>
                      
                      {/* Actual code */}
                      <div className="flex-1 pl-2 pt-2 text-xs overflow-x-auto text-gray-300">
                        <div className="py-px"><span className="text-purple-500">#include</span> <span className="text-green-400">&lt;stdio.h&gt;</span></div>
                        <div className="py-px"></div>
                        <div className="py-px"><span className="text-purple-400">typedef</span> <span className="text-blue-400">struct</span> <span className="text-yellow-300">Linked_List</span>* <span className="text-yellow-300">head</span>);</div>
                        <div className="py-px"></div>
                        <div className="py-px bg-[rgb(214,251,65)]/5 border-l-2 border-[rgb(214,251,65)] pl-1"><span className="text-green-500">void</span> <span className="text-blue-400">reverse_Linked_List</span>(<span className="text-blue-400">struct</span> <span className="text-yellow-300">Linked_List</span>* <span className="text-yellow-300">head</span>) {'{'}</div>
                        <div className="py-px text-gray-500 group cursor-text">&nbsp;&nbsp;&nbsp;&nbsp;<span className="group-hover:hidden">// Write your code here</span><span className="hidden group-hover:inline text-white">/* Your solution here */</span></div>
                        <div className="py-px">{'}'}</div>
                        <div className="py-px"></div>
                        <div className="py-px"><span className="text-green-500">int</span> <span className="text-blue-400">main</span>(<span className="text-green-500">int</span> <span className="text-yellow-300">argc</span>, <span className="text-green-500">char</span>* <span className="text-yellow-300">argv</span>[]) {'{'}</div>
                        <div className="py-px text-gray-500">&nbsp;&nbsp;&nbsp;&nbsp;// Setup the linked list</div>
                        <div className="py-px">&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">struct</span> <span className="text-yellow-300">Linked_List</span>* <span className="text-yellow-300">head</span> = <span className="text-blue-400">setup_question</span>(<span className="text-yellow-300">argc</span>, <span className="text-yellow-300">argv</span>);</div>
                        <div className="py-px"></div>
                        <div className="py-px text-gray-500">&nbsp;&nbsp;&nbsp;&nbsp;// User function to reverse the linked list</div>
                        <div className="py-px">&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">reverse_Linked_List</span>(<span className="text-yellow-300">head</span>);</div>
                        <div className="py-px"></div>
                        <div className="py-px text-gray-500">&nbsp;&nbsp;&nbsp;&nbsp;// Print the linked list</div>
                        <div className="py-px">&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">print_LinkedList</span>(<span className="text-yellow-300">head</span>);</div>
                        <div className="py-px"></div>
                        <div className="py-px">&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-500">return</span> 0;</div>
                        <div className="py-px">{'}'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Footer - test cases */}
                <div className="bg-[rgb(30,30,32)] text-white border-t border-gray-800 p-2 text-xs">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <div className="flex items-center">
                        <span className="bg-[rgb(20,20,22)] text-[rgb(214,251,65)] px-2 py-1 rounded flex items-center">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg"
                            width="12" height="12" viewBox="0 0 24 24" 
                            fill="none" stroke="currentColor" 
                            strokeWidth="2" strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                          </svg>
                          Test Cases
                        </span>
                      </div>
                      <div className="px-2 py-1 text-gray-400">Test Results</div>
                    </div>
                    
                    <div className="flex items-center bg-[rgb(214,251,65)]/10 text-[rgb(214,251,65)] px-3 py-1 rounded cursor-pointer hover:bg-[rgb(214,251,65)]/20 transition-colors">
                      <span className="mr-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </span>
                      <span>Run</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="font-medium mb-1">Test Cases</div>
                    <div className="flex space-x-2">
                      <div className="px-3 py-1 bg-[rgb(214,251,65)]/10 text-[rgb(214,251,65)] rounded cursor-pointer hover:bg-[rgb(214,251,65)]/20 transition-colors">Case 1</div>
                      <div className="px-3 py-1 bg-[rgb(20,20,22)] rounded cursor-pointer hover:bg-[rgb(214,251,65)]/10 transition-colors">Case 2</div>
                      <div className="px-3 py-1 bg-[rgb(20,20,22)] rounded cursor-pointer hover:bg-[rgb(214,251,65)]/10 transition-colors">Case 3</div>
                      <div className="px-2 py-1 bg-[rgb(214,251,65)]/20 text-[rgb(214,251,65)] rounded cursor-pointer hover:bg-[rgb(214,251,65)]/30 transition-colors">+</div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="text-gray-400 mb-1">Input:</div>
                      <div className="bg-[rgb(20,20,22)] p-2 rounded">
                        <div>5</div>
                        <div>1 2 3 4 5</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
