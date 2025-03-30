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
    <div className="bg-[rgb(17,17,17)] min-h-screen text-white pt-16">
      {/* Header */}
      <Header 
        onNavigateFeatures={handleNavigateFeatures}
        onNavigateProblems={handleNavigateProblems}
        isScrolled={true}
      />
      
      <div className="container mx-auto px-4 mt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column - navigation (hide on mobile) */}
          <div className="hidden lg:block w-64 bg-[rgb(22,22,22)] border border-[rgb(48,48,50)] rounded-lg p-4 h-fit">
            <h3 className="text-lg font-bold mb-4">Navigation</h3>
            
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase text-gray-500 mb-2">Prep Bundles</div>
              <div className="space-y-1">
                <div className="bg-[rgb(33,33,33)] rounded-lg p-3 hover:bg-[rgb(40,40,40)] transition-colors relative overflow-hidden cursor-pointer">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center mr-2">
                      <Building2 className="w-3 h-3" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Company-wise</h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[rgb(33,33,33)] rounded-lg p-3 hover:bg-[rgb(40,40,40)] transition-colors relative overflow-hidden cursor-pointer">
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center mr-2">
                      <Clock className="w-3 h-3" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Time-wise</h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[rgb(33,33,33)] rounded-lg p-3 hover:bg-[rgb(40,40,40)] transition-colors relative overflow-hidden cursor-pointer">
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center mr-2">
                      <Code className="w-3 h-3" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Language-wise</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase text-gray-500 mb-2">Study Plans</div>
              <div className="space-y-1">
                <div className="bg-[rgb(33,33,33)] rounded-lg p-3 hover:bg-[rgb(40,40,40)] transition-colors relative overflow-hidden cursor-pointer">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center mr-2">
                      <Codepen className="w-3 h-3" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Top Interview 150</h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[rgb(33,33,33)] rounded-lg p-3 hover:bg-[rgb(40,40,40)] transition-colors relative overflow-hidden cursor-pointer">
                  <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-yellow-600 rounded-md flex items-center justify-center mr-2">
                      <Share2 className="w-3 h-3" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Embedded Systems 50</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <a 
                href="https://discord.gg/HxAqXd8Xwt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-3 bg-[rgb(88,101,242)] hover:bg-[rgb(71,82,196)] rounded-lg transition-colors text-center text-sm"
              >
                Join Discord Community
              </a>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-grow">
            {/* Featured banner */}
            <div className="bg-gradient-to-r from-[rgb(33,33,45)] to-[rgb(22,22,35)] rounded-xl p-6 mb-6 border border-[rgb(48,48,65)]">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    <span className="text-[rgb(214,251,65)]">Embedded Systems</span> Interview Prep
                  </h1>
                  <p className="text-gray-300 mb-4 max-w-2xl">
                    Master embedded systems interview questions with our curated problem sets.
                    Focus on memory management, RTOS, drivers, and hardware interfaces.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-900/30 text-blue-200 border border-blue-800 hover:bg-blue-800/50">
                      RTOS
                    </Badge>
                    <Badge className="bg-green-900/30 text-green-200 border border-green-800 hover:bg-green-800/50">
                      Device Drivers
                    </Badge>
                    <Badge className="bg-purple-900/30 text-purple-200 border border-purple-800 hover:bg-purple-800/50">
                      Memory Management
                    </Badge>
                    <Badge className="bg-yellow-900/30 text-yellow-200 border border-yellow-800 hover:bg-yellow-800/50">
                      Interrupts
                    </Badge>
                  </div>
                </div>
                <div>
                  <Button className="bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)] text-black font-bold shadow-[0_0_10px_rgba(214,251,65,0.3)]">
                    Start Learning
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap md:flex-nowrap gap-2 mb-6 items-center">
              <div className="w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Search problems..." 
                    className="w-full md:w-64 h-10 pl-10 pr-4 rounded-md bg-[rgb(33,33,33)] border border-[rgb(48,48,50)] text-sm text-white focus:outline-none focus:ring-2 focus:ring-[rgb(214,251,65)] focus:border-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-1/2 md:w-auto">
                <Select
                  value={difficulty}
                  onValueChange={setDifficulty}
                >
                  <SelectTrigger className="h-10 bg-[rgb(33,33,33)] border-[rgb(48,48,50)] focus:ring-[rgb(214,251,65)] w-full">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-[rgb(33,33,33)] border-[rgb(48,48,50)]">
                    <SelectItem value="all" className="text-gray-200 focus:bg-[rgb(48,48,50)]">All Difficulties</SelectItem>
                    <SelectItem value="easy" className="text-green-500 focus:bg-[rgb(48,48,50)]">Easy</SelectItem>
                    <SelectItem value="medium" className="text-yellow-500 focus:bg-[rgb(48,48,50)]">Medium</SelectItem>
                    <SelectItem value="hard" className="text-red-500 focus:bg-[rgb(48,48,50)]">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-1/2 md:w-auto">
                <Select
                  value={category}
                  onValueChange={setCategory}
                >
                  <SelectTrigger className="h-10 bg-[rgb(33,33,33)] border-[rgb(48,48,50)] focus:ring-[rgb(214,251,65)] w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[rgb(33,33,33)] border-[rgb(48,48,50)]">
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
              
              <div className="w-1/2 md:w-auto">
                <Select
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger className="h-10 bg-[rgb(33,33,33)] border-[rgb(48,48,50)] focus:ring-[rgb(214,251,65)] w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[rgb(33,33,33)] border-[rgb(48,48,50)]">
                    <SelectItem value="all" className="text-gray-200 focus:bg-[rgb(48,48,50)]">All Status</SelectItem>
                    <SelectItem value="Solved" className="text-green-500 focus:bg-[rgb(48,48,50)]">Solved</SelectItem>
                    <SelectItem value="Attempted" className="text-yellow-500 focus:bg-[rgb(48,48,50)]">Attempted</SelectItem>
                    <SelectItem value="Not Started" className="text-gray-200 focus:bg-[rgb(48,48,50)]">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Problem list */}
            <div className="bg-[rgb(22,22,22)] border border-[rgb(48,48,50)] rounded-lg overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[rgb(33,33,33)] border-b border-[rgb(48,48,50)]">
                    <th className="px-2 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-center hidden md:table-cell">Solution</th>
                    <th className="px-6 py-3 text-center hidden md:table-cell">Companies</th>
                    <th className="px-6 py-3 text-center">Difficulty</th>
                    <th className="px-6 py-3 text-center hidden lg:table-cell">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingExternal ? (
                    <tr className="bg-[rgb(22,22,22)] border-b border-[rgb(48,48,50)]">
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-[rgb(214,251,65)]" />
                          <p className="mt-2 text-gray-400">Loading problems...</p>
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
                            "border-b border-[rgb(48,48,50)] hover:bg-[rgb(33,33,33)]",
                            idx % 2 === 0 ? "bg-[rgb(18,18,18)]" : "bg-[rgb(22,22,22)]"
                          )}
                        >
                          <td className="px-2 py-3 text-center">
                            {statusIcon}
                          </td>
                          <td className="px-6 py-3 font-medium">
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">{idx + 1}.</span>
                              <a href="#" className="text-sm hover:text-[rgb(214,251,65)]">
                                {problem.title}
                              </a>
                            </div>
                            
                            {/* Tags */}
                            {showTags && problem.tags && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {problem.tags.map((tag: string, tagIdx: number) => (
                                  <Badge key={tagIdx} className="bg-[rgb(44,44,44)] hover:bg-[rgb(55,55,55)] text-gray-300 text-xs px-1.5 py-0.5">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-3 hidden md:table-cell text-center">
                            {Math.random() > 0.5 ? (
                              <a href="#" className="text-blue-500 hover:text-blue-400">
                                <Code className="h-4 w-4 inline" />
                              </a>
                            ) : (
                              <Lock className="h-4 w-4 inline text-gray-500" />
                            )}
                          </td>
                          <td className="px-6 py-3 hidden md:table-cell text-center">
                            <div className="flex justify-center gap-1">
                              {problem.companies && problem.companies.slice(0, 2).map((company: string, cIdx: number) => (
                                <Badge key={cIdx} className="bg-blue-900/30 text-blue-200 border border-blue-800">
                                  {company}
                                </Badge>
                              ))}
                              {problem.companies && problem.companies.length > 2 && (
                                <Badge className="bg-gray-800 text-gray-300">
                                  +{problem.companies.length - 2}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className={`px-6 py-3 text-center font-medium ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </td>
                          <td className="px-6 py-3 hidden lg:table-cell text-center">
                            {problem.type || (problem.tags && problem.tags[0]) || "DSA"}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="bg-[rgb(22,22,22)] border-b border-[rgb(48,48,50)]">
                      <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                        No problems found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Right sidebar - stats (hide on mobile) */}
          <div className="hidden lg:block w-72 bg-[rgb(22,22,22)] border border-[rgb(48,48,50)] rounded-lg p-4 h-fit">
            <h3 className="text-lg font-bold mb-4">Top Companies</h3>
            
            <div className="space-y-3 mb-6">
              {companyTrends.map((company, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <div className="text-sm">{company.name}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 h-1.5 bg-[rgb(48,48,50)] rounded-full mr-2">
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
                    <Badge className="bg-[rgb(48,48,50)] hover:bg-[rgb(55,55,55)]">
                      {company.count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Study Recommendations */}
            <h3 className="text-lg font-bold mb-4">Recommended</h3>
            <div className="bg-[rgb(33,33,33)] rounded-lg p-3 border border-[rgb(48,48,50)]">
              <h4 className="text-sm font-medium mb-2">Topics to focus on</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-xs">Memory Management</div>
                  <div className="text-xs text-green-500">85% mastered</div>
                </div>
                <div className="w-full h-1.5 bg-[rgb(48,48,50)] rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "85%" }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs">Multithreading</div>
                  <div className="text-xs text-yellow-500">45% mastered</div>
                </div>
                <div className="w-full h-1.5 bg-[rgb(48,48,50)] rounded-full">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: "45%" }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs">RTOS</div>
                  <div className="text-xs text-red-500">25% mastered</div>
                </div>
                <div className="w-full h-1.5 bg-[rgb(48,48,50)] rounded-full">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}