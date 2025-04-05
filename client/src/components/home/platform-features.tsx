import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { 
  CheckCircle, BookOpen, Briefcase, FileText, Terminal, Users, ChevronRight, 
  ArrowRight, Clock, Award, Zap, Bookmark, Target, Cpu, Code
} from "lucide-react";
import { getCategoryProblems } from "@/data/problem-cards";

interface Feature {
  id: number;
  icon: JSX.Element;
  title: string;
  description: string;
  previewComponent: React.ReactNode;
}

export default function PlatformFeatures() {
  const [activeFeature, setActiveFeature] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<string>("Memory Management");

  // New feature list in the requested order
  const features: Feature[] = [
    {
      id: 1,
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      title: "200+ Expert-Reviewed Questions",
      description: "Practice with industry-vetted problems covering the full spectrum of embedded systems topics, from memory management to RTOS concepts.",
      previewComponent: (
        <div className="bg-gradient-to-br from-[rgb(16,16,18)] to-[rgb(20,20,22)] rounded-xl shadow-xl border border-[rgb(30,30,32)] p-6 h-full overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
            <div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center mr-3 border border-emerald-400/20">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Problem Library</h3>
              </div>
              <p className="text-gray-300 mb-5 text-base">
                Practice with industry-vetted problems covering the full spectrum of embedded systems topics, from memory management to RTOS concepts.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {["Easy", "Medium", "Hard"].map((diff) => (
                  <motion.span 
                    key={diff}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: diff === "Easy" ? 0.1 : diff === "Medium" ? 0.2 : 0.3 }}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full flex items-center ${
                      diff === "Easy" 
                        ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30" 
                        : diff === "Medium"
                          ? "bg-amber-400/10 text-amber-400 border border-amber-400/30"
                          : "bg-rose-400/10 text-rose-400 border border-rose-400/30"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                    {diff}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mb-6 pb-2 overflow-x-auto hide-scrollbar">
            {["Memory Management", "Multithreading", "Data Structures", "RTOS", "C/C++ APIs"].map((cat, index) => (
              <motion.div 
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  cat === activeCategory
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-[rgb(25,25,27)] text-slate-300 hover:bg-[rgb(30,30,32)] border border-[rgb(40,40,42)]"
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </motion.div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dynamic content based on selected category */}
            {activeCategory === "Memory Management" && [
              { title: "Memory Leak Detector", difficulty: "Medium", time: "30 min", 
                desc: "Implement a system to detect memory leaks in an embedded application." },
              { title: "Memory Pool Allocator", difficulty: "Hard", time: "45 min", 
                desc: "Design a fixed-size memory pool allocator for real-time systems with no fragmentation." },
              { title: "Zero-Copy Buffer", difficulty: "Medium", time: "35 min", 
                desc: "Implement a zero-copy mechanism for efficient data transfer between devices." },
              { title: "Stack vs Heap Analysis", difficulty: "Easy", time: "20 min", 
                desc: "Analyze trade-offs between stack and heap allocation in memory-constrained systems." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="bg-gradient-to-br from-[rgb(18,18,20)] to-[rgb(14,14,16)] rounded-lg border border-[rgb(30,30,32)] p-5 
                  hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group
                  transform hover:-translate-y-1 hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center">
                    <Cpu className="w-3 h-3 mr-1.5" />
                    <span>Memory</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                    item.difficulty === "Easy" 
                      ? "text-emerald-400 bg-emerald-400/5" 
                      : item.difficulty === "Medium" 
                        ? "text-amber-400 bg-amber-400/5" 
                        : "text-rose-400 bg-rose-400/5"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {item.difficulty}
                  </div>
                </div>
                
                <h4 className="font-medium text-white text-base mb-2 group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h4>
                
                <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
                  {item.desc}
                </p>
                
                <div className="flex justify-between items-center text-xs mt-auto">
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-3 h-3 mr-1.5" />
                    <span>{item.time}</span>
                  </div>
                  <button className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-md flex items-center gap-1.5 transition-colors">
                    <span>Solve</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
            
            {activeCategory === "Multithreading" && [
              { title: "Mutex Implementation", difficulty: "Medium", time: "35 min", 
                desc: "Implement a mutex for critical section protection in a multithreaded environment." },
              { title: "Producer-Consumer", difficulty: "Medium", time: "40 min", 
                desc: "Implement a thread-safe producer-consumer pattern using semaphores." },
              { title: "Deadlock Detection", difficulty: "Hard", time: "50 min", 
                desc: "Design an algorithm to detect potential deadlocks in a multithreaded application." },
              { title: "Thread Priority", difficulty: "Easy", time: "25 min", 
                desc: "Implement a priority-based thread scheduler for a real-time system." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="bg-gradient-to-br from-[rgb(18,18,20)] to-[rgb(14,14,16)] rounded-lg border border-[rgb(30,30,32)] p-5 
                  hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group
                  transform hover:-translate-y-1 hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center">
                    <Code className="w-3 h-3 mr-1.5" />
                    <span>Threading</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                    item.difficulty === "Easy" 
                      ? "text-emerald-400 bg-emerald-400/5" 
                      : item.difficulty === "Medium" 
                        ? "text-amber-400 bg-amber-400/5" 
                        : "text-rose-400 bg-rose-400/5"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {item.difficulty}
                  </div>
                </div>
                
                <h4 className="font-medium text-white text-base mb-2 group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h4>
                
                <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
                  {item.desc}
                </p>
                
                <div className="flex justify-between items-center text-xs mt-auto">
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-3 h-3 mr-1.5" />
                    <span>{item.time}</span>
                  </div>
                  <button className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-md flex items-center gap-1.5 transition-colors">
                    <span>Solve</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
            
            {activeCategory === "Data Structures" && [
              { title: "Circular Buffer", difficulty: "Medium", time: "30 min", 
                desc: "Implement a circular buffer for efficient data exchange between processes." },
              { title: "Lock-Free Queue", difficulty: "Hard", time: "55 min", 
                desc: "Design a lock-free queue for high-performance inter-thread communication." },
              { title: "Bit Field Manipulation", difficulty: "Easy", time: "25 min", 
                desc: "Implement functions to efficiently pack and unpack bit fields for embedded protocols." },
              { title: "Memory-Efficient Trie", difficulty: "Medium", time: "40 min", 
                desc: "Implement a memory-efficient trie data structure for string matching in resource-constrained systems." }
            ].map((item, i) => (
              <div 
                key={i}
                className="bg-[rgb(14,14,16)]/90 rounded-lg border border-[rgb(30,30,32)] p-4 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    Data
                  </span>
                  <span className={`text-xs font-medium ${
                    item.difficulty === "Easy" ? "text-emerald-400" : 
                    item.difficulty === "Medium" ? "text-amber-400" : "text-rose-400"
                  }`}>{item.difficulty}</span>
                </div>
                <h4 className="font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                  {item.desc}
                </p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Est: {item.time}</span>
                  <button className="text-indigo-400 group-hover:text-indigo-300 flex items-center space-x-1 transition-colors">
                    <span>Solve</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            
            {activeCategory === "RTOS" && [
              { title: "Task Scheduler", difficulty: "Hard", time: "60 min", 
                desc: "Implement a preemptive priority-based task scheduler for an RTOS kernel." },
              { title: "Stack Overflow Detection", difficulty: "Medium", time: "35 min", 
                desc: "Design a function to detect stack overflows in a real-time system." },
              { title: "Semaphore Implementation", difficulty: "Medium", time: "40 min", 
                desc: "Implement a counting semaphore for synchronization between tasks." },
              { title: "Watchdog Timer", difficulty: "Easy", time: "25 min", 
                desc: "Design a watchdog timer system to recover from software failures in an RTOS." }
            ].map((item, i) => (
              <div 
                key={i}
                className="bg-[rgb(14,14,16)]/90 rounded-lg border border-[rgb(30,30,32)] p-4 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    RTOS
                  </span>
                  <span className={`text-xs font-medium ${
                    item.difficulty === "Easy" ? "text-emerald-400" : 
                    item.difficulty === "Medium" ? "text-amber-400" : "text-rose-400"
                  }`}>{item.difficulty}</span>
                </div>
                <h4 className="font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                  {item.desc}
                </p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Est: {item.time}</span>
                  <button className="text-indigo-400 group-hover:text-indigo-300 flex items-center space-x-1 transition-colors">
                    <span>Solve</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            
            {activeCategory === "C/C++ APIs" && [
              { title: "Custom String Library", difficulty: "Medium", time: "45 min", 
                desc: "Implement a memory-efficient string manipulation library for embedded systems." },
              { title: "Interrupt Handler", difficulty: "Hard", time: "50 min", 
                desc: "Design a robust interrupt handling system with priority levels and nested interrupts." },
              { title: "Memory-Safe Functions", difficulty: "Medium", time: "40 min", 
                desc: "Implement memory-safe alternatives to strcpy, strcat and other standard C functions." },
              { title: "Lightweight JSON Parser", difficulty: "Easy", time: "30 min", 
                desc: "Create a lightweight JSON parser optimized for embedded systems with limited resources." }
            ].map((item, i) => (
              <div 
                key={i}
                className="bg-[rgb(14,14,16)]/90 rounded-lg border border-[rgb(30,30,32)] p-4 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    C/C++
                  </span>
                  <span className={`text-xs font-medium ${
                    item.difficulty === "Easy" ? "text-emerald-400" : 
                    item.difficulty === "Medium" ? "text-amber-400" : "text-rose-400"
                  }`}>{item.difficulty}</span>
                </div>
                <h4 className="font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                  {item.desc}
                </p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Est: {item.time}</span>
                  <button className="text-indigo-400 group-hover:text-indigo-300 flex items-center space-x-1 transition-colors">
                    <span>Solve</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <a href="/dashboard" className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-sm font-medium inline-flex items-center space-x-2 transition-colors">
              <span>Browse All Problems</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 2,
      icon: <Bookmark className="w-5 h-5 text-sky-400" />,
      title: "Quick Revision with Short Notes",
      description: "Access concise, focused study materials for rapid review of key embedded system concepts before your interviews.",
      previewComponent: (
        <div className="bg-[rgb(16,16,18)] rounded-xl shadow-xl border border-[rgb(30,30,32)] p-6 h-full overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center mb-2">
                <Bookmark className="w-5 h-5 text-sky-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Quick Notes</h3>
              </div>
              <p className="text-gray-300 mb-3">
                Access concise, focused study materials for rapid review of key embedded system concepts before your interviews.
              </p>
              <div className="flex items-center mb-4 text-sm text-sky-400">
                <Clock className="w-4 h-4 mr-2" />
                <span>5 min read</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[rgb(20,20,22)]/90 rounded-lg border border-[rgb(40,40,42)] p-5 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-base font-medium text-white">Multithreading in Embedded Systems</h4>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Threading
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[rgb(14,14,16)]/90 rounded-lg p-4 border border-[rgb(30,30,32)]">
                <h5 className="text-sky-400 font-medium mb-2 flex items-center">
                  <span className="bg-sky-400/20 p-1 rounded mr-2">
                    <Cpu className="h-4 w-4 text-sky-400" />
                  </span>
                  Mutex Fundamentals
                </h5>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-2">•</span>
                    <span>Provides exclusive access to shared resources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-2">•</span>
                    <span>Prevents race conditions in critical sections</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-2">•</span>
                    <span>Lightweight synchronization for single resource protection</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[rgb(14,14,16)]/90 rounded-lg p-4 border border-[rgb(30,30,32)]">
                <h5 className="text-sky-400 font-medium mb-2 flex items-center">
                  <span className="bg-sky-400/20 p-1 rounded mr-2">
                    <Cpu className="h-4 w-4 text-sky-400" />
                  </span>
                  Semaphore Applications
                </h5>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-2">•</span>
                    <span>Counting semaphores manage multiple identical resources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-2">•</span>
                    <span>Binary semaphores function similar to mutexes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-2">•</span>
                    <span>Enables producer-consumer pattern implementation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <a href="/notes" className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full text-sm font-medium inline-flex items-center space-x-2 transition-colors">
              <span>Browse All Notes</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 3,
      icon: <Briefcase className="w-5 h-5 text-amber-400" />,
      title: "Company-Specific Target Study Material",
      description: "Focus your preparation with tailored content for top companies like Qualcomm, NVIDIA, and Intel.",
      previewComponent: (
        <div className="bg-[rgb(16,16,18)] rounded-xl shadow-xl border border-[rgb(30,30,32)] p-6 h-full overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center mb-2">
                <Briefcase className="w-5 h-5 text-amber-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Company Focus</h3>
              </div>
              <p className="text-gray-300 mb-3">
                Focus your preparation with tailored content for top companies like Qualcomm, NVIDIA, and Intel.
              </p>
              <div className="mb-4">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Premium Content
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-[rgb(20,20,22)]/90 rounded-lg border border-[rgb(40,40,42)] p-4 hover:border-amber-500/50 transition-all group">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-[rgb(25,25,27)] flex items-center justify-center text-amber-400 mr-3">
                  <span className="font-bold">Q</span>
                </div>
                <h4 className="text-white group-hover:text-amber-400 transition-colors font-medium">Qualcomm</h4>
              </div>
              <div className="space-y-2 mb-3">
                <div className="text-xs text-gray-300">
                  <span className="font-medium text-gray-200">Focus Areas:</span> RTOS, DSP, 5G, Power Management
                </div>
                <div className="flex justify-between gap-6 text-xs">
                  <div className="flex justify-between flex-grow">
                    <span className="text-gray-400">Questions:</span>
                    <span className="text-amber-400 font-medium">48</span>
                  </div>
                  <div className="flex justify-between flex-grow">
                    <span className="text-gray-400">Notes:</span>
                    <span className="text-amber-400 font-medium">12</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-2 bg-[rgb(25,25,27)] hover:bg-amber-500 text-gray-300 hover:text-white rounded-md text-xs font-medium transition-all flex items-center justify-center space-x-1">
                <span>View Study Plan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="bg-[rgb(20,20,22)]/90 rounded-lg border border-[rgb(40,40,42)] p-4 hover:border-amber-500/50 transition-all group">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-[rgb(25,25,27)] flex items-center justify-center text-green-400 mr-3">
                  <span className="font-bold">N</span>
                </div>
                <h4 className="text-white group-hover:text-amber-400 transition-colors font-medium">NVIDIA</h4>
              </div>
              <div className="space-y-2 mb-3">
                <div className="text-xs text-gray-300">
                  <span className="font-medium text-gray-200">Focus Areas:</span> GPU Architecture, CUDA, AI Accelerators
                </div>
                <div className="flex justify-between gap-6 text-xs">
                  <div className="flex justify-between flex-grow">
                    <span className="text-gray-400">Questions:</span>
                    <span className="text-amber-400 font-medium">42</span>
                  </div>
                  <div className="flex justify-between flex-grow">
                    <span className="text-gray-400">Notes:</span>
                    <span className="text-amber-400 font-medium">9</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-2 bg-[rgb(25,25,27)] hover:bg-amber-500 text-gray-300 hover:text-white rounded-md text-xs font-medium transition-all flex items-center justify-center space-x-1">
                <span>View Study Plan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="bg-[rgb(20,20,22)]/90 rounded-lg border border-[rgb(40,40,42)] p-4 hover:border-amber-500/50 transition-all group">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-[rgb(25,25,27)] flex items-center justify-center text-red-400 mr-3">
                  <span className="font-bold">T</span>
                </div>
                <h4 className="text-white group-hover:text-amber-400 transition-colors font-medium">Tesla</h4>
              </div>
              <div className="space-y-2 mb-3">
                <div className="text-xs text-gray-300">
                  <span className="font-medium text-gray-200">Focus Areas:</span> AUTOSAR, CAN Bus, Safety Critical, Embedded C
                </div>
                <div className="flex justify-between gap-6 text-xs">
                  <div className="flex justify-between flex-grow">
                    <span className="text-gray-400">Questions:</span>
                    <span className="text-amber-400 font-medium">38</span>
                  </div>
                  <div className="flex justify-between flex-grow">
                    <span className="text-gray-400">Notes:</span>
                    <span className="text-amber-400 font-medium">10</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-2 bg-[rgb(25,25,27)] hover:bg-amber-500 text-gray-300 hover:text-white rounded-md text-xs font-medium transition-all flex items-center justify-center space-x-1">
                <span>View Study Plan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="bg-[rgb(20,20,22)]/90 rounded-lg border border-[rgb(40,40,42)] p-4 hover:border-amber-500/50 transition-all group">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-[rgb(25,25,27)] flex items-center justify-center text-white mr-3">
                  <span className="font-bold">A</span>
                </div>
                <h4 className="text-white group-hover:text-amber-400 transition-colors font-medium">Apple</h4>
              </div>
              <div className="space-y-2 mb-3">
                <div className="text-xs text-gray-300">
                  <span className="font-medium text-gray-200">Focus Areas:</span> SoC Design, Low-Power Systems, ARM Architecture
                </div>
                <div className="flex justify-between gap-6 text-xs">
                  <div className="flex justify-between flex-grow">
                    <span className="text-gray-400">Questions:</span>
                    <span className="text-amber-400 font-medium">45</span>
                  </div>
                  <div className="flex justify-between flex-grow">
                    <span className="text-gray-400">Notes:</span>
                    <span className="text-amber-400 font-medium">14</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-2 bg-[rgb(25,25,27)] hover:bg-amber-500 text-gray-300 hover:text-white rounded-md text-xs font-medium transition-all flex items-center justify-center space-x-1">
                <span>View Study Plan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-sm font-medium inline-flex items-center space-x-2 transition-colors">
              <span>Browse All Companies</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )
    },
    {
      id: 4,
      icon: <Target className="w-5 h-5 text-purple-400" />,
      title: "Personalized Study Plan Based on Job Description",
      description: "Upload a job description and get a tailored study plan that focuses on exactly what you need to master.",
      previewComponent: (
        <div className="bg-[rgb(16,16,18)] rounded-xl shadow-xl border border-[rgb(30,30,32)] p-6 h-full overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-purple-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Personalized Study Plan</h3>
              </div>
              <p className="text-gray-300 mb-3">
                Upload a job description and get a tailored study plan that focuses on exactly what you need to master.
              </p>
              <div className="mb-4">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  AI-Powered
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-[rgb(20,20,22)]/90 rounded-lg border border-[rgb(40,40,42)] p-5 mb-5">
            <div className="bg-[rgb(14,14,16)]/90 rounded-lg p-4 border border-[rgb(30,30,32)] mb-4">
              <h4 className="text-white font-medium mb-3 flex items-center">
                <FileText className="h-4 w-4 text-purple-400 mr-2" />
                Job Description Analysis
              </h4>
              <div className="space-y-3">
                <div className="bg-[rgb(20,20,22)]/90 rounded p-3 border border-[rgb(40,40,42)]">
                  <p className="text-xs text-gray-300 mb-2">
                    <span className="font-medium text-purple-400">Position:</span> Senior Embedded Systems Engineer at Tesla
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["RTOS", "AUTOSAR", "CAN", "Embedded C", "Safety Critical", "MISRA"].map(tag => (
                      <span key={tag} className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-md border border-purple-500/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white font-medium mb-2">Recommended Focus Areas</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[rgb(14,14,16)]/90 rounded-lg p-3 border border-[rgb(30,30,32)]">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-purple-400 text-sm font-medium">RTOS Fundamentals</h5>
                    <span className="text-xs text-gray-400">Priority: High</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-[rgb(30,30,32)] rounded-full h-2 mr-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-xs text-purple-400">75%</span>
                  </div>
                </div>
                
                <div className="bg-[rgb(14,14,16)]/90 rounded-lg p-3 border border-[rgb(30,30,32)]">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-purple-400 text-sm font-medium">AUTOSAR Architecture</h5>
                    <span className="text-xs text-gray-400">Priority: High</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-[rgb(30,30,32)] rounded-full h-2 mr-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-xs text-purple-400">60%</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full py-2 mt-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                <span>View Complete Study Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <button className="px-4 py-2 bg-[rgb(20,20,22)] hover:bg-[rgb(25,25,27)] text-white rounded-full text-sm font-medium inline-flex items-center space-x-2 transition-colors border border-[rgb(40,40,42)] hover:border-purple-500/50">
              <span>Upload New Job Description</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )
    },
    {
      id: 5,
      icon: <Code className="w-5 h-5 text-blue-400" />,
      title: "Code directly in VS Code",
      description: "Practice in a familiar environment with our VS Code integration, complete with syntax highlighting and real-time feedback.",
      previewComponent: (
        <div className="bg-[rgb(16,16,18)] rounded-xl shadow-xl border border-[rgb(30,30,32)] p-6 h-full overflow-hidden flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center mb-1">
                <Code className="w-5 h-5 text-blue-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">VS Code Integration</h3>
              </div>
              <p className="text-gray-300 mb-1 text-sm">
                Practice in a familiar environment with our VS Code integration, complete with syntax highlighting and real-time feedback.
              </p>
              <div className="mb-2">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Seamless Experience
                </span>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden border border-[rgb(40,40,42)] shadow-lg">
            {/* VS Code header */}
            <div className="bg-[#1e1e1e] py-1 px-2 flex items-center border-b border-[#3d3d3d]">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-sm text-slate-400 flex-1 text-center">PWM Generator Implementation</div>
            </div>
            
            {/* VS Code toolbar */}
            <div className="bg-[#252526] border-b border-[#3d3d3d] flex items-center text-xs text-slate-400">
              <div className="px-3 py-1.5 hover:bg-[#3c3c3c] cursor-pointer">File</div>
              <div className="px-3 py-1.5 hover:bg-[#3c3c3c] cursor-pointer">Edit</div>
              <div className="px-3 py-1.5 hover:bg-[#3c3c3c] cursor-pointer">Selection</div>
              <div className="px-3 py-1.5 hover:bg-[#3c3c3c] cursor-pointer">View</div>
              <div className="px-3 py-1.5 hover:bg-[#3c3c3c] cursor-pointer">Go</div>
              <div className="px-3 py-1.5 hover:bg-[#3c3c3c] cursor-pointer">Run</div>
              <div className="px-3 py-1.5 hover:bg-[#3c3c3c] cursor-pointer">Terminal</div>
              <div className="px-3 py-1.5 hover:bg-[#3c3c3c] cursor-pointer">Help</div>
            </div>
            
            {/* VS Code layout */}
            <div className="flex bg-[#1e1e1e] h-[500px]">
              {/* Explorer sidebar */}
              <div className="w-10 bg-[#252526] border-r border-[#3d3d3d] flex flex-col items-center p-2 space-y-4">
                <div className="p-1 bg-[#0d7dec]/20 border-l-2 border-[#0d7dec] text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="p-1 text-[#858585] hover:text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                </div>
                <div className="p-1 text-[#858585] hover:text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
              </div>
              
              {/* Files Explorer */}
              <div className="w-48 bg-[#252526] border-r border-[#3d3d3d] p-2 text-[#cccccc] text-xs hidden md:block">
                <div className="font-semibold mb-2 flex items-center justify-between">
                  <span>EXPLORER</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                
                <div className="mt-4">
                  <div className="mb-1 flex items-center cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    <span className="hover:text-white">src</span>
                  </div>
                  
                  <div className="pl-4 space-y-1">
                    <div className="flex items-center cursor-pointer text-blue-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span>pwm.c</span>
                    </div>
                    <div className="flex items-center cursor-pointer hover:text-white">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span>timer.h</span>
                    </div>
                    <div className="flex items-center cursor-pointer hover:text-white">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span>gpio.h</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 mb-1 flex items-center cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    <span className="hover:text-white">inc</span>
                  </div>
                </div>
              </div>
              
              {/* Editor area */}
              <div className="flex-1 flex flex-col">
                {/* File tabs */}
                <div className="flex bg-[#252526] border-b border-[#3d3d3d] text-xs">
                  <div className="px-3 py-2 bg-[#1e1e1e] border-r border-[#3d3d3d] text-white flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span>pwm.c</span>
                    <span className="ml-2 text-[#858585] hover:text-white cursor-pointer">×</span>
                  </div>
                  <div className="px-3 py-2 border-r border-[#3d3d3d] text-[#858585] flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#858585] mr-2"></div>
                    <span>timer.h</span>
                    <span className="ml-2 hover:text-white cursor-pointer">×</span>
                  </div>
                </div>
                
                {/* Code area */}
                <div className="flex font-mono text-xs flex-grow overflow-auto">
                  {/* Line numbers */}
                  <div className="text-right py-3 px-2 bg-[#1e1e1e] text-[#6e7681] select-none">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div key={i} className="h-5">{i + 1}</div>
                    ))}
                  </div>
                  
                  {/* Code content */}
                  <div className="py-3 px-2 bg-[#1e1e1e] text-[#e6edf3] flex-1">
                    <div><span className="text-[#6a9955]">/**</span></div>
                    <div><span className="text-[#6a9955]"> * Simple PWM Servo Controller</span></div>
                    <div><span className="text-[#6a9955]"> * Demonstrates how to control a servo motor using PWM</span></div>
                    <div><span className="text-[#6a9955]"> * Author: dspcoder.com</span></div>
                    <div><span className="text-[#6a9955]"> */</span></div>
                    <div></div>
                    <div><span className="text-[#569cd6]">#include</span> <span className="text-[#ce9178]">"timer.h"</span>  <span className="text-[#6a9955]">// Abstracted timer control (dummy)</span></div>
                    <div><span className="text-[#569cd6]">#include</span> <span className="text-[#ce9178]">"gpio.h"</span>   <span className="text-[#6a9955]">// Abstracted GPIO control (dummy)</span></div>
                    <div></div>
                    <div><span className="text-[#6a9955]">// Define servo control pin and PWM parameters</span></div>
                    <div><span className="text-[#569cd6]">#define</span> <span className="text-[#4fc1ff]">PWM_PORT</span> <span className="text-[#d4d4d4]">GPIOA</span></div>
                    <div><span className="text-[#569cd6]">#define</span> <span className="text-[#4fc1ff]">PWM_PIN</span>  <span className="text-[#d4d4d4]">GPIO_PIN_5</span></div>
                    <div><span className="text-[#569cd6]">#define</span> <span className="text-[#4fc1ff]">PWM_FREQUENCY</span> <span className="text-[#d4d4d4]">50</span> <span className="text-[#6a9955]">// Typical servo frequency: 50Hz</span></div>
                    <div></div>
                    <div><span className="text-[#6a9955]">/**</span></div>
                    <div><span className="text-[#6a9955]"> * Initializes PWM on a given timer channel</span></div>
                    <div><span className="text-[#6a9955]"> */</span></div>
                    <div><span className="text-[#569cd6]">void</span> <span className="text-[#dcdcaa]">pwm_init</span><span className="text-[#d4d4d4]">(uint8_t channel, uint32_t frequency) {'{'}</span></div>
                    <div>    <span className="text-[#dcdcaa]">timer_init</span><span className="text-[#d4d4d4]">(channel, frequency);</span> <span className="text-[#6a9955]">// Configure timer with desired frequency</span></div>
                    <div>    <span className="text-[#dcdcaa]">gpio_set_mode</span><span className="text-[#d4d4d4]">(PWM_PORT, PWM_PIN, GPIO_MODE_OUTPUT);</span> <span className="text-[#6a9955]">// Set pin as output</span></div>
                    <div><span className="text-[#d4d4d4]">{'}'}</span></div>
                    <div></div>
                    <div><span className="text-[#6a9955]">/**</span></div>
                    <div><span className="text-[#6a9955]"> * Sets the PWM duty cycle (range: 0–100%)</span></div>
                    <div><span className="text-[#6a9955]"> */</span></div>
                    <div><span className="text-[#569cd6]">void</span> <span className="text-[#dcdcaa]">pwm_set_duty</span><span className="text-[#d4d4d4]">(uint8_t channel, uint8_t duty) {'{'}</span></div>
                    <div>    <span className="text-[#c586c0]">if</span><span className="text-[#d4d4d4]"> (duty &gt; 100) duty = 100;</span> <span className="text-[#6a9955]">// Clamp to max 100%</span></div>
                    <div>    <span className="text-[#dcdcaa]">timer_set_compare</span><span className="text-[#d4d4d4]">(channel, duty);</span> <span className="text-[#6a9955]">// Set compare value for duty cycle</span></div>
                    <div><span className="text-[#d4d4d4]">{'}'}</span></div>
                    <div></div>
                    <div><span className="text-[#6a9955]">/**</span></div>
                    <div><span className="text-[#6a9955]"> * Converts angle (0–180°) to PWM duty cycle (5%–10%)</span></div>
                    <div><span className="text-[#6a9955]"> * and sets the servo position</span></div>
                    <div><span className="text-[#6a9955]"> */</span></div>
                    <div><span className="text-[#569cd6]">void</span> <span className="text-[#dcdcaa]">servo_set_angle</span><span className="text-[#d4d4d4]">(uint8_t channel, uint8_t angle) {'{'}</span></div>
                    <div>    <span className="text-[#c586c0]">if</span><span className="text-[#d4d4d4]"> (angle &gt; 180) angle = 180;</span> <span className="text-[#6a9955]">// Clamp to 180°</span></div>
                    <div>    <span className="text-[#569cd6]">uint8_t</span> <span className="text-[#d4d4d4]">duty = 5 + (angle * 5 / 180);</span> <span className="text-[#6a9955]">// Map angle to 5–10% duty</span></div>
                    <div>    <span className="text-[#dcdcaa]">pwm_set_duty</span><span className="text-[#d4d4d4]">(channel, duty);</span></div>
                    <div><span className="text-[#d4d4d4]">{'}'}</span></div>
                    <div></div>
                    <div><span className="text-[#6a9955]">/**</span></div>
                    <div><span className="text-[#6a9955]"> * Main function - Demonstrates usage</span></div>
                    <div><span className="text-[#6a9955]"> */</span></div>
                    <div><span className="text-[#569cd6]">int</span> <span className="text-[#dcdcaa]">main</span><span className="text-[#d4d4d4]">() {'{'}</span></div>
                    <div>    <span className="text-[#dcdcaa]">pwm_init</span><span className="text-[#d4d4d4]">(0, PWM_FREQUENCY);</span>       <span className="text-[#6a9955]">// Initialize PWM on channel 0</span></div>
                    <div>    <span className="text-[#dcdcaa]">servo_set_angle</span><span className="text-[#d4d4d4]">(0, 90);</span>           <span className="text-[#6a9955]">// Move servo to 90° (center)</span></div>
                    <div>    <span className="text-[#c586c0]">while</span> <span className="text-[#d4d4d4]">(1);</span>                        <span className="text-[#6a9955]">// Infinite loop to hold position</span></div>
                    <div>    <span className="text-[#c586c0]">return</span> <span className="text-[#d4d4d4]">0;</span></div>
                    <div><span className="text-[#d4d4d4]">{'}'}</span></div>
                  </div>
                </div>
                
                {/* Status bar */}
                <div className="bg-[#007acc] text-white flex justify-between items-center text-xs px-3 py-1">
                  <div className="flex items-center space-x-3">
                    <span>main</span>
                    <span className="flex items-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="4"></circle>
                        <line x1="21.17" y1="8" x2="12" y2="8"></line>
                        <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                        <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
                      </svg>
                      Live Share
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span>Ln 28, Col 16</span>
                    <span>UTF-8</span>
                    <span>CRLF</span>
                    <span>C/C++</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Removed Try VS Code Integration button to give more prominence to the VS Code interface */}
        </div>
      )
    },
    {
      id: 6,
      icon: <Users className="w-5 h-5 text-rose-400" />,
      title: "Active Community of Embedded Experts",
      description: "Join a thriving community of embedded systems professionals and enthusiasts to share knowledge and get help.",
      previewComponent: (
        <div className="bg-[rgb(16,16,18)] rounded-xl shadow-xl border border-[rgb(30,30,32)] p-6 h-full overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 text-rose-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Community</h3>
              </div>
              <p className="text-gray-300 mb-3">
                Join a thriving community of embedded systems professionals and enthusiasts to share knowledge and get help.
              </p>
              {/* Removed member count as community is still starting out */}
            </div>
          </div>
          
          {/* Community feature tiles */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[rgb(20,20,22)]/90 rounded-lg border border-[rgb(40,40,42)] p-3 hover:border-rose-500/30 transition-all">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 mr-2">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-white text-sm font-medium">Connect with Engineers</h4>
              </div>
              <p className="text-xs text-gray-400">
                Network with fellow embedded systems engineers and expand your professional connections.
              </p>
            </div>
            
            <div className="bg-[rgb(20,20,22)]/90 rounded-lg border border-[rgb(40,40,42)] p-3 hover:border-rose-500/30 transition-all">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 mr-2">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-white text-sm font-medium">Active Discussions</h4>
              </div>
              <p className="text-xs text-gray-400">
                Participate in technical discussions on problems, best practices, and latest embedded trends.
              </p>
            </div>
            
            <div className="bg-[rgb(20,20,22)]/90 rounded-lg border border-[rgb(40,40,42)] p-3 hover:border-rose-500/30 transition-all">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 mr-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <path d="M12 11h4"></path>
                    <path d="M12 16h4"></path>
                    <path d="M8 11h.01"></path>
                    <path d="M8 16h.01"></path>
                  </svg>
                </div>
                <h4 className="text-white text-sm font-medium">Mock Interviews</h4>
              </div>
              <p className="text-xs text-gray-400">
                Practice with peer-to-peer mock interviews and get feedback to improve your interview skills.
              </p>
            </div>
            
            <div className="bg-[rgb(20,20,22)]/90 rounded-lg border border-[rgb(40,40,42)] p-3 hover:border-rose-500/30 transition-all">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 mr-2">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h4 className="text-white text-sm font-medium">Find Jobs</h4>
              </div>
              <p className="text-xs text-gray-400">
                Discover embedded systems job opportunities shared exclusively with our community.
              </p>
            </div>
          </div>
          
          <div className="bg-[rgb(20,20,22)]/90 rounded-lg border border-[rgb(40,40,42)] p-4 mb-5">
            <div className="mb-3">
              <h4 className="text-white font-medium flex items-center">
                <Zap className="h-4 w-4 text-amber-400 mr-2" />
                Example Discussions
              </h4>
              <p className="text-xs text-gray-500 mt-1">Topics you'll be able to discuss in our community</p>
            </div>
            
            <div className="space-y-2">
              <div className="bg-[rgb(14,14,16)]/90 p-3 rounded-lg border border-[rgb(30,30,32)] hover:border-rose-500/30 transition-all cursor-pointer group">
                <h5 className="text-white group-hover:text-rose-400 transition-colors text-sm font-medium mb-1">Best approach for mutex implementation in FreeRTOS?</h5>
                <div className="text-xs text-gray-400 mb-2">
                  I'm working on a critical section that needs protection. Should I use a mutex or a semaphore for this case?
                </div>
                <div className="flex items-center text-xs text-rose-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  <span>Join to participate in discussions</span>
                </div>
              </div>
              
              <div className="bg-[rgb(14,14,16)]/90 p-3 rounded-lg border border-[rgb(30,30,32)] hover:border-rose-500/30 transition-all cursor-pointer group">
                <h5 className="text-white group-hover:text-rose-400 transition-colors text-sm font-medium mb-1">Stack overflow detection in bare-metal systems</h5>
                <div className="text-xs text-gray-400 mb-2">
                  What's the most efficient way to implement stack overflow detection in a resource-constrained system?
                </div>
                <div className="flex items-center text-xs text-rose-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  <span>Join to participate in discussions</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-3 text-center">
            <button className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-sm font-medium inline-flex items-center space-x-2 transition-colors">
              <span>Join The Community</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden text-slate-50">
      {/* Enhanced background with more dynamic elements */}
      <div className="absolute inset-0 bg-[rgb(24,24,26)] z-0"></div>
      
      {/* Animated grid patterns */}
      <div className="circuit-lines absolute inset-0 z-0 opacity-20"></div>
      
      {/* Interactive gradient orbs */}
      <div className="absolute w-full h-full z-0">
        <div className="absolute right-0 bottom-1/3 w-96 h-96 bg-[rgb(214,251,65)]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute left-0 top-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-1/4 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-[90px] animate-pulse"></div>
      </div>
      
      {/* Digital circuit paths - decorative lines */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[rgb(214,251,65)]/30 to-transparent"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-[rgb(214,251,65)]/30 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16 overflow-x-auto pb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-4 py-1 bg-[rgba(214,251,65,0.1)] rounded-full text-[rgb(214,251,65)] text-sm font-medium mb-4">
            POWERFUL TOOLSET
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl xl:text-5xl mb-6 whitespace-nowrap">
            <span className="text-white">Platform</span>
            <span className="text-[rgb(214,251,65)]"> Features</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Explore the powerful features that make dspcoder.com the ultimate platform for embedded systems interview preparation.
          </p>
        </motion.div>

        {/* Mobile and Tablet Feature Navigation - becomes horizontal tabs */}
        <div className="lg:hidden overflow-x-auto mb-6">
          <div className="flex space-x-3 pb-2 min-w-max">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`px-4 py-2 rounded-lg cursor-pointer transition-all whitespace-nowrap ${
                  activeFeature === feature.id
                    ? "bg-[rgb(214,251,65)]/10 border border-[rgb(214,251,65)]/30 text-[rgb(214,251,65)]"
                    : "hover:bg-[rgb(30,30,32)] border border-transparent text-white"
                }`}
                onClick={() => setActiveFeature(feature.id)}
              >
                <div className="flex items-center">
                  <div className={`mr-2 ${activeFeature === feature.id ? "" : "text-gray-400"}`}>
                    {feature.icon}
                  </div>
                  <div className="text-sm font-medium">
                    {feature.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Feature navigation - left column only on large screens (laptops and bigger), hidden on mobile and tablets */}
          <motion.div
            className="hidden lg:block lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-[rgb(18,18,20)]/70 rounded-xl border border-[rgb(30,30,32)] p-5 h-full">
              <h3 className="text-xl font-semibold mb-6 text-white">Explore Features</h3>
              <div className="space-y-3">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      activeFeature === feature.id
                        ? "bg-[rgb(214,251,65)]/10 border border-[rgb(214,251,65)]/30"
                        : "hover:bg-[rgb(30,30,32)] border border-transparent"
                    }`}
                    onClick={() => setActiveFeature(feature.id)}
                  >
                    <div className="flex items-start">
                      <div className={`mr-3 mt-0.5 ${activeFeature === feature.id ? "" : "text-gray-400"}`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className={`text-sm font-medium ${activeFeature === feature.id ? "text-[rgb(214,251,65)]" : "text-white"}`}>
                          {feature.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {feature.title === "200+ Expert-Reviewed Questions" ? 
                            "Comprehensive exercises with expert verification" :
                          feature.title === "Quick Revision with Short Notes" ?
                            "Concise study materials for rapid review" :
                          feature.title === "Company-Specific Target Study Material" ?
                            "Tailored content for top tech companies" :
                          feature.title === "Personalized Study Plan Based on Job Description" ?
                            "Customized learning paths for specific roles" :
                          feature.title === "Code directly in VS Code" ?
                            "Familiar development environment integration" :
                            "Connect with fellow engineers and mentors"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Feature content - right side on large screens (70% width), full width on mobile and tablet */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {features.map((feature) => (
              <div 
                key={feature.id} 
                className={`${activeFeature === feature.id ? "block" : "hidden"} h-full`}
              >
                {feature.previewComponent}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}