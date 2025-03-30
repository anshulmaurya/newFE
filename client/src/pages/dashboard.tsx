import React, { useState, useEffect, Fragment } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CheckCircle2, 
  Loader2, 
  Search, 
  Filter, 
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
  CheckCircle,
  Circle,
  Clock3,
  Filter as FilterIcon,
  CalendarDays,
  BarChart2,
  ChevronUp,
  ChevronDown,
  Building2,
  Clock,
  Code
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';

// Define types for API responses
type Problem = {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptanceRate: number;
  completionRate: string;
  estimatedTime: string;
  frequency: number;
  createdAt: string;
};

type ProblemResponse = {
  problems: Problem[];
  total: number;
};

type UserProgress = {
  id: number;
  userId: number;
  problemId: number;
  status: 'Solved' | 'Attempted' | 'Not Started';
  lastAttemptedAt: string | null;
  completedAt: string | null;
  attemptCount: number;
  notes: string | null;
  problem: Problem;
};

type UserStats = {
  totalProblems: number;
  solvedProblems: number;
  attemptedProblems: number;
  easyProblems: { solved: number; total: number };
  mediumProblems: { solved: number; total: number };
  hardProblems: { solved: number; total: number };
};

// Category icons mapping
const categoryIcons: Record<string, LucideIcon> = {
  'Memory Management': FolderArchive,
  'Multithreading': Share2,
  'Data Structures': Database,
  'C++ API': Codepen,
  'Linux API': Laptop,
  'RTOS': Cpu,
  'Power Management': Zap
};

// Dashboard component
export default function Dashboard() {
  // State
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showTags, setShowTags] = useState(true);

  // Category and Difficulty filter rendering
  const [selectedTopics, setSelectedTopics] = useState(['All Topics']);
  const [selectedDifficulty, setSelectedDifficulty] = useState(['All']);
  const [selectedStatus, setSelectedStatus] = useState(['All']);

  // API queries
  const { data: problemsData, isLoading: isLoadingProblems } = useQuery({
    queryKey: ['/api/problems', category, difficulty, search, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const categoryParam = category === 'all' ? '' : category;
      const difficultyParam = difficulty === 'all' ? '' : difficulty;
      const response = await apiRequest(`/api/problems?category=${categoryParam}&difficulty=${difficultyParam}&search=${search}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      const data = await response.json();
      return data;
    },
  });

  // For testing only - fetch directly from MongoDB test endpoint
  const { data: mongoTestData, isLoading: isLoadingMongoTest } = useQuery({
    queryKey: ['/api/mongodb-test'],
    queryFn: async () => {
      const response = await apiRequest('/api/mongodb-test');
      const data = await response.json();
      return data;
    },
  });

  const { data: userProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['/api/user-progress'],
    queryFn: async () => {
      try {
        const response = await apiRequest('/api/user-progress');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching user progress:', error);
        return [];
      }
    },
  });

  const { data: userStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/user-stats'],
    queryFn: async () => {
      try {
        const response = await apiRequest('/api/user-stats');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching user stats:', error);
        return {
          totalProblems: 0,
          solvedProblems: 0,
          attemptedProblems: 0,
          easyProblems: { solved: 0, total: 0 },
          mediumProblems: { solved: 0, total: 0 },
          hardProblems: { solved: 0, total: 0 }
        };
      }
    },
  });

  // Derived state
  const totalPages = problemsData
    ? Math.ceil(problemsData.total / limit)
    : 0;

  // Get problem status
  const getProblemStatus = (problemId: number): 'Solved' | 'Attempted' | 'Not Started' => {
    if (!userProgress) return 'Not Started';
    const progress = userProgress.find(
      (progress) => progress.problem.id === problemId
    );
    return progress?.status || 'Not Started';
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

  // Format frequency to display with % and up to 1 decimal place
  const formatFrequency = (frequency: number): string => {
    return `${frequency.toFixed(1)}%`;
  };

  // Get filtered problems
  const getFilteredProblems = () => {
    if (!problemsData?.problems) return [];
    
    // Apply status filter if not "all"
    if (status !== 'all') {
      return problemsData.problems.filter(problem => {
        const problemStatus = getProblemStatus(problem.id);
        return problemStatus.toLowerCase() === status.toLowerCase();
      });
    }
    
    return problemsData.problems;
  };

  // Get session stats
  const getSessionStats = () => {
    if (!userStats) return { easy: 0, medium: 0, hard: 0, total: 0 };
    
    return {
      easy: userStats.easyProblems.solved,
      medium: userStats.mediumProblems.solved,
      hard: userStats.hardProblems.solved,
      total: userStats.solvedProblems
    };
  };

  const stats = getSessionStats();

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

  // Function to handle navigation to different sections
  const handleNavigateFeatures = () => {
    // You can implement scroll behavior if needed
  };

  const handleNavigateProblems = () => {
    // You can implement scroll behavior if needed  
  };

  // Check if the user is authenticated
  const isAuthenticated = userStats && Object.keys(userStats).length > 0;

  return (
    <div className="bg-[rgb(17,17,17)] min-h-screen text-white pt-16">
      {/* Header */}
      <Header 
        onNavigateFeatures={handleNavigateFeatures}
        onNavigateProblems={handleNavigateProblems}
        isScrolled={true}
      />
      
      {/* Authentication status message */}
      {!isAuthenticated && (
        <div className="container mx-auto px-4 pt-8 pb-4">
          <div className="bg-[rgb(33,33,33)] rounded-lg p-6 border border-[rgb(48,48,50)]">
            <h2 className="text-xl font-bold mb-2">Welcome to DSP Coder Practice</h2>
            <p className="text-gray-300 mb-4">
              Sign in with GitHub to track your progress and access all features of the platform.
              Create personalized study plans and save your solutions.
            </p>
            <a 
              href="/api/auth/github" 
              className="px-4 py-2 bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)] rounded-md text-sm text-black font-bold transition-all inline-flex items-center gap-2 shadow-[0_0_10px_rgba(214,251,65,0.4)] hover:shadow-[0_0_15px_rgba(214,251,65,0.6)] border border-[rgb(224,255,75)]"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Login with GitHub
            </a>
          </div>
        </div>
      )}

      {/* Prep Bundles Section */}
      <div className="container mx-auto px-4 pt-6 pb-4">
        <h2 className="text-xl font-bold mb-4">Prep Bundles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Company Bundle */}
          <div className="bg-[rgb(33,33,33)] rounded-lg p-4 hover:bg-[rgb(40,40,40)] transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center mr-3">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Company-wise</h3>
                <p className="text-xs text-gray-400">Target specific companies</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {companyTrends.map((company, idx) => (
                <Badge key={idx} className="bg-blue-900/30 text-blue-200 border border-blue-800 hover:bg-blue-800/50">
                  {company.name} ({company.count})
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Time Bundle */}
          <div className="bg-[rgb(33,33,33)] rounded-lg p-4 hover:bg-[rgb(40,40,40)] transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center mr-3">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Time-wise</h3>
                <p className="text-xs text-gray-400">Plan your interview prep</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className="bg-purple-900/30 text-purple-200 border border-purple-800 hover:bg-purple-800/50">
                1 Week Plan (30)
              </Badge>
              <Badge className="bg-purple-900/30 text-purple-200 border border-purple-800 hover:bg-purple-800/50">
                2 Week Plan (50)
              </Badge>
              <Badge className="bg-purple-900/30 text-purple-200 border border-purple-800 hover:bg-purple-800/50">
                1 Month Plan (75)
              </Badge>
            </div>
          </div>
          
          {/* Language Bundle */}
          <div className="bg-[rgb(33,33,33)] rounded-lg p-4 hover:bg-[rgb(40,40,40)] transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center mr-3">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Language-wise</h3>
                <p className="text-xs text-gray-400">Choose your preferred language</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className="bg-green-900/30 text-green-200 border border-green-800 hover:bg-green-800/50">
                C/C++ (45)
              </Badge>
              <Badge className="bg-green-900/30 text-green-200 border border-green-800 hover:bg-green-800/50">
                Python (35)
              </Badge>
              <Badge className="bg-green-900/30 text-green-200 border border-green-800 hover:bg-green-800/50">
                Rust (20)
              </Badge>
              <Badge className="bg-green-900/30 text-green-200 border border-green-800 hover:bg-green-800/50">
                Assembly (15)
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top study plan section */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <h2 className="text-xl font-bold mb-4">Study Plan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[rgb(33,33,33)] rounded-lg p-4 hover:bg-[rgb(40,40,40)] transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center mr-3">
                <Codepen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Top Interview 150</h3>
                <p className="text-xs text-gray-400">Must-do List for Interview</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[rgb(33,33,33)] rounded-lg p-4 hover:bg-[rgb(40,40,40)] transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center mr-3">
                <Codepen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">LeetCode 75</h3>
                <p className="text-xs text-gray-400">Ace Coding Interview</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[rgb(33,33,33)] rounded-lg p-4 hover:bg-[rgb(40,40,40)] transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center mr-3">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">SQL 50</h3>
                <p className="text-xs text-gray-400">Crack SQL Interview</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[rgb(33,33,33)] rounded-lg p-4 hover:bg-[rgb(40,40,40)] transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-yellow-600 rounded-md flex items-center justify-center mr-3">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Javascript 30</h3>
                <p className="text-xs text-gray-400">Learn JS Basics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar and Stats */}
      <div className="bg-[rgb(33,33,33)] py-2 border-t border-b border-[rgb(48,48,50)]">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Left: Day counter */}
          <div className="flex items-center space-x-1">
            <CalendarDays className="w-4 h-4 text-gray-400 mr-1" />
            <div className="text-sm text-gray-400">Day 29</div>
            <div className="text-xs text-gray-500">00:17:42 left</div>
          </div>
          
          {/* Center: Week days */}
          <div className="flex space-x-2 mt-2 md:mt-0">
            {daysInWeek.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-xs text-gray-400">{day.day}</div>
                <div className={cn(
                  "w-6 h-6 flex items-center justify-center text-xs rounded-full mt-1",
                  day.isToday ? "bg-[rgb(214,251,65)] text-black font-bold" : "text-gray-400"
                )}>
                  {day.date}
                </div>
              </div>
            ))}
          </div>
          
          {/* Right: Session stats */}
          <div className="mt-2 md:mt-0 flex space-x-4">
            <div className="flex items-center">
              <div className="text-sm font-bold">{stats.total}</div>
              <div className="text-xs text-gray-400 ml-1">Session</div>
            </div>
            <div className="flex space-x-2">
              <Badge className="bg-green-800 text-green-200 hover:bg-green-700">
                Easy {stats.easy}
              </Badge>
              <Badge className="bg-yellow-800 text-yellow-200 hover:bg-yellow-700">
                Medium {stats.medium}
              </Badge>
              <Badge className="bg-red-800 text-red-200 hover:bg-red-700">
                Hard {stats.hard}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content area with layout */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-grow">
            {/* Filters */}
            <div className="flex flex-wrap md:flex-nowrap gap-2 mb-6 items-center">
              <div className="w-full md:w-auto">
                <div className="p-1 bg-[rgb(33,33,33)] rounded-md flex items-center">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-xs px-2 py-1 h-auto",
                      showTags ? "bg-[rgb(44,44,44)]" : "hover:bg-[rgb(44,44,44)]"
                    )}
                    onClick={() => setShowTags(!showTags)}
                  >
                    All Topics
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-xs px-2 py-1 h-auto hover:bg-[rgb(44,44,44)]"
                    onClick={() => setShowTags(!showTags)}
                  >
                    Algorithms
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-xs px-2 py-1 h-auto hover:bg-[rgb(44,44,44)]"
                    onClick={() => setShowTags(!showTags)}
                  >
                    Database
                  </Button>
                </div>
              </div>
              
              <div className="w-full md:w-auto flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs bg-[rgb(33,33,33)] border-[rgb(48,48,50)] hover:bg-[rgb(44,44,44)]"
                >
                  <FilterIcon className="h-3 w-3 mr-1" />
                  Lists
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-xs bg-[rgb(33,33,33)] border-[rgb(48,48,50)] hover:bg-[rgb(44,44,44)]"
                >
                  <FilterIcon className="h-3 w-3 mr-1" />
                  Difficulty
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-xs bg-[rgb(33,33,33)] border-[rgb(48,48,50)] hover:bg-[rgb(44,44,44)]"
                >
                  <FilterIcon className="h-3 w-3 mr-1" />
                  Status
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-xs bg-[rgb(33,33,33)] border-[rgb(48,48,50)] hover:bg-[rgb(44,44,44)]"
                >
                  <FilterIcon className="h-3 w-3 mr-1" />
                  Tags
                </Button>
              </div>
              
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search questions"
                  className="pl-9 bg-[rgb(33,33,33)] border-[rgb(48,48,50)] focus-visible:ring-[rgb(214,251,65)] text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div>
                <Button 
                  variant="ghost"
                  size="sm"
                  className="bg-[rgb(214,251,65)] text-black hover:bg-[rgb(194,231,45)]"
                >
                  Pick One
                </Button>
              </div>
            </div>
            
            {/* Problems table */}
            <div className="relative overflow-x-auto rounded-lg border border-[rgb(48,48,50)]">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-[rgb(33,33,33)]">
                  <tr>
                    <th scope="col" className="px-2 py-3 w-12 text-center">Status</th>
                    <th scope="col" className="px-6 py-3">Title</th>
                    <th scope="col" className="px-6 py-3 hidden md:table-cell text-center">Solution</th>
                    <th scope="col" className="px-6 py-3 hidden md:table-cell text-center">Acceptance</th>
                    <th scope="col" className="px-6 py-3 text-center">Difficulty</th>
                    <th scope="col" className="px-6 py-3 hidden lg:table-cell text-center">Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingProblems ? (
                    <tr className="bg-[rgb(22,22,22)] border-b border-[rgb(48,48,50)]">
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-[rgb(214,251,65)]" />
                          <p className="mt-2 text-gray-400">Loading problems...</p>
                        </div>
                      </td>
                    </tr>
                  ) : getFilteredProblems().length === 0 && (!mongoTestData || !mongoTestData.problems || mongoTestData.problems.length === 0) ? (
                    <tr className="bg-[rgb(22,22,22)] border-b border-[rgb(48,48,50)]">
                      <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                        No problems found matching your criteria.
                      </td>
                    </tr>
                  ) : getFilteredProblems().length > 0 ? (
                    getFilteredProblems().map((problem, idx) => {
                      const status = getProblemStatus(problem.id);
                      const statusIcon = getStatusIcon(status);
                      
                      return (
                        <tr 
                          key={problem.id} 
                          className={cn(
                            "border-b border-[rgb(48,48,50)] hover:bg-[rgb(33,33,33)]",
                            idx % 2 === 0 ? "bg-[rgb(18,18,18)]" : "bg-[rgb(22,22,22)]"
                          )}
                        >
                          <td className="px-2 py-3 text-center">
                            {statusIcon}
                          </td>
                          <td className="px-6 py-3 font-medium">
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">{problem.id}.</span>
                              <a href="#" className="text-sm hover:text-[rgb(214,251,65)]">
                                {problem.title}
                              </a>
                            </div>
                            
                            {/* Tags */}
                            {showTags && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                <Badge className="bg-[rgb(44,44,44)] hover:bg-[rgb(55,55,55)] text-gray-300 text-xs px-1.5 py-0.5">
                                  {problem.category}
                                </Badge>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-3 hidden md:table-cell text-center">
                            {Math.random() > 0.5 ? (
                              <a href="#" className="text-blue-500 hover:text-blue-400">
                                <Settings className="h-4 w-4 inline" />
                              </a>
                            ) : (
                              <Lock className="h-4 w-4 inline text-gray-500" />
                            )}
                          </td>
                          <td className="px-6 py-3 hidden md:table-cell text-center">
                            {problem.acceptanceRate}%
                          </td>
                          <td className={`px-6 py-3 text-center font-medium ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </td>
                          <td className="px-6 py-3 hidden lg:table-cell text-center">
                            {formatFrequency(problem.frequency)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="bg-[rgb(22,22,22)] border-b border-[rgb(48,48,50)]">
                      <td colSpan={6} className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center">
                          {mongoTestData && mongoTestData.problems && mongoTestData.problems.length > 0 ? (
                            <Fragment>
                              <p className="text-gray-400 mb-2">Found {mongoTestData.problems.length} problems from MongoDB test endpoint</p>
                              <pre className="bg-[rgb(33,33,33)] p-4 rounded-lg overflow-auto max-h-40 text-xs text-gray-300">
                                {JSON.stringify(mongoTestData.problems[0], null, 2)}
                              </pre>
                            </Fragment>
                          ) : (
                            <p className="text-gray-400">No problems found from any data source.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center space-x-1">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-[rgb(33,33,33)] border-[rgb(48,48,50)]"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  
                  {[...Array(Math.min(totalPages, 10))].map((_, idx) => {
                    const pageNumber = idx + 1;
                    return (
                      <Button
                        key={idx}
                        variant={pageNumber === page ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          pageNumber === page 
                            ? "bg-[rgb(214,251,65)] text-black" 
                            : "bg-[rgb(33,33,33)] border-[rgb(48,48,50)]"
                        )}
                        onClick={() => setPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-[rgb(33,33,33)] border-[rgb(48,48,50)]"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </nav>
              </div>
            )}
          </div>
          
          {/* Company trends sidebar - for large screens only */}
          <div className="hidden lg:block w-64 bg-[rgb(33,33,33)] border-l border-[rgb(48,48,50)] h-fit rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-bold mb-4">Company Trends</h3>
              
              <div className="space-y-4">
                {/* Company list */}
                <div className="space-y-2">
                  {companyTrends.map((company, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="text-sm">{company.name}</div>
                      <Badge className="bg-[rgb(48,48,50)] hover:bg-[rgb(55,55,55)]">
                        {company.count}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                {/* Session counter */}
                <div className="mt-8 border-t border-[rgb(48,48,50)] pt-4">
                  <h3 className="text-sm font-bold mb-2">Your Progress</h3>
                  <div className="bg-[rgb(22,22,22)] rounded-md p-3 mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-2xl font-bold">{stats.total}</div>
                      <div className="text-xs text-gray-400">Solved</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-green-500">Easy</div>
                        <div className="text-xs"><span className="text-green-500">{stats.easy}</span></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-yellow-500">Medium</div>
                        <div className="text-xs"><span className="text-yellow-500">{stats.medium}</span></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-red-500">Hard</div>
                        <div className="text-xs"><span className="text-red-500">{stats.hard}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}