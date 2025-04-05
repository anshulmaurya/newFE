import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { Flame, Trophy, Calendar } from "lucide-react";

// Interface for weekly activity data
interface WeeklyActivityData {
  [dayOfWeek: string]: {
    count: number;
    percentage: number;
    date: string;
  };
}

// Get day name from date
const getDayName = (date: Date): string => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
};

// Function to get color based on percentage
const getColorForPercentage = (percentage: number): string => {
  if (percentage === 0) return 'bg-[rgb(28,28,30)]';
  if (percentage < 30) return 'bg-[rgb(43,87,61)]';
  if (percentage < 60) return 'bg-[rgb(63,147,96)]';
  return 'bg-[rgb(214,251,65)]';
};

// Function to get text color based on percentage
const getTextColorForPercentage = (percentage: number): string => {
  return percentage >= 60 ? 'text-black' : 'text-white';
};

export default function WeeklyHeatmap() {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<WeeklyActivityData>({});
  const [mostActiveDay, setMostActiveDay] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get current date info
  const today = useMemo(() => new Date(), []);
  
  // Get the current week's dates (Sun to Sat)
  const weekDates = useMemo(() => {
    const dates = [];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Go to Sunday
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [today]);
  
  // Fetch user activity data for the week
  const { data: activityData, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['/api/user-activity'],
    queryFn: async () => {
      try {
        // Calculate the date range for the week
        const startOfWeek = new Date(weekDates[0]);
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(weekDates[6]);
        endOfWeek.setHours(23, 59, 59, 999);
        
        // Format dates for API query
        const fromDate = startOfWeek.toISOString().split('T')[0];
        const toDate = endOfWeek.toISOString().split('T')[0];
        
        const response = await apiRequest('GET', `/api/user-activity?from=${fromDate}&to=${toDate}`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching weekly activity data:", error);
        return [];
      }
    },
    enabled: !!user,
  });

  // Process activity data to create weekly heatmap data
  useEffect(() => {
    if (!activityData || isLoadingActivity) return;
    
    // Initialize empty data structure for the week
    const initialWeeklyData: WeeklyActivityData = {};
    
    // Initialize with zero counts for all days of the week
    weekDates.forEach(date => {
      const dayName = getDayName(date);
      const dateStr = date.toISOString().split('T')[0];
      initialWeeklyData[dayName] = {
        count: 0,
        percentage: 0,
        date: dateStr
      };
    });
    
    // Populate with actual data
    if (Array.isArray(activityData)) {
      // Track max problems solved in a day for percentage calculation
      let maxProblemsInDay = 0;
      
      // Fill in actual counts from activity data
      activityData.forEach(activity => {
        const activityDate = new Date(activity.date);
        const dayName = getDayName(activityDate);
        
        if (initialWeeklyData[dayName]) {
          initialWeeklyData[dayName].count = activity.problemsSolved || 0;
          
          // Keep track of maximum problems solved in a day
          if (activity.problemsSolved > maxProblemsInDay) {
            maxProblemsInDay = activity.problemsSolved;
          }
        }
      });
      
      // Calculate percentages based on max problems
      if (maxProblemsInDay > 0) {
        Object.keys(initialWeeklyData).forEach(day => {
          initialWeeklyData[day].percentage = Math.round((initialWeeklyData[day].count / maxProblemsInDay) * 100);
        });
      }
      
      // Find the most active day
      let highestPercentage = 0;
      let mostActive = null;
      
      Object.entries(initialWeeklyData).forEach(([day, data]) => {
        if (data.percentage > highestPercentage) {
          highestPercentage = data.percentage;
          mostActive = day;
        }
      });
      
      setMostActiveDay(mostActive);
    }
    
    setWeeklyData(initialWeeklyData);
    setIsLoading(false);
  }, [activityData, isLoadingActivity, weekDates]);

  if (isLoading || isLoadingActivity) {
    return (
      <Card className="border border-[rgb(35,35,40)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full bg-[rgb(35,35,40)]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-[rgb(35,35,40)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-base">Weekly Activity</CardTitle>
        <CardDescription className="text-gray-400 text-xs">
          Your weekly coding activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
              const data = weeklyData[day] || { count: 0, percentage: 0, date: '' };
              const bgColor = getColorForPercentage(data.percentage);
              const textColor = getTextColorForPercentage(data.percentage);
              
              return (
                <div
                  key={day}
                  className={`p-2 rounded-md text-center ${bgColor}`}
                  title={`${day}: ${data.count} problems solved (${data.date})`}
                >
                  <div className={`text-sm font-medium ${textColor}`}>{day}</div>
                  <div className={`text-xs ${textColor}`}>
                    {data.percentage > 0 ? `${data.percentage}%` : '-'}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-xs text-gray-400 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {mostActiveDay 
              ? `You're most active on ${mostActiveDay}s. Keep up the good work!` 
              : "Try solving problems throughout the week for consistent progress."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}