import { motion } from "framer-motion";
import { 
  Code, 
  Cpu, 
  GraduationCap, 
  BarChart3, 
  Users, 
  Briefcase 
} from "lucide-react";

const features = [
  {
    icon: <Code className="text-primary text-xl" />,
    title: "Interactive Code Editor",
    description: "Write, compile, and test your code in real-time with syntax highlighting and intelligent code completion."
  },
  {
    icon: <Cpu className="text-primary text-xl" />,
    title: "Hardware Simulation",
    description: "Test your embedded code with simulated hardware environments for MCUs, peripherals, and real-time systems."
  },
  {
    icon: <GraduationCap className="text-primary text-xl" />,
    title: "Guided Learning",
    description: "Step-by-step tutorials and hints to help you understand core concepts and optimize your solutions."
  },
  {
    icon: <BarChart3 className="text-primary text-xl" />,
    title: "Progress Tracking",
    description: "Monitor your progress with detailed analytics and personalized learning paths to focus on your weak areas."
  },
  {
    icon: <Users className="text-primary text-xl" />,
    title: "Community Challenges",
    description: "Participate in community challenges and compete with other engineers to improve your skills."
  },
  {
    icon: <Briefcase className="text-primary text-xl" />,
    title: "Interview Preparation",
    description: "Practice with actual interview questions from top tech companies specializing in embedded systems."
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 relative">
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
            <span className="text-white">Advanced</span>
            <span className="text-primary"> Features</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Our platform is designed to help you master embedded systems through hands-on practice and real-world challenges.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="glass rounded-xl p-6 border border-slate-700/30 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group"
              variants={item}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-xl mb-3">{feature.title}</h3>
              <p className="text-slate-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
