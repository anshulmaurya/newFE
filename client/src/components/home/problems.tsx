import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const categories = [
  "All Categories",
  "RTOS",
  "Memory Management",
  "Peripherals",
  "Interrupts",
  "ARM Architecture"
];

const problems = [
  {
    id: 1,
    category: "RTOS",
    difficulty: "Medium",
    title: "Implement a Priority Scheduler",
    description: "Design a priority-based task scheduler with preemption for a real-time operating system.",
    completionRate: "68%",
    rating: "4.7/5",
    estimatedTime: "45 min",
    difficultyColor: "text-pink-500"
  },
  {
    id: 2,
    category: "Memory",
    difficulty: "Easy",
    title: "Memory-Mapped I/O Implementation",
    description: "Create a device driver that interfaces with hardware using memory-mapped I/O registers.",
    completionRate: "82%",
    rating: "4.3/5",
    estimatedTime: "30 min",
    difficultyColor: "text-primary"
  },
  {
    id: 3,
    category: "Interrupts",
    difficulty: "Hard",
    title: "Nested Interrupt Handler",
    description: "Implement a nested interrupt handler with priority levels for an ARM Cortex-M microcontroller.",
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
        
        <div className="text-center mt-10">
          <Button variant="outline" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all inline-flex items-center gap-2">
            <span>View all problems</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
