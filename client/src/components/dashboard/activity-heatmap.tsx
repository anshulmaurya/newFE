import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';

interface ActivityData {
  [date: string]: number;
}

export default function ActivityHeatmap() {
  const [activityData, setActivityData] = useState<ActivityData>({});
  const [totalSolved, setTotalSolved] = useState<number>(0);
  
  // Calculate date range for the last year
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);
  
  // Format dates as ISO strings
  const formattedStartDate = startDate.toISOString().split('T')[0];
  const formattedEndDate = endDate.toISOString().split('T')[0];
  
  // Fetch user activity data
  const { data: userActivity, isLoading } = useQuery({
    queryKey: ['/api/user-activity'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/user-activity');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching user activity:', error);
        return [];
      }
    },
  });
  
  // Process the activity data once it's loaded
  useEffect(() => {
    if (userActivity && userActivity.length > 0) {
      const processedData: ActivityData = {};
      let total = 0;
      
      userActivity.forEach((activity: any) => {
        const date = activity.date.split('T')[0]; // Format: YYYY-MM-DD
        processedData[date] = activity.problemsSolved;
        total += activity.problemsSolved;
      });
      
      setActivityData(processedData);
      setTotalSolved(total);
    }
  }, [userActivity]);
  
  // Define color scale based on number of problems solved
  const colorScale = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  
  // Generate the heatmap data
  const getDaysArray = () => {
    const days = [];
    // Create 7 rows for each day of the week
    for (let i = 0; i < 7; i++) {
      const row = [];
      // Create 52 weeks worth of cells (one year)
      for (let j = 0; j < 52; j++) {
        const cellDate = new Date(endDate);
        // Adjust the date to get the correct day for this cell
        cellDate.setDate(cellDate.getDate() - (endDate.getDay() - i) - (7 * (51 - j)));
        
        const dateKey = cellDate.toISOString().split('T')[0];
        const value = activityData[dateKey] || 0;
        
        // Determine the color based on the value
        let colorIndex = 0;
        if (value > 0) {
          colorIndex = Math.min(Math.floor(value / 2) + 1, 4); // Adjust coloring logic as needed
        }
        
        row.push({
          date: dateKey,
          value,
          color: colorScale[colorIndex],
          isToday: dateKey === endDate.toISOString().split('T')[0]
        });
      }
      days.push(row);
    }
    return days;
  };
  
  const daysMatrix = getDaysArray();
  
  // Get month labels positions
  const getMonthLabels = () => {
    const months = [];
    const currentDate = new Date(endDate);
    currentDate.setDate(1); // Set to first day of current month
    
    // Go back to get first of each month in the last year
    for (let i = 0; i < 12; i++) {
      if (i > 0) {
        currentDate.setMonth(currentDate.getMonth() - 1);
      }
      
      // Calculate the position based on week in the year
      const firstDayDate = new Date(currentDate);
      const startOfYear = new Date(endDate);
      startOfYear.setDate(endDate.getDate() - 364); // 52 weeks * 7 days
      
      const diffTime = firstDayDate.getTime() - startOfYear.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(diffDays / 7);
      
      // Only add if weekIndex is positive and within our 52 weeks range
      if (weekIndex >= 0 && weekIndex < 52) {
        months.unshift({
          name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][currentDate.getMonth()],
          index: weekIndex
        });
      }
    }
    
    return months;
  };
  
  const monthLabels = getMonthLabels();
  
  // For loading state
  if (isLoading) {
    return (
      <div className="rounded-lg bg-[rgb(24,24,27)] p-4 mb-4">
        <Skeleton className="h-6 w-48 mb-4 bg-[rgb(35,35,40)]" />
        <Skeleton className="h-36 w-full bg-[rgb(35,35,40)]" />
      </div>
    );
  }
  
  return (
    <div className="rounded-lg bg-[rgb(24,24,27)] p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-medium">{totalSolved} problems solved in the last year</h2>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[650px]">
          {/* Month labels */}
          <div className="flex text-xs text-gray-400 mb-1 relative pl-8">
            {monthLabels.map((month, i) => (
              <div 
                key={i}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${(month.index / 52) * 100}%` }}
              >
                {month.name}
              </div>
            ))}
          </div>
          
          <div className="flex">
            {/* Day of week labels */}
            <div className="pr-2 flex flex-col justify-start text-xs text-gray-400">
              <div className="h-[14px]">Mon</div>
              <div className="h-[14px] mt-[2px]"></div>
              <div className="h-[14px] mt-[2px]">Wed</div>
              <div className="h-[14px] mt-[2px]"></div>
              <div className="h-[14px] mt-[2px]">Fri</div>
              <div className="h-[14px] mt-[2px]"></div>
            </div>
            
            {/* Heatmap grid */}
            <div className="flex-grow grid grid-rows-7 gap-[2px]">
              {daysMatrix.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-[2px]">
                  {row.map((cell, colIndex) => (
                    <div 
                      key={`${rowIndex}-${colIndex}`} 
                      className={`w-[12px] h-[12px] rounded-sm ${cell.isToday ? 'ring-1 ring-gray-300' : ''}`}
                      style={{ backgroundColor: cell.color }}
                      title={`${cell.date}: ${cell.value} problems solved`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-2 text-xs text-gray-400">
            <span>Less</span>
            <div className="flex items-center mx-2">
              {colorScale.map((color, i) => (
                <div 
                  key={i} 
                  className="w-3 h-3 mx-[1px]" 
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}