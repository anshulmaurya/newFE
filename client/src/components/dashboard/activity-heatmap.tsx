import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

// Define the data structure for a single day's activity
interface DayActivity {
  count: number;
  questions: string[];
}

// Interface for year data with a mix of day activities and the total count
interface YearData {
  // This is a record that can store DayActivity objects for date keys
  // or a number for the "total" key
  [key: string]: DayActivity | number;
}

// Interface for yearly activity data
interface YearlyActivityData {
  [year: string]: YearData;
}

/**
 * API response format for user activity data (all years at once):
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
 * API endpoint: https://dspcoder-backend-prod.azurewebsites.net/api/get_user_contribution_heatmap
 * Parameter: username (string)
 */

export default function ActivityHeatmap() {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [allYearsData, setAllYearsData] = useState<YearlyActivityData>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to track if we've already fetched data to prevent multiple API calls
  const didFetchData = useRef<boolean>(false);
  
  // Calculate available years (current year and 2 previous years) - memoized to prevent recalculation
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const availableYears = useMemo(() => [currentYear, currentYear - 1, currentYear - 2], [currentYear]);
  
  // Fetch real activity data from the API - only when the user changes
  useEffect(() => {
    // Function to fetch user activity data
    const fetchUserActivity = async () => {
      // Skip fetching if no username is available
      if (!user?.username) return;
      
      // Only set loading on first fetch
      if (Object.keys(allYearsData).length === 0) {
        setIsLoading(true);
      }
      setError(null);
      
      try {
        // Try to use either stored username or display name if available
        if (!user?.username && !user?.displayName) {
          throw new Error("No username available for API request");
        }
        
        const username = user?.username || 
                         (user?.displayName ? user.displayName.toLowerCase().replace(/\s+/g, '') : '');
        
        // Make the actual API call using POST request with username in the body
        const response = await fetch(
          'https://dspcoder-backend-prod.azurewebsites.net/api/get_user_contribution_heatmap',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username })
          }
        );
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        // Get the raw response text first for debugging
        const responseText = await response.text();
        
        try {
          // Try to parse the JSON response
          const data = JSON.parse(responseText);
          
          // Check if this is empty or has the expected format
          if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            setAllYearsData(data);
          } else {
            throw new Error("Invalid data format from API");
          }
        } catch (jsonError) {
          console.error("Failed to parse API response as JSON:", jsonError);
          throw new Error("Invalid JSON response from API");
        }
      } catch (err) {
        console.error('Error fetching user activity data:', err);
        setError('Failed to load activity data from API. Please try again later.');
        
        // Initialize with empty data for years that matches API format
        const emptyData: YearlyActivityData = {};
        availableYears.forEach(year => {
          // Create empty year data with total = 0 in the format expected from the API
          emptyData[year.toString()] = {
            "total": 0
          };
        });
        
        setAllYearsData(emptyData);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch if we have a user and haven't already fetched the data
    if (user?.username && !didFetchData.current) {
      didFetchData.current = true;
      fetchUserActivity();
    }
  }, [user?.username]);
  
  // Calculate the total problems solved for the selected year
  const totalSolved = useMemo(() => {
    // Convert selectedYear to string since our API data uses string keys
    const yearKey = selectedYear.toString();
    if (!allYearsData[yearKey]) return 0;
    
    // First check if we have a 'total' field directly from the API
    const yearData = allYearsData[yearKey];
    if (yearData && 'total' in yearData) {
      const total = yearData['total'];
      return typeof total === 'number' ? total : 0;
    }
    
    // If not, calculate it by summing up all the daily counts
    // Skip the 'total' key during calculation to avoid double counting
    return Object.entries(allYearsData[yearKey])
      .filter(([key]) => key !== 'total')
      .reduce((sum, [_, day]) => {
        // Check if day is the expected object format with count property
        if (typeof day === 'object' && day && 'count' in day) {
          return sum + day.count;
        }
        return sum;
      }, 0);
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
    
    // Group dates by week
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    // Calculate dates for each week
    // First determine the first Sunday of the year to start the grid
    let startIndex = 0;
    const firstSunday = new Date(selectedYear, 0, 1); // Start with Jan 1
    while (firstSunday.getDay() !== 0) {
      firstSunday.setDate(firstSunday.getDate() + 1);
    }
    
    // Now build the weeks properly
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      
      // Check if this is a Sunday (start of a new week)
      if (date.getDay() === 0 && currentWeek.length > 0) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
      
      // Add the date if it's on or after the first Sunday
      if (date >= firstSunday) {
        currentWeek.push(date);
      }
      
      // Push the last week if we're at the end
      if (i === dates.length - 1 && currentWeek.length > 0) {
        weeks.push([...currentWeek]);
      }
    }
    
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
          <div className="flex-1 grid" style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))' , gap: '2px' }}>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((date, dateIndex) => {
                  if (!date) return <div key={`empty-${dateIndex}`} className="w-3 h-3"></div>;
                  
                  // Format date for API format: YYYY-MM-DD
                  const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
                  const dayStr = date.getDate().toString().padStart(2, '0');
                  const yearStr = date.getFullYear().toString();
                  const dateKey = `${yearStr}-${monthStr}-${dayStr}`;
                  const yearKey = selectedYear.toString();
                  
                  // Get activity data for this specific date
                  const dayData = allYearsData[yearKey]?.[dateKey];
                  
                  // Handle the count and questions properly based on the data type
                  let count = 0;
                  let questions: string[] = [];
                  
                  if (dayData && typeof dayData === 'object' && 'count' in dayData) {
                    count = dayData.count;
                    questions = dayData.questions || [];
                  }
                  
                  // Format date for hover: Weekday, MM/DD/YYYY
                  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  const weekday = weekdays[date.getDay()];
                  const displayMonth = date.getMonth() + 1; // getMonth() is 0-based
                  const displayDay = date.getDate();
                  const displayYear = date.getFullYear();
                  const formattedDate = `${weekday} : ${displayMonth.toString().padStart(2, '0')}/${displayDay.toString().padStart(2, '0')}/${displayYear}`;
                  
                  return (
                    <div
                      key={dateKey}
                      className="w-3 h-3 rounded-sm cursor-pointer relative group"
                      style={{ backgroundColor: getColorForCount(count) }}
                      title={`${formattedDate}: ${count} questions solved`}
                    >
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