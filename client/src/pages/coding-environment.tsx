import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  Maximize2,
  RefreshCw,
  Info,
  Code,
  ScrollText,
  MessageSquare,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'description' | 'solution' | 'companies'>('description');
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
  };
  
  const toggleDescription = (section?: 'description' | 'solution' | 'companies') => {
    if (section && !isDescriptionOpen) {
      setIsDescriptionOpen(true);
      setActiveSection(section);
    } else if (section && isDescriptionOpen) {
      if (activeSection === section) {
        setIsDescriptionOpen(false);
      } else {
        setActiveSection(section);
      }
    } else {
      setIsDescriptionOpen(!isDescriptionOpen);
    }
  };
  
  const goBack = () => {
    // Go back to problem detail page if we have a problem ID, otherwise to dashboard
    if (problemId) {
      setLocation(`/problems/${problemId}`);
    } else {
      setLocation('/dashboard');
    }
  };

  const goHome = () => {
    setLocation('/dashboard');
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
      className="flex w-full h-screen overflow-hidden bg-[#1E1E1E]"
    >
      {/* Vertical navbar */}
      <div className="flex flex-col w-14 bg-[#252526] text-white items-center border-r border-[#1E1E1E] py-2">
        <TooltipProvider>
          {/* Home button */}
          <div className="mb-4 mt-2">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={goHome}
                  className="h-12 w-12 rounded-xl hover:bg-[#2D2D30]"
                >
                  <Home className="h-5 w-5 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Back button */}
          <div className="mb-4">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={goBack}
                  className="h-12 w-12 rounded-xl hover:bg-[#2D2D30]"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Go Back</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="border-t border-[#3E3E42] w-10 my-2"></div>

          {/* Problem Description button */}
          <div className="my-2">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeSection === 'description' && isDescriptionOpen ? "secondary" : "ghost"}
                  size="icon" 
                  onClick={() => toggleDescription('description')}
                  className="h-12 w-12 rounded-xl hover:bg-[#2D2D30]"
                >
                  <FileText className="h-5 w-5 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Problem Description</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Solution button */}
          <div className="my-2">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeSection === 'solution' && isDescriptionOpen ? "secondary" : "ghost"}
                  size="icon" 
                  onClick={() => toggleDescription('solution')}
                  className="h-12 w-12 rounded-xl hover:bg-[#2D2D30]"
                >
                  <ScrollText className="h-5 w-5 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Solution</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Companies button */}
          <div className="my-2">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeSection === 'companies' && isDescriptionOpen ? "secondary" : "ghost"}
                  size="icon" 
                  onClick={() => toggleDescription('companies')}
                  className="h-12 w-12 rounded-xl hover:bg-[#2D2D30]"
                >
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Companies & Tags</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="border-t border-[#3E3E42] w-10 my-2"></div>

          {/* Refresh button */}
          <div className="my-2">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={refreshIframe}
                  className="h-12 w-12 rounded-xl hover:bg-[#2D2D30]"
                >
                  <RefreshCw className="h-5 w-5 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Refresh Workspace</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Fullscreen button */}
          <div className="my-2">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleFullscreen}
                  className="h-12 w-12 rounded-xl hover:bg-[#2D2D30]"
                >
                  <Maximize2 className="h-5 w-5 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Fullscreen</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Problem Description (when open) */}
        {isDescriptionOpen && (
          <div className="w-2/5 max-w-lg border-r border-[#1E1E1E] bg-[#252526] text-white">
            <div className="flex items-center justify-between p-3 border-b border-[#1E1E1E]">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-gray-400" />
                <h2 className="font-medium truncate">
                  {isLoadingDescription ? (
                    <Skeleton className="h-5 w-48" />
                  ) : (
                    problem?.title || "Loading problem..."
                  )}
                </h2>
              </div>
              
              {problem && (
                <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
              )}
            </div>
            
            <div className="h-full overflow-y-auto">
              {isLoadingDescription ? (
                <div className="p-4 space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-20 w-full mt-6" />
                </div>
              ) : problem ? (
                <div className="p-4">
                  {activeSection === 'description' && (
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
                  )}
                  
                  {activeSection === 'solution' && (
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
                  )}
                  
                  {activeSection === 'companies' && (
                    <div>
                      {problem.companies && problem.companies.length > 0 && (
                        <div className="mb-6">
                          <h3 className="font-medium text-lg mb-3">Companies that ask this question:</h3>
                          <div className="flex flex-wrap gap-2">
                            {problem.companies.map((company, idx) => (
                              <Badge key={idx} variant="outline" className="bg-[#2D2D30] text-white">
                                {company}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {problem.tags && problem.tags.length > 0 && (
                        <div>
                          <h3 className="font-medium text-lg mb-3">Tags:</h3>
                          <div className="flex flex-wrap gap-2">
                            {problem.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="bg-[#3E3E42] text-white">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {(!problem.companies || problem.companies.length === 0) && 
                       (!problem.tags || problem.tags.length === 0) && (
                        <div className="text-center py-12">
                          <Info className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400">No company or tag information available for this problem.</p>
                        </div>
                      )}
                      
                      {problem.acceptance_rate && (
                        <div className="mt-6 p-4 bg-[#2D2D30] rounded-md">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Acceptance Rate:</span>
                            <span className="font-medium">{problem.acceptance_rate.toFixed(1)}%</span>
                          </div>
                          
                          {problem.type && (
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-gray-400">Category:</span>
                              <span>{problem.type}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
        
        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col relative">
          {/* Optional title bar in fullscreen mode */}
          {isFullscreen && !isDescriptionOpen && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-[#252526] rounded-md text-white z-10 flex items-center">
              <span className="text-sm font-medium truncate max-w-md">
                {problem?.title || "Coding Environment"}
              </span>
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