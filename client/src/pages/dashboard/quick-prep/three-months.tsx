import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from 'wouter';
import ProblemCard, { getStatusIcon } from '@/components/dashboard/problem-card';
import { useAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Loader2, Clock, Badge, ArrowRight, Zap, BookOpen, Code, Terminal, Cpu } from 'lucide-react';

// Define types for API responses
type Problem = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptance_rate: number;
  completionRate?: string;
  estimatedTime?: string;
  frequency?: number;
  created_at: string | null;
  companies?: string[];
  tags?: string[];
  type?: string;
  importance?: string;
  question_id?: string;
};

const ThreeMonthsPage: React.FC = () => {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const { user, darkMode, toggleDarkMode } = useAuth();
  const [search, setSearch] = useState<string>('');
  const [language, setLanguage] = useState<string>('c'); // Default language is C

  // Fetch problems from external API via our server proxy
  const { data: externalProblems, isLoading: isLoadingExternal } = useQuery({
    queryKey: ['/api/problems-proxy'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/problems-proxy');
      const data = await response.json();
      return data.problems;
    },
  });
  
  // Fetch user progress data for problems - only if user is authenticated
  const { data: userProgressData, isLoading: isLoadingUserProgress } = useQuery({
    queryKey: ['/api/user-progress'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/user-progress');
        return await response.json();
      } catch (error) {
        // Return empty array if not authenticated or any other error
        return [];
      }
    },
    // Only run this query if user is authenticated
    enabled: !!user,
  });

  // Setup codebase for a problem
  const handleSetupCodebase = (problemId: string, questionId?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the coding environment",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }
    
    // Navigate to the problem detail or coding page
    setLocation(`/coding-environment?id=${problemId}${questionId ? `&questionId=${questionId}` : ''}`);
  };

  // Topics to focus on in the 3-month preparation
  const focusTopics = [
    {
      title: "Microcontroller Fundamentals",
      description: "Master the core concepts of microcontroller architecture and programming",
      icon: <Cpu className="h-5 w-5 text-blue-500" />,
      topics: ["ARM Architecture", "Memory Types & Hierarchy", "Registers & Addressing Modes", "Instruction Pipeline"]
    },
    {
      title: "Communication Protocols",
      description: "Understand various communication protocols used in embedded systems",
      icon: <Terminal className="h-5 w-5 text-green-500" />,
      topics: ["SPI Implementation", "I2C Bus Protocol", "UART/USART", "CAN Bus"]
    },
    {
      title: "Real-Time Operating Systems",
      description: "Learn RTOS concepts and implementation techniques",
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      topics: ["Task Scheduling", "Mutex & Semaphores", "Message Queues", "Interrupt Handling"]
    },
    {
      title: "C/C++ Programming",
      description: "Deepen your knowledge of C/C++ for embedded systems",
      icon: <Code className="h-5 w-5 text-purple-500" />,
      topics: ["Memory Management", "Pointers & Data Structures", "Bit Manipulation", "Optimization Techniques"]
    }
  ];

  return (
    <DashboardLayout darkMode={darkMode} toggleTheme={toggleDarkMode}>
      <div className="pl-4 pr-4 relative pb-8 bg-[rgb(12,12,14)]">
        <div className="flex">
          <div className="flex-1 space-y-4 w-full">
            {/* Header with title and description */}
            <div className="bg-[rgb(18,18,20)] rounded-lg border border-[rgb(45,45,50)] p-6 mt-4">
              <h1 className="text-2xl font-bold text-[rgb(214,251,65)] mb-2">3 Months Preparation Bundle</h1>
              <p className="text-gray-300 mb-4">
                A comprehensive 3-month preparation plan for embedded systems interviews, designed to systematically build your
                knowledge from fundamentals to advanced concepts. Ideal for thorough long-term interview preparation.
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-gray-300">Duration: 12 weeks</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-gray-300">90+ Practice Problems</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-yellow-400 mr-2" />
                  <span className="text-gray-300">Comprehensive Coverage</span>
                </div>
              </div>
            </div>
            
            {/* Topics to focus on */}
            <div className="bg-[rgb(18,18,20)] rounded-lg border border-[rgb(45,45,50)] p-6">
              <h2 className="text-xl font-bold mb-4">Topics to Focus On</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {focusTopics.map((topic, index) => (
                  <div key={index} className="bg-[rgb(24,24,27)] rounded-lg p-4 border border-[rgb(55,55,60)]">
                    <div className="flex items-start mb-3">
                      <div className="mr-3 p-2 bg-[rgb(35,35,40)] rounded-md">
                        {topic.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{topic.title}</h3>
                        <p className="text-sm text-gray-400">{topic.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-1 pl-4">
                      {topic.topics.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-center">
                          <div className="h-1.5 w-1.5 bg-[rgb(214,251,65)] rounded-full mr-2"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recommended Problems */}
            <div className="bg-[rgb(18,18,20)] rounded-lg border border-[rgb(45,45,50)] p-6">
              <h2 className="text-xl font-bold mb-4">Recommended Problems</h2>
              
              {isLoadingExternal ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 text-[rgb(214,251,65)] animate-spin" />
                  <span className="ml-2 text-gray-400">Loading problems...</span>
                </div>
              ) : externalProblems && externalProblems.length > 0 ? (
                <div className="space-y-3">
                  {externalProblems
                    .filter((problem: any) => {
                      // Simple search filter
                      if (search && !problem.title?.toLowerCase().includes(search.toLowerCase())) {
                        return false;
                      }
                      return true;
                    })
                    .slice(0, 10) // Limit to first 10 problems for this bundle
                    .map((problem: Problem, idx: number) => {
                      // Get the problem status from userProgress data if available
                      const progressData = userProgressData?.find((p: any) => p.problemId === problem.id);
                      const problemStatus = progressData?.status || 'Not Started';
                      const statusIcon = getStatusIcon(problemStatus);
                      
                      return (
                        <ProblemCard 
                          key={problem.id}
                          problem={problem}
                          index={idx}
                          statusIcon={statusIcon}
                          handleSetupCodebase={handleSetupCodebase}
                        />
                      );
                    })}
                </div>
              ) : (
                <div className="bg-[rgb(18,18,20)] rounded-lg border border-[rgb(45,45,50)] p-8 text-center">
                  <p className="text-gray-400 mb-2">No problems found for this bundle.</p>
                </div>
              )}
            </div>
            
            {/* Week-by-week plan */}
            <div className="bg-[rgb(18,18,20)] rounded-lg border border-[rgb(45,45,50)] p-6">
              <h2 className="text-xl font-bold mb-4">Weekly Breakdown</h2>
              <div className="space-y-4">
                <div className="bg-[rgb(24,24,27)] rounded-lg p-4 border border-[rgb(55,55,60)]">
                  <h3 className="font-semibold text-white mb-2">Month 1: Building the Foundation</h3>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-300">
                      <span className="font-medium text-[rgb(214,251,65)]">Week 1-2:</span> Microcontroller architecture, C programming essentials, digital electronics
                    </li>
                    <li className="text-sm text-gray-300">
                      <span className="font-medium text-[rgb(214,251,65)]">Week 3-4:</span> Memory organization, peripheral interfaces, basic embedded algorithms
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[rgb(24,24,27)] rounded-lg p-4 border border-[rgb(55,55,60)]">
                  <h3 className="font-semibold text-white mb-2">Month 2: Intermediate Concepts</h3>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-300">
                      <span className="font-medium text-[rgb(214,251,65)]">Week 5-6:</span> Communication protocols (SPI, I2C, UART), interrupt handling
                    </li>
                    <li className="text-sm text-gray-300">
                      <span className="font-medium text-[rgb(214,251,65)]">Week 7-8:</span> Real-time systems, memory management, state machines
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[rgb(24,24,27)] rounded-lg p-4 border border-[rgb(55,55,60)]">
                  <h3 className="font-semibold text-white mb-2">Month 3: Advanced Applications</h3>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-300">
                      <span className="font-medium text-[rgb(214,251,65)]">Week 9-10:</span> RTOS concepts, multithreading, synchronization primitives
                    </li>
                    <li className="text-sm text-gray-300">
                      <span className="font-medium text-[rgb(214,251,65)]">Week 11-12:</span> Advanced debugging techniques, system design, mock interviews
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ThreeMonthsPage;