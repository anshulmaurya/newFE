import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, CircleDashed, BarChart, FlameIcon } from "lucide-react";

type UserStats = {
  totalSolved: number;
  totalAttempted: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  currentStreak: number;
  longestStreak: number;
};

export default function ProgressStats() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ["/api/user-stats-record"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="bg-[rgb(20,20,22)] rounded-md border border-[rgb(35,35,40)]">
        <div className="px-3 py-3">
          <h3 className="text-sm font-bold mb-3">Progress Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
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

  // Calculate percentages
  const totalProblems = 100; // Assuming there are 100 problems total for now
  const easyTotal = 50; // Assuming there are 50 easy problems
  const mediumTotal = 30; // Assuming there are 30 medium problems
  const hardTotal = 20; // Assuming there are 20 hard problems

  const percentageSolved = Math.round((userStats.totalSolved / totalProblems) * 100);
  const percentageEasy = Math.round((userStats.easySolved / easyTotal) * 100);
  const percentageMedium = Math.round((userStats.mediumSolved / mediumTotal) * 100);
  const percentageHard = Math.round((userStats.hardSolved / hardTotal) * 100);

  return (
    <div className="bg-[rgb(20,20,22)] rounded-md border border-[rgb(35,35,40)]">
      <div className="px-3 py-3">
        <h3 className="text-sm font-bold mb-3">Progress Stats</h3>
        <div className="space-y-4">

          {/* Easy, Medium, Hard Problems - all on one line */}
          <div className="flex justify-between gap-2">
            {/* Easy */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1">
                  <CircleDashed className="h-3 w-3 text-green-500" />
                  <span className="text-xs font-medium">Easy</span>
                </div>
                <span className="text-xs text-gray-400">
                  {userStats.easySolved}/{easyTotal}
                </span>
              </div>
              <Progress value={percentageEasy} className="h-1.5" />
            </div>
            
            {/* Medium */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1">
                  <BarChart className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs font-medium">Medium</span>
                </div>
                <span className="text-xs text-gray-400">
                  {userStats.mediumSolved}/{mediumTotal}
                </span>
              </div>
              <Progress value={percentageMedium} className="h-1.5" />
            </div>
            
            {/* Hard */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1">
                  <BarChart className="h-3 w-3 text-red-500" />
                  <span className="text-xs font-medium">Hard</span>
                </div>
                <span className="text-xs text-gray-400">
                  {userStats.hardSolved}/{hardTotal}
                </span>
              </div>
              <Progress value={percentageHard} className="h-1.5" />
            </div>
          </div>

          {/* Streaks */}
          <div className="flex justify-between text-xs">
            <div className="flex items-center gap-1">
              <FlameIcon className="h-3 w-3 text-orange-500" />
              <span>Current: <span className="font-bold">{userStats.currentStreak}d</span></span>
            </div>
            <div className="flex items-center gap-1">
              <FlameIcon className="h-3 w-3 text-red-500" />
              <span>Longest: <span className="font-bold">{userStats.longestStreak}d</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}