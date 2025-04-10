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
  };
}

// Function to get color based on count
const getColorForCount = (count: number): string => {
  if (count === 0) return 'bg-[rgb(28,28,30)]';
  if (count < 2) return 'bg-[rgb(43,87,61)]';
  if (count < 4) return 'bg-[rgb(63,147,96)]';
  return 'bg-[rgb(214,251,65)]';
};

// Function to get text color based on count
const getTextColorForCount = (count: number): string => {
  return count >= 4 ? 'text-black' : 'text-white';
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
  
  // Fetch user activity data for the month
  const { data: activityData, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['/api/user-activity', formatDate(firstDayOfMonth), formatDate(lastDayOfMonth)],
    queryFn: async () => {
      try {
        // Format dates for API query
        const fromDate = formatDate(firstDayOfMonth);
        const toDate = formatDate(lastDayOfMonth);
        
        const response = await apiRequest('GET', `/api/user-activity?from=${fromDate}&to=${toDate}`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching monthly activity data:", error);
        return [];
      }
    },
    enabled: !!user,
  });

  // Process activity data to create monthly heatmap data
  useEffect(() => {
    if (!activityData || isLoadingActivity) return;
    
    // Initialize empty data structure for the month
    const initialMonthlyData: MonthlyActivityData = {};
    
    // Initialize with zero counts for all days of the month
    monthDates.forEach(({ date, currentMonth }) => {
      if (currentMonth) {
        const dateStr = formatDate(date);
        initialMonthlyData[dateStr] = {
          count: 0,
          percentage: 0
        };
      }
    });
    
    // Populate with actual data
    if (Array.isArray(activityData)) {
      // Track max problems solved in a day for percentage calculation
      let maxProblemsInDay = 0;
      
      // Fill in actual counts from activity data
      activityData.forEach(activity => {
        const dateStr = activity.date.split('T')[0];
        
        if (initialMonthlyData[dateStr]) {
          initialMonthlyData[dateStr].count = activity.problemsSolved || 0;
          
          // Keep track of maximum problems solved in a day
          if (activity.problemsSolved > maxProblemsInDay) {
            maxProblemsInDay = activity.problemsSolved;
          }
        }
      });
      
      // Calculate percentages based on max problems
      if (maxProblemsInDay > 0) {
        Object.keys(initialMonthlyData).forEach(date => {
          initialMonthlyData[date].percentage = Math.round((initialMonthlyData[date].count / maxProblemsInDay) * 100);
        });
      }
      
      // Find the most active date
      let highestCount = 0;
      let mostActive = null;
      
      Object.entries(initialMonthlyData).forEach(([date, data]) => {
        if (data.count > highestCount) {
          highestCount = data.count;
          mostActive = date;
        }
      });
      
      setMostActiveDate(mostActive);
    }
    
    setMonthlyData(initialMonthlyData);
    setIsLoading(false);
  }, [activityData, isLoadingActivity, monthDates]);

  // Loading state
  if (isLoading || isLoadingActivity) {
    return (
      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white text-xs font-medium">Monthly Activity</h3>
          <span className="text-xs text-gray-400">Loading activity data...</span>
        </div>
        <Skeleton className="h-24 w-full bg-[rgb(35,35,40)]" />
        <Skeleton className="h-3 w-3/4 mt-2 bg-[rgb(35,35,40)]" />
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white text-xs font-medium">Monthly Activity</h3>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={goToPreviousMonth}
            disabled={isPrevDisabled}
            className={`p-0.5 rounded ${isPrevDisabled ? 'text-gray-600' : 'text-gray-400 hover:text-white'}`}
            title="Previous month"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          
          <span className="text-xs text-gray-300">
            {getMonthName(currentMonth)} {currentMonth.getFullYear()}
          </span>
          
          <button 
            onClick={goToNextMonth}
            disabled={isNextDisabled}
            className={`p-0.5 rounded ${isNextDisabled ? 'text-gray-600' : 'text-gray-400 hover:text-white'}`}
            title="Next month"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="text-[9px] text-gray-400 text-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {monthDates.map(({ date, currentMonth }, index) => {
          const dateStr = formatDate(date);
          const data = currentMonth && monthlyData[dateStr] 
            ? monthlyData[dateStr] 
            : { count: 0, percentage: 0 };
          
          const bgColor = currentMonth ? getColorForCount(data.count) : 'bg-[rgb(22,22,24)]';
          const textColor = currentMonth && data.count >= 4 ? 'text-black' : 'text-gray-400';
          const opacity = currentMonth ? 'opacity-100' : 'opacity-50';
          
          return (
            <div
              key={index}
              className={`p-0.5 w-6 h-6 ${bgColor} ${opacity} rounded flex flex-col items-center justify-center`}
              title={currentMonth ? `${dateStr}: ${data.count} problems solved` : dateStr}
            >
              <div className={`text-[9px] font-medium ${textColor}`}>
                {date.getDate()}
              </div>
              {currentMonth && data.count > 0 && (
                <div className={`text-[7px] ${textColor}`}>
                  {data.count}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-2 text-[9px] text-gray-400 flex items-center">
        <Calendar className="h-2.5 w-2.5 mr-1" />
        {mostActiveDate 
          ? `Most active: ${new Date(mostActiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} with ${monthlyData[mostActiveDate].count} problems` 
          : "Solve problems regularly for better progress tracking."}
      </div>
    </div>
  );
}