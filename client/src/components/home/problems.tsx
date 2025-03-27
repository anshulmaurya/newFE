import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const categories = [
  "All Categories",
  "Memory Management",
  "Data Structures",
  "Multithreading",
  "C/C++ APIs",
  "Linux APIs"
];

const problems = [
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
    difficultyColor: "text-primary"
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
  }
];

export default function Problems() {
  const [activeCategory, setActiveCategory] = useState("All Categories");

  return (
    <section id="problems" className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute right-0 top-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute left-0 bottom-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            <span className="text-white">Practice with</span>
            <span className="text-primary"> Real Problems</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Tackle challenges that test your knowledge of embedded systems, from basic concepts to advanced topics.
          </p>
        </motion.div>
        
        {/* Problem categories with tabs */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category 
                  ? "bg-primary text-primary-900 font-medium" 
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>
        
        {/* Problem cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {problems.map((problem) => (
            <div 
              key={problem.id}
              className="glass rounded-xl overflow-hidden border border-slate-700/30 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10 group"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary">{problem.category}</span>
                  <span className={`${problem.difficultyColor} font-medium`}>{problem.difficulty}</span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{problem.title}</h3>
                <p className="text-slate-300 text-sm mb-4">
                  {problem.description}
                </p>
                <div className="flex items-center text-xs text-slate-400 justify-between">
                  <span>Completion rate: {problem.completionRate}</span>
                  <span>⭐ {problem.rating}</span>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-slate-700/30 flex justify-between items-center">
                <span className="text-sm text-slate-400">Estimated time: {problem.estimatedTime}</span>
                <button className="text-primary hover:text-primary/80 transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
        
        <div className="text-center mt-10 mb-16">
          <Button variant="outline" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all inline-flex items-center gap-2">
            <span>View all problems</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Upcoming Hardware Section */}
        <motion.div 
          className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700/30 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2">
              <h3 className="font-display font-bold text-2xl md:text-3xl mb-4">
                <span className="text-white">Coming Soon: </span>
                <span className="text-primary">Real Hardware Deployment</span>
              </h3>
              <p className="text-slate-300 mb-6">
                Soon you'll be able to test your embedded code on actual hardware platforms. Deploy your solutions directly to STM32, Arduino, and other popular platforms right from our interface.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-slate-800 rounded-full flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></div>
                  <span>STM32 Support</span>
                </div>
                <div className="px-4 py-2 bg-slate-800 rounded-full flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                  <span>Arduino Integration</span>
                </div>
                <div className="px-4 py-2 bg-slate-800 rounded-full flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  <span>Raspberry Pi Deployment</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative">
                <motion.div 
                  className="bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-lg"
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
                    <div className="text-sm text-slate-400 ml-2">Hardware Deployment Console</div>
                  </div>
                  <div className="font-mono text-xs text-green-400 bg-slate-950 p-3 rounded-md h-24 overflow-hidden">
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
                  className="absolute -bottom-6 -right-6 w-32 h-32 bg-slate-900 rounded-xl border border-slate-700 p-2 shadow-lg flex items-center justify-center"
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
                    <rect x="10" y="10" width="80" height="80" rx="5" fill="#1e293b" stroke="#3f506e" strokeWidth="2" />
                    <circle cx="30" cy="30" r="5" fill="#10b981" className="animate-ping" style={{ animationDuration: "3s" }} />
                    <circle cx="50" cy="50" r="5" fill="#3b82f6" className="animate-ping" style={{ animationDuration: "4s" }} />
                    <circle cx="70" cy="70" r="5" fill="#8b5cf6" className="animate-ping" style={{ animationDuration: "5s" }} />
                    <path d="M20,80 L30,60 L40,70 L50,40 L60,50 L70,30 L80,20" stroke="#3b82f6" strokeWidth="2" fill="none" />
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
