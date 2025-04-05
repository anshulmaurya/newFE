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

const TeslaCompanyPage: React.FC = () => {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const { user, darkMode, toggleDarkMode } = useAuth();

  // Fetch problems data for Tesla-specific preparation
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

  // Filter problems specifically for Tesla preparation
  // This would typically come from a specific API endpoint for this company bundle
  const filteredProblems = problems?.slice(0, 7) || [];

  return (
    <DashboardLayout darkMode={darkMode} toggleTheme={toggleDarkMode}>
      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Tesla Interview Preparation</h1>
          </div>

          <div className="bg-[rgb(18,18,20)] p-5 rounded-lg shadow-lg border border-gray-800 mb-6">
            <h2 className="text-lg font-semibold mb-2">Company Overview</h2>
            <p className="text-gray-300 mb-4">
              Tesla's embedded systems interviews focus on automotive systems, real-time control algorithms, and 
              safety-critical software development. Their questions often test both theoretical knowledge and practical 
              implementation skills for automotive-grade embedded systems.
            </p>
            
            <h3 className="font-medium mb-2">Key Focus Areas:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">Technical Skills:</h4>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>AUTOSAR and automotive standards</li>
                  <li>Real-time operating systems</li>
                  <li>CAN, LIN, FlexRay protocols</li>
                  <li>Safety-critical software architecture</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Interview Format:</h4>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>Initial technical screening</li>
                  <li>Deep dive on automotive protocols</li>
                  <li>Control systems design questions</li>
                  <li>System safety and reliability rounds</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-1">Common Questions:</h4>
              <ul className="list-disc pl-5 text-gray-300 space-y-1">
                <li>Implementing fault-tolerant communication systems</li>
                <li>Real-time sensor fusion algorithms</li>
                <li>Battery management system design</li>
                <li>Automotive security and over-the-air updates</li>
              </ul>
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
                <p className="text-gray-400">No problems found for Tesla preparation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeslaCompanyPage;