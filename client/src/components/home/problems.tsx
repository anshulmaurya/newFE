import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

// Define problem interface
interface Problem {
  id: number;
  category: string;
  difficulty: string;
  title: string;
  description: string;
  completionRate: string;
  rating: string;
  estimatedTime: string;
  difficultyColor: string;
}

// Category definitions
const categories = [
  "All Categories",
  "Memory Management",
  "Data Structures",
  "Multithreading",
  "C/C++ APIs",
  "Linux APIs"
];

// Problem data
const problems: Problem[] = [
  {
    id: 1,
    category: "Multithreading",
    difficulty: "Medium",
    title: "Thread-Safe Ring Buffer",
    description: "Implement a thread-safe ring buffer data structure for inter-thread communication in a resource-constrained environment.",
    completionRate: "68%",
    rating: "4.7/5",
    estimatedTime: "45 min",
    difficultyColor: "text-pink-500"
  },
  {
    id: 2,
    category: "Memory Management",
    difficulty: "Easy",
    title: "Custom Memory Allocator",
    description: "Design a static memory allocation system optimized for embedded systems with limited heap space and fragmentation prevention.",
    completionRate: "82%",
    rating: "4.3/5",
    estimatedTime: "30 min",
    difficultyColor: "text-[rgb(214,251,65)]"
  },
  {
    id: 3,
    category: "Data Structures",
    difficulty: "Hard",
    title: "Zero-Copy Protocol Parser",
    description: "Create an efficient zero-copy protocol parser using optimized data structures for processing communication packets.",
    completionRate: "41%",
    rating: "4.9/5",
    estimatedTime: "60 min",
    difficultyColor: "text-purple-500"
  },
  {
    id: 4,
    category: "Memory Management",
    difficulty: "Medium",
    title: "Memory Pool Implementation",
    description: "Create a fixed-size memory pool allocator that minimizes fragmentation for real-time embedded applications.",
    completionRate: "65%",
    rating: "4.5/5",
    estimatedTime: "40 min",
    difficultyColor: "text-pink-500"
  },
  {
    id: 5,
    category: "C/C++ APIs",
    difficulty: "Easy",
    title: "Interrupt Service Routine",
    description: "Implement a proper interrupt service routine (ISR) in C that efficiently handles external hardware interrupts.",
    completionRate: "79%",
    rating: "4.2/5",
    estimatedTime: "25 min",
    difficultyColor: "text-[rgb(214,251,65)]"
  },
  {
    id: 6,
    category: "Multithreading",
    difficulty: "Hard",
    title: "Real-time Scheduler",
    description: "Design a priority-based preemptive scheduler for embedded real-time operating system with minimal overhead.",
    completionRate: "38%",
    rating: "4.8/5",
    estimatedTime: "70 min",
    difficultyColor: "text-purple-500"
  },
  {
    id: 7,
    category: "Linux APIs",
    difficulty: "Medium",
    title: "Custom Device Driver",
    description: "Develop a Linux kernel device driver for a custom hardware peripheral with interrupt handling capabilities.",
    completionRate: "55%",
    rating: "4.6/5",
    estimatedTime: "60 min",
    difficultyColor: "text-pink-500"
  },
  {
    id: 8,
    category: "Data Structures",
    difficulty: "Medium",
    title: "Lockless Queue Implementation",
    description: "Create a lock-free queue data structure suitable for inter-core communication in multicore embedded systems.",
    completionRate: "62%",
    rating: "4.7/5",
    estimatedTime: "50 min",
    difficultyColor: "text-pink-500"
  },
  {
    id: 9,
    category: "C/C++ APIs",
    difficulty: "Hard",
    title: "Zero-Copy DMA Controller",
    description: "Implement a DMA controller interface that enables efficient zero-copy transfers between peripherals and memory.",
    completionRate: "44%",
    rating: "4.9/5",
    estimatedTime: "65 min",
    difficultyColor: "text-purple-500"
  }
];

export default function Problems() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  
  // Filter problems based on active category
  const filteredProblems = problems.filter(
    problem => activeCategory === "All Categories" || problem.category === activeCategory
  );

  // Function to render a problem card
  const renderProblemCard = (problem: Problem) => (
    <motion.div 
      key={problem.id}
      className="glass rounded-xl overflow-hidden border border-[rgb(30,30,32)]/30 hover:border-[rgb(214,251,65)]/30 transition-all hover:shadow-lg hover:shadow-[rgb(214,251,65)]/10 group"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-[rgb(214,251,65)]/20 text-[rgb(214,251,65)]">
            {problem.category}
          </span>
          <span className={`${problem.difficultyColor} font-medium`}>
            {problem.difficulty}
          </span>
        </div>
        <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-[rgb(214,251,65)] transition-colors">
          {problem.title}
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          {problem.description}
        </p>
        <div className="flex items-center text-xs text-gray-400 justify-between">
          <span>Completion rate: {problem.completionRate}</span>
          <span>⭐ {problem.rating}</span>
        </div>
      </div>
      <div className="px-5 py-3 border-t border-[rgb(30,30,32)]/30 flex justify-between items-center">
        <span className="text-sm text-gray-400">Estimated time: {problem.estimatedTime}</span>
        <button className="text-[rgb(214,251,65)] hover:text-[rgb(214,251,65)]/80 transition-colors flex items-center gap-1">
          <span>Solve</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );

  // Function to render the empty state when no problems match the filter
  const renderEmptyState = () => (
    <div className="col-span-3 text-center py-16">
      <div className="mb-4 text-gray-400">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="mx-auto"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9 10h.01"></path>
          <path d="M15 10h.01"></path>
          <path d="M9.5 15.5a3.5 3.5 0 0 0 5 0"></path>
        </svg>
      </div>
      <h3 className="text-xl font-medium mb-2">No problems found</h3>
      <p className="text-gray-400">We'll be adding more problems to this category soon!</p>
    </div>
  );

  return (
    <section id="problems" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute right-0 top-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute left-0 bottom-1/4 w-64 h-64 bg-[rgb(214,251,65)]/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            <span className="text-white">Practice with</span>
            <span className="text-[rgb(214,251,65)]"> Real Problems</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Tackle challenges that test your knowledge of embedded systems, from basic concepts to advanced topics.
          </p>
        </motion.div>
        
        {/* Category tabs */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => {
              // Calculate count of problems for this category
              const count = category === "All Categories" 
                ? problems.length 
                : problems.filter(p => p.category === category).length;
                
              return (
                <Button
                  key={index}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className={activeCategory === category 
                    ? "bg-[rgb(214,251,65)] text-black font-medium" 
                    : "bg-[rgb(18,18,20)] text-gray-300 hover:bg-[rgb(30,30,32)] transition-colors"
                  }
                >
                  {category} 
                  <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                    activeCategory === category 
                      ? "bg-black/20 text-[rgb(214,251,65)]" 
                      : "bg-[rgb(30,30,32)] text-gray-300"
                  }`}>
                    {count}
                  </span>
                </Button>
              );
            })}
          </div>
        </motion.div>
        
        {/* Problem cards grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {filteredProblems.length === 0 
            ? renderEmptyState() 
            : filteredProblems.map(renderProblemCard)}
        </motion.div>
        
        {/* "View all" button */}
        <div className="text-center mt-10 mb-16">
          <Button 
            variant="outline" 
            className="px-6 py-3 bg-[rgb(18,18,20)] hover:bg-[rgb(214,251,65)] hover:text-black text-gray-300 rounded-lg transition-all inline-flex items-center gap-2"
          >
            <span>View all problems</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Upcoming Hardware Section */}
        <motion.div 
          className="mt-16 bg-gradient-to-r from-[rgb(18,18,20)] to-[rgb(24,24,26)] rounded-2xl p-8 border border-[rgb(30,30,32)]/30 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[rgb(214,251,65)]/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2">
              <h3 className="font-display font-bold text-2xl md:text-3xl mb-4">
                <span className="text-white">Coming Soon: </span>
                <span className="text-[rgb(214,251,65)]">Real Hardware Deployment</span>
              </h3>
              <p className="text-gray-300 mb-6">
                Soon you'll be able to test your embedded code on actual hardware platforms. Deploy your solutions directly to STM32, Arduino, and other popular platforms right from our interface.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-[rgb(18,18,20)] rounded-full flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-[rgb(214,251,65)] mr-2 animate-pulse"></div>
                  <span>STM32 Support</span>
                </div>
                <div className="px-4 py-2 bg-[rgb(18,18,20)] rounded-full flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                  <span>Arduino Integration</span>
                </div>
                <div className="px-4 py-2 bg-[rgb(18,18,20)] rounded-full flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  <span>Raspberry Pi Deployment</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative">
                <motion.div 
                  className="bg-[rgb(18,18,20)] p-4 rounded-xl border border-[rgb(30,30,32)] shadow-lg"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 2, 0, -2, 0]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }}
                >
                  <div className="flex gap-2 items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="text-sm text-gray-400 ml-2">Hardware Deployment Console</div>
                  </div>
                  <div className="font-mono text-xs text-[rgb(214,251,65)] bg-[rgb(12,12,14)] p-3 rounded-md h-24 overflow-hidden">
                    <div className="animate-typing">
                      <p>$ connect --device stm32f4</p>
                      <p>&gt; Connecting to STM32F4 Discovery...</p>
                      <p>&gt; Device connected successfully!</p>
                      <p>&gt; Uploading binary...</p>
                      <p>&gt; Transfer: [████████████████] 100%</p>
                      <p>&gt; Program executing on hardware</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  className="absolute -bottom-6 -right-6 w-32 h-32 bg-[rgb(18,18,20)] rounded-xl border border-[rgb(30,30,32)] p-2 shadow-lg flex items-center justify-center"
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -3, 0, 3, 0]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1
                  }}
                >
                  <svg viewBox="0 0 100 100" className="w-20 h-20">
                    <rect x="10" y="10" width="80" height="80" rx="5" fill="#121214" stroke="#30303a" strokeWidth="2" />
                    <circle cx="30" cy="30" r="5" fill="#d6fb41" className="animate-ping" style={{ animationDuration: "3s" }} />
                    <circle cx="50" cy="50" r="5" fill="#d6fb41" className="animate-ping" style={{ animationDuration: "4s" }} />
                    <circle cx="70" cy="70" r="5" fill="#d6fb41" className="animate-ping" style={{ animationDuration: "5s" }} />
                    <path d="M20,80 L30,60 L40,70 L50,40 L60,50 L70,30 L80,20" stroke="#d6fb41" strokeWidth="2" fill="none" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
