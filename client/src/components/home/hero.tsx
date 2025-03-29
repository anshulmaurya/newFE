import { motion } from "framer-motion";

interface HeroProps {
  onScrollToFeatures: () => void;
}

export default function Hero({ onScrollToFeatures }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 pb-16 bg-[rgb(24,24,26)]">
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
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="code-block rounded-lg p-4 font-mono text-sm sm:text-base shadow-xl border border-gray-700/50 overflow-hidden bg-[rgb(18,18,20)] backdrop-blur-sm">
              {/* VS Code-like header */}
              <div className="flex flex-col">
                {/* Window controls and tabs */}
                <div className="flex items-center text-xs border-b border-gray-700/50 pb-2">
                  <div className="flex items-center gap-2 mr-4">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  </div>
                  <div className="flex">
                    <div className="px-3 py-1 bg-[rgb(24,24,26)] rounded-t-md border-b-2 border-[rgb(214,251,65)] text-gray-300 font-medium flex items-center gap-2">
                      <span className="text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 18l6-6-6-6" />
                          <path d="M8 6l-6 6 6 6" />
                        </svg>
                      </span>
                      <span>rtos_tasks.c</span>
                    </div>
                    <div className="px-3 py-1 text-gray-500 flex items-center">
                      task_interface.h
                    </div>
                  </div>
                </div>
                
                {/* Line numbers and code */}
                <div className="flex mt-2">
                  {/* Line numbers */}
                  <div className="pr-4 text-right text-gray-600 select-none border-r border-gray-700/50 mr-3">
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                    <div>5</div>
                    <div>6</div>
                    <div>7</div>
                    <div>8</div>
                    <div>9</div>
                    <div>10</div>
                    <div>11</div>
                    <div>12</div>
                    <div>13</div>
                    <div>14</div>
                    <div>15</div>
                    <div>16</div>
                    <div>17</div>
                  </div>
                  
                  {/* Code */}
                  <div className="flex-1 overflow-x-auto">
                    <div><span className="text-pink-500">#include</span> <span className="text-green-400">&lt;FreeRTOS.h&gt;</span></div>
                    <div><span className="text-pink-500">#include</span> <span className="text-green-400">&lt;task.h&gt;</span></div>
                    <div><span className="text-pink-500">#include</span> <span className="text-green-400">&lt;semphr.h&gt;</span></div>
                    <div></div>
                    <div><span className="text-gray-400">// Mutex for sensor data access</span></div>
                    <div><span className="text-blue-500">SemaphoreHandle_t</span> <span className="text-orange-400">sensorMutex</span>;</div>
                    <div><span className="text-blue-500">SensorData_t</span> <span className="text-orange-400">sharedSensorData</span>;</div>
                    <div></div>
                    <div><span className="text-purple-500">void</span> <span className="text-blue-400">SensorTask</span>(<span className="text-purple-500">void</span>* <span className="text-orange-400">pvParameters</span>) {'{'}</div>
                    <div className="pl-4"><span className="text-blue-500">while</span>(1) {'{'}</div>
                    <div className="pl-8"><span className="text-gray-400">// Acquire new sensor readings</span></div>
                    <div className="pl-8"><span className="text-blue-500">SensorData_t</span> <span className="text-orange-400">newData</span> = <span className="text-blue-400">ReadSensors</span>();</div>
                    <div className="pl-8"></div>
                    <div className="pl-8"><span className="text-gray-400">// Update shared data with mutex protection</span></div>
                    <div className="pl-8"><span className="text-pink-500">if</span> (<span className="text-blue-400">xSemaphoreTake</span>(<span className="text-orange-400">sensorMutex</span>, <span className="text-orange-400">portMAX_DELAY</span>)) {'{'}</div>
                    <div className="pl-12"><span className="text-orange-400">sharedSensorData</span> = <span className="text-orange-400">newData</span>;</div>
                    <div className="pl-12"><span className="text-blue-400">xSemaphoreGive</span>(<span className="text-orange-400">sensorMutex</span>);</div>
                    <div className="pl-8">{'}'}</div>
                    <div className="pl-8"><span className="text-blue-400">vTaskDelay</span>(<span className="text-orange-400">pdMS_TO_TICKS</span>(100));</div>
                    <div className="pl-4">{'}'}</div>
                    <div>{'}'}</div>
                  </div>
                </div>
              </div>
              
              {/* Task visualization */}
              <div className="mt-5 p-3 bg-[rgb(24,24,26)] rounded-md flex flex-col border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white font-medium">Task Execution Visualization</span>
                  <span className="px-2 py-1 bg-[rgb(214,251,65)]/20 rounded text-[rgb(214,251,65)] text-xs">RTOS Scheduler</span>
                </div>
                
                {/* Task scheduling visualization */}
                <div className="h-16 bg-[rgb(18,18,20)] rounded-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col">
                    <div className="h-1/3 border-b border-gray-800 flex">
                      <div className="bg-[rgb(214,251,65)]/40 h-full w-[20%]"></div>
                      <div className="bg-transparent h-full w-[10%]"></div>
                      <div className="bg-[rgb(214,251,65)]/40 h-full w-[30%]"></div>
                      <div className="bg-transparent h-full w-[15%]"></div>
                      <div className="bg-[rgb(214,251,65)]/40 h-full w-[25%] animate-pulse"></div>
                    </div>
                    <div className="h-1/3 border-b border-gray-800 flex">
                      <div className="bg-transparent h-full w-[15%]"></div>
                      <div className="bg-blue-500/40 h-full w-[25%]"></div>
                      <div className="bg-transparent h-full w-[20%]"></div>
                      <div className="bg-blue-500/40 h-full w-[30%]"></div>
                      <div className="bg-transparent h-full w-[10%] animate-pulse"></div>
                    </div>
                    <div className="h-1/3 flex">
                      <div className="bg-transparent h-full w-[5%]"></div>
                      <div className="bg-green-500/40 h-full w-[15%]"></div>
                      <div className="bg-transparent h-full w-[10%]"></div>
                      <div className="bg-green-500/40 h-full w-[20%]"></div>
                      <div className="bg-transparent h-full w-[10%]"></div>
                      <div className="bg-green-500/40 h-full w-[40%] animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[rgb(214,251,65)]/60 rounded-sm"></div>
                    <span className="text-gray-300">Sensor Task</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500/60 rounded-sm"></div>
                    <span className="text-gray-300">Processing Task</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500/60 rounded-sm"></div>
                    <span className="text-gray-300">Output Task</span>
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
