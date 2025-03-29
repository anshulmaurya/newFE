import { motion } from "framer-motion";
import { useState } from "react";
import { Code, Newspaper, BookOpen, Building, Calendar, Users } from "lucide-react";

interface Feature {
  id: number;
  icon: JSX.Element;
  emoji: string;
  title: string;
  description: string;
  previewImage: JSX.Element;
}

export default function PlatformFeatures() {
  const [activeFeature, setActiveFeature] = useState<number>(1);

  const features: Feature[] = [
    {
      id: 1,
      icon: <Code className="w-5 h-5" />,
      emoji: "1️⃣",
      title: "Code Directly in VS Code",
      description: "Write, compile, and test your embedded code seamlessly within VS Code. No setup hassles—just code and focus on problem-solving.",
      previewImage: (
        <div className="h-full w-full bg-[rgb(18,18,20)] rounded-lg shadow-lg border border-[rgb(30,30,32)]">
          <div className="flex space-x-2 p-3 border-b border-[rgb(30,30,32)]">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex h-[350px]">
            <div className="w-14 bg-[rgb(24,24,26)] flex flex-col items-center py-4 space-y-4 border-r border-[rgb(30,30,32)]">
              <div className="w-6 h-6 rounded bg-[rgb(30,30,32)]"></div>
              <div className="w-6 h-6 rounded bg-[rgb(30,30,32)]"></div>
              <div className="w-6 h-6 rounded bg-[rgb(214,251,65)]/20"></div>
              <div className="w-6 h-6 rounded bg-[rgb(30,30,32)]"></div>
              <div className="w-6 h-6 rounded bg-[rgb(30,30,32)]"></div>
            </div>
            <div className="flex-1 bg-[rgb(24,24,26)] p-4 text-xs font-mono">
              <div className="mb-1 text-green-400">#include &lt;stdint.h&gt;</div>
              <div className="mb-1 text-green-400">#include "FreeRTOS.h"</div>
              <div className="mb-1 text-green-400">#include "task.h"</div>
              <div className="mb-1 text-green-400">#include "queue.h"</div>
              <div className="mb-3"></div>
              <div className="mb-1"><span className="text-purple-400">static QueueHandle_t</span> <span className="text-blue-400">dataQueue</span>;</div>
              <div className="mb-1"><span className="text-purple-400">static TaskHandle_t</span> <span className="text-blue-400">sensorTaskHandle</span>;</div>
              <div className="mb-3"></div>
              <div className="mb-1"><span className="text-purple-400">void</span> <span className="text-blue-400">sensorTask</span>(<span className="text-purple-400">void*</span> <span className="text-orange-400">pvParameters</span>) {'{'}</div>
              <div className="mb-1 pl-4"><span className="text-purple-400">sensor_data_t</span> <span className="text-blue-400">data</span>;</div>
              <div className="mb-1 pl-4"></div>
              <div className="mb-1 pl-4"><span className="text-purple-400">while</span> (<span className="text-blue-400">1</span>) {'{'}</div>
              <div className="mb-1 pl-8"><span className="text-gray-400">// Read from sensor and prepare data</span></div>
              <div className="mb-1 pl-8"><span className="text-blue-400">readSensorData</span>(&<span className="text-blue-400">data</span>);</div>
              <div className="mb-1 pl-8"></div>
              <div className="mb-1 pl-8"><span className="text-gray-400">// Send data to processing task</span></div>
              <div className="mb-1 pl-8"><span className="text-blue-400">xQueueSend</span>(<span className="text-blue-400">dataQueue</span>, &<span className="text-blue-400">data</span>, <span className="text-blue-400">pdMS_TO_TICKS</span>(<span className="text-yellow-400">100</span>));</div>
              <div className="mb-1 pl-8"></div>
              <div className="mb-1 pl-8"><span className="text-gray-400">// Wait before next reading</span></div>
              <div className="mb-1 pl-8"><span className="text-blue-400">vTaskDelay</span>(<span className="text-blue-400">pdMS_TO_TICKS</span>(<span className="text-yellow-400">500</span>));</div>
              <div className="mb-1 pl-4">{'}'}  <span className="text-gray-400">// end while</span></div>
              <div className="mb-1">{'}'} <span className="text-gray-400">// end sensorTask</span></div>
              <div className="relative">
                <div className="absolute h-5 w-2 bg-[rgb(214,251,65)]/70 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      icon: <BookOpen className="w-5 h-5" />,
      emoji: "2️⃣",
      title: "200+ Expert-Reviewed Coding Questions",
      description: "Practice real-world embedded systems problems, curated and reviewed by industry experts, ensuring you're always prepared for tough interviews.",
      previewImage: (
        <div className="h-full w-full bg-[rgb(18,18,20)] rounded-lg shadow-lg border border-[rgb(30,30,32)] overflow-hidden">
          <div className="p-4 border-b border-[rgb(30,30,32)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-[rgb(214,251,65)]/20 text-[rgb(214,251,65)] px-2 py-1 rounded-full text-xs">Memory Management</div>
                <div className="text-pink-500 text-xs font-medium px-2 py-1 bg-pink-500/10 rounded-full">Medium</div>
              </div>
              <div className="text-xs text-gray-400 bg-[rgb(30,30,32)] px-2 py-1 rounded-full">Q.34</div>
            </div>
            <h3 className="text-lg font-semibold mb-1">Memory-Efficient Ring Buffer</h3>
            <p className="text-sm text-gray-300 mb-1">Implement a memory-efficient ring buffer for embedded systems with overflow handling and thread safety.</p>
          </div>
          
          <div className="bg-[rgb(24,24,26)] p-4 h-[275px] overflow-auto">
            <div className="mb-4">
              <div className="text-sm font-semibold mb-2 text-white">Function Signatures:</div>
              <div className="bg-[rgb(18,18,20)] p-3 rounded border border-[rgb(30,30,32)] mb-4">
                <div className="text-xs font-mono text-[rgb(214,251,65)]">
                  <div className="mb-1">typedef struct {'{'}</div>
                  <div className="mb-1 pl-4">uint8_t* buffer;</div>
                  <div className="mb-1 pl-4">uint32_t size;</div>
                  <div className="mb-1 pl-4">uint32_t head;</div>
                  <div className="mb-1 pl-4">uint32_t tail;</div>
                  <div className="mb-1 pl-4">SemaphoreHandle_t mutex;</div>
                  <div className="mb-1">{'}'} RingBuffer_t;</div>
                  <div className="mb-1"></div>
                  <div className="mb-1">RingBuffer_t* createBuffer(uint32_t size);</div>
                  <div className="mb-1">bool writeBuffer(RingBuffer_t* rb, uint8_t* data, uint32_t len);</div>
                  <div className="mb-1">bool readBuffer(RingBuffer_t* rb, uint8_t* data, uint32_t len);</div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm font-semibold mb-2 text-white">Requirements:</div>
              <ul className="text-xs text-gray-300 list-disc pl-5 space-y-1">
                <li>Thread-safe implementation for multi-threaded environments</li>
                <li>Efficient memory usage with no dynamic allocation during operations</li>
                <li>Handle buffer overflow conditions gracefully</li>
                <li>Implement proper mutex locking for concurrent access</li>
                <li>Optimize for speed in embedded applications</li>
              </ul>
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-3 border-t border-[rgb(30,30,32)]">
              <div className="flex space-x-4 text-xs">
                <span className="text-gray-400">Completion: <span className="text-[rgb(214,251,65)]">68%</span></span>
                <span className="text-gray-400">⭐ <span className="text-[rgb(214,251,65)]">4.7/5</span></span>
                <span className="text-gray-400">Avg. Time: <span className="text-[rgb(214,251,65)]">35 min</span></span>
              </div>
              <button className="text-[rgb(214,251,65)] text-sm font-medium flex items-center bg-[rgb(214,251,65)]/10 px-3 py-1 rounded-full hover:bg-[rgb(214,251,65)]/20 transition-colors">
                Solve Now <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      icon: <Newspaper className="w-5 h-5" />,
      emoji: "3️⃣",
      title: "Quick Revision with Short Notes",
      description: "Short, precise notes to help you understand key concepts fast. Perfect for last-minute revisions before interviews.",
      previewImage: (
        <div className="h-full w-full bg-[rgb(18,18,20)] rounded-lg shadow-lg border border-[rgb(30,30,32)] overflow-hidden">
          <div className="p-4 border-b border-[rgb(30,30,32)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">Quick Revision</div>
              <div className="text-xs text-gray-400">5 min read</div>
            </div>
            <div className="flex items-center">
              <button className="text-xs text-gray-400 hover:text-[rgb(214,251,65)] transition-colors mr-3">Save</button>
              <button className="text-xs text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">Print</button>
            </div>
          </div>
          
          <div className="bg-[rgb(24,24,26)] p-4 h-[350px] overflow-auto">
            <h3 className="text-lg font-semibold mb-3 text-white">Memory-Mapped I/O vs Port-Mapped I/O</h3>
            
            <div className="bg-[rgb(18,18,20)] p-4 rounded-lg border border-[rgb(30,30,32)] mb-4">
              <h4 className="text-base font-medium text-[rgb(214,251,65)] mb-2">Memory-Mapped I/O:</h4>
              <ul className="text-sm text-gray-300 list-disc pl-5 space-y-2">
                <li>I/O devices share the same address space as memory</li>
                <li>All memory instructions work with I/O devices</li>
                <li>No special I/O instructions needed</li>
                <li>Address decoding more complex</li>
              </ul>
              
              <div className="mt-3 bg-[rgb(24,24,26)] p-3 rounded border border-[rgb(30,30,32)]">
                <p className="text-xs text-gray-400 mb-1">Example in C:</p>
                <pre className="text-xs font-mono text-[rgb(214,251,65)]">
                  <code>
{`// Accessing a memory-mapped device register
volatile uint32_t* pUART_DATA = (uint32_t*)0x40001000;

// Write to the device register
*pUART_DATA = 0x55;

// Read from the device register
uint32_t data = *pUART_DATA;`}
                  </code>
                </pre>
              </div>
            </div>
            
            <div className="bg-[rgb(18,18,20)] p-4 rounded-lg border border-[rgb(30,30,32)] mb-4">
              <h4 className="text-base font-medium text-[rgb(214,251,65)] mb-2">Port-Mapped I/O:</h4>
              <ul className="text-sm text-gray-300 list-disc pl-5 space-y-2">
                <li>Separate address space for I/O devices</li>
                <li>Special IN/OUT instructions required</li>
                <li>Simpler address decoding</li>
                <li>Limited by port address size</li>
              </ul>
              
              <div className="mt-3 bg-[rgb(24,24,26)] p-3 rounded border border-[rgb(30,30,32)]">
                <p className="text-xs text-gray-400 mb-1">Example in x86 Assembly:</p>
                <pre className="text-xs font-mono text-[rgb(214,251,65)]">
                  <code>
{`; Write to port 0x3F8 (COM1 data port)
MOV AL, 0x55    ; Data to send
OUT 0x3F8, AL   ; Send to port

; Read from port 0x3F8
IN AL, 0x3F8    ; Read from port into AL`}
                  </code>
                </pre>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button className="text-[rgb(214,251,65)] text-sm font-medium flex items-center bg-[rgb(214,251,65)]/10 px-3 py-1 rounded-full hover:bg-[rgb(214,251,65)]/20 transition-colors">
                View Full Notes <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      icon: <Building className="w-5 h-5" />,
      emoji: "4️⃣",
      title: "Company-Specific Target Study Material",
      description: "Get curated resources tailored to top companies like Qualcomm, NVIDIA, and Tesla—study smart, not hard.",
      previewImage: (
        <div className="h-full w-full bg-[rgb(18,18,20)] rounded-lg shadow-lg border border-[rgb(30,30,32)] overflow-hidden">
          <div className="p-4 border-b border-[rgb(30,30,32)]">
            <h3 className="text-lg font-semibold mb-1">Top Companies - Study Plans</h3>
            <p className="text-xs text-gray-400">Tailored resources for your target interviews</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 p-4 h-[350px] overflow-auto">
            <div className="bg-[rgb(24,24,26)] rounded-lg border border-[rgb(30,30,32)] hover:border-[rgb(214,251,65)]/30 transition-colors cursor-pointer group p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-[rgb(30,30,32)] flex items-center justify-center text-red-400 mr-3 text-lg font-bold">Q</div>
                <span className="text-base font-medium group-hover:text-[rgb(214,251,65)] transition-colors">Qualcomm</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-xs text-gray-300">
                  <span className="font-medium text-gray-200">Focus Areas:</span> RTOS, DSP, Wireless Protocols, Power Management
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Questions:</span>
                  <span className="text-[rgb(214,251,65)]">42</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Labs:</span>
                  <span className="text-[rgb(214,251,65)]">12</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Notes:</span>
                  <span className="text-[rgb(214,251,65)]">15</span>
                </div>
              </div>
              <div className="mt-auto text-center">
                <span className="inline-block px-3 py-1 bg-[rgb(214,251,65)]/10 text-[rgb(214,251,65)] text-xs rounded-full group-hover:bg-[rgb(214,251,65)]/20 transition-colors">Study Plan →</span>
              </div>
            </div>
            
            <div className="bg-[rgb(24,24,26)] rounded-lg border border-[rgb(30,30,32)] hover:border-[rgb(214,251,65)]/30 transition-colors cursor-pointer group p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-[rgb(30,30,32)] flex items-center justify-center text-green-400 mr-3 text-lg font-bold">N</div>
                <span className="text-base font-medium group-hover:text-[rgb(214,251,65)] transition-colors">NVIDIA</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-xs text-gray-300">
                  <span className="font-medium text-gray-200">Focus Areas:</span> GPU Architecture, CUDA, Parallel Processing, Memory Hierarchy
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Questions:</span>
                  <span className="text-[rgb(214,251,65)]">37</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Labs:</span>
                  <span className="text-[rgb(214,251,65)]">9</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Notes:</span>
                  <span className="text-[rgb(214,251,65)]">13</span>
                </div>
              </div>
              <div className="mt-auto text-center">
                <span className="inline-block px-3 py-1 bg-[rgb(214,251,65)]/10 text-[rgb(214,251,65)] text-xs rounded-full group-hover:bg-[rgb(214,251,65)]/20 transition-colors">Study Plan →</span>
              </div>
            </div>
            
            <div className="bg-[rgb(24,24,26)] rounded-lg border border-[rgb(30,30,32)] hover:border-[rgb(214,251,65)]/30 transition-colors cursor-pointer group p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-[rgb(30,30,32)] flex items-center justify-center text-blue-400 mr-3 text-lg font-bold">T</div>
                <span className="text-base font-medium group-hover:text-[rgb(214,251,65)] transition-colors">Tesla</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-xs text-gray-300">
                  <span className="font-medium text-gray-200">Focus Areas:</span> Automotive Systems, Safety-Critical Software, CAN Bus, AUTOSAR
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Questions:</span>
                  <span className="text-[rgb(214,251,65)]">31</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Labs:</span>
                  <span className="text-[rgb(214,251,65)]">8</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Notes:</span>
                  <span className="text-[rgb(214,251,65)]">11</span>
                </div>
              </div>
              <div className="mt-auto text-center">
                <span className="inline-block px-3 py-1 bg-[rgb(214,251,65)]/10 text-[rgb(214,251,65)] text-xs rounded-full group-hover:bg-[rgb(214,251,65)]/20 transition-colors">Study Plan →</span>
              </div>
            </div>
            
            <div className="bg-[rgb(24,24,26)] rounded-lg border border-[rgb(30,30,32)] hover:border-[rgb(214,251,65)]/30 transition-colors cursor-pointer group p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-[rgb(30,30,32)] flex items-center justify-center text-purple-400 mr-3 text-lg font-bold">+</div>
                <span className="text-base font-medium group-hover:text-[rgb(214,251,65)] transition-colors">More Companies</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-[rgb(18,18,20)] rounded p-2 text-xs text-center">Apple</div>
                <div className="bg-[rgb(18,18,20)] rounded p-2 text-xs text-center">AMD</div>
                <div className="bg-[rgb(18,18,20)] rounded p-2 text-xs text-center">Intel</div>
                <div className="bg-[rgb(18,18,20)] rounded p-2 text-xs text-center">Samsung</div>
                <div className="bg-[rgb(18,18,20)] rounded p-2 text-xs text-center">ARM</div>
                <div className="bg-[rgb(18,18,20)] rounded p-2 text-xs text-center">+15 more</div>
              </div>
              <div className="mt-auto text-center">
                <span className="inline-block px-3 py-1 bg-[rgb(214,251,65)]/10 text-[rgb(214,251,65)] text-xs rounded-full group-hover:bg-[rgb(214,251,65)]/20 transition-colors">View All →</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      icon: <Calendar className="w-5 h-5" />,
      emoji: "5️⃣",
      title: "Personalized Study Plan Based on Job Description",
      description: "Upload a JD, and we'll craft a personalized study plan to maximize your chances of landing the job.",
      previewImage: (
        <div className="h-full w-full bg-[rgb(18,18,20)] rounded-lg shadow-lg border border-[rgb(30,30,32)] overflow-hidden">
          <div className="p-4 border-b border-[rgb(30,30,32)]">
            <h3 className="text-lg font-semibold mb-1">Your Personalized Study Plan</h3>
            <p className="text-xs text-gray-400">For: Senior Embedded Systems Engineer at Qualcomm</p>
          </div>
          
          <div className="p-4 h-[350px] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-[rgb(30,30,32)] py-1 px-3 rounded-full text-sm">Overall Progress</div>
                <div className="text-sm text-[rgb(214,251,65)]">22%</div>
              </div>
              <div className="text-xs text-gray-400">32 days remaining</div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-[rgb(24,24,26)] p-4 rounded-lg border border-[rgb(30,30,32)]">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-white">Week 1: RTOS Fundamentals</span>
                  <span className="text-xs bg-green-500/30 text-green-400 px-2 py-0.5 rounded-full">In Progress</span>
                </div>
                <div className="h-2 bg-[rgb(30,30,32)] rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-[rgb(214,251,65)] to-green-400 w-[65%]"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>13/20 topics completed</span>
                  <span>Estimated: 4 more hours</span>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border border-green-400 bg-green-400/30 flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-400">Task Creation and Management</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border border-green-400 bg-green-400/30 flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-400">Queue Implementation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border border-[rgb(214,251,65)] mr-2"></div>
                    <span className="text-xs text-gray-400">Mutex and Semaphores</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[rgb(24,24,26)] p-4 rounded-lg border border-[rgb(30,30,32)]">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-white">Week 2: Memory Management</span>
                  <span className="text-xs bg-[rgb(30,30,32)] text-gray-400 px-2 py-0.5 rounded-full">Up Next</span>
                </div>
                <div className="h-2 bg-[rgb(30,30,32)] rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-[rgb(214,251,65)] to-green-400 w-0"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>0/15 topics completed</span>
                  <span>Estimated: 8 hours</span>
                </div>
              </div>
              
              <div className="bg-[rgb(24,24,26)] p-4 rounded-lg border border-[rgb(30,30,32)]">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-white">Week 3: DSP Algorithms</span>
                  <span className="text-xs bg-[rgb(30,30,32)] text-gray-400 px-2 py-0.5 rounded-full">Upcoming</span>
                </div>
                <div className="h-2 bg-[rgb(30,30,32)] rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-[rgb(214,251,65)] to-green-400 w-0"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>0/18 topics completed</span>
                  <span>Estimated: 10 hours</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button className="text-[rgb(214,251,65)] text-sm font-medium flex items-center bg-[rgb(214,251,65)]/10 px-3 py-1 rounded-full hover:bg-[rgb(214,251,65)]/20 transition-colors">
                Continue Studying <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      icon: <Users className="w-5 h-5" />,
      emoji: "6️⃣",
      title: "Active Community of Embedded Experts",
      description: "Join a network of experienced embedded engineers—share insights, exchange interview experiences, and discover job opportunities.",
      previewImage: (
        <div className="h-full w-full bg-[rgb(18,18,20)] rounded-lg shadow-lg border border-[rgb(30,30,32)] overflow-hidden">
          <div className="p-4 border-b border-[rgb(30,30,32)]">
            <h3 className="text-lg font-semibold mb-1">Community Highlights</h3>
            <p className="text-xs text-gray-400">Connect with experts and peers</p>
          </div>
          
          <div className="p-4 h-[350px] overflow-auto">
            <div className="space-y-4">
              <div className="bg-[rgb(24,24,26)] rounded-lg border border-[rgb(30,30,32)] hover:border-[rgb(214,251,65)]/30 transition-colors p-4 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 flex-shrink-0">J</div>
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-white mr-2">John D.</span>
                      <span className="text-xs text-gray-500">Embedded Systems Lead at Samsung</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Just passed my NVIDIA interview! Check my experience report in the forum. They focus heavily on memory optimization and C++ 17 features.
                    </p>
                    <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-[rgb(30,30,32)]">
                      <span>2 hours ago</span>
                      <div className="flex gap-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                          </svg> 24
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                          </svg> 7
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[rgb(24,24,26)] rounded-lg border border-[rgb(30,30,32)] hover:border-[rgb(214,251,65)]/30 transition-colors p-4 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-500/30 rounded-full flex items-center justify-center text-purple-400 flex-shrink-0">M</div>
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-white mr-2">Maria L.</span>
                      <span className="text-xs text-gray-500">Senior DSP Engineer</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Hosting a workshop on RTOS internals this weekend. Join us on Discord to learn about task scheduling internals and priority inversion.
                    </p>
                    <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-[rgb(30,30,32)]">
                      <span>Yesterday</span>
                      <div className="flex gap-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                          </svg> 42
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                          </svg> 19
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[rgb(24,24,26)] rounded-lg border border-[rgb(30,30,32)] hover:border-[rgb(214,251,65)]/30 transition-colors p-4 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/30 rounded-full flex items-center justify-center text-blue-400 flex-shrink-0">A</div>
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-white mr-2">Alex K.</span>
                      <span className="text-xs text-gray-500">Firmware Engineer at ARM</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      I've compiled a list of the most common MCU architecture questions from my recent interviews. Sharing with everyone - check the resources section!
                    </p>
                    <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-[rgb(30,30,32)]">
                      <span>3 days ago</span>
                      <div className="flex gap-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                          </svg> 56
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                          </svg> 23
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <button className="text-[rgb(214,251,65)] text-sm font-medium flex items-center bg-[rgb(214,251,65)]/10 px-4 py-2 rounded-full hover:bg-[rgb(214,251,65)]/20 transition-colors">
                Join the community <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )
    },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[rgb(24,24,26)]">
      {/* Background gradients */}
      <div className="absolute right-1/4 top-1/3 w-80 h-80 bg-[rgb(214,251,65)]/5 rounded-full blur-[100px]"></div>
      <div className="absolute left-1/4 bottom-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            <span className="text-white">Platform</span>
            <span className="text-[rgb(214,251,65)]"> Features</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore the powerful features that make dspcoder.com the ultimate platform for embedded systems interview preparation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Feature tabs - left side on desktop, top on mobile */}
          <motion.div 
            className="lg:col-span-4 order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-3">
              {features.map((feature) => (
                <div 
                  key={feature.id}
                  className={`rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${activeFeature === feature.id ? 'bg-[rgb(18,18,20)] border-[rgb(214,251,65)]/30 shadow-[0_4px_20px_rgba(214,251,65,0.15)]' : 'bg-[rgb(18,18,20)] hover:bg-[rgb(22,22,24)] border-[rgb(30,30,32)]/30'} border`}
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <div className="flex items-start">
                    <div className={`rounded-full p-3 mr-3 ${activeFeature === feature.id ? 'bg-[rgb(214,251,65)]/10' : 'bg-[rgb(30,30,32)]'}`}>
                      <div className={activeFeature === feature.id ? 'text-[rgb(214,251,65)]' : 'text-gray-400'}>
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="mr-2">{feature.emoji}</span>
                        <h3 className={`font-semibold ${activeFeature === feature.id ? 'text-[rgb(214,251,65)]' : 'text-gray-300'}`}>{feature.title}</h3>
                      </div>
                      <p className={`text-sm mt-1 ${activeFeature === feature.id ? 'text-gray-200' : 'text-gray-400'}`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feature preview - right side on desktop, bottom on mobile */}
          <motion.div 
            className="lg:col-span-8 order-1 lg:order-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative h-[450px]">
              {features.map((feature) => (
                <motion.div 
                  key={feature.id}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: activeFeature === feature.id ? 1 : 0,
                    zIndex: activeFeature === feature.id ? 10 : 0
                  }}
                  transition={{ duration: 0.4 }}
                  className={`absolute inset-0 h-full w-full ${activeFeature === feature.id ? '' : 'pointer-events-none'}`}
                >
                  {feature.previewImage}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}