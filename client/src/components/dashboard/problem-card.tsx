import React from 'react';
import { ArrowRight, CheckCircle, Circle, Clock3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProblemCardProps {
  problem: any;
  index: number;
  statusIcon: React.ReactNode;
  handleSetupCodebase: (problemId: string, questionId?: string) => void;
}

export default function ProblemCard({ problem, index, statusIcon, handleSetupCodebase }: ProblemCardProps) {
  return (
    <div className="bg-[rgb(20,20,22)] rounded-lg border border-[rgb(45,45,50)] hover:border-[rgb(70,70,80)] transition-colors duration-150 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="mr-3 text-xl text-gray-500">{index + 1}</div>
            <div>
              <h3 className="text-base font-medium text-gray-200 mb-1">
                {problem.title || `Problem ${index + 1}`}
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {problem.tags && problem.tags.map((tag: string, tagIdx: number) => (
                  <Badge 
                    key={tagIdx} 
                    className="bg-[rgb(30,30,36)] border-[rgb(50,50,60)] text-gray-300 px-1.5 py-0 text-[10px]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 items-center mt-2">
                <div className="flex items-center">
                  <span className="text-xs text-gray-400 mr-2">Difficulty:</span>
                  <Badge className={cn(
                    "px-1.5 py-0 text-[10px] bg-opacity-10 border",
                    problem.difficulty?.toLowerCase() === 'easy' ? 'bg-green-500 text-green-500 border-green-700' :
                    problem.difficulty?.toLowerCase() === 'medium' ? 'bg-yellow-500 text-yellow-500 border-yellow-700' :
                    problem.difficulty?.toLowerCase() === 'hard' ? 'bg-red-500 text-red-500 border-red-700' :
                    'bg-gray-500 text-gray-400 border-gray-700'
                  )}>
                    {problem.difficulty || 'Unknown'}
                  </Badge>
                </div>
                
                {problem.acceptance_rate && (
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">Acceptance:</span>
                    <div className="text-xs text-gray-300">{problem.acceptance_rate}%</div>
                  </div>
                )}
                
                {problem.companies && problem.companies.length > 0 && (
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">Companies:</span>
                    <div className="group relative inline-block">
                      <div className="flex flex-wrap gap-1">
                        {problem.companies.slice(0, 2).map((company: string, compIdx: number) => (
                          <Badge key={compIdx} className="bg-transparent text-gray-400 border border-gray-700 px-1.5 py-0 text-[10px]">
                            {company}
                          </Badge>
                        ))}
                        
                        {problem.companies.length > 2 && (
                          <Badge className="bg-gray-800 text-gray-300 px-1 py-0 text-[10px] cursor-default">
                            +{problem.companies.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      {problem.companies.length > 2 && (
                        <div className="absolute left-0 bottom-full mb-2 w-auto min-w-32 p-2 bg-[rgb(35,35,40)] rounded shadow-lg z-10 invisible group-hover:visible">
                          <div className="flex flex-col gap-1 text-xs">
                            {problem.companies.map((company: string, compIdx: number) => (
                              <span key={compIdx} className="text-gray-300 whitespace-nowrap">
                                {company}
                              </span>
                            ))}
                          </div>
                          <div className="absolute left-2 -bottom-1 w-2 h-2 bg-[rgb(35,35,40)] transform rotate-45"></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="mb-2">{statusIcon}</div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8 bg-[rgb(30,30,36)] hover:bg-[rgb(40,40,50)] border-[rgb(60,60,70)] text-gray-200"
              onClick={() => handleSetupCodebase(problem.id, problem.question_id)}
            >
              Solve <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get status icon based on problem status
export function getStatusIcon(status: string) {
  switch (status) {
    case 'Solved':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'Attempted':
      return <Clock3 className="h-5 w-5 text-yellow-500" />;
    default:
      return <Circle className="h-5 w-5 text-gray-500 opacity-50" />;
  }
}