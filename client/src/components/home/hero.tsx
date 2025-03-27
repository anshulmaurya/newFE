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
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-white">Crack </span>
            <span className="gradient-text">Embedded System</span>
            <span className="text-white"> Interviews</span>
          </motion.h1>
          
          <motion.p 
            className="text-slate-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Master embedded programming with our interactive platform. Practice real problems, get instant feedback, and land your dream job.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
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
          </motion.div>
          
          {/* Code preview */}
          <motion.div 
            className="code-block rounded-lg p-4 font-mono text-sm sm:text-base shadow-xl border border-slate-700/50 overflow-hidden mx-auto mb-8 max-w-2xl text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center mb-2 text-xs gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="ml-2 text-slate-400">rtos_scheduler.c</span>
            </div>
            <pre>{`<span class="text-pink-500">typedef struct</span> {
  <span class="text-primary">TaskHandle_t</span> handle;
  <span class="text-primary">uint8_t</span> priority;
  <span class="text-primary">TaskState_t</span> state;
} <span class="text-purple-500">Task_t</span>;

<span class="text-primary">void</span> <span class="text-blue-400">scheduler_init</span>(<span class="text-primary">void</span>) {
  <span class="text-slate-400">// Initialize the task scheduler</span>
  task_queue = <span class="text-pink-500">create_priority_queue</span>();
  <span class="text-pink-500">current_task</span> = <span class="text-primary">NULL</span>;
  
  <span class="text-purple-500">SysTick_Config</span>(SystemCoreClock / <span class="text-purple-500">1000</span>);
}`}</pre>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center gap-8 text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
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
        </div>
      </div>
    </section>
  );
}
