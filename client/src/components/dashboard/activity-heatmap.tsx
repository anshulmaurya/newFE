import React, { useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Calendar from 'react-github-contribution-calendar';

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
  
  // Calculate the end date (today or last day of selected year)
  const today = new Date();
  const endDate = selectedYear === currentYear 
    ? today
    : new Date(selectedYear, 11, 31); // December 31st of selected year
  
  // Generate mock data for all years (in a real app, this would be fetched from an API)
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
  
  // Format data for the selected year for the calendar component
  const formattedData = useMemo(() => {
    if (!allYearsData[selectedYear]) return {};
    
    const formatted: {[key: string]: number} = {};
    Object.entries(allYearsData[selectedYear]).forEach(([date, data]) => {
      formatted[date] = data.count;
    });
    return formatted;
  }, [allYearsData, selectedYear]);
  
  // Define color scale based on number of problems solved
  // Light green for 1-4, medium green for 5-9, dark green for 10+
  const colorScale = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  
  // For loading state
  if (Object.keys(formattedData).length === 0) {
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
          <div className="relative pl-20"> {/* Increased padding from 12px to 20px to show weekday labels */}
            <Calendar 
              values={formattedData}
              until={endDate.toISOString().split('T')[0]}
              panelColors={colorScale}
              weekNames={['', 'Mon', '', 'Wed', '', 'Fri', '']}
              monthNames={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            />
          </div>
          
          <div className="flex items-center justify-end mt-2 text-xs text-gray-400">
            <span>Less</span>
            <div className="flex items-center mx-2">
              <div className="w-3 h-3 mx-[1px]" style={{ backgroundColor: colorScale[0] }}></div>
              <div className="w-3 h-3 mx-[1px]" style={{ backgroundColor: colorScale[1] }}></div>
              <div className="w-3 h-3 mx-[1px]" style={{ backgroundColor: colorScale[2] }}></div>
              <div className="w-3 h-3 mx-[1px]" style={{ backgroundColor: colorScale[3] }}></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}