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
    
    // Combine stats with streak data
    const combinedStats: UserStats = {
      ...defaultStats,
      ...statsData,
      currentStreak: streakData?.current || 0,
      longestStreak: streakData?.longest || 0,
    };
    
    setStats(combinedStats);
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
      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white text-xs font-medium">Your Progress</h3>
          <span className="text-xs text-gray-400">Loading data...</span>
        </div>
        <Skeleton className="h-16 w-full bg-[rgb(35,35,40)]" />
      </div>
    );
  }
  
  const progress = calculateProgress();
  
  // Calculate the maximum value for scaling the bar heights
  const maxValue = Math.max(progress.easy, progress.medium, progress.hard, 1);
  
  // Calculate normalized heights (percentage of max)
  const getHeight = (value: number) => {
    return Math.max((value / maxValue) * 100, 5); // At least 5% height for visibility
  };
  
  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white text-xs font-medium">Your Progress</h3>
        <span className="text-xs text-gray-400">
          Total Solved: {progress.total}
        </span>
      </div>
      
      <div className="flex items-end space-x-4">
        {/* Problems by difficulty visualization */}
        <div className="flex items-end space-x-1.5 pr-4 border-r border-gray-800">
          {/* Easy problems */}
          <div className="flex flex-col items-center">
            <div 
              className="bg-[rgb(63,147,96)] rounded-t-sm w-6" 
              style={{ height: `${getHeight(progress.easy)}px` }}
            ></div>
            <div className="text-gray-400 text-[8px] mt-1">{progress.easy}</div>
            <div className="text-gray-400 text-[7px]">EASY</div>
          </div>
          
          {/* Medium problems */}
          <div className="flex flex-col items-center">
            <div 
              className="bg-[rgb(236,180,14)] rounded-t-sm w-6" 
              style={{ height: `${getHeight(progress.medium)}px` }}
            ></div>
            <div className="text-gray-400 text-[8px] mt-1">{progress.medium}</div>
            <div className="text-gray-400 text-[7px]">MED</div>
          </div>
          
          {/* Hard problems */}
          <div className="flex flex-col items-center">
            <div 
              className="bg-[rgb(224,89,89)] rounded-t-sm w-6" 
              style={{ height: `${getHeight(progress.hard)}px` }}
            ></div>
            <div className="text-gray-400 text-[8px] mt-1">{progress.hard}</div>
            <div className="text-gray-400 text-[7px]">HARD</div>
          </div>
        </div>
        
        {/* Streak visualization */}
        <div className="flex flex-col justify-center">
          {/* Current streak */}
          <div className="flex items-center mb-2">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-br from-[rgb(255,138,76)] to-[rgb(255,56,100)] mr-2">
              <Flame className="h-3 w-3 text-white" />
            </div>
            <div>
              <div className="text-[8px] text-gray-400">CURRENT STREAK</div>
              <div className="text-md font-semibold text-white">{stats?.currentStreak || 0} days</div>
            </div>
          </div>
          
          {/* Longest streak */}
          <div className="flex items-center">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-br from-[rgb(147,197,253)] to-[rgb(59,130,246)] mr-2">
              <Trophy className="h-3 w-3 text-white" />
            </div>
            <div>
              <div className="text-[8px] text-gray-400">LONGEST STREAK</div>
              <div className="text-md font-semibold text-white">{stats?.longestStreak || 0} days</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Completion rate info */}
      <div className="mt-3 text-[9px] text-gray-400 flex items-center">
        <Check className="h-2.5 w-2.5 mr-1 text-[rgb(63,147,96)]" />
        {progress.total > 0 
          ? `You've solved ${progress.total} problems. Keep going!` 
          : "Start solving problems to track your progress."}
      </div>
    </div>
  );
}