import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, CircleDashed, BarChart3, Flame, Trophy } from "lucide-react";

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

  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ["/api/user-stats-record"],
    enabled: !!user,
  });

  if (isLoading) {
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

  // Default stats if none exist yet
  const userStats = stats || {
    totalSolved: 0,
    totalAttempted: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    currentStreak: 0,
    longestStreak: 0,
  };

  // Calculate percentages - use real data when available
  const fetchedStats = useQuery<UserStatsData>({
    queryKey: ["/api/user-stats"],
    enabled: !!user,
  });

  // Get actual totals by difficulty from fetched stats or use fallbacks
  const statsData: UserStatsData = fetchedStats.data || {};
  
  // Safe access to optional properties with default values
  const easyTotal = statsData?.easyProblems?.total ?? 50;
  const mediumTotal = statsData?.mediumProblems?.total ?? 30;
  const hardTotal = statsData?.hardProblems?.total ?? 20;
  const totalProblems = easyTotal + mediumTotal + hardTotal;

  const percentageEasy = Math.round((userStats.easySolved / easyTotal) * 100) || 0;
  const percentageMedium = Math.round((userStats.mediumSolved / mediumTotal) * 100) || 0;
  const percentageHard = Math.round((userStats.hardSolved / hardTotal) * 100) || 0;
  const percentageTotal = Math.round((userStats.totalSolved / totalProblems) * 100) || 0;

  return (
    <Card className="border border-[rgb(35,35,40)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-base">Problems Solved</CardTitle>
        <CardDescription className="text-gray-400 text-xs flex justify-between">
          <span>Your progress by difficulty</span>
          <span className="font-medium">{userStats.totalSolved}/{totalProblems} ({percentageTotal}%)</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Easy Problems */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <CircleDashed className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-gray-300">Easy</span>
              </div>
              <span className="text-xs font-medium text-gray-300">
                {userStats.easySolved}/{easyTotal}
              </span>
            </div>
            <Progress value={percentageEasy} className="h-2 bg-[rgb(35,35,40)]" />
          </div>

          {/* Medium Problems */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-yellow-500" />
                <span className="text-xs font-medium text-gray-300">Medium</span>
              </div>
              <span className="text-xs font-medium text-gray-300">
                {userStats.mediumSolved}/{mediumTotal}
              </span>
            </div>
            <Progress value={percentageMedium} className="h-2 bg-[rgb(35,35,40)]" />
          </div>

          {/* Hard Problems */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-red-500" />
                <span className="text-xs font-medium text-gray-300">Hard</span>
              </div>
              <span className="text-xs font-medium text-gray-300">
                {userStats.hardSolved}/{hardTotal}
              </span>
            </div>
            <Progress value={percentageHard} className="h-2 bg-[rgb(35,35,40)]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}