import React, { useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

// Interface for yearly activity data
interface YearlyActivityData {
  [year: number]: {
    [date: string]: {
      count: number;
      questions: string[];
    }
  };
}

/**
 * Expected API response format for user activity data (all years at once):
 * {
 *   "2023": {
 *     "2023-01-01": {
 *       "count": 2,
 *       "questions": ["Memory Buffer Management", "Thread Synchronization"]
 *     },
 *     // more dates for 2023...
 *   },
 *   "2024": {
 *     // dates for 2024...
 *   },
 *   "2025": {
 *     // dates for 2025...
 *   }
 * }
 */

export default function ActivityHeatmap() {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  // Calculate available years (current year and 2 previous years)
  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];
  
  // Generate mock data for all years (in a real app, this would be fetched from an API)
  // Define today here for global use
  const today = new Date();
  
  const allYearsData = useMemo(() => {
    // List of sample question titles
    const questionTitles = [
      "Memory Buffer Management", 
      "Thread Synchronization", 
      "Pointer Arithmetic", 
      "Stack Implementation", 
      "Queue with Arrays", 
      "RTOS Task Creation", 
      "Linux Semaphores",
      "C++ Smart Pointers",
      "Mutex Implementation",
      "Signal Handling",
      "Device Driver Basics",
      "Interrupt Handling",
      "Power Management States",
      "Memory Leak Detection",
      "Task Scheduling Algorithm"
    ];
    
    const yearlyData: YearlyActivityData = {};
    
    // Generate data for each available year
    availableYears.forEach(year => {
      yearlyData[year] = {};
      
      // Start and end dates for this year
      const yearStart = new Date(year, 0, 1);
      const yearEnd = year === currentYear ? new Date() : new Date(year, 11, 31);
      
      // Add active days
      const daysToGenerate = year === currentYear ? 100 : 150;
      
      for (let i = 0; i < daysToGenerate; i++) {
        // Create a random date within the year
        const randomDay = new Date(yearStart);
        const daysInYear = (year === currentYear) 
          ? Math.floor((today.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24))
          : 364;
        
        randomDay.setDate(randomDay.getDate() + Math.floor(Math.random() * daysInYear));
        
        // Make sure date is within bounds
        if (randomDay > yearEnd) continue;
        
        const dateKey = randomDay.toISOString().split('T')[0];
        
        // If we already have data for this date, skip
        if (yearlyData[year][dateKey]) continue;
        
        // Random number of problems solved (1-12)
        const count = Math.floor(Math.random() * 12) + 1;
        
        // Select random questions
        const questions = [];
        const questionCount = Math.min(count, questionTitles.length);
        
        // Shuffle and pick questions
        const shuffled = [...questionTitles].sort(() => 0.5 - Math.random());
        for (let j = 0; j < questionCount; j++) {
          questions.push(shuffled[j]);
        }
        
        yearlyData[year][dateKey] = {
          count,
          questions
        };
      }
    });
    
    return yearlyData;
  }, [availableYears, currentYear, today]);
  
  // Calculate the total problems solved for the selected year
  const totalSolved = useMemo(() => {
    if (!allYearsData[selectedYear]) return 0;
    
    return Object.values(allYearsData[selectedYear]).reduce((sum, day) => sum + day.count, 0);
  }, [allYearsData, selectedYear]);
  
  // For loading state
  if (Object.keys(allYearsData).length === 0) {
    return (
      <div className="rounded-lg bg-[rgb(24,24,27)] p-4 mb-4">
        <Skeleton className="h-6 w-48 mb-4 bg-[rgb(35,35,40)]" />
        <Skeleton className="h-36 w-full bg-[rgb(35,35,40)]" />
      </div>
    );
  }

  // Get all dates in the year for the calendar
  const getDatesInYear = (year: number) => {
    const dates = [];
    const today = new Date();
    const endDate = year === currentYear ? today : new Date(year, 11, 31);
    
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        if (date <= endDate) {
          dates.push(date);
        }
      }
    }
    return dates;
  };
  
  // Function to get color based on count
  const getColorForCount = (count: number) => {
    if (count === 0) return '#161b22';
    if (count >= 1 && count <= 4) return '#0e4429';
    if (count >= 5 && count <= 9) return '#26a641';
    return '#39d353'; // 10+
  };
  
  // Create calendar grid
  const renderCalendar = () => {
    const dates = getDatesInYear(selectedYear);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Group dates by week, starting each column on the same day of week
    const weeks: Date[][] = [];
    
    // Initialize an array of 7 weeks (columns)
    for (let i = 0; i < 7; i++) {
      weeks.push([]);
    }
    
    // Distribute dates into the appropriate day column
    // This ensures consistent vertical alignment regardless of year
    dates.forEach(date => {
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...
      weeks[dayOfWeek].push(date);
    });
    
    return (
      <div className="mt-4">
        {/* Month labels */}
        <div className="flex text-xs text-gray-400 mb-1 pl-12">
          {months.map((month, i) => (
            <div key={month} className="flex-1 text-center">{month}</div>
          ))}
        </div>
        
        <div className="flex">
          {/* Calendar cells */}
          <div className="flex-1 grid" style={{ gridTemplateColumns: 'repeat(52, minmax(0, 1fr))' , gap: '2px' }}>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((date, dateIndex) => {
                  if (!date) return <div key={`empty-${dateIndex}`} className="w-3 h-3"></div>;
                  
                  const dateKey = date.toISOString().split('T')[0];
                  const dayData = allYearsData[selectedYear]?.[dateKey];
                  const count = dayData?.count || 0;
                  const questions = dayData?.questions || [];
                  
                  // Format date for hover: Weekday, MM/DD/YYYY
                  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  const weekday = weekdays[date.getDay()];
                  const month = date.getMonth() + 1; // getMonth() is 0-based
                  const day = date.getDate();
                  const year = date.getFullYear();
                  const formattedDate = `${weekday} : ${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
                  
                  return (
                    <div
                      key={dateKey}
                      className="w-3 h-3 rounded-sm cursor-pointer relative group"
                      style={{ backgroundColor: getColorForCount(count) }}
                      title={`${formattedDate}: ${count} questions solved`}
                    >
                      {count > 0 && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[rgb(35,35,40)] p-2 rounded-md text-xs shadow-lg text-white z-10 w-48 hidden group-hover:block pointer-events-none">
                          <p className="font-semibold">{formattedDate}</p>
                          <p>{count} questions solved</p>
                          <ul className="mt-1 list-disc pl-4">
                            {questions.map((q, i) => (
                              <li key={i} className="truncate">{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end mt-2 text-xs text-gray-400">
          <span>Less</span>
          <div className="flex items-center mx-2">
            <div className="w-3 h-3 mx-[1px]" style={{ backgroundColor: '#161b22' }}></div>
            <div className="w-3 h-3 mx-[1px]" style={{ backgroundColor: '#0e4429' }}></div>
            <div className="w-3 h-3 mx-[1px]" style={{ backgroundColor: '#26a641' }}></div>
            <div className="w-3 h-3 mx-[1px]" style={{ backgroundColor: '#39d353' }}></div>
          </div>
          <span>More</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="rounded-lg bg-[rgb(24,24,27)] p-4 mb-4">
      <div className="flex items-center justify-between">
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
        <div className="min-w-[800px]">
          {renderCalendar()}
        </div>
      </div>
    </div>
  );
}