import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import ProblemCard from '@/components/dashboard/problem-card';
import { useAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  category: string;
  status?: string;
  notes?: string;
}

const ThreeMonthsPage: React.FC = () => {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const { user, darkMode, toggleDarkMode } = useAuth();

  // Fetch problems data for Three Months study plan
  const { data: problems, error, isLoading } = useQuery<Problem[]>({
    queryKey: ['/api/problems'],
    enabled: true
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load problems. Please try again later.",
      variant: "destructive",
    });
  }

  // Filter problems specifically for the Three Months plan
  // This would typically come from a specific API endpoint for this bundle
  const filteredProblems = problems?.slice(0, 10) || [];

  return (
    <DashboardLayout darkMode={darkMode} toggleTheme={toggleDarkMode}>
      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">3 Months Study Plan</h1>
          </div>

          <div className="bg-[rgb(18,18,20)] p-5 rounded-lg shadow-lg border border-gray-800 mb-6">
            <h2 className="text-lg font-semibold mb-2">Preparation Guide</h2>
            <p className="text-gray-300 mb-4">
              This comprehensive 3-month plan is designed for thorough embedded systems interview preparation.
              It covers all essential topics and provides extensive practice with increasing difficulty.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium mb-1">Week 1-4:</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>Microcontroller architecture</li>
                  <li>C programming deep dive</li>
                  <li>Basics of digital electronics</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-1">Week 5-8:</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>Communication protocols (SPI, I2C, UART)</li>
                  <li>Interrupt handling & Real-time systems</li>
                  <li>Memory management techniques</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-1">Week 9-12:</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>RTOS concepts and implementation</li>
                  <li>Advanced debugging techniques</li>
                  <li>System design challenges</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-1">Final Week:</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>Mock interviews</li>
                  <li>System design practice</li>
                  <li>Resume and portfolio refinement</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[rgb(214,251,65)]"></div>
              </div>
            ) : filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <ProblemCard 
                  key={problem.id}
                  problem={problem}
                  onClick={() => {
                    // Navigate to the problem detail or coding page
                    setLocation(`/coding-environment?id=${problem.id}`);
                  }}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400">No problems found for this bundle.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ThreeMonthsPage;