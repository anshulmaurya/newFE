import { motion } from "framer-motion";
import { useState } from "react";
import { Code, Newspaper, BookOpen, Building, Calendar, Users } from "lucide-react";

interface Feature {
  id: number;
  icon: JSX.Element;
  emoji: string;
  title: string;
  description: string;
  bgColor: string;
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
      bgColor: "from-blue-500/20 to-cyan-400/20",
      previewImage: (
        <div className="bg-[rgb(18,18,20)] rounded-lg p-4 shadow-lg border border-[rgb(30,30,32)]">
          <div className="flex space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex">
            <div className="w-12 bg-[rgb(24,24,26)] h-48 flex flex-col items-center py-2 space-y-3">
              <div className="w-6 h-6 rounded bg-[rgb(30,30,32)]"></div>
              <div className="w-6 h-6 rounded bg-[rgb(30,30,32)]"></div>
              <div className="w-6 h-6 rounded bg-[rgb(214,251,65)]/20"></div>
            </div>
            <div className="flex-1 bg-[rgb(24,24,26)] p-2 text-xs font-mono">
              <div className="mb-1 text-green-400">#include &lt;stdint.h&gt;</div>
              <div className="mb-1 text-green-400">#include "FreeRTOS.h"</div>
              <div className="mb-1 text-green-400">#include "task.h"</div>
              <div className="mb-1 text-green-400">#include "queue.h"</div>
              <div className="mb-3"></div>
              <div className="mb-1"><span className="text-purple-400">void</span> <span className="text-blue-400">setup</span>() {'{'}</div>
              <div className="mb-1 pl-4"><span className="text-gray-400">// Configure timer</span></div>
              <div className="mb-1 pl-4"><span className="text-orange-400">Timer1</span>.<span className="text-blue-400">initialize</span>(<span className="text-yellow-400">50</span>);</div>
              <div className="mb-1 pl-4"><span className="text-orange-400">Timer1</span>.<span className="text-blue-400">attachInterrupt</span>(isr);</div>
              <div className="mb-1">{'}'}</div>
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
      bgColor: "from-purple-500/20 to-pink-400/20",
      previewImage: (
        <div className="bg-[rgb(18,18,20)] rounded-lg p-4 shadow-lg border border-[rgb(30,30,32)]">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <div className="bg-[rgb(214,251,65)]/20 text-[rgb(214,251,65)] px-2 py-1 rounded-full text-xs">Memory Management</div>
              <div className="text-pink-500 text-xs font-medium">Medium</div>
            </div>
            <div className="text-xs text-gray-400">Q.34</div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Memory-Efficient Ring Buffer</h3>
          <p className="text-sm text-gray-300 mb-3">Implement a memory-efficient ring buffer for embedded systems with overflow handling and thread safety.</p>
          <div className="bg-[rgb(24,24,26)] p-3 rounded border border-[rgb(30,30,32)] mb-3">
            <div className="text-xs font-mono mb-2 text-gray-400"># Function signature:</div>
            <div className="text-xs font-mono text-[rgb(214,251,65)]">
              typedef struct RingBuffer {'{'} ... {'}'} RingBuffer_t;<br />
              RingBuffer_t* createBuffer(uint32_t size);<br />
              bool writeBuffer(RingBuffer_t* rb, uint8_t* data, uint32_t len);<br />
              bool readBuffer(RingBuffer_t* rb, uint8_t* data, uint32_t len);
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-3 text-xs text-gray-400">
              <span>Completion: 68%</span>
              <span>⭐ 4.7/5</span>
            </div>
            <button className="text-[rgb(214,251,65)] text-sm flex items-center">
              Solve <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
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
      bgColor: "from-green-500/20 to-emerald-400/20",
      previewImage: (
        <div className="bg-[rgb(18,18,20)] rounded-lg p-4 shadow-lg border border-[rgb(30,30,32)]">
          <div className="flex items-center mb-3">
            <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs mr-2">Quick Revision</div>
            <div className="text-xs text-gray-400">5 min read</div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Memory-Mapped I/O vs Port-Mapped I/O</h3>
          <div className="space-y-3">
            <div className="bg-[rgb(24,24,26)] p-3 rounded border border-[rgb(30,30,32)]">
              <h4 className="text-sm font-medium text-[rgb(214,251,65)] mb-1">Memory-Mapped I/O:</h4>
              <ul className="text-xs text-gray-300 list-disc pl-4 space-y-1">
                <li>I/O devices share the same address space as memory</li>
                <li>All memory instructions work with I/O devices</li>
                <li>No special I/O instructions needed</li>
                <li>Address decoding more complex</li>
              </ul>
            </div>
            <div className="bg-[rgb(24,24,26)] p-3 rounded border border-[rgb(30,30,32)]">
              <h4 className="text-sm font-medium text-[rgb(214,251,65)] mb-1">Port-Mapped I/O:</h4>
              <ul className="text-xs text-gray-300 list-disc pl-4 space-y-1">
                <li>Separate address space for I/O devices</li>
                <li>Special IN/OUT instructions required</li>
                <li>Simpler address decoding</li>
                <li>Limited by port address size</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button className="text-[rgb(214,251,65)] text-sm flex items-center">
              View full notes <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
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
      bgColor: "from-orange-500/20 to-amber-400/20",
      previewImage: (
        <div className="bg-[rgb(18,18,20)] rounded-lg p-4 shadow-lg border border-[rgb(30,30,32)]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Top Companies - Study Plans</h3>
            <p className="text-xs text-gray-400">Tailored resources for your target interviews</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[rgb(24,24,26)] p-3 rounded border border-[rgb(30,30,32)] flex flex-col hover:border-[rgb(214,251,65)]/30 transition-colors cursor-pointer group">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-[rgb(30,30,32)] flex items-center justify-center text-red-400 mr-2">Q</div>
                <span className="text-sm font-medium group-hover:text-[rgb(214,251,65)] transition-colors">Qualcomm</span>
              </div>
              <div className="text-xs text-gray-400 mb-1">Topics: RTOS, DSP, Wireless</div>
              <div className="mt-auto text-[rgb(214,251,65)]/70 text-xs">42 questions</div>
            </div>
            <div className="bg-[rgb(24,24,26)] p-3 rounded border border-[rgb(30,30,32)] flex flex-col hover:border-[rgb(214,251,65)]/30 transition-colors cursor-pointer group">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-[rgb(30,30,32)] flex items-center justify-center text-green-400 mr-2">N</div>
                <span className="text-sm font-medium group-hover:text-[rgb(214,251,65)] transition-colors">NVIDIA</span>
              </div>
              <div className="text-xs text-gray-400 mb-1">Topics: GPU, CUDA, Parallel</div>
              <div className="mt-auto text-[rgb(214,251,65)]/70 text-xs">37 questions</div>
            </div>
            <div className="bg-[rgb(24,24,26)] p-3 rounded border border-[rgb(30,30,32)] flex flex-col hover:border-[rgb(214,251,65)]/30 transition-colors cursor-pointer group">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-[rgb(30,30,32)] flex items-center justify-center text-blue-400 mr-2">T</div>
                <span className="text-sm font-medium group-hover:text-[rgb(214,251,65)] transition-colors">Tesla</span>
              </div>
              <div className="text-xs text-gray-400 mb-1">Topics: Automotive, Safety</div>
              <div className="mt-auto text-[rgb(214,251,65)]/70 text-xs">31 questions</div>
            </div>
            <div className="bg-[rgb(24,24,26)] p-3 rounded border border-[rgb(30,30,32)] flex flex-col hover:border-[rgb(214,251,65)]/30 transition-colors cursor-pointer group">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-[rgb(30,30,32)] flex items-center justify-center text-purple-400 mr-2">+</div>
                <span className="text-sm font-medium group-hover:text-[rgb(214,251,65)] transition-colors">More</span>
              </div>
              <div className="text-xs text-gray-400 mb-1">Apple, AMD, Intel...</div>
              <div className="mt-auto text-[rgb(214,251,65)]/70 text-xs">120+ questions</div>
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
      bgColor: "from-red-500/20 to-rose-400/20",
      previewImage: (
        <div className="bg-[rgb(18,18,20)] rounded-lg p-4 shadow-lg border border-[rgb(30,30,32)]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Your Personalized Study Plan</h3>
            <p className="text-xs text-gray-400">For: Senior Embedded Systems Engineer at Qualcomm</p>
          </div>
          <div className="space-y-3 mb-3">
            <div className="bg-[rgb(24,24,26)] p-3 rounded border border-[rgb(30,30,32)]">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Week 1: RTOS Fundamentals</span>
                <span className="text-xs bg-green-500/30 text-green-400 px-2 rounded-full">In Progress</span>
              </div>
              <div className="h-2 bg-[rgb(30,30,32)] rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[rgb(214,251,65)] to-green-400 w-[65%]"></div>
              </div>
              <div className="mt-2 text-xs text-gray-400">13/20 topics completed</div>
            </div>
            <div className="bg-[rgb(24,24,26)] p-3 rounded border border-[rgb(30,30,32)]">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Week 2: Memory Management</span>
                <span className="text-xs bg-[rgb(30,30,32)] text-gray-400 px-2 rounded-full">Up Next</span>
              </div>
              <div className="h-2 bg-[rgb(30,30,32)] rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[rgb(214,251,65)] to-green-400 w-0"></div>
              </div>
              <div className="mt-2 text-xs text-gray-400">0/15 topics completed</div>
            </div>
            <div className="bg-[rgb(24,24,26)] p-3 rounded border border-[rgb(30,30,32)]">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Week 3: DSP Algorithms</span>
                <span className="text-xs bg-[rgb(30,30,32)] text-gray-400 px-2 rounded-full">Upcoming</span>
              </div>
              <div className="h-2 bg-[rgb(30,30,32)] rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[rgb(214,251,65)] to-green-400 w-0"></div>
              </div>
              <div className="mt-2 text-xs text-gray-400">0/18 topics completed</div>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Overall: 22% Complete</span>
            <button className="text-[rgb(214,251,65)] text-sm flex items-center">
              Continue studying <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
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
      bgColor: "from-blue-500/20 to-indigo-400/20",
      previewImage: (
        <div className="bg-[rgb(18,18,20)] rounded-lg p-4 shadow-lg border border-[rgb(30,30,32)]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Community Highlights</h3>
            <p className="text-xs text-gray-400">Connect with experts and peers</p>
          </div>
          <div className="space-y-3 mb-3">
            <div className="bg-[rgb(24,24,26)] p-3 rounded border border-[rgb(30,30,32)] hover:border-[rgb(214,251,65)]/30 transition-colors cursor-pointer">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 bg-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400">J</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">John D.</span>
                    <span className="text-xs text-gray-500">Embedded Systems Lead at Samsung</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">Just passed my NVIDIA interview! Check my experience report in the forum. They focus heavily on memory optimization and C++ 17 features.</p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1 pt-1 border-t border-[rgb(30,30,32)]">
                <span>2 hours ago</span>
                <div className="flex gap-3">
                  <span>👍 24</span>
                  <span>💬 7</span>
                </div>
              </div>
            </div>
            <div className="bg-[rgb(24,24,26)] p-3 rounded border border-[rgb(30,30,32)] hover:border-[rgb(214,251,65)]/30 transition-colors cursor-pointer">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center text-purple-400">M</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Maria L.</span>
                    <span className="text-xs text-gray-500">Senior DSP Engineer</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">Hosting a workshop on RTOS internals this weekend. Join us on Discord to learn about task scheduling internals and priority inversion.</p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1 pt-1 border-t border-[rgb(30,30,32)]">
                <span>Yesterday</span>
                <div className="flex gap-3">
                  <span>👍 42</span>
                  <span>💬 19</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button className="text-[rgb(214,251,65)] text-sm flex items-center">
              Join the community <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
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
                  className={`rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${activeFeature === feature.id ? 'bg-gradient-to-r border-[rgb(214,251,65)]/30 shadow-[0_4px_20px_rgba(214,251,65,0.15)]' : 'bg-[rgb(18,18,20)] hover:bg-[rgb(22,22,24)] border-[rgb(30,30,32)]/30'} border ${activeFeature === feature.id ? 'bg-' + feature.bgColor : ''}`}
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-3 ${activeFeature === feature.id ? 'bg-white/10' : 'bg-[rgb(30,30,32)]'}`}>
                      <div className={`${activeFeature === feature.id ? 'text-white' : 'text-[rgb(214,251,65)]'}`}>
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="mr-2">{feature.emoji}</span>
                        <h3 className={`font-semibold ${activeFeature === feature.id ? 'text-white' : 'text-gray-300'}`}>{feature.title}</h3>
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
            <div className="relative h-full flex items-center justify-center">
              {/* Preview Container */}
              <div className="w-full">
                {features.map((feature) => (
                  <motion.div 
                    key={feature.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ 
                      opacity: activeFeature === feature.id ? 1 : 0,
                      y: activeFeature === feature.id ? 0 : 20,
                      scale: activeFeature === feature.id ? 1 : 0.95
                    }}
                    transition={{ duration: 0.4 }}
                    className={`absolute inset-0 ${activeFeature === feature.id ? 'z-10' : 'z-0 pointer-events-none'}`}
                  >
                    {feature.previewImage}
                  </motion.div>
                ))}
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[rgb(18,18,20)] rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-[rgb(18,18,20)] rounded-full blur-3xl opacity-50"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}