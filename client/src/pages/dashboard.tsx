import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar 
} from 'recharts';
import { 
  Calendar,
  CheckCircle2, 
  Clock, 
  Filter, 
  GitPullRequest, 
  Loader2, 
  PlusCircle, 
  Search, 
  Timer, 
  TrendingUp, 
  X, 
  ListFilter,
  BarChart2,
  Laptop,
  Cpu,
  Database,
  Share2,
  Codepen,
  Zap,
  FolderArchive,
  ScanEye,
  LucideIcon
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

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

// Helper function to get difficulty color
const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-green-500';
    case 'Medium':
      return 'bg-yellow-500';
    case 'Hard':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Solved':
      return 'bg-green-500';
    case 'Attempted':
      return 'bg-yellow-500';
    case 'Not Started':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

// Dashboard component
export default function Dashboard() {
  // State
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(16);
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState<string>('all');

  // API queries
  const { data: problemsData, isLoading: isLoadingProblems } = useQuery({
    queryKey: ['/api/problems', category, difficulty, search, page, limit, sortBy, sortOrder],
    queryFn: () => {
      const categoryParam = category === 'all' ? '' : category;
      const difficultyParam = difficulty === 'all' ? '' : difficulty;
      return apiRequest(`/api/problems?category=${categoryParam}&difficulty=${difficultyParam}&search=${search}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    },
  });

  const { data: userProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['/api/user-progress'],
    queryFn: () => apiRequest('/api/user-progress'),
  });

  const { data: userStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/user-stats'],
    queryFn: () => apiRequest('/api/user-stats'),
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

  // Get problem progress data for charts
  const getProgressData = () => {
    if (!userStats) return [];
    
    const data = [
      { name: 'Solved', value: userStats.solvedProblems, color: '#22c55e' },
      { name: 'Attempted', value: userStats.attemptedProblems, color: '#eab308' },
      { name: 'Not Started', value: userStats.totalProblems - userStats.solvedProblems - userStats.attemptedProblems, color: '#94a3b8' },
    ];
    
    return data;
  };

  // Get difficulty progress data
  const getDifficultyData = () => {
    if (!userStats) return [];
    
    return [
      {
        name: 'Easy',
        solved: userStats.easyProblems.solved,
        total: userStats.easyProblems.total,
        progress: Math.round((userStats.easyProblems.solved / (userStats.easyProblems.total || 1)) * 100)
      },
      {
        name: 'Medium',
        solved: userStats.mediumProblems.solved,
        total: userStats.mediumProblems.total,
        progress: Math.round((userStats.mediumProblems.solved / (userStats.mediumProblems.total || 1)) * 100)
      },
      {
        name: 'Hard',
        solved: userStats.hardProblems.solved,
        total: userStats.hardProblems.total,
        progress: Math.round((userStats.hardProblems.solved / (userStats.hardProblems.total || 1)) * 100)
      },
    ];
  };

  // Filter problems based on status tab
  const getFilteredProblems = () => {
    if (!problemsData?.problems) return [];
    
    if (activeTab === 'all') return problemsData.problems;
    
    return problemsData.problems.filter(problem => {
      const status = getProblemStatus(problem.id);
      return activeTab === status.toLowerCase();
    });
  };

  // Render
  return (
    <div className="bg-[rgb(24,24,26)] min-h-screen text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Problem Dashboard</h1>
            <p className="mt-1 text-gray-400">Practice embedded systems problems and track your progress</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Button 
              variant="outline" 
              className="border-[rgb(214,251,65)] hover:bg-[rgb(214,251,65)] hover:text-black"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add to Study List
            </Button>
            <Button 
              className="bg-[rgb(214,251,65)] text-black hover:bg-[rgb(194,231,45)]"
            >
              Pick Random Problem
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Progress Overview Card */}
          <Card className="bg-[rgb(36,36,38)] border-[rgb(48,48,50)] shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="flex justify-center p-6">
                  <Loader2 className="h-8 w-8 animate-spin text-[rgb(214,251,65)]" />
                </div>
              ) : userStats ? (
                <div className="flex flex-col">
                  <div className="flex items-center justify-center h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getProgressData()}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {getProgressData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`${value} problems`, '']}
                          contentStyle={{ backgroundColor: 'rgb(36,36,38)', borderColor: 'rgb(48,48,50)' }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold text-green-500">{userStats.solvedProblems}</div>
                      <div className="text-xs text-gray-400">Solved</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold text-yellow-500">{userStats.attemptedProblems}</div>
                      <div className="text-xs text-gray-400">In Progress</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold text-gray-500">
                        {userStats.totalProblems - userStats.solvedProblems - userStats.attemptedProblems}
                      </div>
                      <div className="text-xs text-gray-400">Not Started</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Difficulty Progress Card */}
          <Card className="bg-[rgb(36,36,38)] border-[rgb(48,48,50)] shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Difficulty Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="flex justify-center p-6">
                  <Loader2 className="h-8 w-8 animate-spin text-[rgb(214,251,65)]" />
                </div>
              ) : userStats ? (
                <div className="space-y-4 mt-2">
                  {getDifficultyData().map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between">
                        <span className={`text-sm font-medium ${
                          item.name === 'Easy' ? 'text-green-500' : 
                          item.name === 'Medium' ? 'text-yellow-500' : 
                          'text-red-500'
                        }`}>
                          {item.name}
                        </span>
                        <span className="text-sm text-gray-400">
                          {item.solved} / {item.total}
                        </span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${
                          item.name === 'Easy' ? 'bg-green-900' : 
                          item.name === 'Medium' ? 'bg-yellow-900' : 
                          'bg-red-900'
                        }`}>
                        <div 
                          className={`h-full transition-all ${
                            item.name === 'Easy' ? 'bg-green-500' : 
                            item.name === 'Medium' ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={getDifficultyData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgb(36,36,38)', borderColor: 'rgb(48,48,50)' }} 
                        />
                        <Bar dataKey="solved" name="Solved" fill="#22c55e" />
                        <Bar dataKey="total" name="Total" fill="#94a3b8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Activity Card */}
          <Card className="bg-[rgb(36,36,38)] border-[rgb(48,48,50)] shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Study Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }).map((_, i) => {
                    // Mock data - in a real app this would come from the API
                    const isActive = Math.random() > 0.4;
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded flex items-center justify-center ${
                          isActive ? 'bg-[rgb(214,251,65)]' : 'bg-[rgb(48,48,50)]'
                        }`}
                      >
                        <span className={isActive ? 'text-black' : 'text-gray-400'}>
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="text-lg font-bold">5 day streak</div>
                  <Badge className="bg-[rgb(214,251,65)] text-black">+2 today</Badge>
                </div>

                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart 
                      data={[
                        { day: 'Mon', problems: 3 },
                        { day: 'Tue', problems: 5 },
                        { day: 'Wed', problems: 2 },
                        { day: 'Thu', problems: 7 },
                        { day: 'Fri', problems: 4 },
                        { day: 'Sat', problems: 2 },
                        { day: 'Sun', problems: 3 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgb(36,36,38)', borderColor: 'rgb(48,48,50)' }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="problems" 
                        name="Problems" 
                        stroke="rgb(214,251,65)" 
                        strokeWidth={2} 
                        dot={{ fill: 'rgb(214,251,65)', r: 4 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters and Problems Grid */}
      <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        {/* Search and filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search problems..."
              className="pl-9 bg-[rgb(36,36,38)] border-[rgb(48,48,50)] focus-visible:ring-[rgb(214,251,65)] text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full bg-[rgb(36,36,38)] border-[rgb(48,48,50)] focus:ring-[rgb(214,251,65)] text-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-[rgb(36,36,38)] border-[rgb(48,48,50)] text-white">
                <SelectGroup>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Memory Management">Memory Management</SelectItem>
                  <SelectItem value="Multithreading">Multithreading</SelectItem>
                  <SelectItem value="Data Structures">Data Structures</SelectItem>
                  <SelectItem value="C++ API">C++ API</SelectItem>
                  <SelectItem value="Linux API">Linux API</SelectItem>
                  <SelectItem value="RTOS">RTOS</SelectItem>
                  <SelectItem value="Power Management">Power Management</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-full bg-[rgb(36,36,38)] border-[rgb(48,48,50)] focus:ring-[rgb(214,251,65)] text-white">
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-[rgb(36,36,38)] border-[rgb(48,48,50)] text-white">
                <SelectGroup>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full bg-[rgb(36,36,38)] border-[rgb(48,48,50)] focus:ring-[rgb(214,251,65)] text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[rgb(36,36,38)] border-[rgb(48,48,50)] text-white">
                <SelectGroup>
                  <SelectItem value="id">ID</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="frequency">Frequency</SelectItem>
                  <SelectItem value="acceptanceRate">Acceptance Rate</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              className="bg-[rgb(36,36,38)] border-[rgb(48,48,50)] hover:bg-[rgb(48,48,50)] text-white"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>
        </div>

        {/* Tabs for filtering problems by status */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-[rgb(36,36,38)] border border-[rgb(48,48,50)]">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-[rgb(214,251,65)] data-[state=active]:text-black"
            >
              All Problems
            </TabsTrigger>
            <TabsTrigger 
              value="solved" 
              className="data-[state=active]:bg-[rgb(214,251,65)] data-[state=active]:text-black"
            >
              Solved
            </TabsTrigger>
            <TabsTrigger 
              value="attempted" 
              className="data-[state=active]:bg-[rgb(214,251,65)] data-[state=active]:text-black"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger 
              value="not started" 
              className="data-[state=active]:bg-[rgb(214,251,65)] data-[state=active]:text-black"
            >
              Not Started
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Problems grid */}
        {isLoadingProblems ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-[rgb(214,251,65)]" />
            <p className="mt-4 text-gray-400">Loading problems...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getFilteredProblems().map((problem) => {
                const status = getProblemStatus(problem.id);
                const CategoryIcon = categoryIcons[problem.category] || Codepen;
                
                return (
                  <Card key={problem.id} className="bg-[rgb(36,36,38)] border-[rgb(48,48,50)] h-full shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center mb-2">
                        <Badge 
                          className={`${getDifficultyColor(problem.difficulty)} text-white`}
                        >
                          {problem.difficulty}
                        </Badge>
                        <Badge 
                          className={`${getStatusColor(status)} text-white`}
                        >
                          {status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold truncate">{problem.title}</CardTitle>
                      <div className="flex space-x-2 items-center mt-1">
                        <Badge variant="outline" className="flex items-center space-x-1 py-0 h-5">
                          <CategoryIcon className="h-3 w-3" />
                          <span className="text-xs">{problem.category}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {problem.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-0">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          <span>{problem.acceptanceRate}%</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{problem.estimatedTime}</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span>Freq: {problem.frequency}%</span>
                        </div>
                        <div className="flex items-center">
                          <GitPullRequest className="h-3 w-3 mr-1" />
                          <span>{problem.completionRate}</span>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="bg-[rgb(214,251,65)] text-black hover:bg-[rgb(194,231,45)]"
                      >
                        Solve
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="bg-[rgb(36,36,38)] border-[rgb(48,48,50)] hover:bg-[rgb(48,48,50)] text-white"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex">
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <Button
                          key={pageNumber}
                          variant={page === pageNumber ? "default" : "outline"}
                          className={
                            page === pageNumber
                              ? "bg-[rgb(214,251,65)] text-black hover:bg-[rgb(194,231,45)]"
                              : "bg-[rgb(36,36,38)] border-[rgb(48,48,50)] hover:bg-[rgb(48,48,50)] text-white"
                          }
                          onClick={() => setPage(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    className="bg-[rgb(36,36,38)] border-[rgb(48,48,50)] hover:bg-[rgb(48,48,50)] text-white"
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Bottom padding */}
      <div className="h-20"></div>
    </div>
  );
}