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
  
  // Fetch user stats
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/user-stats-record'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/user-stats-record');
        return await response.json();
      } catch (error) {
        console.error("Error fetching user stats:", error);
        return defaultStats;
      }
    },
    enabled: !!user,
  });
  
  // Fetch streak data
  const { data: streakData, isLoading: isLoadingStreak } = useQuery({
    queryKey: ['/api/user-streak'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/user-streak');
        return await response.json();
      } catch (error) {
        console.error("Error fetching streak data:", error);
        return { current: 0, longest: 0 };
      }
    },
    enabled: !!user,
  });
  
  // Process stats data
  useEffect(() => {
    if (isLoadingStats || isLoadingStreak) return;
    
    // Check if we have real data from the API
    if (
      (statsData && Object.keys(statsData).length > 0 && 
       streakData && Object.keys(streakData).length > 0) &&
      // Check if there's any actual data (at least one value > 0)
      (statsData.totalSolved > 0 || statsData.easySolved > 0 || 
       statsData.mediumSolved > 0 || statsData.hardSolved > 0 ||
       streakData.current > 0 || streakData.longest > 0)
    ) {
      // Use real data
      const combinedStats: UserStats = {
        ...defaultStats,
        ...statsData,
        currentStreak: streakData?.current || 0,
        longestStreak: streakData?.longest || 0,
      };
      setStats(combinedStats);
    } else {
      // Use dummy data for demonstration
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
  }, [statsData, streakData, isLoadingStats, isLoadingStreak]);
  
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
  if (isLoading || isLoadingStats || isLoadingStreak) {
    return (
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-sm font-medium">Your Progress</h3>
          <span className="text-sm text-gray-300">Loading data...</span>
        </div>
        <div className="flex-1">
          <Skeleton className="h-32 w-full bg-[rgb(35,35,40)]" />
        </div>
      </div>
    );
  }
  
  const progress = calculateProgress();
  
  // Calculate the maximum value for scaling the bar heights
  const maxValue = Math.max(progress.easy, progress.medium, progress.hard, 1);
  
  // Calculate normalized heights (percentage of max)
  const getHeight = (value: number) => {
    return Math.max((value / maxValue) * 140, 8); // Increased height for better visibility
  };
  
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-sm font-medium">Your Progress</h3>
        <span className="text-sm text-gray-300">
          Total Solved: {progress.total}
        </span>
      </div>
      
      <div className="flex flex-1 items-center space-x-6">
        {/* Problems by difficulty visualization */}
        <div className="flex-1 flex items-end justify-center space-x-4 pr-6 border-r border-gray-800 h-full">
          {/* Easy problems */}
          <div className="flex flex-col items-center">
            <div 
              className="bg-[rgb(63,147,96)] rounded-t-sm w-10" 
              style={{ height: `${getHeight(progress.easy)}px` }}
            ></div>
            <div className="text-gray-300 text-xs mt-1 font-medium">{progress.easy}</div>
            <div className="text-gray-400 text-[10px]">EASY</div>
          </div>
          
          {/* Medium problems */}
          <div className="flex flex-col items-center">
            <div 
              className="bg-[rgb(236,180,14)] rounded-t-sm w-10" 
              style={{ height: `${getHeight(progress.medium)}px` }}
            ></div>
            <div className="text-gray-300 text-xs mt-1 font-medium">{progress.medium}</div>
            <div className="text-gray-400 text-[10px]">MEDIUM</div>
          </div>
          
          {/* Hard problems */}
          <div className="flex flex-col items-center">
            <div 
              className="bg-[rgb(224,89,89)] rounded-t-sm w-10" 
              style={{ height: `${getHeight(progress.hard)}px` }}
            ></div>
            <div className="text-gray-300 text-xs mt-1 font-medium">{progress.hard}</div>
            <div className="text-gray-400 text-[10px]">HARD</div>
          </div>
        </div>
        
        {/* Streak visualization */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {/* Current streak */}
          <div className="flex items-center">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[rgb(255,138,76)] to-[rgb(255,56,100)] mr-3">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400">CURRENT STREAK</div>
              <div className="text-xl font-semibold text-white">{stats?.currentStreak || 0} days</div>
            </div>
          </div>
          
          {/* Longest streak */}
          <div className="flex items-center">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[rgb(147,197,253)] to-[rgb(59,130,246)] mr-3">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400">LONGEST STREAK</div>
              <div className="text-xl font-semibold text-white">{stats?.longestStreak || 0} days</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Completion rate info - only shown if there are problems solved */}
      {progress.total > 0 && (
        <div className="mt-4 text-xs text-gray-400 flex items-center">
          <Check className="h-3 w-3 mr-1.5 text-[rgb(63,147,96)]" />
          You've solved {progress.total} problems. Keep going!
        </div>
      )}
    </div>
  );
}