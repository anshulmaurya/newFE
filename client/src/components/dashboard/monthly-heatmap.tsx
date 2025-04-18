import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// Interface for monthly activity data
interface MonthlyActivityData {
  [date: string]: {
    count: number;
    percentage: number;
    isActive: boolean; // Flag to track if user logged in on this day
  };
}

// Interface for user stats
interface UserStats {
  id: number;
  userId: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalAttempted: number;
  currentStreak: number;
  longestStreak: number;
  dailyGoal: number;
  lastActiveDate: string;
  updatedAt: string;
}

// Function to get color based on count and daily goal - using Emerald Green gradient
const getColorForCount = (count: number, dailyGoal: number): string => {
  if (count === 0) return 'bg-[rgb(32,32,36)]'; // Original dark shade - no activity
  
  // Calculate percentage of daily goal
  const percentComplete = Math.min(count / dailyGoal, 1);
  
  if (percentComplete <= 0.25) {
    return 'bg-[rgb(6,78,59)]'; // Emerald dark - 25% of goal
  } else if (percentComplete <= 0.5) {
    return 'bg-[rgb(5,150,105)]'; // Emerald medium - 50% of goal
  } else if (percentComplete <= 0.75) {
    return 'bg-[rgb(52,211,153)]'; // Emerald light - 75% of goal
  } else {
    return 'bg-[rgb(167,243,208)]'; // Mint - 100% of goal
  }
};

// Function to get text color based on count and daily goal (for Emerald Green gradient)
const getTextColorForCount = (count: number, dailyGoal: number): string => {
  if (count === 0) return 'text-gray-400';
  const percentComplete = Math.min(count / dailyGoal, 1);
  
  // For darker Emerald backgrounds (lower percentages), use white text
  if (percentComplete <= 0.5) {
    return 'text-white';
  }
  // For lighter Emerald backgrounds (higher percentages), use dark text
  return 'text-gray-900';
};

// Function to get text color for the count indicator
const getCountTextColor = (count: number, dailyGoal: number): string => {
  const percentComplete = Math.min(count / dailyGoal, 1);
  
  // For darker Emerald backgrounds (lower percentages), use white text
  if (percentComplete <= 0.5) {
    return 'text-white';
  }
  // For lighter Emerald backgrounds (higher percentages), use dark text
  return 'text-gray-900';
};

// Function to check if date is today
const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

// Format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get month name
const getMonthName = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long' });
};

export default function MonthlyHeatmap() {
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState<MonthlyActivityData>({});
  const [mostActiveDate, setMostActiveDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Fetch user stats to get daily goal and last active date
  const { data: userStats, isLoading: isLoadingStats } = useQuery<UserStats>({
    queryKey: ['/api/user-stats-record'],
    enabled: !!user,
  });
  
  // Calculate first and last day of month
  const firstDayOfMonth = useMemo(() => {
    const first = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    return first;
  }, [currentMonth]);
  
  const lastDayOfMonth = useMemo(() => {
    const last = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    return last;
  }, [currentMonth]);
  
  // Get number of days in the month
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // Create array of dates for the calendar
  const monthDates = useMemo(() => {
    const dates = [];
    // Add dates from previous month to fill first week
    const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthLastDay - firstDayOfWeek + i + 1);
      dates.push({ date: prevDate, currentMonth: false });
    }
    // Add dates from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      dates.push({ date, currentMonth: true });
    }
    // Add dates from next month to fill last week
    const remainingDays = (7 - (dates.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i);
      dates.push({ date: nextDate, currentMonth: false });
    }
    return dates;
  }, [currentMonth, daysInMonth, firstDayOfWeek]);
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    
    // Don't allow going back more than 3 months from current date
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    
    if (prevMonth >= threeMonthsAgo) {
      setCurrentMonth(prevMonth);
    }
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    // Don't allow going beyond current month
    const today = new Date();
    if (nextMonth <= today) {
      setCurrentMonth(nextMonth);
    }
  };
  
  // Check if previous navigation is disabled
  const isPrevDisabled = useMemo(() => {
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    
    const firstOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const firstOfThreeMonthsAgo = new Date(threeMonthsAgo.getFullYear(), threeMonthsAgo.getMonth(), 1);
    
    return firstOfCurrentMonth <= firstOfThreeMonthsAgo;
  }, [currentMonth]);
  
  // Check if next navigation is disabled
  const isNextDisabled = useMemo(() => {
    const today = new Date();
    const firstOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const firstOfCurrentMonthActual = new Date(today.getFullYear(), today.getMonth(), 1);
    
    return firstOfCurrentMonth >= firstOfCurrentMonthActual;
  }, [currentMonth]);
  
  // Fetch user activity data for the month using the new monthly-activity endpoint
  const { data: monthlyActivityData, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['/api/monthly-activity', currentMonth.getMonth() + 1, currentMonth.getFullYear()],
    queryFn: async () => {
      try {
        // Get the month and year
        const month = currentMonth.getMonth() + 1; // 1-12
        const year = currentMonth.getFullYear();
        
        // Use the new endpoint that handles date conversion and includes most active date
        const response = await apiRequest('GET', `/api/monthly-activity?month=${month}&year=${year}`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching monthly activity data:", error);
        return { activities: [], mostActiveDate: null };
      }
    },
    enabled: true, // Enable for all users, API handles auth check
  });

  // Process activity data to create monthly heatmap data
  useEffect(() => {
    // Initialize empty data structure for the month
    const initialMonthlyData: MonthlyActivityData = {};
    
    // Get the user's last active date (for login tracking)
    const lastActiveDate = userStats?.lastActiveDate ? new Date(userStats.lastActiveDate) : null;
    
    // Initialize with zero counts for all days of the month
    monthDates.forEach(({ date, currentMonth }) => {
      if (currentMonth) {
        const dateStr = formatDate(date);
        const isUserActiveOnThisDay = lastActiveDate ? 
          formatDate(lastActiveDate) === dateStr : false;
        
        initialMonthlyData[dateStr] = {
          count: 0,
          percentage: 0,
          isActive: isUserActiveOnThisDay
        };
      }
    });
    
    // Default max count if no real data is available
    const maxCount = 7; 
    
    // Check if we have real data from the API
    if (monthlyActivityData && 
        monthlyActivityData.activities && 
        Array.isArray(monthlyActivityData.activities) && 
        monthlyActivityData.activities.length > 0 &&
        !isLoadingActivity) {
      
      // Populate with actual data from API response
      let maxProblemsInDay = 0;
      
      // Fill in actual counts from activity data
      monthlyActivityData.activities.forEach((activity: { date: string; problemsSolved: number }) => {
        const dateStr = activity.date.split('T')[0];
        
        if (initialMonthlyData[dateStr]) {
          initialMonthlyData[dateStr].count = activity.problemsSolved || 0;
          
          // Keep track of maximum problems solved in a day
          if (activity.problemsSolved > maxProblemsInDay) {
            maxProblemsInDay = activity.problemsSolved;
          }
        }
      });
      
      // Ensure we have at least 1 for percentage calculations
      maxProblemsInDay = Math.max(maxProblemsInDay, 1);
      
      // Calculate percentages based on max problems
      Object.keys(initialMonthlyData).forEach(date => {
        initialMonthlyData[date].percentage = Math.round((initialMonthlyData[date].count / maxProblemsInDay) * 100);
      });
      
      // Use most active date from API response if available
      if (monthlyActivityData.mostActiveDate) {
        setMostActiveDate(monthlyActivityData.mostActiveDate.toString().split('T')[0]);
      }
    } else {
      // Keep all days with zero counts when no activity data exists
      // We won't generate dummy data to avoid confusing users
      Object.keys(initialMonthlyData).forEach(date => {
        initialMonthlyData[date].count = 0;
        initialMonthlyData[date].percentage = 0;
        // Keep the isActive flag as is
      });
      
      // No most active date when there's no activity
      setMostActiveDate(null);
    }
    
    // Update the component state
    setMonthlyData(initialMonthlyData);
    setIsLoading(false);
  }, [monthlyActivityData, isLoadingActivity, monthDates, userStats]);

  // Loading state
  if (isLoading || isLoadingActivity || isLoadingStats) {
    return (
      <div className="p-3 h-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white text-base font-semibold">Monthly Activity</h3>
          <span className="text-[11px] text-gray-300">Loading data...</span>
        </div>
        <Skeleton className="h-16 w-full bg-[rgb(32,32,36)]" />
      </div>
    );
  }

  return (
    <div className="p-3 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white text-base font-semibold">Monthly Activity</h3>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={goToPreviousMonth}
            disabled={isPrevDisabled}
            className={`p-0.5 rounded-full hover:bg-gray-800 ${isPrevDisabled ? 'text-gray-600' : 'text-gray-300 hover:text-white'}`}
            title="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="text-sm text-gray-200 font-medium">
            {getMonthName(currentMonth)} {currentMonth.getFullYear()}
          </span>
          
          <button 
            onClick={goToNextMonth}
            disabled={isNextDisabled}
            className={`p-0.5 rounded-full hover:bg-gray-800 ${isNextDisabled ? 'text-gray-600' : 'text-gray-300 hover:text-white'}`}
            title="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-[1px]">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="text-[10px] text-gray-400 text-center font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[1px] flex-1">
        {monthDates.map(({ date, currentMonth }, index) => {
          const dateStr = formatDate(date);
          const data = currentMonth && monthlyData[dateStr] 
            ? monthlyData[dateStr] 
            : { count: 0, percentage: 0, isActive: false };
          
          // Get daily goal from user stats (default to 3 if not available)
          const dailyGoal = userStats?.dailyGoal || 3;
          
          // Determine background color based on count and daily goal
          const bgColor = currentMonth ? getColorForCount(data.count, dailyGoal) : 'bg-[rgb(20,24,23)]';
          const textColor = currentMonth ? getTextColorForCount(data.count, dailyGoal) : 'text-gray-500';
          const opacity = currentMonth ? 'opacity-100' : 'opacity-40';
          
          // Check if the date is today for highlighting
          const isDateToday = isToday(date);
          
          // Create subtle indicator for login days
          const loginIndicator = data.isActive && currentMonth ? 'after:content-[""] after:absolute after:right-1 after:top-1 after:h-1.5 after:w-1.5 after:rounded-full after:bg-emerald-400' : '';
          
          // Create subtle highlight for today's date with matching emerald theme
          const todayHighlight = isDateToday ? 'ring-2 ring-emerald-300 ring-opacity-60' : '';
          
          return (
            <div
              key={index}
              className={`h-8 w-full ${bgColor} ${opacity} ${loginIndicator} ${todayHighlight} rounded-sm flex items-center justify-center relative transition-colors`}
              title={currentMonth ? `${dateStr}: ${data.count} problems solved${data.isActive ? ' (Logged in)' : ''}` : dateStr}
            >
              <div className={`text-[11px] leading-none font-medium ${textColor}`}>
                {date.getDate()}
              </div>
              {currentMonth && data.count > 0 && (
                <div className="absolute bottom-1 right-1">
                  <span className={`text-[8px] font-medium ${getCountTextColor(data.count, dailyGoal)}`}>
                    {data.count}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {mostActiveDate && (
        <div className="mt-2 text-[10px] text-gray-400 flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          Most active: {new Date(mostActiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} with {monthlyData[mostActiveDate].count} problems
        </div>
      )}
    </div>
  );
}