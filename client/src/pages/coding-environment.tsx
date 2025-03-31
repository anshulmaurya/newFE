import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Code, 
  AlertTriangle, 
  Maximize2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animation-utils';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProblemDescription {
  id: string;
  title: string;
  difficulty: string;
  type: string;
  tags: string[];
  companies: string[];
  file_path: string;
  likes: number;
  dislikes: number;
  successful_submissions: number;
  failed_submissions: number;
  acceptance_rate: number;
  importance: string;
  question_id: string;
  readme: string;
  solution: string;
}

interface ProblemDescriptionResponse {
  status: string;
  message: string;
  data: ProblemDescription;
}

export default function CodingEnvironment() {
  const [, setLocation] = useLocation();
  const [containerUrl, setContainerUrl] = useState<string | null>(null);
  const [problemId, setProblemId] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Extract params from URL
    const queryParams = new URLSearchParams(window.location.search);
    
    const urlParam = queryParams.get('containerUrl');
    const idParam = queryParams.get('problemId');
    const qIdParam = queryParams.get('questionId');
    
    if (urlParam) {
      setContainerUrl(decodeURIComponent(urlParam));
    }
    
    if (idParam) {
      setProblemId(idParam);
    }

    if (qIdParam) {
      setQuestionId(qIdParam);
    }
  }, []);
  
  // Fetch problem description from the external API
  const { data: problemDescription, isLoading: isLoadingDescription } = useQuery<ProblemDescriptionResponse>({
    queryKey: ['problemDescription', questionId],
    queryFn: async () => {
      if (!questionId) {
        // Try to get question_id from MongoDB problem data
        const problemRes = await fetch(`/api/problems/${problemId}`);
        if (problemRes.ok) {
          const problemData = await problemRes.json();
          if (problemData.question_id) {
            setQuestionId(problemData.question_id);
            const descRes = await fetch(`https://dspcoder-backend-prod.azurewebsites.net/api/get_problem_description_by_question_id?question_id=${problemData.question_id}`);
            if (!descRes.ok) throw new Error('Failed to fetch problem description');
            return descRes.json();
          }
        }
        throw new Error('Question ID not available');
      }
      
      const res = await fetch(`https://dspcoder-backend-prod.azurewebsites.net/api/get_problem_description_by_question_id?question_id=${questionId}`);
      if (!res.ok) throw new Error('Failed to fetch problem description');
      return res.json();
    },
    enabled: !!questionId || !!problemId,
  });
  
  const refreshIframe = () => {
    if (iframeRef.current && iframeRef.current.src) {
      iframeRef.current.src = iframeRef.current.src;
      toast({
        title: "Refreshing workspace",
        description: "The coding environment is being refreshed",
        variant: "default",
      });
    }
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setIsPanelCollapsed(false);
  };
  
  const togglePanel = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };
  
  const goBack = () => {
    // Go back to problem detail page if we have a problem ID, otherwise to dashboard
    if (problemId) {
      setLocation(`/problems/${problemId}`);
    } else {
      setLocation('/dashboard');
    }
  };

  // Function to get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-500/15 text-green-500 hover:bg-green-500/20';
      case 'medium': return 'bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/20';
      case 'hard': return 'bg-red-500/15 text-red-500 hover:bg-red-500/20';
      default: return 'bg-green-500/15 text-green-500 hover:bg-green-500/20';
    }
  };
  
  const problem = problemDescription?.data;
  
  return (
    <motion.div 
      variants={fadeIn("up")} 
      initial="hidden" 
      animate="show"
      className="flex flex-col w-full h-screen overflow-hidden"
    >
      {/* Top controls - only visible when not in fullscreen */}
      {!isFullscreen && (
        <div className="flex items-center justify-between p-2 border-b bg-[#1E1E1E] text-white">
          <Button 
            variant="ghost" 
            onClick={goBack}
            className="gap-2 hover:bg-[#2D2D2D]"
          >
            <ArrowLeft className="h-4 w-4" /> 
            Back
          </Button>
          
          <div className="flex-1 text-center font-medium truncate px-4">
            {isLoadingDescription ? (
              <Skeleton className="h-5 w-64 mx-auto" />
            ) : (
              problem?.title || "Coding Environment"
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={refreshIframe} className="gap-1 hover:bg-[#2D2D2D]">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="gap-1 hover:bg-[#2D2D2D]">
              <Maximize2 className="h-3.5 w-3.5" />
              Fullscreen
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex flex-grow overflow-hidden">
        {/* Left Panel - Problem Description (collapsible) */}
        {(!isFullscreen || isFullscreen && !isPanelCollapsed) && (
          <div className={cn(
            "flex flex-col bg-[#252526] text-white border-r border-[#1E1E1E]",
            isPanelCollapsed ? "w-0" : isFullscreen ? "w-1/3" : "w-2/5"
          )}>
            <div className={cn(
              "h-full flex flex-col",
              isPanelCollapsed && "hidden"
            )}>
              <div className="p-3 border-b border-[#1E1E1E] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-medium text-lg">
                    <Code className="h-4 w-4 text-gray-400" />
                    {isLoadingDescription ? (
                      <Skeleton className="h-7 w-48" />
                    ) : (
                      problem?.title || "Loading problem..."
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={togglePanel}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
                
                {isLoadingDescription ? (
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ) : problem && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                    
                    {problem.acceptance_rate && (
                      <Badge variant="outline" className="bg-slate-700 text-white">
                        Acceptance: {problem.acceptance_rate.toFixed(1)}%
                      </Badge>
                    )}
                    
                    {problem.type && (
                      <Badge variant="outline" className="bg-slate-700 text-white">
                        {problem.type}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              {isLoadingDescription ? (
                <div className="p-4 space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-20 w-full mt-6" />
                </div>
              ) : problem ? (
                <Tabs defaultValue="description" className="w-full flex-1 flex flex-col">
                  <TabsList className="w-full bg-[#2D2D30] rounded-none border-b border-[#1E1E1E]">
                    <TabsTrigger value="description" className="flex-1 data-[state=active]:bg-[#1E1E1E]">
                      Description
                    </TabsTrigger>
                    <TabsTrigger value="solution" className="flex-1 data-[state=active]:bg-[#1E1E1E]">
                      Solution
                    </TabsTrigger>
                    {problem.companies && problem.companies.length > 0 && (
                      <TabsTrigger value="companies" className="flex-1 data-[state=active]:bg-[#1E1E1E]">
                        Companies
                      </TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="description" className="flex-1 overflow-auto mt-0 px-1">
                    <div className="p-3">
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown components={{
                          p: ({node, ...props}) => <p {...props} />,
                          h1: ({node, ...props}) => <h1 {...props} />,
                          h2: ({node, ...props}) => <h2 {...props} />,
                          h3: ({node, ...props}) => <h3 {...props} />,
                          ul: ({node, ...props}) => <ul {...props} />,
                          ol: ({node, ...props}) => <ol {...props} />,
                          li: ({node, ...props}) => <li {...props} />,
                          code: ({node, ...props}) => <code {...props} />,
                          pre: ({node, ...props}) => <pre {...props} />
                        }}>
                          {problem.readme || "No description available."}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="solution" className="flex-1 overflow-auto mt-0 px-1">
                    <div className="p-3">
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown components={{
                          p: ({node, ...props}) => <p {...props} />,
                          h1: ({node, ...props}) => <h1 {...props} />,
                          h2: ({node, ...props}) => <h2 {...props} />,
                          h3: ({node, ...props}) => <h3 {...props} />,
                          ul: ({node, ...props}) => <ul {...props} />,
                          ol: ({node, ...props}) => <ol {...props} />,
                          li: ({node, ...props}) => <li {...props} />,
                          code: ({node, ...props}) => <code {...props} />,
                          pre: ({node, ...props}) => <pre {...props} />
                        }}>
                          {problem.solution || "Solution is not available yet."}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {problem.companies && problem.companies.length > 0 && (
                    <TabsContent value="companies" className="mt-0 p-3">
                      <h3 className="font-medium mb-2">Companies that ask this question:</h3>
                      <div className="flex flex-wrap gap-2">
                        {problem.companies.map((company, idx) => (
                          <Badge key={idx} variant="outline" className="bg-[#2D2D30] text-white">
                            {company}
                          </Badge>
                        ))}
                      </div>
                      
                      {problem.tags && problem.tags.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-medium mb-2">Tags:</h3>
                          <div className="flex flex-wrap gap-2">
                            {problem.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="bg-[#3E3E42] text-white">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  )}
                </Tabs>
              ) : (
                <div className="p-4 text-center flex flex-col items-center justify-center h-full">
                  <Info className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Problem description not available</h3>
                  <p className="text-gray-400 max-w-md">
                    We couldn't load the problem description. Please try again or go back to the problem page.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Collapsed panel toggle */}
        {isPanelCollapsed && !isFullscreen && (
          <Button 
            variant="ghost"
            size="sm"
            className="absolute left-0 top-1/2 z-10 h-24 rounded-l-none bg-[#2D2D30] hover:bg-[#3E3E42]"
            onClick={togglePanel}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        
        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col bg-[#1E1E1E]">
          {isFullscreen && (
            <div className="flex items-center justify-between p-2 border-b border-[#2D2D30] bg-[#1E1E1E] text-white">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 hover:bg-[#2D2D30]"
                onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
              >
                {isPanelCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                {isPanelCollapsed ? "Show" : "Hide"} Problem
              </Button>
              
              <div className="font-medium">
                {problem?.title || "Coding Environment"}
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={refreshIframe} className="gap-1 hover:bg-[#2D2D30]">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="gap-1 hover:bg-[#2D2D30]">
                  <Maximize2 className="h-3.5 w-3.5" />
                  Exit Fullscreen
                </Button>
              </div>
            </div>
          )}
          
          {containerUrl ? (
            <iframe 
              ref={iframeRef}
              src={containerUrl} 
              className="flex-grow w-full border-0"
              title="Coding Environment"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
              loading="eager"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-white">
              <Alert variant="destructive" className="mb-6 max-w-md">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Container URL not found. Please go back and try setting up the codebase again.
                </AlertDescription>
              </Alert>
              
              <Button onClick={goBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}