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

export default function Demo() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'problems' | 'debug'>('terminal');
  
  return (
    <section className="py-16 md:py-24 relative bg-[rgb(24,24,26)]">
      <div className="absolute inset-0 bg-gradient-to-b from-[rgb(24,24,26)] via-[rgb(24,24,26)] to-[rgb(24,24,26)] pointer-events-none"></div>
      
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
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our platform provides a realistic coding environment to practice embedded programming.
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-5xl mx-auto glass rounded-xl overflow-hidden border border-gray-700/50 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Tools and output panel */}
          <div className="bg-[#252526] border-b border-[#2d2d2d] p-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center flex-wrap gap-2">
              <div className="px-4 py-2 rounded-md bg-[rgb(24,24,26)] hover:bg-[rgb(18,18,20)] text-gray-300 flex items-center gap-2 cursor-pointer">
                <HelpCircle className="h-4 w-4" />
                <span>Documentation</span>
              </div>
              <div className="px-4 py-2 rounded-md bg-[rgb(24,24,26)] hover:bg-[rgb(18,18,20)] text-gray-300 flex items-center gap-2 cursor-pointer">
                <RotateCcw className="h-4 w-4" />
                <span>Reset Exercise</span>
              </div>
            </div>
            
            <div className="px-4 py-2 rounded-md bg-[rgb(214,251,65)] hover:bg-[rgb(214,251,65)]/90 text-[rgb(18,18,20)] font-medium flex items-center gap-2 cursor-pointer ml-auto">
              <Play className="h-4 w-4" />
              <span>Run Tests</span>
            </div>
          </div>
                    
          {/* VS Code output panels */}
          <div className="flex flex-col bg-[#1e1e1e]">
            {/* VS Code panel tabs */}
            <div className="border-b border-[#3d3d3d] bg-[#252526] flex items-center px-2">
              <div 
                className={`px-3 py-2 text-sm flex items-center gap-1.5 cursor-pointer ${activeTab === 'terminal' 
                  ? 'border-b border-[rgb(214,251,65)] text-white' 
                  : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('terminal')}
              >
                <Terminal className="w-3 h-3" />
                <span>Terminal</span>
              </div>
              <div 
                className={`px-3 py-2 text-sm flex items-center gap-1.5 cursor-pointer ${activeTab === 'problems' 
                  ? 'border-b border-[rgb(214,251,65)] text-white' 
                  : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('problems')}
              >
                <AlertCircle className="w-3 h-3" />
                <span>Problems</span>
              </div>
              <div 
                className={`px-3 py-2 text-sm flex items-center gap-1.5 cursor-pointer ${activeTab === 'debug' 
                  ? 'border-b border-[rgb(214,251,65)] text-white' 
                  : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('debug')}
              >
                <Bug className="w-3 h-3" />
                <span>Debug Console</span>
              </div>
            </div>
            
            {/* Terminal output */}
            {activeTab === 'terminal' && (
              <div className="font-mono text-xs p-4 overflow-auto h-60 bg-[#1e1e1e]">
                <div className="text-gray-400">
                  <p className="py-0.5"><span className="text-[rgb(214,251,65)]">$</span> <span className="text-white">gcc -o pwm pwm.c -I./include</span></p>
                  <p className="py-0.5"><span className="text-[rgb(214,251,65)]">$</span> <span className="text-white">./run_tests.sh</span></p>
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
              <div className="font-mono text-xs p-4 overflow-auto h-60 bg-[#1e1e1e]">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-medium text-white">PROBLEMS (2)</p>
                  <div className="flex items-center gap-2 text-gray-400">
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
                <div className="mb-3 text-xs flex items-center gap-2 p-2 hover:bg-[#2a2d2e] cursor-pointer border border-[#3d3d3d] rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span className="text-white">Missing PWM configuration in pwm_init() function</span>
                  <span className="text-gray-500 ml-auto">pwm.c:13</span>
                </div>
                <div className="text-xs flex items-center gap-2 p-2 hover:bg-[#2a2d2e] cursor-pointer border border-[#3d3d3d] rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span className="text-white">Duty cycle not properly calculated in pwm_set_duty_cycle</span>
                  <span className="text-gray-500 ml-auto">pwm.c:22</span>
                </div>
              </div>
            )}
            
            {/* Debug Console panel */}
            {activeTab === 'debug' && (
              <div className="font-mono text-xs p-4 overflow-auto h-60 bg-[#1e1e1e]">
                <div className="text-gray-400">
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
                  <p className="py-0.5 text-yellow-400">[HINT] 1. Configure timer for PWM mode using timer_config_pwm_mode()</p>
                  <p className="py-0.5 text-yellow-400">[HINT] 2. Calculate compare value based on the duty cycle percentage</p>
                  <p className="py-0.5 text-yellow-400">[HINT] 3. Set the compare value using timer_set_compare()</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}