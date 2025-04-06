import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Trophy } from "lucide-react";
import { useState, useEffect } from "react";

type StreakStats = {
  current: number;
  longest: number;
};

export default function StreakCard() {
  const { user } = useAuth();
  const [isRenderSafe, setIsRenderSafe] = useState(false);

  // Delay rendering until component is mounted to avoid hydration issues
  useEffect(() => {
    setIsRenderSafe(true);
  }, []);

  const { 
    data: streak, 
    isLoading, 
    isError 
  } = useQuery<StreakStats>({
    queryKey: ["/api/user-streak"],
    enabled: !!user,
    retry: 1
  });

  if (!isRenderSafe || isLoading || isError) {
    return (
      <Card className="border border-[rgb(35,35,40)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base">Your Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full bg-[rgb(35,35,40)]" />
        </CardContent>
      </Card>
    );
  }

  const userStreak = streak || { current: 0, longest: 0 };

  // Generate array of flame icons based on current streak
  const flameCount = Math.min(userStreak.current, 7); // Limit to 7 flames max
  const flames = Array(flameCount).fill(null);

  // Determine streak message
  let streakMessage = "";
  if (userStreak.current === 0) {
    streakMessage = "Start solving problems today to build your streak!";
  } else if (userStreak.current === 1) {
    streakMessage = "You're on your first day! Keep going!";
  } else if (userStreak.current < 3) {
    streakMessage = "Great start! Maintain your momentum!";
  } else if (userStreak.current < 7) {
    streakMessage = "You're building consistency! Keep it up!";
  } else if (userStreak.current < 14) {
    streakMessage = "Impressive streak! You're on fire!";
  } else {
    streakMessage = "Phenomenal discipline! You're unstoppable!";
  }

  return (
    <Card className="border border-[rgb(35,35,40)]">
      <CardHeader className="pb-1 pt-2">
        <CardTitle className="text-white text-sm">Your Streak</CardTitle>
        <CardDescription className="text-gray-400 text-xs mt-0.5">
          Days in a row with solved problems
        </CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        <div className="space-y-2">
          {/* Flame icons display */}
          <div className="flex justify-center items-center gap-1.5 py-1">
            {flameCount > 0 ? (
              flames.map((_, index) => (
                <Flame 
                  key={index} 
                  className={`h-5 w-5 ${index === flameCount - 1 ? 'text-[rgb(255,165,0)]' : 'text-[rgb(214,251,65)]'}`}
                  fill={index === flameCount - 1 ? 'rgb(255,165,0)' : 'rgb(214,251,65)'}
                />
              ))
            ) : (
              <div className="flex flex-col items-center">
                <Flame className="h-7 w-7 text-gray-600" />
              </div>
            )}
          </div>

          {/* Streak counters */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-[rgb(24,24,26)] px-2 py-1 rounded-md">
              <div className="text-xs text-gray-400">Current</div>
              <div className="flex items-center justify-center gap-1">
                <Flame className="h-3 w-3 text-[rgb(214,251,65)]" />
                <span className="text-sm font-bold text-white">{userStreak.current}</span>
                <span className="text-xs text-gray-400">days</span>
              </div>
            </div>
            
            <div className="bg-[rgb(24,24,26)] px-2 py-1 rounded-md">
              <div className="text-xs text-gray-400">Longest</div>
              <div className="flex items-center justify-center gap-1">
                <Trophy className="h-3 w-3 text-yellow-500" />
                <span className="text-sm font-bold text-white">{userStreak.longest}</span>
                <span className="text-xs text-gray-400">days</span>
              </div>
            </div>
          </div>
          
          {/* Streak message */}
          <div className="text-[10px] text-center text-gray-400">
            {streakMessage}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}