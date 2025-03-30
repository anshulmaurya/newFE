import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type ActivityData = {
  date: string;
  problemsSolved: number;
  minutesActive: number;
}

type MonthData = {
  month: string;
  days: {
    date: string;
    dayOfWeek: number;
    problemsSolved: number;
    intensity: number; // 0 to 4
  }[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ActivityHeatmap() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lastYear, setLastYear] = useState<MonthData[]>([]);
  const [maxActivity, setMaxActivity] = useState(1);
  const [totalContributions, setTotalContributions] = useState(0);

  // Fetch user activity for the last year
  const { data: activityData, isLoading } = useQuery<ActivityData[]>({
    queryKey: ["/api/user-activity"],
    enabled: !!user,
  });

  useEffect(() => {
    if (!activityData) return;

    // Process activity data into months and days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1); // Last 12 months
    
    // Create array of all dates in the past year
    const dateMap = new Map<string, ActivityData>();
    activityData.forEach(activity => {
      dateMap.set(activity.date, activity);
    });

    // Calculate max activity to normalize intensity
    const activities = activityData.map(a => a.problemsSolved);
    const max = Math.max(...activities, 1);
    setMaxActivity(max);
    
    // Count total contributions
    const total = activities.reduce((sum, current) => sum + current, 0);
    setTotalContributions(total);

    // Generate month data
    const months: MonthData[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const monthIndex = currentDate.getMonth();
      const monthName = MONTHS[monthIndex];
      
      // Find or create month
      let month = months.find(m => m.month === monthName);
      if (!month) {
        month = { month: monthName, days: [] };
        months.push(month);
      }
      
      // Format date as YYYY-MM-DD for lookup
      const dateStr = currentDate.toISOString().split('T')[0];
      const activity = dateMap.get(dateStr);
      
      // Create day object
      month.days.push({
        date: dateStr,
        dayOfWeek: (currentDate.getDay() + 6) % 7, // Convert Sunday=0 to Monday=0
        problemsSolved: activity?.problemsSolved || 0,
        intensity: activity ? Math.min(Math.ceil((activity.problemsSolved / max) * 4), 4) : 0
      });
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Sort months chronologically
    const sortedMonths = months.slice().sort((a, b) => {
      return MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month);
    });
    
    setLastYear(sortedMonths);
  }, [activityData]);

  // Function to get cell color based on intensity
  const getCellColor = (intensity: number) => {
    if (intensity === 0) return "bg-gray-800";
    if (intensity === 1) return "bg-green-900";
    if (intensity === 2) return "bg-green-700";
    if (intensity === 3) return "bg-green-500";
    return "bg-green-300";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Activity</CardTitle>
          <CardDescription>Retrieving your contribution history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full flex items-center justify-center">
            <Skeleton className="h-[180px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{totalContributions} contributions in the last year</CardTitle>
        <CardDescription>
          Track your daily problem-solving activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Month headers */}
            <div className="flex mb-2 text-xs text-gray-400">
              <div className="w-10"></div> {/* Placeholder for day labels */}
              <div className="flex-1 grid grid-cols-52 gap-1">
                {lastYear.map((month, index) => (
                  <div
                    key={index}
                    className="col-span-4 text-center"
                    style={{ 
                      gridColumnStart: Math.floor((index * 52) / 12) + 1
                    }}
                  >
                    {month.month}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Day rows */}
            {DAYS.map((day, dayIndex) => (
              <div key={day} className="flex items-center mb-1">
                <div className="w-10 text-xs text-gray-400">{day}</div>
                <div className="flex-1 grid grid-cols-52 gap-1">
                  {lastYear.flatMap((month) =>
                    month.days
                      .filter(d => d.dayOfWeek === dayIndex)
                      .map((dayData, idx) => (
                        <div
                          key={`${month.month}-${idx}`}
                          className={`w-3 h-3 rounded-sm ${getCellColor(dayData.intensity)}`}
                          title={`${dayData.date}: ${dayData.problemsSolved} problems solved`}
                        />
                      ))
                  )}
                </div>
              </div>
            ))}
            
            {/* Legend */}
            <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
              <div>Learn how we count contributions</div>
              <div className="flex items-center gap-1">
                <span>Less</span>
                <div className={`w-3 h-3 rounded-sm bg-gray-800`}></div>
                <div className={`w-3 h-3 rounded-sm bg-green-900`}></div>
                <div className={`w-3 h-3 rounded-sm bg-green-700`}></div>
                <div className={`w-3 h-3 rounded-sm bg-green-500`}></div>
                <div className={`w-3 h-3 rounded-sm bg-green-300`}></div>
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}