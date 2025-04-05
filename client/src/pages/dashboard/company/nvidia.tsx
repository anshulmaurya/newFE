import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from 'wouter';
import ProblemCard, { getStatusIcon } from '@/components/dashboard/problem-card';
import { useAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Loader2, Clock, BookOpen, Zap } from 'lucide-react';
import { SiNvidia } from 'react-icons/si';

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

const NvidiaPage: React.FC = () => {
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

  return (
    <DashboardLayout darkMode={darkMode} toggleTheme={toggleDarkMode}>
      <div className="pl-4 pr-4 relative pb-8 bg-[rgb(12,12,14)]">
        <div className="flex">
          <div className="flex-1 space-y-4 w-full">
            {/* Header with title and description */}
            <div className="bg-[rgb(18,18,20)] rounded-lg border border-[rgb(45,45,50)] p-6 mt-4">
              <div className="flex items-center mb-3">
                <SiNvidia className="text-3xl text-green-500 mr-3" />
                <h1 className="text-2xl font-bold text-[rgb(214,251,65)]">NVIDIA Interview Preparation</h1>
              </div>
              <p className="text-gray-300 mb-4">
                A specialized preparation bundle designed for NVIDIA embedded systems and GPU interviews.
                Covers GPU architecture, parallel programming, and hardware optimization challenges frequently seen at NVIDIA.
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-gray-300">GPU-Specific Focus</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-gray-300">Parallel Computing Challenges</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-yellow-400 mr-2" />
                  <span className="text-gray-300">Hardware Optimization Problems</span>
                </div>
              </div>
            </div>
            
            {/* Recommended Problems */}
            <div className="bg-[rgb(18,18,20)] rounded-lg border border-[rgb(45,45,50)] p-6">
              <h2 className="text-xl font-bold mb-4">NVIDIA Interview Problems</h2>
              
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
                    // For a real implementation, we would filter by NVIDIA-specific problems
                    // For now, we'll just display a selection of problems
                    .slice(2, 8) // Get a different subset of problems for this bundle
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NvidiaPage;