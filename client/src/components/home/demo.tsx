import { motion } from "framer-motion";
import { 
  Play, 
  RotateCcw, 
  HelpCircle 
} from "lucide-react";

export default function Demo() {
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
          {/* Workspace header */}
          <div className="bg-primary-900 border-b border-slate-700/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-primary font-mono text-sm">Problem:</span>
              <h3 className="font-medium">Implement a PWM Generator</h3>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-3 py-1 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                <span>Hint</span>
              </button>
              <button className="px-3 py-1 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1">
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
              <button className="px-3 py-1 text-xs rounded-md bg-primary hover:bg-primary/90 text-primary-900 font-medium flex items-center gap-1">
                <Play className="h-3 w-3" />
                <span>Run</span>
              </button>
            </div>
          </div>
          
          {/* IDE layout */}
          <div className="flex flex-col md:flex-row">
            {/* Editor panel */}
            <div className="w-full md:w-2/3 border-r border-slate-700/50">
              <div className="border-b border-slate-700/50 bg-slate-800/30 p-2 flex">
                <div className="px-4 py-1 bg-slate-800 rounded-t-md text-sm">pwm.c</div>
                <div className="px-4 py-1 text-sm text-slate-400">timer.h</div>
                <div className="px-4 py-1 text-sm text-slate-400">gpio.h</div>
              </div>
              <div className="p-4 font-mono text-sm overflow-auto h-80 code-block">
                <pre className="language-c">
                  <code>
                    <span className="text-slate-400">// PWM Generator Implementation
// TODO: Complete the code below</span>

                    <span className="text-primary">#include</span> <span className="text-pink-500">"timer.h"</span>
                    <span className="text-primary">#include</span> <span className="text-pink-500">"gpio.h"</span>

                    <span className="text-primary">void</span> <span className="text-blue-400">pwm_init</span>(<span className="text-primary">uint8_t</span> channel, <span className="text-primary">uint32_t</span> frequency) {'{'}
                      <span className="text-slate-400">// Initialize the timer peripheral</span>
                      <span className="text-purple-500">timer_init</span>(channel, frequency);
                      
                      <span className="text-slate-400">// Configure GPIO pin as output</span>
                      <span className="text-purple-500">gpio_set_mode</span>(PWM_PORT, PWM_PIN, GPIO_MODE_OUTPUT);
                      
                      <span className="text-slate-400">// TODO: Configure timer for PWM mode</span>
                      
                    {'}'}

                    <span className="text-primary">void</span> <span className="text-blue-400">pwm_set_duty_cycle</span>(<span className="text-primary">uint8_t</span> channel, <span className="text-primary">uint8_t</span> duty_cycle) {'{'}
                      <span className="text-slate-400">// TODO: Set the PWM duty cycle (0-100%)</span>
                      <span className="text-slate-400">// Hint: Calculate the compare value based on the duty cycle</span>
                      
                      <span className="text-primary">uint32_t</span> period = <span className="text-purple-500">timer_get_period</span>(channel);
                      <span className="text-primary">uint32_t</span> compare_value = 0;
                      
                      <span className="text-slate-400">// Set the compare value</span>
                    {'}'}
                  </code>
                </pre>
              </div>
            </div>
            
            {/* Output panel */}
            <div className="w-full md:w-1/3 flex flex-col">
              <div className="border-b border-slate-700/50 bg-slate-800/30 p-2 flex">
                <div className="px-4 py-1 bg-slate-800 rounded-t-md text-sm">Output</div>
              </div>
              <div className="p-4 font-mono text-sm overflow-auto h-60">
                <div className="text-slate-400">
                  &gt; Compiling source code...<br />
                  &gt; Build successful<br />
                  &gt; Running tests...<br />
                  <span className="text-red-400">ERROR: PWM duty cycle not properly configured</span><br />
                  <span className="text-red-400">Test failed: Expected PWM output at 50% duty cycle</span>
                </div>
              </div>
              
              {/* PWM Visualization */}
              <div className="p-4 border-t border-slate-700/50">
                <h4 className="text-sm font-medium mb-2">PWM Output Visualization</h4>
                <div className="h-20 bg-slate-800 rounded-md p-2 flex items-center">
                  <svg className="w-full h-full" viewBox="0 0 300 60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,30 H50 V5 H150 V30 H200 V5 H300 V30" stroke="var(--primary)" strokeWidth="2" fill="none" />
                    <path d="M0,30 H300" stroke="#64748B" strokeWidth="1" strokeDasharray="4 4" fill="none" />
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
