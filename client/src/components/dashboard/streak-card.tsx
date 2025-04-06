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
    <div className="p-3">
      <div className="flex justify-between items-center">
        <h3 className="text-white text-xs font-medium">Your Streak</h3>
        <span className="text-xs text-gray-400">Days with solved problems</span>
      </div>
      
      <div className="flex items-center mt-2">
        {/* Streak visualization */}
        <div className="flex items-center gap-1 mr-2">
          {flameCount > 0 ? (
            flames.map((_, index) => (
              <Flame 
                key={index} 
                className={`h-3 w-3 ${index === flameCount - 1 ? 'text-[rgb(255,165,0)]' : 'text-[rgb(214,251,65)]'}`}
                fill={index === flameCount - 1 ? 'rgb(255,165,0)' : 'rgb(214,251,65)'}
              />
            ))
          ) : (
            <Flame className="h-3 w-3 text-gray-600" />
          )}
        </div>
        
        {/* Streak counters - horizontal layout */}
        <div className="flex gap-3 ml-auto text-right">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400">Current</span>
            <Flame className="h-2.5 w-2.5 text-[rgb(214,251,65)]" />
            <span className="text-xs font-medium text-white">{userStreak.current}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400">Longest</span>
            <Trophy className="h-2.5 w-2.5 text-yellow-500" />
            <span className="text-xs font-medium text-white">{userStreak.longest}</span>
          </div>
        </div>
      </div>
      
      {/* Streak message in a more compact line */}
      <div className="mt-1.5 text-[10px] text-gray-400 truncate">
        {streakMessage}
      </div>
    </div>
  );
}