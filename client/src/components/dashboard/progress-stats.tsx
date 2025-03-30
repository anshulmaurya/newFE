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
      <Card>
        <CardHeader>
          <CardTitle>Progress Statistics</CardTitle>
          <CardDescription>
            Loading your problem-solving statistics...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
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
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Overall Progress</span>
              </div>
              <span className="text-sm font-medium">
                {userStats.totalSolved} / {totalProblems}
              </span>
            </div>
            <Progress value={percentageSolved} className="h-2" />
          </div>

          {/* Easy Problems */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <CircleDashed className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Easy</span>
              </div>
              <span className="text-sm font-medium">
                {userStats.easySolved} / {easyTotal}
              </span>
            </div>
            <Progress value={percentageEasy} className="h-2" />
          </div>

          {/* Medium Problems */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Medium</span>
              </div>
              <span className="text-sm font-medium">
                {userStats.mediumSolved} / {mediumTotal}
              </span>
            </div>
            <Progress value={percentageMedium} className="h-2" />
          </div>

          {/* Hard Problems */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">Hard</span>
              </div>
              <span className="text-sm font-medium">
                {userStats.hardSolved} / {hardTotal}
              </span>
            </div>
            <Progress value={percentageHard} className="h-2" />
          </div>

          {/* Current Streak */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FlameIcon className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <span className="text-sm font-medium">{userStats.currentStreak} days</span>
          </div>

          {/* Longest Streak */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FlameIcon className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium">Longest Streak</span>
            </div>
            <span className="text-sm font-medium">{userStats.longestStreak} days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}