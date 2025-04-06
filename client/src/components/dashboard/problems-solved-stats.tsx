import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, CircleDashed, BarChart3, Flame, Trophy } from "lucide-react";
import { useState, useEffect } from "react";

type UserStats = {
  totalSolved: number;
  totalAttempted: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  currentStreak: number;
  longestStreak: number;
};

type DifficultyCounts = {
  total: number;
  solved: number;
};

type UserStatsData = {
  totalProblems?: number;
  solvedProblems?: number;
  attemptedProblems?: number;
  easyProblems?: DifficultyCounts;
  mediumProblems?: DifficultyCounts;
  hardProblems?: DifficultyCounts;
};

export default function ProblemsSolvedStats() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRenderSafe, setIsRenderSafe] = useState(false);

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

  // First query - get user stats record
  const { 
    data: stats, 
    isLoading: isStatsLoading, 
    isError: isStatsError 
  } = useQuery<UserStats>({
    queryKey: ["/api/user-stats-record"],
    enabled: !!user,
    retry: 1
  });

  // Second query - get problem counts by difficulty
  const { 
    data: statsData, 
    isLoading: isStatsDataLoading, 
    isError: isStatsDataError 
  } = useQuery<UserStatsData>({
    queryKey: ["/api/user-stats"],
    enabled: !!user,
    retry: 1
  });

  // Delay rendering until component is mounted to avoid hydration issues
  useEffect(() => {
    setIsRenderSafe(true);
  }, []);

  // Loading or error state
  if (!isRenderSafe || isStatsLoading || isStatsDataLoading || isStatsError || isStatsDataError) {
    return (
      <Card className="border border-[rgb(35,35,40)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base">Problems Solved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full bg-[rgb(35,35,40)]" />
            <Skeleton className="h-4 w-full bg-[rgb(35,35,40)]" />
            <Skeleton className="h-4 w-full bg-[rgb(35,35,40)]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use fetched stats or default to empty stats
  const userStats = stats || defaultStats;
  
  // Safe access to optional properties with default values
  const easyTotal = statsData?.easyProblems?.total ?? 50;
  const mediumTotal = statsData?.mediumProblems?.total ?? 30;
  const hardTotal = statsData?.hardProblems?.total ?? 20;
  const totalProblems = easyTotal + mediumTotal + hardTotal;

  // Calculate percentages safely with fallbacks to prevent NaN
  const percentageEasy = Math.round((userStats.easySolved / easyTotal) * 100) || 0;
  const percentageMedium = Math.round((userStats.mediumSolved / mediumTotal) * 100) || 0;
  const percentageHard = Math.round((userStats.hardSolved / hardTotal) * 100) || 0;
  const percentageTotal = Math.round((userStats.totalSolved / totalProblems) * 100) || 0;

  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <h3 className="text-white text-xs font-medium">Problems Solved</h3>
        <span className="text-xs font-medium text-gray-400">{userStats.totalSolved}/{totalProblems} ({percentageTotal}%)</span>
      </div>
      
      <div className="mt-2 space-y-1.5">
        {/* Easy Problems */}
        <div className="flex items-center gap-2">
          <CircleDashed className="h-2.5 w-2.5 text-green-500 flex-shrink-0" />
          <div className="flex-grow">
            <div className="flex justify-between items-center text-[10px] mb-0.5">
              <span className="text-gray-300">Easy</span>
              <span className="text-gray-300">{userStats.easySolved}/{easyTotal}</span>
            </div>
            <Progress value={percentageEasy} className="h-1 bg-[rgb(35,35,40)]" />
          </div>
        </div>

        {/* Medium Problems */}
        <div className="flex items-center gap-2">
          <BarChart3 className="h-2.5 w-2.5 text-yellow-500 flex-shrink-0" />
          <div className="flex-grow">
            <div className="flex justify-between items-center text-[10px] mb-0.5">
              <span className="text-gray-300">Medium</span>
              <span className="text-gray-300">{userStats.mediumSolved}/{mediumTotal}</span>
            </div>
            <Progress value={percentageMedium} className="h-1 bg-[rgb(35,35,40)]" />
          </div>
        </div>

        {/* Hard Problems */}
        <div className="flex items-center gap-2">
          <Flame className="h-2.5 w-2.5 text-red-500 flex-shrink-0" />
          <div className="flex-grow">
            <div className="flex justify-between items-center text-[10px] mb-0.5">
              <span className="text-gray-300">Hard</span>
              <span className="text-gray-300">{userStats.hardSolved}/{hardTotal}</span>
            </div>
            <Progress value={percentageHard} className="h-1 bg-[rgb(35,35,40)]" />
          </div>
        </div>
      </div>
    </div>
  );
}