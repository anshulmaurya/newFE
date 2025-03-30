import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface ActivityData {
  [date: string]: number;
}

export default function ActivityHeatmap() {
  const [activityData, setActivityData] = useState<ActivityData>({});
  const [totalSolved, setTotalSolved] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  // Calculate the start of the selected year (January 1st)
  const startDate = new Date(selectedYear, 0, 1);
  // Calculate the end of the selected year (December 31st)
  const endDate = new Date(selectedYear, 11, 31);
  
  // Calculate available years (current year and 2 previous years)
  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];
  
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
        const year = new Date(date).getFullYear();
        
        // Only include activities from the selected year
        if (year === selectedYear) {
          processedData[date] = activity.problemsSolved;
          total += activity.problemsSolved;
        }
      });
      
      setActivityData(processedData);
      setTotalSolved(total);
    }
  }, [userActivity, selectedYear]);
  
  // Define color scale based on number of problems solved
  const colorScale = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  
  // Generate the heatmap data
  const getDaysArray = () => {
    // Create a date object pointing to January 1st of the selected year
    const yearStart = new Date(selectedYear, 0, 1);
    // Get the day of week for January 1st (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = yearStart.getDay();
    
    // Calculate the number of days in the selected year
    const daysInYear = (selectedYear % 4 === 0 && (selectedYear % 100 !== 0 || selectedYear % 400 === 0)) ? 366 : 365;
    
    // Calculate number of weeks needed to display the full year
    // Add 1 week to account for the offset caused by the first day of the year not being a Sunday
    const weeksNeeded = Math.ceil((daysInYear + firstDayOfWeek) / 7);
    
    const days = [];
    // Create 7 rows for each day of the week (0 = Sunday, 6 = Saturday)
    for (let i = 0; i < 7; i++) {
      const row = [];
      // Create cells for each week
      for (let j = 0; j < weeksNeeded; j++) {
        // Calculate the day offset from the start of the year
        // (j * 7) moves us to the correct week
        // (i - firstDayOfWeek) adjusts for the day of the week
        const dayOffset = (j * 7) + i - firstDayOfWeek;
        
        // Create a date for this cell
        const cellDate = new Date(yearStart);
        cellDate.setDate(yearStart.getDate() + dayOffset);
        
        // Skip days outside the selected year
        if (cellDate.getFullYear() !== selectedYear) {
          // Push an empty cell for days outside the year
          row.push({
            date: '',
            value: 0,
            color: 'transparent',
            isToday: false,
            isValid: false
          });
          continue;
        }
        
        const dateKey = cellDate.toISOString().split('T')[0];
        const value = activityData[dateKey] || 0;
        
        // Determine the color based on the value
        let colorIndex = 0;
        if (value > 0) {
          colorIndex = Math.min(Math.floor(value / 2) + 1, 4); // Adjust coloring logic as needed
        }
        
        const today = new Date();
        const isToday = cellDate.getDate() === today.getDate() && 
                       cellDate.getMonth() === today.getMonth() && 
                       cellDate.getFullYear() === today.getFullYear();
        
        row.push({
          date: dateKey,
          value,
          color: colorScale[colorIndex],
          isToday,
          isValid: true
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
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // For each month in the year
    for (let month = 0; month < 12; month++) {
      // Create a date for the first day of the month
      const firstDayOfMonth = new Date(selectedYear, month, 1);
      
      // Get the day of the year (0-indexed)
      const startOfYear = new Date(selectedYear, 0, 1);
      const dayOfYear = Math.floor((firstDayOfMonth.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
      
      // Calculate the week index
      const firstDayOfWeek = startOfYear.getDay(); // 0 = Sunday, 6 = Saturday
      const weekIndex = Math.floor((dayOfYear + firstDayOfWeek) / 7);
      
      months.push({
        name: monthNames[month],
        index: weekIndex
      });
    }
    
    return months;
  };
  
  const monthLabels = getMonthLabels();
  
  // Calculate total weeks in the visualization
  const totalWeeks = daysMatrix[0]?.length || 52;
  
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
        <h2 className="text-white font-medium">{totalSolved} problems solved in {selectedYear}</h2>
        
        {/* Year selector */}
        <div className="flex space-x-2">
          {availableYears.map(year => (
            <Button
              key={year}
              onClick={() => setSelectedYear(year)}
              variant={selectedYear === year ? "default" : "outline"}
              className={`h-7 px-2 py-1 text-xs ${selectedYear === year 
                ? 'bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)] text-black' 
                : 'bg-[rgb(35,35,40)] text-gray-300 hover:bg-[rgb(45,45,50)] hover:text-white'}`}
            >
              {year}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[750px]">
          {/* Month labels */}
          <div className="flex text-xs text-gray-400 mb-1 pl-8 relative">
            {monthLabels.map((month, i) => (
              <div 
                key={i}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${(month.index / totalWeeks) * 100}%` }}
              >
                {month.name}
              </div>
            ))}
          </div>
          
          <div className="flex">
            {/* Day of week labels */}
            <div className="pr-2 flex flex-col justify-around text-xs text-gray-400 h-[90px]">
              <div>Mon</div>
              <div>Wed</div>
              <div>Fri</div>
            </div>
            
            {/* Heatmap grid */}
            <div className="flex-grow">
              <div className="grid grid-rows-7 gap-[2px]">
                {daysMatrix.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-[2px]">
                    {row.map((cell, colIndex) => (
                      cell.isValid ? (
                        <div 
                          key={`${rowIndex}-${colIndex}`} 
                          className={`w-[10px] h-[10px] rounded-sm ${cell.isToday ? 'ring-1 ring-gray-300' : ''}`}
                          style={{ backgroundColor: cell.color }}
                          title={`${cell.date}: ${cell.value} problems solved`}
                        />
                      ) : (
                        <div 
                          key={`${rowIndex}-${colIndex}`} 
                          className="w-[10px] h-[10px]"
                        />
                      )
                    ))}
                  </div>
                ))}
              </div>
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