import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Calendar from 'react-github-contribution-calendar';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActivityData {
  [date: string]: {
    count: number;
    questions: string[];
  };
}

// Sample activity data format - this would come from the API in production
// The API should return data in this format:
// {
//   "2023-01-01": {
//     "count": 2,
//     "questions": ["Memory Buffer Management", "Thread Synchronization"]
//   },
//   "2023-01-02": {
//     "count": 5,
//     "questions": ["Pointer Arithmetic", "Stack Implementation", "Queue with Arrays", "RTOS Task Creation", "Linux Semaphores"]
//   }
// }

export default function ActivityHeatmap() {
  const [activityData, setActivityData] = useState<ActivityData>({});
  const [formattedData, setFormattedData] = useState<{[key: string]: number}>({});
  const [totalSolved, setTotalSolved] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  // Calculate available years (current year and 2 previous years)
  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];
  
  // Calculate the end date (today or last day of selected year)
  const today = new Date();
  const endDate = selectedYear === currentYear 
    ? today
    : new Date(selectedYear, 11, 31); // December 31st of selected year
  
  // Create some mock activity data for demonstration
  useEffect(() => {
    // Generate mock data for the selected year
    const mockData: ActivityData = {};
    let total = 0;
    
    // Generate some random activity for the selected year
    const startDate = new Date(selectedYear, 0, 1); // January 1st
    const endOfYear = new Date(selectedYear, 11, 31); // December 31st
    
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
    
    // Add more active days in recent months
    for (let i = 0; i < 150; i++) {
      // Create a random date within the year
      const randomDay = new Date(startDate);
      randomDay.setDate(randomDay.getDate() + Math.floor(Math.random() * 365));
      
      // Only include dates in the selected year and not in the future
      if (randomDay > today || randomDay > endOfYear) continue;
      
      const dateKey = randomDay.toISOString().split('T')[0];
      
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
      
      mockData[dateKey] = {
        count,
        questions
      };
      
      total += count;
    }
    
    setActivityData(mockData);
    setTotalSolved(total);
    
    // Format data for the calendar component
    const formatted: {[key: string]: number} = {};
    Object.keys(mockData).forEach(date => {
      formatted[date] = mockData[date].count;
    });
    setFormattedData(formatted);
  }, [selectedYear, today]);
  
  // Define color scale based on number of problems solved
  // Light green for 1-4, medium green for 5-9, dark green for 10+
  const panelColors = {
    level0: '#161b22', // empty
    level1: '#0e4429', // 1-4 problems
    level2: '#006d32', // 5-9 problems
    level3: '#26a641', // 10+ problems
    level4: '#39d353'  // Not used, but required by the library
  };
  
  // For loading state
  if (Object.keys(formattedData).length === 0) {
    return (
      <div className="rounded-lg bg-[rgb(24,24,27)] p-4 mb-4">
        <Skeleton className="h-6 w-48 mb-4 bg-[rgb(35,35,40)]" />
        <Skeleton className="h-36 w-full bg-[rgb(35,35,40)]" />
      </div>
    );
  }
  
  // Function to determine tooltip content for a date
  const getTooltipContent = (date: string) => {
    if (!activityData[date]) return "0 problems solved";
    
    const { count, questions } = activityData[date];
    return (
      <div className="max-w-xs">
        <p className="font-medium">{count} problems solved on {new Date(date).toLocaleDateString()}</p>
        <ul className="text-xs mt-1 max-h-48 overflow-auto">
          {questions.map((q, i) => (
            <li key={i} className="mt-1">• {q}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  // Function to transform the count value to color
  const transformDayCount = (count: number) => {
    if (count === 0) return 0;
    if (count >= 1 && count <= 4) return 1;
    if (count >= 5 && count <= 9) return 2;
    return 3; // 10+
  };
  
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
          <TooltipProvider>
            <div className="relative">
              <Calendar 
                values={formattedData}
                until={endDate.toISOString().split('T')[0]}
                transformDayCount={transformDayCount}
                panelColors={panelColors}
                weekNames={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                monthNames={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
                monthLabelAttrs={{
                  'text-anchor': 'start',
                  'dominant-baseline': 'text-before-edge',
                  fontSize: '12px',
                  fill: '#a3a3a3'
                }}
                weekLabelAttrs={{
                  'text-anchor': 'end',
                  'dominant-baseline': 'middle',
                  fontSize: '12px',
                  fill: '#a3a3a3'
                }}
                panelAttributes={(day: string) => ({
                  'data-date': day,
                  rx: '2',
                  ry: '2',
                  'stroke-width': 0
                })}
                renderPanel={(day: string, value: number, fill: string) => {
                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <rect
                          x="0"
                          y="0"
                          width="10"
                          height="10"
                          fill={fill}
                          data-date={day}
                          rx="2"
                          ry="2"
                          stroke-width="0"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {getTooltipContent(day)}
                      </TooltipContent>
                    </Tooltip>
                  );
                }}
              />
            </div>
          </TooltipProvider>
          
          <div className="flex items-center justify-end mt-2 text-xs text-gray-400">
            <span>Less</span>
            <div className="flex items-center mx-2">
              <div className="w-3 h-3 mx-[1px]" style={{ backgroundColor: panelColors.level0 }}></div>
              <div className="w-3 h-3 mx-[1px]" style={{ backgroundColor: panelColors.level1 }}></div>
              <div className="w-3 h-3 mx-[1px]" style={{ backgroundColor: panelColors.level2 }}></div>
              <div className="w-3 h-3 mx-[1px]" style={{ backgroundColor: panelColors.level3 }}></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}