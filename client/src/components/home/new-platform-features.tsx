import { motion } from "framer-motion";
import { useState } from "react";
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
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-xl border border-slate-700/50 p-6 h-full overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Problem Library</h3>
              <p className="text-slate-400 text-sm">Browse by category or difficulty</p>
            </div>
            <div className="flex space-x-2">
              {["Easy", "Medium", "Hard"].map((diff) => (
                <span 
                  key={diff} 
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    diff === "Easy" 
                      ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30" 
                      : diff === "Medium"
                        ? "bg-amber-400/10 text-amber-400 border border-amber-400/30"
                        : "bg-rose-400/10 text-rose-400 border border-rose-400/30"
                  }`}
                >
                  {diff}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 mb-6 pb-2 overflow-x-auto hide-scrollbar">
            {["Memory Management", "Multithreading", "Data Structures", "RTOS", "C/C++ APIs"].map((cat) => (
              <div 
                key={cat}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  cat === activeCategory
                    ? "bg-indigo-500/80 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {activeCategory.split(" ")[0]}
                  </span>
                  <span className="text-xs font-medium text-amber-400">Medium</span>
                </div>
                <h4 className="font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {["Memory Leak Detector", "Stack Overflow Detection", "Mutex Implementation", "Circular Buffer"][i-1]}
                </h4>
                <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                  {[
                    "Implement a system to detect memory leaks in an embedded application.",
                    "Design a function to detect stack overflows in a real-time system.",
                    "Implement a mutex for critical section protection in a multithreaded environment.",
                    "Implement a circular buffer for efficient producer-consumer data exchange."
                  ][i-1]}
                </p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Est: 30 min</span>
                  <button className="text-indigo-400 group-hover:text-indigo-300 flex items-center space-x-1 transition-colors">
                    <span>Solve</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-sm font-medium inline-flex items-center space-x-2 transition-colors">
              <span>Browse All Problems</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-xl border border-slate-700/50 p-6 h-full overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Quick Notes</h3>
              <p className="text-slate-400 text-sm">Condensed knowledge for rapid review</p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span className="text-sm text-sky-400">5 min read</span>
            </div>
          </div>
          
          <div className="bg-slate-800/80 rounded-lg border border-slate-700/50 p-5 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-base font-medium text-white">Memory-Mapped vs Port-Mapped I/O</h4>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Architecture
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-900/70 rounded-lg p-4 border border-slate-700">
                <h5 className="text-sky-400 font-medium mb-2 flex items-center">
                  <span className="bg-sky-400/20 p-1 rounded mr-2">
                    <Cpu className="h-4 w-4 text-sky-400" />
                  </span>
                  Memory-Mapped I/O
                </h5>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-2">•</span>
                    <span>I/O devices and memory share the same address space</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-2">•</span>
                    <span>Any instruction that can access memory can access I/O devices</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-2">•</span>
                    <span>Simpler programming but more complex address decoding</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-slate-900/70 rounded-lg p-4 border border-slate-700">
                <h5 className="text-sky-400 font-medium mb-2 flex items-center">
                  <span className="bg-sky-400/20 p-1 rounded mr-2">
                    <Cpu className="h-4 w-4 text-sky-400" />
                  </span>
                  Port-Mapped I/O
                </h5>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-2">•</span>
                    <span>Separate address spaces for memory and I/O devices</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-2">•</span>
                    <span>Requires special IN/OUT instructions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-400 mr-2">•</span>
                    <span>More efficient addressing but special instruction handling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full text-sm font-medium inline-flex items-center space-x-2 transition-colors">
              <span>Browse All Notes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-xl border border-slate-700/50 p-6 h-full overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Company Focus</h3>
              <p className="text-slate-400 text-sm">Targeted preparation for top employers</p>
            </div>
            <div>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Premium Content
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-800/80 rounded-lg border border-slate-700/50 p-4 hover:border-amber-500/50 transition-all group">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-amber-400 mr-3">
                  <span className="font-bold">Q</span>
                </div>
                <h4 className="text-white group-hover:text-amber-400 transition-colors font-medium">Qualcomm</h4>
              </div>
              <div className="space-y-2 mb-3">
                <div className="text-xs text-slate-300">
                  <span className="font-medium text-slate-200">Focus Areas:</span> RTOS, DSP, 5G, Power Management
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Questions:</span>
                    <span className="text-amber-400 font-medium">48</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Labs:</span>
                    <span className="text-amber-400 font-medium">14</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Notes:</span>
                    <span className="text-amber-400 font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Interviews:</span>
                    <span className="text-amber-400 font-medium">8</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-2 bg-slate-700 hover:bg-amber-500 text-slate-300 hover:text-white rounded-md text-xs font-medium transition-all flex items-center justify-center space-x-1">
                <span>View Study Plan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="bg-slate-800/80 rounded-lg border border-slate-700/50 p-4 hover:border-amber-500/50 transition-all group">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-green-400 mr-3">
                  <span className="font-bold">N</span>
                </div>
                <h4 className="text-white group-hover:text-amber-400 transition-colors font-medium">NVIDIA</h4>
              </div>
              <div className="space-y-2 mb-3">
                <div className="text-xs text-slate-300">
                  <span className="font-medium text-slate-200">Focus Areas:</span> GPU Architecture, CUDA, AI Accelerators
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Questions:</span>
                    <span className="text-amber-400 font-medium">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Labs:</span>
                    <span className="text-amber-400 font-medium">11</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Notes:</span>
                    <span className="text-amber-400 font-medium">9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Interviews:</span>
                    <span className="text-amber-400 font-medium">6</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-2 bg-slate-700 hover:bg-amber-500 text-slate-300 hover:text-white rounded-md text-xs font-medium transition-all flex items-center justify-center space-x-1">
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
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-xl border border-slate-700/50 p-6 h-full overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Personalized Study Plan</h3>
              <p className="text-slate-400 text-sm">Tailored to your target job description</p>
            </div>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              AI-Powered
            </span>
          </div>
          
          <div className="bg-slate-800/80 rounded-lg border border-slate-700/50 p-5 mb-5">
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 mb-4">
              <h4 className="text-white font-medium mb-3 flex items-center">
                <FileText className="h-4 w-4 text-purple-400 mr-2" />
                Job Description Analysis
              </h4>
              <div className="space-y-3">
                <div className="bg-slate-800 rounded p-3 border border-slate-700">
                  <p className="text-xs text-slate-300 mb-2">
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
                <div className="bg-slate-900/70 rounded-lg p-3 border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-purple-400 text-sm font-medium">RTOS Fundamentals</h5>
                    <span className="text-xs text-slate-400">Priority: High</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-slate-700 rounded-full h-2 mr-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-xs text-purple-400">75%</span>
                  </div>
                </div>
                
                <div className="bg-slate-900/70 rounded-lg p-3 border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-purple-400 text-sm font-medium">AUTOSAR Architecture</h5>
                    <span className="text-xs text-slate-400">Priority: High</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-slate-700 rounded-full h-2 mr-2">
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
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-sm font-medium inline-flex items-center space-x-2 transition-colors border border-slate-700 hover:border-purple-500/50">
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
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-xl border border-slate-700/50 p-6 h-full overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">VS Code Integration</h3>
              <p className="text-slate-400 text-sm">Code in your familiar environment</p>
            </div>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Seamless Experience
            </span>
          </div>
          
          <div className="rounded-lg overflow-hidden border border-slate-700 shadow-lg">
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
            <div className="flex bg-[#1e1e1e]">
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
              <div className="flex-1">
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
                <div className="flex font-mono text-xs">
                  {/* Line numbers */}
                  <div className="text-right py-3 px-2 bg-[#1e1e1e] text-[#6e7681] select-none">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="h-5">{i + 1}</div>
                    ))}
                  </div>
                  
                  {/* Code content */}
                  <div className="py-3 px-2 bg-[#1e1e1e] text-[#e6edf3] flex-1">
                    <div><span className="text-[#6a9955]">// PWM Generator Implementation</span></div>
                    <div><span className="text-[#6a9955]">// Controls servo motor position via duty cycle</span></div>
                    <div></div>
                    <div><span className="text-[#569cd6]">#include</span> <span className="text-[#ce9178]">"timer.h"</span></div>
                    <div><span className="text-[#569cd6]">#include</span> <span className="text-[#ce9178]">"gpio.h"</span></div>
                    <div></div>
                    <div><span className="text-[#569cd6]">void</span> <span className="text-[#dcdcaa]">pwm_init</span><span className="text-[#d4d4d4]">(uint8_t channel, uint32_t frequency) {'{'}</span></div>
                    <div>  <span className="text-[#dcdcaa]">timer_init</span><span className="text-[#d4d4d4]">(channel, frequency);</span></div>
                    <div>  <span className="text-[#dcdcaa]">gpio_set_mode</span><span className="text-[#d4d4d4]">(PWM_PORT, PWM_PIN, GPIO_MODE_OUTPUT);</span></div>
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
                    <span>Ln 8, Col 21</span>
                    <span>UTF-8</span>
                    <span>CRLF</span>
                    <span>C/C++</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium inline-flex items-center space-x-2 transition-colors">
              <span>Try VS Code Integration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )
    },
    {
      id: 6,
      icon: <Users className="w-5 h-5 text-rose-400" />,
      title: "Active Community of Embedded Experts",
      description: "Join a thriving community of embedded systems professionals and enthusiasts to share knowledge and get help.",
      previewComponent: (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-xl border border-slate-700/50 p-6 h-full overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Community</h3>
              <p className="text-slate-400 text-sm">Connect with fellow engineers and experts</p>
            </div>
            <span className="flex items-center px-3 py-1 text-xs font-medium rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Users className="w-3 h-3 mr-1" />
              <span>2,580+ Members</span>
            </span>
          </div>
          
          <div className="bg-slate-800/80 rounded-lg border border-slate-700/50 p-4 mb-5">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-medium flex items-center">
                <Zap className="h-4 w-4 text-amber-400 mr-2" />
                Active Discussions
              </h4>
              <span className="text-xs text-slate-400">24 new today</span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-700 hover:border-rose-500/30 transition-all cursor-pointer group">
                <div className="flex justify-between mb-2">
                  <h5 className="text-white group-hover:text-rose-400 transition-colors text-sm font-medium">Best approach for mutex implementation in FreeRTOS?</h5>
                  <span className="text-rose-400 text-xs">12m ago</span>
                </div>
                <div className="text-xs text-slate-400 mb-3 line-clamp-2">
                  I'm working on a critical section that needs protection. Should I use a mutex or a semaphore for this case? The resource is...
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center font-medium text-white">
                        {["J", "K", "S"][i-1]}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-3 text-slate-400">
                    <span className="flex items-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      <span>14</span>
                    </span>
                    <span className="flex items-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <polyline points="9 11 12 14 22 4"></polyline>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                      <span>3</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-700 hover:border-rose-500/30 transition-all cursor-pointer group">
                <div className="flex justify-between mb-2">
                  <h5 className="text-white group-hover:text-rose-400 transition-colors text-sm font-medium">Stack overflow detection in bare-metal systems</h5>
                  <span className="text-rose-400 text-xs">1h ago</span>
                </div>
                <div className="text-xs text-slate-400 mb-3 line-clamp-2">
                  What's the most efficient way to implement stack overflow detection in a resource-constrained system without an OS?
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center font-medium text-white">
                        {["A", "R", "M", "T"][i-1]}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-3 text-slate-400">
                    <span className="flex items-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      <span>28</span>
                    </span>
                    <span className="flex items-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <polyline points="9 11 12 14 22 4"></polyline>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                      <span>7</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
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
    <section className="py-16 md:py-24 relative overflow-hidden text-slate-50">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 z-0"></div>
      <div className="absolute w-full h-full z-0">
        <div className="absolute right-0 bottom-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute left-0 top-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl xl:text-5xl mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-300">Platform </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-400">Features</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Explore the powerful features that make dspcoder.com the ultimate platform for embedded systems interview preparation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feature navigation - left column on desktop */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 h-full">
              <h3 className="text-xl font-semibold mb-6 text-white">Explore Features</h3>
              <div className="space-y-2">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      activeFeature === feature.id
                        ? "bg-indigo-500/10 border border-indigo-500/30"
                        : "hover:bg-slate-800/80 border border-transparent"
                    }`}
                    onClick={() => setActiveFeature(feature.id)}
                  >
                    <div className="flex items-center">
                      <div className={`mr-3 ${activeFeature === feature.id ? "" : "text-slate-400"}`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className={`text-sm font-medium ${activeFeature === feature.id ? "text-white" : "text-slate-300"}`}>
                          {feature.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Feature content - right columns on desktop */}
          <motion.div
            className="lg:col-span-2"
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