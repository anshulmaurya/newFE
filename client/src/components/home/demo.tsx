import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  RotateCcw, 
  HelpCircle,
  AlertCircle,
  Terminal,
  Bug
} from "lucide-react";
import DemoHeaderFiles from "./demo-header-files";

export default function Demo() {
  const [activeFile, setActiveFile] = useState<'pwm.c' | 'timer.h' | 'gpio.h'>('pwm.c');
  const [activeTab, setActiveTab] = useState<'terminal' | 'problems' | 'debug'>('terminal');
  
  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900 via-slate-800/50 to-primary-900 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            <span className="text-white">Interactive Learning</span>
            <span className="text-primary"> Environment</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Our platform provides a realistic coding environment to practice embedded programming.
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-5xl mx-auto glass rounded-xl overflow-hidden border border-slate-700/50 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* VS Code inspired header with title bar */}
          <div className="bg-[#1e1e1e] border-b border-[#2d2d2d] p-1 flex items-center">
            <div className="flex items-center gap-2 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 text-center text-sm text-slate-400">DSPCoder - Embedded Problem: Implement a PWM Generator</div>
          </div>
          
          {/* VS Code inspired menu bar */}
          <div className="bg-[#252526] border-b border-[#2d2d2d] p-1 flex items-center text-xs text-slate-400">
            <div className="px-3 py-1 hover:bg-[#3c3c3c] cursor-pointer">File</div>
            <div className="px-3 py-1 hover:bg-[#3c3c3c] cursor-pointer">Edit</div>
            <div className="px-3 py-1 hover:bg-[#3c3c3c] cursor-pointer">View</div>
            <div className="px-3 py-1 hover:bg-[#3c3c3c] cursor-pointer">Run</div>
            <div className="px-3 py-1 hover:bg-[#3c3c3c] cursor-pointer">Terminal</div>
            <div className="px-3 py-1 hover:bg-[#3c3c3c] cursor-pointer">Help</div>
            <div className="ml-auto flex items-center gap-3">
              <button className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                <span>Hint</span>
              </button>
              <button className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center gap-1">
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
              <button className="px-3 py-1 rounded-md bg-primary hover:bg-primary/90 text-primary-900 font-medium flex items-center gap-1">
                <Play className="h-3 w-3" />
                <span>Run</span>
              </button>
            </div>
          </div>
          
          {/* IDE layout */}
          <div className="flex flex-col md:flex-row">
            {/* VS Code sidebar with explorer */}
            <div className="hidden md:block w-12 bg-[#252526] border-r border-[#3d3d3d] flex flex-col items-center py-2 space-y-4">
              <div className="p-1 border-l-2 border-primary bg-[#37373d]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                  <path d="M3 6h18"></path>
                  <path d="M6 12h18"></path>
                  <path d="M9 18h18"></path>
                </svg>
              </div>
              <div className="p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 hover:text-slate-300">
                  <path d="M11 18c0 1.1-.9 2-2 2a2 2 0 0 1-2-2c0-1.1.9-2 2-2s2 .9 2 2Z"></path>
                  <path d="M22 18c0 1.1-.9 2-2 2a2 2 0 0 1-2-2c0-1.1.9-2 2-2s2 .9 2 2Z"></path>
                  <path d="M6 12V2h12v10"></path>
                  <path d="M17 12H7"></path>
                  <path d="M9 18v-6"></path>
                  <path d="M20 18v-6"></path>
                </svg>
              </div>
              <div className="p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 hover:text-slate-300">
                  <path d="m18 16 4-4-4-4"></path>
                  <path d="m6 8-4 4 4 4"></path>
                  <path d="m14.5 4-5 16"></path>
                </svg>
              </div>
            </div>
        
            {/* Editor panel */}
            <div className="w-full md:w-7/12 border-r border-[#3d3d3d] bg-[#1e1e1e]">
              {/* VS Code file tabs */}
              <div className="border-b border-[#3d3d3d] flex">
                <div 
                  className={`px-4 py-2 border-r border-[#3d3d3d] text-sm flex items-center gap-2 cursor-pointer ${activeFile === 'pwm.c' 
                    ? 'bg-[#1e1e1e] text-white' 
                    : 'bg-[#252526] text-slate-400'}`}
                  onClick={() => setActiveFile('pwm.c')}
                >
                  <div className={`w-2 h-2 rounded-full ${activeFile === 'pwm.c' ? 'bg-primary' : 'bg-slate-500'}`}></div>
                  pwm.c
                </div>
                <div 
                  className={`px-4 py-2 border-r border-[#3d3d3d] text-sm flex items-center gap-2 cursor-pointer ${activeFile === 'timer.h' 
                    ? 'bg-[#1e1e1e] text-white' 
                    : 'bg-[#252526] text-slate-400'}`}
                  onClick={() => setActiveFile('timer.h')}
                >
                  <div className={`w-2 h-2 rounded-full ${activeFile === 'timer.h' ? 'bg-primary' : 'bg-slate-500'}`}></div>
                  timer.h
                </div>
                <div 
                  className={`px-4 py-2 border-r border-[#3d3d3d] text-sm flex items-center gap-2 cursor-pointer ${activeFile === 'gpio.h' 
                    ? 'bg-[#1e1e1e] text-white' 
                    : 'bg-[#252526] text-slate-400'}`}
                  onClick={() => setActiveFile('gpio.h')}
                >
                  <div className={`w-2 h-2 rounded-full ${activeFile === 'gpio.h' ? 'bg-primary' : 'bg-slate-500'}`}></div>
                  gpio.h
                </div>
              </div>
              
              {/* VS Code editor area with line numbers */}
              <div className="flex h-80 overflow-auto code-block">
                {/* Line numbers */}
                <div className="px-2 py-4 text-right bg-[#1e1e1e] text-slate-600 font-mono text-xs select-none">
                  {Array.from({ length: activeFile === 'pwm.c' ? 19 : activeFile === 'timer.h' ? 60 : 65 }).map((_, i) => (
                    <div key={i} className="h-6">{i + 1}</div>
                  ))}
                </div>
                
                {/* Code content - dynamically show the selected file */}
                <DemoHeaderFiles activeFile={activeFile} />
                
                {/* Minimap */}
                <div className="w-[30px] bg-[#252526] opacity-70" aria-hidden="true"></div>
              </div>
              
              {/* VS Code status bar */}
              <div className="bg-[#007acc] h-6 flex items-center text-xs text-white px-2 justify-between">
                <div className="flex items-center gap-3">
                  <span>PWM Generator</span>
                  <span>C/C++</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>Line {activeFile === 'pwm.c' ? '18' : activeFile === 'timer.h' ? '42' : '33'}, Col 2</span>
                  <span>UTF-8</span>
                </div>
              </div>
            </div>
            
            {/* VS Code output panels */}
            <div className="w-full md:w-1/3 flex flex-col bg-[#1e1e1e]">
              {/* VS Code panel tabs */}
              <div className="border-b border-[#3d3d3d] bg-[#252526] flex items-center px-2">
                <div 
                  className={`px-3 py-2 text-sm flex items-center gap-1.5 cursor-pointer ${activeTab === 'terminal' 
                    ? 'border-b border-primary text-white' 
                    : 'text-slate-400 hover:text-slate-300'}`}
                  onClick={() => setActiveTab('terminal')}
                >
                  <Terminal className="w-3 h-3" />
                  <span>Terminal</span>
                </div>
                <div 
                  className={`px-3 py-2 text-sm flex items-center gap-1.5 cursor-pointer ${activeTab === 'problems' 
                    ? 'border-b border-primary text-white' 
                    : 'text-slate-400 hover:text-slate-300'}`}
                  onClick={() => setActiveTab('problems')}
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>Problems</span>
                </div>
                <div 
                  className={`px-3 py-2 text-sm flex items-center gap-1.5 cursor-pointer ${activeTab === 'debug' 
                    ? 'border-b border-primary text-white' 
                    : 'text-slate-400 hover:text-slate-300'}`}
                  onClick={() => setActiveTab('debug')}
                >
                  <Bug className="w-3 h-3" />
                  <span>Debug Console</span>
                </div>
              </div>
              
              {/* Terminal output */}
              {activeTab === 'terminal' && (
                <div className="font-mono text-xs p-2 overflow-auto h-60 bg-[#1e1e1e]">
                  <div className="text-slate-400">
                    <p className="py-0.5"><span className="text-green-400">$</span> <span className="text-white">gcc -o pwm pwm.c -I./include</span></p>
                    <p className="py-0.5"><span className="text-green-400">$</span> <span className="text-white">./run_tests.sh</span></p>
                    <p className="py-0.5">[INFO] Compiling source code...</p>
                    <p className="py-0.5">[INFO] Build successful</p>
                    <p className="py-0.5">[INFO] Running tests...</p>
                    <p className="py-0.5"><span className="text-red-400">[ERROR] PWM duty cycle not properly configured</span></p>
                    <p className="py-0.5"><span className="text-red-400">[ERROR] Test failed: Expected PWM output at 50% duty cycle</span></p>
                    <p className="py-0.5">[INFO] 0 tests passed, 1 failed</p>
                    <p className="py-0.5 text-white"><span className="animate-[blink_1s_infinite]">|</span></p>
                  </div>
                </div>
              )}
              
              {/* Problems panel */}
              {activeTab === 'problems' && (
                <div className="font-mono text-xs p-2 overflow-auto h-60 bg-[#1e1e1e]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-white">PROBLEMS (2)</p>
                    <div className="flex items-center gap-2 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                  </div>
                  <div className="mb-1 text-xs flex items-center gap-2 p-1 hover:bg-[#2a2d2e] cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span className="text-white">Missing PWM configuration in pwm_init() function</span>
                    <span className="text-slate-500 ml-auto">pwm.c:13</span>
                  </div>
                  <div className="text-xs flex items-center gap-2 p-1 hover:bg-[#2a2d2e] cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span className="text-white">Duty cycle not properly calculated in pwm_set_duty_cycle</span>
                    <span className="text-slate-500 ml-auto">pwm.c:22</span>
                  </div>
                </div>
              )}
              
              {/* Debug Console panel */}
              {activeTab === 'debug' && (
                <div className="font-mono text-xs p-2 overflow-auto h-60 bg-[#1e1e1e]">
                  <div className="text-slate-400">
                    <p className="py-0.5">[DEBUG] Program execution started</p>
                    <p className="py-0.5">[DEBUG] timer_init() called with channel = 0, frequency = 1000</p>
                    <p className="py-0.5">[DEBUG] gpio_set_mode() called with port = 1, pin = 5, mode = 1</p>
                    <p className="py-0.5">[DEBUG] pwm_init() completed, but PWM mode not configured</p>
                    <p className="py-0.5">[DEBUG] pwm_set_duty_cycle() called with channel = 0, duty_cycle = 50</p>
                    <p className="py-0.5">[DEBUG] timer_get_period() returned value = 1000</p>
                    <p className="py-0.5">[DEBUG] compare_value not set, still equals 0</p>
                    <p className="py-0.5">[DEBUG] timer_set_compare() not called</p>
                    <p className="py-0.5">[DEBUG] Output pin is generating constant LOW signal</p>
                    <p className="py-0.5 mt-2 text-yellow-400">[HINT] To generate proper PWM signal:</p>
                    <p className="py-0.5 text-yellow-400">[HINT] 1. Configure timer in PWM mode using timer_config_pwm_mode()</p>
                    <p className="py-0.5 text-yellow-400">[HINT] 2. Calculate compare value based on duty_cycle percentage</p>
                    <p className="py-0.5 text-white mt-1"><span className="animate-[blink_1s_infinite]">|</span></p>
                  </div>
                </div>
              )}
              
              {/* PWM Visualization Panel with VS Code styling */}
              <div className="border-t border-[#3d3d3d] p-3">
                <h4 className="text-xs font-medium mb-2 text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                  PWM Output Visualization
                </h4>
                <div className="h-20 bg-[#2d2d2d] rounded-sm p-2 flex items-center">
                  <svg className="w-full h-full" viewBox="0 0 300 60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,30 H50 V5 H150 V30 H200 V5 H300 V30" stroke="var(--primary)" strokeWidth="2" fill="none" />
                    <path d="M0,30 H300" stroke="#4d4d4d" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                    <text x="10" y="50" fill="#94A3B8" fontSize="10">0%</text>
                    <text x="140" y="50" fill="#94A3B8" fontSize="10">50%</text>
                    <text x="270" y="50" fill="#94A3B8" fontSize="10">100%</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}