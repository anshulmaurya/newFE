import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  companies?: string[];
  tags?: string[];
  type?: string;
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
  const [search, setSearch] = useState<string>('');
  const [showTags, setShowTags] = useState(true);

  // Fetch problems from external API via our server proxy
  const { data: externalProblems, isLoading: isLoadingExternal } = useQuery({
    queryKey: ['/api/problems-proxy'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/problems-proxy');
      const data = await response.json();
      return data.problems;
    },
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

  return (
    <div className="bg-[rgb(14,14,16)] min-h-screen text-white pt-16">
      {/* Header */}
      <Header 
        onNavigateFeatures={handleNavigateFeatures}
        onNavigateProblems={handleNavigateProblems}
        isScrolled={true}
      />
      
      <div className="mt-6 px-4 lg:px-0 lg:ml-56 lg:mr-64">
        <div className="flex flex-col gap-4">
          {/* Left column - navigation (hide on mobile) */}
          <div className="hidden lg:block w-56 bg-[rgb(14,14,16)] fixed left-0 top-0 pt-20 h-screen flex flex-col">
            <div className="px-4 py-2 flex flex-col h-full">
              <a href="/dashboard" className="block text-white text-sm font-medium py-2 px-3 bg-[rgb(24,24,27)] rounded-md mb-1">
                Dashboard
              </a>
              
              <div className="mb-4">
                <button className="flex justify-between items-center w-full text-gray-400 hover:text-white text-sm py-2 px-3 rounded-md transition-colors">
                  <span>Practice questions</span>
                  <span><ChevronDown className="h-4 w-4" /></span>
                </button>
              </div>
              
              <div className="mb-4">
                <button className="flex justify-between items-center w-full text-gray-400 hover:text-white text-sm py-2 px-3 rounded-md transition-colors">
                  <span>Recommended strategy</span>
                  <span><ChevronDown className="h-4 w-4" /></span>
                </button>
                
                <div className="mt-1 pl-3">
                  <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md">
                    <Codepen className="h-4 w-4 text-gray-500" />
                    <span>Top Interview 150</span>
                  </a>
                  
                  <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md">
                    <Database className="h-4 w-4 text-gray-500" />
                    <span>Embedded Systems 50</span>
                  </a>
                  
                  <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md">
                    <Share2 className="h-4 w-4 text-gray-500" />
                    <span>Company-wise</span>
                  </a>
                  
                  <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Time-wise</span>
                  </a>
                </div>
              </div>
              
              <div className="mb-4">
                <button className="flex justify-between items-center w-full text-gray-400 hover:text-white text-sm py-2 px-3 rounded-md transition-colors">
                  <span>Time-savers</span>
                  <span><ChevronDown className="h-4 w-4" /></span>
                </button>
              </div>
              
              <div className="mb-4">
                <button className="flex justify-between items-center w-full text-gray-400 hover:text-white text-sm py-2 px-3 rounded-md transition-colors">
                  <span>Guides</span>
                  <span><ChevronDown className="h-4 w-4" /></span>
                </button>
              </div>
            
              {/* Sponsored divider */}
              <div className="mt-auto mb-3">
                <div className="flex items-center">
                  <div className="flex-grow h-px bg-[rgb(35,35,40)]"></div>
                  <div className="mx-2 text-xs text-gray-500">Sponsored</div>
                  <div className="flex-grow h-px bg-[rgb(35,35,40)]"></div>
                </div>
              </div>
            
              {/* Discord community section */}
              <div className="mb-2">
                <div className="rounded-md p-3">
                  <a href="https://discord.gg/HxAqXd8Xwt" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-[rgb(214,251,65)]">
                    Join our Discord Community
                    <span className="inline-block ml-1">→</span>
                  </a>
                </div>
              </div>
              
              <div className="flex justify-between mb-3">
                <a href="https://discord.gg/HxAqXd8Xwt" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                  </svg>
                </a>
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
          
          {/* Main content */}
          <div className="flex-grow">

            
            {/* Filters */}
            <div className="flex flex-wrap md:flex-nowrap gap-2 mb-4 items-center">
              <div className="w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-3.5 w-3.5" />
                  <input 
                    type="text" 
                    placeholder="Search problems..." 
                    className="w-full md:w-60 h-9 pl-9 pr-3 rounded-md bg-[rgb(33,33,33)] border border-[rgb(48,48,50)] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[rgb(214,251,65)] focus:border-transparent"
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
                  <SelectTrigger className="h-9 bg-[rgb(33,33,33)] border-[rgb(48,48,50)] focus:ring-[rgb(214,251,65)] w-full text-xs">
                    <SelectValue placeholder="All Difficulties" />
                  </SelectTrigger>
                  <SelectContent className="bg-[rgb(33,33,33)] border-[rgb(48,48,50)] text-xs">
                    <SelectItem value="all" className="text-gray-200 focus:bg-[rgb(48,48,50)]">All Difficulties</SelectItem>
                    <SelectItem value="easy" className="text-green-500 focus:bg-[rgb(48,48,50)]">Easy</SelectItem>
                    <SelectItem value="medium" className="text-yellow-500 focus:bg-[rgb(48,48,50)]">Medium</SelectItem>
                    <SelectItem value="hard" className="text-red-500 focus:bg-[rgb(48,48,50)]">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-1/3 md:w-auto">
                <Select
                  value={category}
                  onValueChange={setCategory}
                >
                  <SelectTrigger className="h-9 bg-[rgb(33,33,33)] border-[rgb(48,48,50)] focus:ring-[rgb(214,251,65)] w-full text-xs">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-[rgb(33,33,33)] border-[rgb(48,48,50)] text-xs">
                    <SelectItem value="all" className="text-gray-200 focus:bg-[rgb(48,48,50)]">All Categories</SelectItem>
                    <SelectItem value="Memory Management" className="text-gray-200 focus:bg-[rgb(48,48,50)]">Memory Management</SelectItem>
                    <SelectItem value="Multithreading" className="text-gray-200 focus:bg-[rgb(48,48,50)]">Multithreading</SelectItem>
                    <SelectItem value="Data Structures" className="text-gray-200 focus:bg-[rgb(48,48,50)]">Data Structures</SelectItem>
                    <SelectItem value="C++ API" className="text-gray-200 focus:bg-[rgb(48,48,50)]">C++ API</SelectItem>
                    <SelectItem value="Linux API" className="text-gray-200 focus:bg-[rgb(48,48,50)]">Linux API</SelectItem>
                    <SelectItem value="RTOS" className="text-gray-200 focus:bg-[rgb(48,48,50)]">RTOS</SelectItem>
                    <SelectItem value="Power Management" className="text-gray-200 focus:bg-[rgb(48,48,50)]">Power Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-1/3 md:w-auto">
                <Select
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger className="h-9 bg-[rgb(33,33,33)] border-[rgb(48,48,50)] focus:ring-[rgb(214,251,65)] w-full text-xs">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[rgb(33,33,33)] border-[rgb(48,48,50)] text-xs">
                    <SelectItem value="all" className="text-gray-200 focus:bg-[rgb(48,48,50)]">All Status</SelectItem>
                    <SelectItem value="Solved" className="text-green-500 focus:bg-[rgb(48,48,50)]">Solved</SelectItem>
                    <SelectItem value="Attempted" className="text-yellow-500 focus:bg-[rgb(48,48,50)]">Attempted</SelectItem>
                    <SelectItem value="Not Started" className="text-gray-200 focus:bg-[rgb(48,48,50)]">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Problem list */}
            <div className="bg-[rgb(20,20,22)] border border-[rgb(45,45,50)] rounded-lg overflow-hidden">
              <table className="w-full border-collapse table-fixed">
                <thead>
                  <tr className="bg-[rgb(27,27,30)] border-b border-[rgb(45,45,50)]">
                    <th className="px-2 py-2 text-center w-12 text-xs">Status</th>
                    <th className="px-3 py-2 text-left text-xs">Title</th>
                    <th className="px-2 py-2 text-center w-16 hidden md:table-cell text-xs">Solution</th>
                    <th className="px-2 py-2 text-center w-28 hidden md:table-cell text-xs">Companies</th>
                    <th className="px-2 py-2 text-center w-20 text-xs">Difficulty</th>
                    <th className="px-2 py-2 text-center w-16 hidden lg:table-cell text-xs">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingExternal ? (
                    <tr className="bg-[rgb(20,20,22)] border-b border-[rgb(35,35,40)]">
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-6 w-6 animate-spin text-[rgb(214,251,65)]" />
                          <p className="mt-2 text-gray-400 text-xs">Loading problems...</p>
                        </div>
                      </td>
                    </tr>
                  ) : externalProblems && externalProblems.length > 0 ? (
                    externalProblems.map((problem: any, idx: number) => {
                      // Create random status for demonstration purposes
                      const statusOptions = ['Solved', 'Attempted', 'Not Started'];
                      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
                      const statusIcon = getStatusIcon(randomStatus);
                      
                      return (
                        <tr 
                          key={problem.id}
                          className={cn(
                            "border-b border-[rgb(35,35,40)] hover:bg-[rgb(28,28,32)]",
                            idx % 2 === 0 ? "bg-[rgb(20,20,22)]" : "bg-[rgb(22,22,25)]"
                          )}
                        >
                          <td className="px-2 py-2 text-center">
                            {statusIcon}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center">
                              <span className="text-xs font-medium mr-1.5 text-gray-500">{idx + 1}.</span>
                              <div className="flex flex-col">
                                <a href="#" className="text-xs hover:text-[rgb(214,251,65)] whitespace-nowrap overflow-hidden text-ellipsis">
                                  {problem.title || `Problem ${idx + 1}`}
                                </a>
                                {/* Small tags below title */}
                                <div className="mt-1 text-xs text-gray-500">
                                  {problem.tags?.[0] || 'linkedlist'}
                                </div>
                                {problem.tags?.[1] && (
                                  <div className="text-xs text-gray-500">
                                    {problem.tags[1]}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-2 hidden md:table-cell text-center">
                            {idx % 2 === 0 ? (
                              <a href="#" className="text-blue-500 hover:text-blue-400">
                                <Code className="h-3.5 w-3.5 inline" />
                              </a>
                            ) : (
                              <Lock className="h-3.5 w-3.5 inline text-gray-500" />
                            )}
                          </td>
                          <td className="px-2 py-2 hidden md:table-cell text-center">
                            <div className="flex justify-center gap-1 flex-wrap">
                              {problem.companies?.length > 0 ? (
                                <>
                                  <Badge className="bg-blue-900/30 text-blue-200 border border-blue-800 px-1.5 py-0 text-[10px]">
                                    {problem.companies[0] || 'Qualcomm'}
                                  </Badge>
                                  {problem.companies.length > 1 && (
                                    <Badge className="bg-blue-900/30 text-blue-200 border border-blue-800 px-1.5 py-0 text-[10px]">
                                      {problem.companies[1] || 'Microsoft'}
                                    </Badge>
                                  )}
                                  {problem.companies.length > 2 && (
                                    <Badge className="bg-gray-800 text-gray-300 px-1 py-0 text-[10px]">
                                      +{problem.companies.length - 2}
                                    </Badge>
                                  )}
                                </>
                              ) : (
                                <>
                                  {idx % 3 === 0 ? (
                                    <Badge className="bg-blue-900/30 text-blue-200 border border-blue-800 px-1.5 py-0 text-[10px]">Intel</Badge>
                                  ) : idx % 3 === 1 ? (
                                    <Badge className="bg-blue-900/30 text-blue-200 border border-blue-800 px-1.5 py-0 text-[10px]">Qualcomm</Badge>
                                  ) : (
                                    <Badge className="bg-blue-900/30 text-blue-200 border border-blue-800 px-1.5 py-0 text-[10px]">Microsoft</Badge>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                          <td className={`px-2 py-2 text-center text-xs font-medium ${getDifficultyColor(problem.difficulty || 'Easy')}`}>
                            {problem.difficulty || 'easy'}
                          </td>
                          <td className="px-2 py-2 hidden lg:table-cell text-center text-xs">
                            {(problem.type || (problem.tags && problem.tags[0]) || "dsa").toLowerCase()}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="bg-[rgb(20,20,22)] border-b border-[rgb(35,35,40)]">
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-xs">
                        No problems found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          
          {/* Right sidebar - stats (hide on mobile) */}
          <div className="hidden lg:block w-64 min-h-screen fixed right-0 top-0 pt-20 bg-[rgb(14,14,16)]">
            <div className="px-4 py-2">
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-3">Top Companies</h3>
                
                <div className="space-y-2">
                  {companyTrends.map((company, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="text-xs text-gray-400 mr-2 w-3.5 h-3.5 flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${
                          idx === 0 ? "bg-blue-500" : 
                          idx === 1 ? "bg-purple-500" : 
                          idx === 2 ? "bg-green-500" : 
                          idx === 3 ? "bg-yellow-500" : "bg-red-500"
                        }`}></div>
                      </div>
                      <div className="text-xs text-gray-300 w-20">{company.name}</div>
                      <div className="flex-grow h-1 bg-[rgb(24,24,27)] rounded-full mx-2">
                        <div 
                          className={`h-full rounded-full ${
                            idx === 0 ? "bg-blue-500" :
                            idx === 1 ? "bg-purple-500" :
                            idx === 2 ? "bg-green-500" :
                            idx === 3 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${(company.count / companyTrends[0].count) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400 w-5 text-right">{company.count}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Study Recommendations */}
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-3">Recommended</h3>
                <div className="bg-[rgb(24,24,27)] rounded-md p-3">
                  <div className="text-xs font-medium text-gray-400 mb-2">Topics to focus on</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-300">Memory Management</div>
                      <div className="text-xs text-green-500">85% mastered</div>
                    </div>
                    <div className="w-full h-1 bg-[rgb(32,32,35)] rounded-full">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-300">Multithreading</div>
                      <div className="text-xs text-yellow-500">45% mastered</div>
                    </div>
                    <div className="w-full h-1 bg-[rgb(32,32,35)] rounded-full">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-300">RTOS</div>
                      <div className="text-xs text-red-500">25% mastered</div>
                    </div>
                    <div className="w-full h-1 bg-[rgb(32,32,35)] rounded-full">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional resources section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-3">Resources</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-xs text-gray-400 hover:text-white py-2 px-3 rounded-md hover:bg-[rgb(24,24,27)] transition-colors">
                    Embedded Systems Interview Guide
                  </a>
                  <a href="#" className="block text-xs text-gray-400 hover:text-white py-2 px-3 rounded-md hover:bg-[rgb(24,24,27)] transition-colors">
                    RTOS Fundamentals
                  </a>
                  <a href="#" className="block text-xs text-gray-400 hover:text-white py-2 px-3 rounded-md hover:bg-[rgb(24,24,27)] transition-colors">
                    Memory Management Patterns
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}