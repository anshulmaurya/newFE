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

const OneWeekPage: React.FC = () => {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const { user, darkMode, toggleDarkMode } = useAuth();

  // Fetch problems data for One Week study plan
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

  // Filter problems specifically for the One Week plan
  // This would typically come from a specific API endpoint for this bundle
  const filteredProblems = problems?.slice(0, 5) || [];

  return (
    <DashboardLayout darkMode={darkMode} toggleTheme={toggleDarkMode}>
      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">1 Week Study Plan</h1>
          </div>

          <div className="bg-[rgb(18,18,20)] p-5 rounded-lg shadow-lg border border-gray-800 mb-6">
            <h2 className="text-lg font-semibold mb-2">Preparation Guide</h2>
            <p className="text-gray-300 mb-4">
              This intensive 1-week plan is designed for last-minute embedded systems interview preparation.
              It focuses on the most crucial topics and highest-probability questions to maximize your readiness.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium mb-1">Day 1-2:</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>Essential C programming review</li>
                  <li>Pointers and memory management</li>
                  <li>Common embedded interview questions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-1">Day 3-4:</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>Interrupt handling and prioritization</li>
                  <li>Key communication protocols</li>
                  <li>Critical embedded patterns</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-1">Day 5-6:</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>Practice problems with solutions</li>
                  <li>Mock interview exercises</li>
                  <li>Quick system design practice</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-1">Day 7:</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>Final review of weak areas</li>
                  <li>Common pitfalls to avoid</li>
                  <li>Interview mindset preparation</li>
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

export default OneWeekPage;