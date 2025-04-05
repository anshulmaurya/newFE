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
import { 
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
      
      /* Fix for the main content area to ensure proper overflow behavior */
      .dashboard-content-area {
        overflow-y: auto !important;
        position: relative !important;
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
import Header from '@/components/layout/header';
import DashboardLayout from '@/components/layout/dashboard-layout';

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

  // Function to handle navigation to different sections
  const handleNavigateFeatures = () => {
    // This is a placeholder function for header navigation
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleNavigateProblems = () => {
    // This is a placeholder function for header navigation
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Get difficulty color class
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Get status icon based on problem status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Solved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Attempted':
        return <Clock3 className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-500 opacity-50" />;
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
  
  // Handle codebase setup for a problem
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
    
    // Call the mutation with the problem ID, question ID, and selected language
    setupCodebaseMutation.mutate({ problemId, questionId, language });
  };
  
  // Check if a sidebar item should be disabled (all except Dashboard)
  const isSidebarItemDisabled = (itemName: string) => {
    // Dashboard is always accessible
    if (itemName === 'dashboard') return false;
    // All other items should be disabled for non-authenticated users
    return !user;
  };

  // Apply the scroll jump prevention hook
  usePreventScrollJump();
  
  // State for darkMode - add dark mode toggle functionality
  const [darkMode, setDarkMode] = useState(true);
  
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  // Dashboard content to be rendered inside the layout
  const dashboardContent = (
    <div className="bg-[rgb(14,14,16)] text-white h-full overflow-hidden">
      {/* Header */}
      <Header 
        onNavigateFeatures={handleNavigateFeatures}
        onNavigateProblems={handleNavigateProblems}
        isScrolled={true}
      />
      
      <div className="flex h-[calc(100%-10px)] overflow-hidden">
        {/* Left sidebar - fixed */}
        <div className="hidden lg:block w-56 bg-[rgb(14,14,16)] fixed left-0 top-16 bottom-0 overflow-y-auto border-r border-[rgb(35,35,40)]">
          <div className="px-4 py-4 flex flex-col h-full">
            <a href="/dashboard" className="block text-white text-sm font-medium py-2 px-3 bg-[rgb(24,24,27)] rounded-md mb-3">
              Dashboard
            </a>
            
            {/* Quick Prep Bundles */}
            <div className="mb-4">
              <button 
                className="flex justify-between items-center w-full text-gray-200 hover:text-white text-sm py-2 px-3 rounded-md transition-colors"
                onClick={() => toggleSection('quick-prep')}
              >
                <span>Quick Prep Bundles</span>
                <span><ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'quick-prep' ? 'rotate-180' : ''}`} /></span>
              </button>
              
              {expandedSection === 'quick-prep' && (
                <div className="mt-1 pl-3">
                  <button 
                    className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left"
                    onClick={() => handleBundleSelect('blind-75')}
                  >
                    Embedded Blind 75
                  </button>
                  
                  <button 
                    className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left"
                    onClick={() => handleBundleSelect('one-week')}
                  >
                    1-Week Crash Course
                  </button>
                  
                  <button 
                    className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left"
                    onClick={() => handleBundleSelect('two-weeks')}
                  >
                    2-Week Preparation
                  </button>
                  
                  <button 
                    className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left"
                    onClick={() => handleBundleSelect('one-month')}
                  >
                    1-Month Complete Prep
                  </button>
                </div>
              )}
            </div>
            
            {/* Topic Bundles */}
            <div className="mb-4">
              <button 
                className="flex justify-between items-center w-full text-gray-200 hover:text-white text-sm py-2 px-3 rounded-md transition-colors"
                onClick={() => toggleSection('topic-bundles')}
              >
                <span>Topic Bundles</span>
                <span><ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'topic-bundles' ? 'rotate-180' : ''}`} /></span>
              </button>
              
              {expandedSection === 'topic-bundles' && (
                <div className="mt-1 pl-3">
                  <button 
                    className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left"
                    onClick={() => handleBundleSelect('linux-basics')}
                  >
                    Linux Basics
                  </button>
                  
                  <button 
                    className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left"
                    onClick={() => handleBundleSelect('embedded-essentials')}
                  >
                    Embedded Essentials
                  </button>
                  
                  <button 
                    className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left"
                    onClick={() => handleBundleSelect('c-cpp-asm')}
                  >
                    C/C++/ASM Trilogy
                  </button>
                  
                  <button 
                    className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left"
                    onClick={() => handleBundleSelect('hard-algorithms')}
                  >
                    Hard Algorithms
                  </button>
                </div>
              )}
            </div>
            
            {/* Company Bundles */}
            <div className="mb-4">
              <button 
                className="flex justify-between items-center w-full text-gray-200 hover:text-white text-sm py-2 px-3 rounded-md transition-colors"
                onClick={() => toggleSection('company-bundles')}
              >
                <span>Company Bundles</span>
                <span><ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'company-bundles' ? 'rotate-180' : ''}`} /></span>
              </button>
              
              {expandedSection === 'company-bundles' && (
                <div className="mt-1 pl-3">
                  <button 
                    className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left"
                    onClick={() => handleBundleSelect('arm')}
                  >
                    ARM
                  </button>
                  
                  <button 
                    className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left"
                    onClick={() => handleBundleSelect('amd')}
                  >
                    AMD
                  </button>
                  
                  <button 
                    className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left"
                    onClick={() => handleBundleSelect('nvidia')}
                  >
                    NVIDIA
                  </button>
                </div>
              )}
            </div>
          
            {/* Simple divider */}
            <div className="mt-auto mb-3">
              <div className="flex items-center">
                <div className="flex-grow h-px bg-[rgb(35,35,40)]"></div>
              </div>
            </div>
          
            {/* Community section */}
            <div className="mb-2">
              <div className="rounded-md p-3">
                <a href="#community" className="text-sm text-white hover:text-[rgb(214,251,65)]">
                  Join our Community
                  <span className="inline-block ml-1">→</span>
                </a>
              </div>
            </div>
            
            <div className="flex justify-between mb-3">
              <a href="#github" className="text-gray-500 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </a>
              <a href="#linkedin" className="text-gray-500 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
            
        {/* Main content - scrollable */}
        <div className="w-full lg:ml-56 overflow-y-auto overflow-x-hidden px-4 lg:px-0 pt-14 pb-8 bg-[rgb(14,14,16)] dashboard-content-area">
          {/* Main content area - flex layout with right sidebar */}
          <div className="flex">
            {/* Main content column */}
            <div className="flex-grow pt-0 pb-8 px-2 space-y-2 overflow-x-hidden mr-0 lg:mr-64">
            
              {/* Activity Heatmap */}
              <ActivityHeatmap />

              {/* Selected Bundle Details */}
              {selectedBundle && bundles[selectedBundle as keyof typeof bundles] && (
                <div className="bg-[rgb(20,20,22)] rounded-lg p-3 border border-[rgb(35,35,40)] mb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {bundles[selectedBundle as keyof typeof bundles].icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {bundles[selectedBundle as keyof typeof bundles].title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {bundles[selectedBundle as keyof typeof bundles].count} Problems • 
                          {bundles[selectedBundle as keyof typeof bundles].estimatedTime} • 
                          {bundles[selectedBundle as keyof typeof bundles].difficulty}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        className="bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)] text-black text-xs py-1 px-3 h-8 rounded-md"
                        onClick={() => {
                          if (!user) {
                            toast({
                              title: "Authentication required",
                              description: "Please log in to start this bundle",
                              variant: "destructive",
                            });
                            setLocation("/auth");
                            return;
                          }
                          // Implement bundle start logic here
                        }}
                      >
                        Start Now
                      </Button>
                      <button 
                        className="text-gray-400 hover:text-white"
                        onClick={() => setSelectedBundle(null)}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mt-3">
                    {bundles[selectedBundle as keyof typeof bundles].description}
                  </p>
                </div>
              )}
              
              {/* Filters */}
              <div className="flex flex-wrap md:flex-nowrap gap-2 mb-2 items-center bg-[rgb(14,14,16)] pt-0 pb-2 -mx-2 px-2 shadow-md">
                {/* Note: Removed sticky positioning which caused dropdown issues */}
                <div className="w-full md:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-3.5 w-3.5" />
                    <input 
                      type="text" 
                      placeholder="Search problems..." 
                      className="w-full md:w-60 h-9 pl-9 pr-3 rounded-md bg-[rgb(24,24,27)] border border-[rgb(45,45,50)] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[rgb(214,251,65)] focus:border-transparent"
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
              
              {/* Problem list */}
              <div className="bg-[rgb(16,16,18)] border border-[rgb(45,45,50)] rounded-lg overflow-hidden shadow-lg mt-0 w-full mb-0">
                <table className="w-full border-collapse table-fixed overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-[rgb(21,21,24)] to-[rgb(25,25,28)] text-gray-300 border-b border-[rgb(45,45,50)]">
                      <th className="px-2 py-3 text-center w-12 text-xs font-medium">Status</th>
                      <th className="px-3 py-3 text-left text-xs font-medium">Title</th>
                      <th className="px-2 py-3 text-center w-28 hidden md:table-cell text-xs font-medium">Companies</th>
                      <th className="px-2 py-3 text-center w-24 hidden md:table-cell text-xs font-medium">Tags</th>
                      <th className="px-2 py-3 text-center w-20 text-xs font-medium">Difficulty</th>
                      <th className="px-2 py-3 text-center w-24 hidden lg:table-cell text-xs font-medium">Acceptance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgb(35,35,40)]">
                    {isLoadingExternal ? (
                      <tr className="bg-[rgb(20,20,22)]">
                        <td colSpan={6} className="px-4 py-8 text-center">
                          <div className="flex flex-col items-center">
                            <Loader2 className="h-6 w-6 animate-spin text-[rgb(214,251,65)]" />
                            <p className="mt-2 text-gray-400 text-xs">Loading problems...</p>
                          </div>
                        </td>
                      </tr>
                    ) : externalProblems && externalProblems.length > 0 ? (
                      // Apply filters to problems
                      externalProblems
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
                          <tr 
                            key={problem.id}
                            className={cn(
                              "hover:bg-[rgb(26,26,32)] transition-colors duration-150",
                              idx % 2 === 0 ? "bg-[rgb(18,18,20)]" : "bg-[rgb(20,20,24)]"
                            )}
                          >
                            <td className="px-2 py-3 text-center">
                              {statusIcon}
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center">
                                <span className="text-xs font-medium mr-2 text-gray-500 w-5 text-right">{idx + 1}.</span>
                                <div className="flex flex-col">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent event propagation
                                      handleSetupCodebase(problem.id, problem.question_id);
                                    }} 
                                    className="text-xs font-medium text-left hover:text-[#56B2FF] whitespace-nowrap overflow-hidden text-ellipsis transition-colors"
                                  >
                                    {problem.title || `Problem ${idx + 1}`}
                                  </button>
                                  
                                  {/* No tags here anymore since we moved them to a separate column */}
                                </div>
                              </div>
                            </td>
                            <td className="px-2 py-3 hidden md:table-cell text-center">
                              <div className="flex justify-center flex-wrap">
                                {problem.companies && problem.companies.length > 0 ? (
                                  <div className="group relative inline-block">
                                    {/* Show only the first company */}
                                    <Badge className="bg-transparent text-gray-400 border border-gray-700 px-1.5 py-0 text-[10px]">
                                      {problem.companies[0]}
                                    </Badge>
                                    
                                    {/* If there are more companies, show +n */}
                                    {problem.companies.length > 1 && (
                                      <>
                                        <Badge className="bg-gray-800 text-gray-300 px-1 py-0 text-[10px] ml-1 cursor-default">
                                          +{problem.companies.length - 1}
                                        </Badge>
                                        
                                        {/* Tooltip for additional companies */}
                                        <div className="absolute z-10 left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-xs text-gray-300 p-2 rounded shadow-lg w-max max-w-xs">
                                          <div className="flex flex-col gap-1">
                                            {problem.companies.slice(1).map((company: string, i: number) => (
                                              <span key={i} className="px-1.5 py-0.5">
                                                {company}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  <Badge className="bg-transparent text-gray-400 border border-gray-700 px-1.5 py-0 text-[10px]">
                                    N/A
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-2 py-3 hidden md:table-cell text-center">
                              <div className="flex justify-center flex-wrap">
                                {problem.tags && problem.tags.length > 0 ? (
                                  <div className="group relative inline-block">
                                    {/* Show only the first tag */}
                                    <Badge className="bg-transparent text-gray-400 border border-gray-700 px-1.5 py-0 text-[10px]">
                                      {problem.tags[0]}
                                    </Badge>
                                    
                                    {/* If there are more than 1 tag, show the second or +n */}
                                    {problem.tags.length > 1 && (
                                      <>
                                        {problem.tags.length === 2 ? (
                                          <Badge className="bg-transparent text-gray-400 border border-gray-700 px-1.5 py-0 text-[10px] ml-1">
                                            {problem.tags[1]}
                                          </Badge>
                                        ) : (
                                          <Badge className="bg-gray-800 text-gray-300 px-1 py-0 text-[10px] ml-1 cursor-default">
                                            +{problem.tags.length - 1}
                                          </Badge>
                                        )}
                                        
                                        {/* Tooltip for additional tags when more than 2 */}
                                        {problem.tags.length > 2 && (
                                          <div className="absolute z-10 left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-xs text-gray-300 p-2 rounded shadow-lg w-max max-w-xs">
                                            <div className="flex flex-col gap-1">
                                              {problem.tags.slice(1).map((tag: string, i: number) => (
                                                <span key={i} className="px-1.5 py-0.5">
                                                  {tag}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  <Badge className="bg-transparent text-gray-400 border border-gray-700 px-1.5 py-0 text-[10px]">
                                    {problem.type || "dsa"}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className={`px-2 py-3 text-center text-xs font-medium ${getDifficultyColor(problem.difficulty || 'Easy')}`}>
                              {problem.difficulty || 'Easy'}
                            </td>
                            <td className="px-2 py-3 hidden lg:table-cell text-center">
                              <span className="text-xs text-gray-400">
                                {problem.acceptance_rate ? `${problem.acceptance_rate}%` : 'N/A'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="bg-[rgb(20,20,22)] border-b border-[rgb(35,35,40)]">
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-xs">
                          No problems found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Right sidebar for tags */}
            <div className="hidden lg:block w-60 fixed right-4 top-20 bottom-8 overflow-y-auto">
              <div className="bg-[rgb(20,20,22)] rounded-lg p-4 border border-[rgb(35,35,40)]">
                <h3 className="text-sm font-medium text-white mb-3">Popular Tags</h3>
                <div className="space-y-2">
                  {/* Sample tags with different colors */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-[#4a9eff] text-white hover:bg-[#3a8eff] cursor-pointer text-xs">RTOS</Badge>
                    <Badge className="bg-[#ff6b6b] text-white hover:bg-[#ff5a5a] cursor-pointer text-xs">Memory Management</Badge>
                    <Badge className="bg-[#50e3c2] text-black hover:bg-[#40d3b2] cursor-pointer text-xs">Embedded C</Badge>
                    <Badge className="bg-[#ffc107] text-black hover:bg-[#efb100] cursor-pointer text-xs">ARM</Badge>
                    <Badge className="bg-[#bd93f9] text-white hover:bg-[#ad83e9] cursor-pointer text-xs">MCU</Badge>
                    <Badge className="bg-[#8bd450] text-black hover:bg-[#7bc440] cursor-pointer text-xs">Interrupts</Badge>
                    <Badge className="bg-[#ff79c6] text-white hover:bg-[#ef69b6] cursor-pointer text-xs">UART</Badge>
                    <Badge className="bg-[#f1fa8c] text-black hover:bg-[#e1ea7c] cursor-pointer text-xs">SPI</Badge>
                    <Badge className="bg-[#ffb86c] text-black hover:bg-[#efaa5c] cursor-pointer text-xs">I2C</Badge>
                    <Badge className="bg-[#8be9fd] text-black hover:bg-[#7bd9ed] cursor-pointer text-xs">GPIO</Badge>
                    <Badge className="bg-[#ff5555] text-white hover:bg-[#ef4545] cursor-pointer text-xs">DMA</Badge>
                    <Badge className="bg-[#50fa7b] text-black hover:bg-[#40ea6b] cursor-pointer text-xs">ADC</Badge>
                    <Badge className="bg-[#bd93f9] text-white hover:bg-[#ad83e9] cursor-pointer text-xs">PWM</Badge>
                    <Badge className="bg-[#f1fa8c] text-black hover:bg-[#e1ea7c] cursor-pointer text-xs">Multithreading</Badge>
                    <Badge className="bg-[#ff79c6] text-white hover:bg-[#ef69b6] cursor-pointer text-xs">CAN</Badge>
                    <Badge className="bg-[#4a9eff] text-white hover:bg-[#3a8eff] cursor-pointer text-xs">Ethernet</Badge>
                    <Badge className="bg-[#ff6b6b] text-white hover:bg-[#ff5a5a] cursor-pointer text-xs">Drivers</Badge>
                    <Badge className="bg-[#50e3c2] text-black hover:bg-[#40d3b2] cursor-pointer text-xs">Bootloader</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Return the dashboard content wrapped in the DashboardLayout
  return (
    <DashboardLayout darkMode={darkMode} toggleTheme={toggleTheme}>
      {dashboardContent}
    </DashboardLayout>
  );
}