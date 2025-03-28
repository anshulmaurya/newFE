import { motion } from "framer-motion";

interface HeroProps {
  onScrollToFeatures: () => void;
  onScrollToWaitlist: () => void;
}

export default function Hero({ onScrollToFeatures, onScrollToWaitlist }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 pb-16">
      {/* Circuit board decorative elements */}
      <div className="absolute top-1/4 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-pink-500/5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left side: Title, Subheading, Buttons */}
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight flex flex-col items-start">
              <span className="gradient-text mb-1">Learning</span>
              <span className="gradient-text mb-2">Embedded Systems</span>
              <motion.div 
                className="text-white text-3xl md:text-4xl relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.7, 
                  delay: 0.8,
                  ease: [0.22, 1, 0.36, 1] 
                }}
              >
                <span className="relative">
                  Redefined
                  <motion.span 
                    className="absolute -bottom-2 left-0 w-full h-1 bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 1.2,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  />
                </span>
              </motion.div>
            </h1>
            
            <p className="text-slate-300 text-lg mb-8 max-w-xl">
              Master embedded programming with our interactive platform. Practice real problems, get instant feedback, and land your dream job.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center lg:justify-start gap-4 mb-6">
              <button 
                onClick={onScrollToWaitlist}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-900 font-bold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20 w-full sm:w-auto"
              >
                Join the Waitlist
              </button>
              <button 
                onClick={onScrollToFeatures}
                className="px-6 py-3 border border-primary/50 text-primary hover:bg-primary/10 rounded-lg transition-all w-full sm:w-auto"
              >
                Explore Features
              </button>
            </div>
            
            <motion.div 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-slate-400 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <div className="text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <span>200+ Problems</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <span>C/C++/Assembly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <span>Expert-Reviewed</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right side: Code preview */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="code-block rounded-lg p-4 font-mono text-sm sm:text-base shadow-xl border border-slate-700/50 overflow-hidden bg-slate-950/50 backdrop-blur-sm">
              <div className="flex items-center mb-3 text-xs gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="ml-2 text-slate-400 font-medium">pwm_controller.c</span>
              </div>

              <div className="code-block bg-slate-900/80 p-4 rounded-md font-mono text-sm overflow-auto">
                <div><span className="text-pink-500">#include</span> <span className="text-green-400">"timer.h"</span></div>
                <div><span className="text-pink-500">#include</span> <span className="text-green-400">"gpio.h"</span></div>
                <div></div>
                <div><span className="text-primary">void</span> <span className="text-blue-400">pwm_init</span>(<span className="text-primary">uint8_t</span> channel, <span className="text-primary">uint32_t</span> frequency) {'{'}</div>
                <div className="pl-4"><span className="text-slate-400">// Configure timer for PWM generation</span></div>
                <div className="pl-4"><span className="text-purple-500">timer_init</span>(channel, frequency);</div>
                <div className="pl-4"><span className="text-purple-500">timer_set_mode</span>(channel, <span className="text-orange-400">TIMER_MODE_PWM</span>);</div>
                <div></div>
                <div className="pl-4"><span className="text-slate-400">// Configure GPIO pin as output</span></div>
                <div className="pl-4"><span className="text-purple-500">gpio_set_mode</span>(<span className="text-orange-400">PWM_PORT</span>, <span className="text-orange-400">PWM_PIN</span>, <span className="text-orange-400">GPIO_MODE_OUTPUT</span>);</div>
                <div>{'}'}</div>
                <div></div>
                <div><span className="text-primary">void</span> <span className="text-blue-400">pwm_set_duty</span>(<span className="text-primary">uint8_t</span> channel, <span className="text-primary">uint8_t</span> duty_percent) {'{'}</div>
                <div className="pl-4"><span className="text-primary">uint32_t</span> period = <span className="text-purple-500">timer_get_period</span>(channel);</div>
                <div className="pl-4"><span className="text-primary">uint32_t</span> compare = (period * duty_percent) / <span className="text-purple-500">100</span>;</div>
                <div className="pl-4"><span className="text-purple-500">timer_set_compare</span>(channel, compare);</div>
                <div>{'}'}</div>
              </div>
              
              {/* Visual indicator for embedded system */}
              <div className="mt-5 p-3 bg-slate-800 rounded-md flex flex-col border border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white font-medium">PWM Signal Visualization</span>
                  <span className="px-2 py-1 bg-primary/20 rounded text-primary text-xs">50% Duty Cycle</span>
                </div>
                
                {/* PWM Waveform */}
                <div className="h-16 bg-slate-900 rounded-md relative overflow-hidden p-2">
                  <svg className="w-full h-full" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="200" y2="30" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1="50" y1="0" x2="50" y2="60" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1="100" y1="0" x2="100" y2="60" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1="150" y1="0" x2="150" y2="60" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
                    
                    {/* PWM Wave - 50% duty cycle */}
                    <path 
                      d="M0,10 H50 V50 H100 V10 H150 V50 H200" 
                      fill="none" 
                      stroke="var(--primary)" 
                      strokeWidth="3"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
                
                <div className="flex justify-between text-xs text-slate-500 mt-1 px-1">
                  <span>0ms</span>
                  <span>Time</span>
                  <span>4ms</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
