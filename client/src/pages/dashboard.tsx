import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import ActivityHeatmap from '@/components/dashboard/activity-heatmap';
import WeeklyHeatmap from '@/components/dashboard/weekly-heatmap';
import ProblemsSolvedStats from '@/components/dashboard/problems-solved-stats';
import StreakCard from '@/components/dashboard/streak-card';
import ProblemCard, { getStatusIcon } from '@/components/dashboard/problem-card';
import { 
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Circle, 
  Clock3, 
  Loader2, 
  Search, 
  Settings,
  Lock,
  Codepen,
  FolderArchive,
  Share2,
  Database,
  Laptop,
  Cpu,
  Zap,
  LucideIcon,
  Building2,
  Clock,
  Code,
  User,
  CalendarDays,
  ChevronDown,
  Terminal,
  Building,
  Microchip,
  Sparkles,
  Code2,
  Gauge,
  Check,
  X,
  FileText,
} from 'lucide-react';

// Custom hook to prevent scroll issues with dropdowns
const usePreventScrollJump = () => {
  React.useEffect(() => {
    // Create a style element to override select component positioning
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      /* Force all dropdowns to use fixed positioning */
      [data-radix-select-content],
      [data-radix-dropdown-menu-content] {
        position: fixed !important;
        transform: none !important;
        z-index: 100 !important;
      }
      
      /* Fix body styles that might interfere with scrolling */
      body[style*="overflow: hidden"] {
        overflow: auto !important;
        padding-right: 0 !important;
      }
      
      /* Ensure body scroll position is maintained */
      body {
        scroll-behavior: auto !important;
      }
      
      /* Remove all animations that might cause scroll position to change */
      .select-dropdown-animate-out,
      .select-dropdown-animate-in {
        animation: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(styleEl);
    
    // Store initial scroll position when page loads
    let savedScrollPosition = window.scrollY;
    
    // Lock scroll position before any select operation
    const lockScroll = () => {
      savedScrollPosition = window.scrollY;
      // Apply data attribute to body to mark the scroll as locked
      document.body.setAttribute('data-scroll-locked', 'true');
    };
    
    // Restore scroll position after select operation
    const restoreScroll = () => {
      if (document.body.hasAttribute('data-scroll-locked')) {
        window.scrollTo(0, savedScrollPosition);
        document.body.removeAttribute('data-scroll-locked');
      }
    };
    
    // Handle select triggers - prevent default behavior that might cause scroll jumps
    const handleSelectTrigger = (e: MouseEvent) => {
      if (e.target instanceof Element) {
        const isTrigger = e.target.closest('[aria-haspopup="listbox"]') || 
                          e.target.closest('[data-state="closed"]');
        
        if (isTrigger) {
          lockScroll();
        }
      }
    };
    
    // Handle content clicks - restore scroll when clicking select items
    const handleContentClick = (e: MouseEvent) => {
      if (e.target instanceof Element) {
        const isSelectContent = e.target.closest('[role="listbox"]') || 
                               e.target.closest('[role="option"]');
        
        if (isSelectContent) {
          // Small delay to allow select to close first
          setTimeout(restoreScroll, 10);
        }
      }
    };
    
    // Handle scroll events that might occur during select operations
    const handleScroll = () => {
      if (document.body.hasAttribute('data-scroll-locked')) {
        window.scrollTo(0, savedScrollPosition);
      }
    };
    
    // Add event listeners
    document.addEventListener('mousedown', handleSelectTrigger, { capture: true });
    document.addEventListener('click', handleContentClick, { capture: true });
    document.addEventListener('scroll', handleScroll);
    
    // Watch for focus state changes and restore scroll
    const handleFocusChange = () => {
      // After a short delay to let selection complete
      setTimeout(restoreScroll, 50);
    };
    
    document.addEventListener('focusout', handleFocusChange);
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(styleEl);
      document.removeEventListener('mousedown', handleSelectTrigger, { capture: true });
      document.removeEventListener('click', handleContentClick, { capture: true });
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('focusout', handleFocusChange);
    };
  }, []);
  
  return null;
};

import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { useSetupCodebase } from '@/hooks/use-setup-codebase';

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
};

type ProblemResponse = {
  problems: Problem[];
  total: number;
};

// Dashboard component
export default function Dashboard() {
  // State
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [language, setLanguage] = useState<string>('c'); // Default language is C
  const [search, setSearch] = useState<string>('');
  const [showTags, setShowTags] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [jdSubmitted, setJdSubmitted] = useState<boolean>(false);
  
  // Get current user information
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Use the preventScrollJump hook
  usePreventScrollJump();

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

  // Calendar data
  const today = new Date();
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const daysInWeek = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - today.getDay() + i);
    return {
      day: dayNames[i],
      date: d.getDate(),
      isToday: i === today.getDay()
    };
  });

  // Company trends data
  const companyTrends = [
    { name: 'Intel', count: 15 },
    { name: 'Microsoft', count: 12 },
    { name: 'Amazon', count: 10 },
    { name: 'Qualcomm', count: 8 },
    { name: 'Apple', count: 5 }
  ];
  
  // Bundle data
  const bundles = {
    'jd-questions': {
      title: 'JD Based Questions',
      description: 'Tailored questions based on your job description analysis. These questions are specifically selected to match the skills and requirements in your target job.',
      icon: <FileText className="h-5 w-5 text-blue-400" />,
      count: 20,
      estimatedTime: '8 hours',
      difficulty: 'Tailored'
    },
    'blind-75': {
      title: 'Embedded Blind 75',
      description: 'A carefully curated list of 75 most important embedded systems questions that cover all the essential topics for technical interviews.',
      icon: <Code className="h-5 w-5 text-yellow-400" />,
      count: 75,
      estimatedTime: '15 hours',
      difficulty: 'Mixed'
    },
    'linux-basics': {
      title: 'Linux Basics',
      description: 'Essential Linux kernel and system programming concepts for embedded developers. Covers syscalls, drivers, and memory management.',
      icon: <Terminal className="h-5 w-5 text-green-400" />,
      count: 25,
      estimatedTime: '8 hours',
      difficulty: 'Easy to Medium'
    },
    'embedded-essentials': {
      title: 'Embedded Essentials',
      description: 'Core embedded systems concepts including real-time programming, interrupts, DMA, and peripheral interfaces.',
      icon: <Cpu className="h-5 w-5 text-blue-400" />,
      count: 40,
      estimatedTime: '12 hours',
      difficulty: 'Medium'
    },
    'arm': {
      title: 'ARM Interview Bundle',
      description: 'Targeted problems frequently asked in ARM interviews, covering architecture specifics and optimization techniques.',
      icon: <Microchip className="h-5 w-5 text-red-400" />,
      count: 30,
      estimatedTime: '10 hours',
      difficulty: 'Medium to Hard'
    },
    'amd': {
      title: 'AMD Interview Bundle',
      description: 'Problems focused on AMD architecture, GPU programming, and system optimization.',
      icon: <Microchip className="h-5 w-5 text-red-400" />,
      count: 25,
      estimatedTime: '9 hours',
      difficulty: 'Medium to Hard'
    },
    'nvidia': {
      title: 'NVIDIA Interview Bundle',
      description: 'CUDA programming, GPU architecture, and parallel computing problems often encountered in NVIDIA interviews.',
      icon: <Microchip className="h-5 w-5 text-green-500" />,
      count: 28,
      estimatedTime: '10 hours',
      difficulty: 'Hard'
    },
    'c-cpp-asm': {
      title: 'C/C++/ASM Trilogy',
      description: 'Deep dive into low-level programming with C, C++, and Assembly language challenges.',
      icon: <Code2 className="h-5 w-5 text-purple-400" />,
      count: 45,
      estimatedTime: '14 hours',
      difficulty: 'Hard'
    },
    'hard-algorithms': {
      title: 'Hard Algorithms',
      description: 'Advanced algorithm challenges specifically tailored for embedded systems, focusing on optimization and efficiency.',
      icon: <Gauge className="h-5 w-5 text-orange-400" />,
      count: 35,
      estimatedTime: '12 hours',
      difficulty: 'Very Hard'
    },
    'one-week': {
      title: '1-Week Crash Course',
      description: 'An intensive crash course covering essential embedded systems topics. Perfect for last-minute interview preparation.',
      icon: <CalendarDays className="h-5 w-5 text-orange-400" />,
      count: 20,
      estimatedTime: '7 days',
      difficulty: 'Mixed'
    },
    'two-weeks': {
      title: '2-Week Preparation',
      description: 'A balanced preparation plan over two weeks, covering core embedded systems concepts with sufficient practice time.',
      icon: <CalendarDays className="h-5 w-5 text-orange-400" />,
      count: 40,
      estimatedTime: '14 days',
      difficulty: 'Mixed'
    },
    'one-month': {
      title: '1-Month Complete Prep',
      description: 'A comprehensive preparation plan covering all embedded concepts with ample time for practice and revision.',
      icon: <CalendarDays className="h-5 w-5 text-orange-400" />,
      count: 80,
      estimatedTime: '30 days',
      difficulty: 'Mixed'
    }
  };

  // Dashboard uses fixed dark mode styling

  // Get difficulty color class
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Handle bundle selection
  const handleBundleSelect = (bundleId: string) => {
    // Check if authentication is required for certain features
    if (!user && bundleId !== 'blind-75' && bundleId !== 'embedded-essentials') {
      toast({
        title: "Authentication required",
        description: "Please log in to access this feature",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }
    
    setSelectedBundle(bundleId);
    // Could add additional logic here to filter problems by bundle
  };
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSection(prev => {
      if (prev === section) {
        return null;
      }
      return section;
    });
  };
  
  // Setup codebase mutation
  const setupCodebaseMutation = useMutation({
    mutationFn: async ({ problemId, questionId, language }: { problemId: string, questionId?: string, language: string }) => {
      if (!questionId) throw new Error("Question ID is missing");
      
      const res = await apiRequest("POST", "/api/setup-codebase", { 
        questionId: questionId,
        language: language 
      });
      return await res.json();
    },
    onSuccess: (data, variables) => {
      // After successful setup, redirect to coding environment
      if (data && data.containerToken) {
        // Use the token instead of direct container URL
        const encodedTitle = encodeURIComponent(variables.problemId || 'Coding Problem');
        
        // Include the question_id if available for direct API call
        const questionIdParam = variables.questionId ? 
          `&questionId=${encodeURIComponent(variables.questionId)}` : '';
        
        // Navigate to the IDE page with the container token
        window.location.href = `/coding-environment?containerToken=${data.containerToken}&title=${encodedTitle}${questionIdParam}`;
      } else {
        toast({
          title: "Error",
          description: "Failed to set up coding environment",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to set up coding environment: " + (error as Error).message,
        variant: "destructive",
      });
    }
  });
  
  // We're using useSetupCodebase hook for improved navigation
  const { setupCodebase } = useSetupCodebase();
  
  // Handle codebase setup for a problem with immediate navigation (no popups)
  const handleSetupCodebase = (problemId: string, questionId?: string) => {
    if (!user) {
      // Still need to show auth errors
      toast({
        title: "Authentication required",
        description: "Please log in to access the coding environment",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }
    
    // Use the improved setupCodebase hook - no toast notifications
    setupCodebase({
      problemId,
      questionId,
      language
    });
  };

  return (
    <DashboardLayout darkMode={true} toggleTheme={() => {}}>
      <div className="pt-0 pb-8 bg-[rgb(12,12,14)]">
        <div className="pl-4 pr-4 relative">
          <div className="flex">
            <div className="flex-1 space-y-4 w-full">
              {/* WeeklyHeatmap works fine */}
              <WeeklyHeatmap />
              
              {/* Testing ProblemsSolvedStats component */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProblemsSolvedStats />
                {/* StreakCard will be tested later */}
              </div>

              {/* Selected Bundle Details */}
              {selectedBundle && bundles[selectedBundle as keyof typeof bundles] && (
                <div className="bg-[rgb(18,18,20)] rounded-lg p-3 border border-[rgb(35,35,40)] mb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {bundles[selectedBundle as keyof typeof bundles].icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white">
                          {bundles[selectedBundle as keyof typeof bundles].title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 max-w-lg">
                          {bundles[selectedBundle as keyof typeof bundles].description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400">Problems</span>
                        <span className="text-sm font-medium">{bundles[selectedBundle as keyof typeof bundles].count}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400">Estimated Time</span>
                        <span className="text-sm font-medium">{bundles[selectedBundle as keyof typeof bundles].estimatedTime}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400">Difficulty</span>
                        <span className="text-sm font-medium">{bundles[selectedBundle as keyof typeof bundles].difficulty}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Filter Controls */}
              <div className="flex flex-wrap gap-2 mb-4 items-center">
                <div className="flex-grow">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Search problems..."
                      className="h-9 py-2 pl-8 pr-4 bg-[rgb(24,24,27)] border-[rgb(45,45,50)] focus:ring-[rgb(214,251,65)] text-xs"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="w-1/3 md:w-auto">
                  <Select
                    value={difficulty}
                    onValueChange={setDifficulty}
                  >
                    <SelectTrigger className="h-9 bg-[rgb(24,24,27)] border-[rgb(45,45,50)] focus:ring-[rgb(214,251,65)] w-full text-xs">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)] text-xs">
                      <SelectItem value="all" className="text-gray-200 focus:bg-[rgb(45,45,50)]">Difficulty</SelectItem>
                      <SelectItem value="easy" className="text-green-500 focus:bg-[rgb(45,45,50)]">Easy</SelectItem>
                      <SelectItem value="medium" className="text-yellow-500 focus:bg-[rgb(45,45,50)]">Medium</SelectItem>
                      <SelectItem value="hard" className="text-red-500 focus:bg-[rgb(45,45,50)]">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-1/3 md:w-auto">
                  <Select
                    value={category}
                    onValueChange={setCategory}
                  >
                    <SelectTrigger className="h-9 bg-[rgb(24,24,27)] border-[rgb(45,45,50)] focus:ring-[rgb(214,251,65)] w-full text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)] text-xs">
                      <SelectItem value="all" className="text-gray-200 focus:bg-[rgb(45,45,50)]">Category</SelectItem>
                      <SelectItem value="Memory Management" className="text-gray-200 focus:bg-[rgb(45,45,50)]">Memory Management</SelectItem>
                      <SelectItem value="Multithreading" className="text-gray-200 focus:bg-[rgb(45,45,50)]">Multithreading</SelectItem>
                      <SelectItem value="Data Structures" className="text-gray-200 focus:bg-[rgb(45,45,50)]">Data Structures</SelectItem>
                      <SelectItem value="C++ API" className="text-gray-200 focus:bg-[rgb(45,45,50)]">C++ API</SelectItem>
                      <SelectItem value="Linux API" className="text-gray-200 focus:bg-[rgb(45,45,50)]">Linux API</SelectItem>
                      <SelectItem value="RTOS" className="text-gray-200 focus:bg-[rgb(45,45,50)]">RTOS</SelectItem>
                      <SelectItem value="Power Management" className="text-gray-200 focus:bg-[rgb(45,45,50)]">Power Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-1/3 md:w-auto">
                  <Select
                    value={status}
                    onValueChange={setStatus}
                  >
                    <SelectTrigger className="h-9 bg-[rgb(24,24,27)] border-[rgb(45,45,50)] focus:ring-[rgb(214,251,65)] w-full text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)] text-xs">
                      <SelectItem value="all" className="text-gray-200 focus:bg-[rgb(45,45,50)]">Status</SelectItem>
                      <SelectItem value="Solved" className="text-green-500 focus:bg-[rgb(45,45,50)]">Solved</SelectItem>
                      <SelectItem value="Attempted" className="text-yellow-500 focus:bg-[rgb(45,45,50)]">Attempted</SelectItem>
                      <SelectItem value="Not Started" className="text-gray-200 focus:bg-[rgb(45,45,50)]">Not Started</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-1/3 md:w-auto">
                  <Select
                    value={language}
                    onValueChange={setLanguage}
                  >
                    <SelectTrigger className="h-9 bg-[rgb(24,24,27)] border-[rgb(45,45,50)] focus:ring-[rgb(214,251,65)] w-full text-xs">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-[rgb(24,24,27)] border-[rgb(45,45,50)] text-xs">
                      <SelectItem value="c" className="text-gray-200 focus:bg-[rgb(45,45,50)]">C</SelectItem>
                      <SelectItem value="cpp" className="text-gray-200 focus:bg-[rgb(45,45,50)]">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Problem Cards */}
              {isLoadingExternal ? (
                <div className="bg-[rgb(18,18,20)] rounded-lg border border-[rgb(45,45,50)] p-8 text-center">
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[rgb(214,251,65)]" />
                    <p className="mt-2 text-gray-400 text-xs">Loading problems...</p>
                  </div>
                </div>
              ) : externalProblems && externalProblems.length > 0 ? (
                <div className="space-y-3">
                  {externalProblems
                    .filter((problem: any) => {
                      // Apply difficulty filter
                      if (difficulty !== 'all' && problem.difficulty?.toLowerCase() !== difficulty.toLowerCase()) {
                        return false;
                      }
                      
                      // Apply category filter
                      if (category !== 'all' && 
                          !(problem.category?.toLowerCase() === category.toLowerCase() ||
                            problem.type?.toLowerCase() === category.toLowerCase() ||
                            problem.tags?.some((tag: string) => tag.toLowerCase() === category.toLowerCase()))
                         ) {
                        return false;
                      }
                      
                      // Apply status filter - only works if user is authenticated
                      if (status !== 'all') {
                        // If user is not authenticated, and status is not 'Not Started', don't show problems
                        if (!user && status !== 'Not Started') {
                          return false;
                        } else if (user) {
                          // For authenticated users, filter by progress data
                          const progressData = userProgressData?.find((p: any) => p.problemId === problem.id);
                          const problemStatus = progressData?.status || 'Not Started';
                          if (problemStatus !== status) {
                            return false;
                          }
                        }
                      }
                      
                      // Apply search filter
                      if (search && search.trim() !== '') {
                        const searchTerm = search.toLowerCase();
                        return problem.title?.toLowerCase().includes(searchTerm) ||
                              problem.description?.toLowerCase().includes(searchTerm) ||
                              problem.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm)) ||
                              problem.companies?.some((company: string) => company.toLowerCase().includes(searchTerm));
                      }
                      
                      return true;
                    })
                    .map((problem: any, idx: number) => {
                      // Get the problem status from userProgress data if available, otherwise default to "Not Started"
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
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                    <p className="mt-2 text-gray-400 text-xs">No problems found</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right sidebar removed as requested */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}