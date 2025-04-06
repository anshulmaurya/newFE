import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { Flame, Award, Check, Trophy } from "lucide-react";

// Types for user stats
type UserStats = {
  totalSolved: number;
  totalAttempted: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  currentStreak: number;
  longestStreak: number;
};

// Types for streak stats
type StreakStats = {
  current: number;
  longest: number;
};

export default function ProgressVisualization() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  
  // Default stats values
  const defaultStats: UserStats = {
    totalSolved: 0,
    totalAttempted: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    currentStreak: 0,
    longestStreak: 0,
  };
  
  // Fetch user progress summary (using the new combined API)
  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['/api/progress-summary'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/progress-summary');
        return await response.json();
      } catch (error) {
        console.error("Error fetching progress summary:", error);
        return {
          totalSolved: 0,
          byDifficulty: {
            easy: 0,
            medium: 0,
            hard: 0
          },
          streak: {
            current: 0,
            longest: 0
          }
        };
      }
    },
    enabled: true, // Always enable the query, API handles auth check
  });
  
  // Process summary data
  useEffect(() => {
    if (isLoadingSummary) return;
    
    // Check if we have real data from the API
    if (
      summaryData && 
      // Check if there's any actual data (at least one value > 0)
      (summaryData.totalSolved > 0 || 
       summaryData.byDifficulty?.easy > 0 || 
       summaryData.byDifficulty?.medium > 0 || 
       summaryData.byDifficulty?.hard > 0 ||
       summaryData.streak?.current > 0 || 
       summaryData.streak?.longest > 0)
    ) {
      // Map the new summary structure to our UserStats type
      const combinedStats: UserStats = {
        totalSolved: summaryData.totalSolved || 0,
        totalAttempted: summaryData.totalSolved || 0, // We don't track attempted separately in the new API
        easySolved: summaryData.byDifficulty?.easy || 0,
        mediumSolved: summaryData.byDifficulty?.medium || 0,
        hardSolved: summaryData.byDifficulty?.hard || 0,
        currentStreak: summaryData.streak?.current || 0,
        longestStreak: summaryData.streak?.longest || 0,
      };
      setStats(combinedStats);
    } else {
      // Use dummy data when no user logged in or no data
      const dummyStats: UserStats = {
        totalSolved: 57,
        totalAttempted: 76,
        easySolved: 28,
        mediumSolved: 21,
        hardSolved: 8,
        currentStreak: 5,
        longestStreak: 12,
      };
      setStats(dummyStats);
    }
    
    setIsLoading(false);
  }, [summaryData, isLoadingSummary]);
  
  // Calculate total progress percentages
  const calculateProgress = () => {
    if (!stats) return { easy: 0, medium: 0, hard: 0, total: 0 };
    
    const total = stats.totalSolved;
    
    return {
      easy: stats.easySolved,
      medium: stats.mediumSolved,
      hard: stats.hardSolved,
      total
    };
  };
  
  // Loading state
  if (isLoading || isLoadingSummary) {
    return (
      <div className="p-1 h-full flex flex-col">
        <div className="flex justify-between items-center mb-0.5">
          <h3 className="text-white text-xs font-medium">Your Progress</h3>
          <span className="text-[8px] text-gray-300">Loading data...</span>
        </div>
        <div className="flex-1">
          <Skeleton className="h-11 w-full bg-[rgb(35,35,40)]" />
        </div>
      </div>
    );
  }
  
  const progress = calculateProgress();
  
  // Calculate the maximum value for scaling the bar heights
  const maxValue = Math.max(progress.easy, progress.medium, progress.hard, 1);
  
  // Calculate normalized heights (percentage of max)
  const getHeight = (value: number) => {
    return Math.max((value / maxValue) * 70, 8); // Significantly increased height for better visualization
  };
  
  return (
    <div className="p-3 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white text-base font-semibold">Your Progress</h3>
        <span className="text-[11px] text-gray-300">
          Total Solved: {progress.total}
        </span>
      </div>
      
      <div className="flex flex-1 items-center space-x-3">
        {/* Problems by difficulty visualization */}
        <div className="flex-1 flex items-end justify-center space-x-3 pr-4 border-r border-gray-700 h-full">
          {/* Easy problems */}
          <div className="flex flex-col items-center">
            <div 
              className="bg-[rgb(63,147,96)] rounded-t-sm w-10" 
              style={{ height: `${getHeight(progress.easy)}px` }}
            ></div>
            <div className="text-gray-300 text-[9px] mt-1 font-medium">{progress.easy}</div>
            <div className="text-gray-400 text-[8px]">EASY</div>
          </div>
          
          {/* Medium problems */}
          <div className="flex flex-col items-center">
            <div 
              className="bg-[rgb(236,180,14)] rounded-t-sm w-10" 
              style={{ height: `${getHeight(progress.medium)}px` }}
            ></div>
            <div className="text-gray-300 text-[9px] mt-1 font-medium">{progress.medium}</div>
            <div className="text-gray-400 text-[8px]">MED</div>
          </div>
          
          {/* Hard problems */}
          <div className="flex flex-col items-center">
            <div 
              className="bg-[rgb(224,89,89)] rounded-t-sm w-10" 
              style={{ height: `${getHeight(progress.hard)}px` }}
            ></div>
            <div className="text-gray-300 text-[9px] mt-1 font-medium">{progress.hard}</div>
            <div className="text-gray-400 text-[8px]">HARD</div>
          </div>
        </div>
        
        {/* Streak visualization */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {/* Current streak */}
          <div className="flex items-center">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-[rgb(255,138,76)] to-[rgb(255,56,100)] mr-2">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-[8px] text-gray-400 leading-none">CURRENT STREAK</div>
              <div className="text-base font-semibold text-white leading-tight">{stats?.currentStreak || 0} days</div>
            </div>
          </div>
          
          {/* Longest streak */}
          <div className="flex items-center">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-[rgb(147,197,253)] to-[rgb(59,130,246)] mr-2">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-[8px] text-gray-400 leading-none">LONGEST STREAK</div>
              <div className="text-base font-semibold text-white leading-tight">{stats?.longestStreak || 0} days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}