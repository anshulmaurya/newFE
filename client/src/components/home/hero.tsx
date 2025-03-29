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
          
          {/* Right side: VS Code-like Reverse Linked List Problem */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="code-block rounded-lg overflow-hidden shadow-xl border border-gray-700/50 bg-[rgb(18,18,20)] backdrop-blur-sm">
              <img 
                src="/attached_assets/image_1743228272928.png" 
                alt="Reverse Linked List Problem" 
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
