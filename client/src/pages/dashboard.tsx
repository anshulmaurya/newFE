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
  ArrowRight,
  Folder,
  FileText,
  BookOpen,
  ChevronRight,
  ExternalLink,
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
    <div className="bg-[rgb(21,21,21)] min-h-screen text-white pt-16">
      {/* Header */}
      <Header 
        onNavigateFeatures={handleNavigateFeatures}
        onNavigateProblems={handleNavigateProblems}
        isScrolled={true}
      />
      
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="flex flex-col">
          {/* Dashboard Title */}
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
          {/* Recommended preparation section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Recommended preparation</h2>
            <p className="text-gray-400 text-sm mb-6">
              Not sure where to start? This preparation roadmap has been proven to work for most of our users.
            </p>
            
            {/* Card items */}
            <div className="space-y-4">
              {/* Card 1 */}
              <div className="bg-[rgb(30,30,33)] hover:bg-[rgb(35,35,38)] transition-colors border border-[rgb(45,45,48)] rounded-lg p-5">
                <div className="flex justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-[rgb(40,40,43)] rounded-md h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-300">1</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <h3 className="font-medium">Front End Interview Playbook</h3>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">A starter guide to preparing for front end interviews</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FileText className="h-3 w-3" />
                        <span>10 articles</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="bg-[rgb(30,30,33)] hover:bg-[rgb(35,35,38)] transition-colors border border-[rgb(45,45,48)] rounded-lg p-5">
                <div className="flex justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-[rgb(40,40,43)] rounded-md h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-300">2</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Codepen className="h-4 w-4 text-gray-400" />
                        <h3 className="font-medium">GFE 75</h3>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">The 75 most important front and interview questions. Covers a wide range of interview patterns and formats.</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Code className="h-3 w-3" />
                        <span>75 questions</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="bg-[rgb(30,30,33)] hover:bg-[rgb(35,35,38)] transition-colors border border-[rgb(45,45,48)] rounded-lg p-5">
                <div className="flex justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-[rgb(40,40,43)] rounded-md h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-300">3</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Folder className="h-4 w-4 text-gray-400" />
                        <h3 className="font-medium">Embedded Systems 50</h3>
                        <Badge className="text-[10px] py-0 px-2 bg-blue-900/30 text-blue-200 ml-1">for expert DSA coders</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">The curated list of questions commonly used to prepare for embedded systems interviews. Solved in JavaScript/TypeScript for front end engineers.</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Code className="h-3 w-3" />
                        <span>50 questions</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              {/* Card 4 */}
              <div className="bg-[rgb(30,30,33)] hover:bg-[rgb(35,35,38)] transition-colors border border-[rgb(45,45,48)] rounded-lg p-5">
                <div className="flex justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-[rgb(40,40,43)] rounded-md h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-300">4</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <h3 className="font-medium">Front End System Design Playbook</h3>
                        <Badge className="text-[10px] py-0 px-2 bg-green-900/30 text-green-200 ml-1">if you're a senior engineer</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">Core System Design techniques and in-depth solutions to common questions like building a social media feed, autocomplete component, e-commerce website.</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FileText className="h-3 w-3" />
                        <span>8 articles</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mt-6">
              With extra time, continue working on the lists below depending on your needs!
            </p>
          </div>
          
          {/* More time-savers section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">More time-savers</h2>
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <span>338 online</span>
                <Button variant="outline" size="sm" className="h-7 px-3 py-1 text-xs bg-transparent border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800">
                  Feedback
                </Button>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Efficient ways to prepare when you're short on time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}