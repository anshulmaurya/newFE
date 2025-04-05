import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  RefreshCw,
  Info,
  Code,
  ScrollText,
  MessageSquare,
  Home,
  MessagesSquare,
  Send,
  User,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Building2,
  Tags,
  PercentSquare,
  Play,
  ClipboardCheck,
  Clock,
  Database,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { useContainerStatus } from '@/hooks/use-container-status';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animation-utils';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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

interface Comment {
  id: number;
  problemId: string;
  userId: number;
  username: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'upvote' | 'downvote' | null;
}

interface SubmissionResult {
  status: string;
  output: {
    metadata: {
      Total_Time: number;
      overall_status: string;
      mem_stat: {
        footprint: {
          heap_usage: number;
          stack_usage: number;
          total_ram: number;
        };
        memory_leak: {
          definitely_lost: number;
          indirectly_lost: number;
          possibly_lost: number;
          still_reachable: number;
          suppressed: number;
        };
        cache_profile: {
          l1_miss: number;
          l2_miss: number;
          branch_miss: number;
        };
      };
    };
    test_cases: Record<string, { status: string }>;
  };
  message: string;
}

interface NewComment {
  problemId: string;
  content: string;
}

// Sample comment data
const SAMPLE_COMMENTS: Comment[] = [
  {
    id: 1,
    problemId: '671988657912757f63726161',
    userId: 1,
    username: 'dspcoder',
    avatarUrl: 'https://github.com/identicons/dspcoder.png',
    content: 'Watch out for edge cases with circular linked lists. Make sure your pointers are initialized correctly!',
    createdAt: '2025-03-29T12:00:00Z',
    upvotes: 5,
    downvotes: 1,
  },
  {
    id: 2,
    problemId: '671988657912757f63726161',
    userId: 2,
    username: 'embeddedsystems',
    avatarUrl: 'https://github.com/identicons/embeddedsystems.png',
    content: 'I found it helpful to use Floyd\'s cycle-finding algorithm (tortoise and hare) for this problem. The trick is to have one pointer move twice as fast as the other.',
    createdAt: '2025-03-29T13:30:00Z',
    upvotes: 12,
    downvotes: 0,
  },
  {
    id: 3,
    problemId: '671988657912757f63726161',
    userId: 3,
    username: 'cplusplusexpert',
    avatarUrl: 'https://github.com/identicons/cplusplusexpert.png',
    content: 'Be careful with memory management here. In a real-world implementation, you\'d need to consider how to properly free memory and avoid leaks.',
    createdAt: '2025-03-30T09:15:00Z',
    upvotes: 8,
    downvotes: 2,
  }
];

export default function CodingEnvironment() {
  const [, setLocation] = useLocation();
  const [containerUrl, setContainerUrl] = useState<string | null>(null);
  const [containerToken, setContainerToken] = useState<string | null>(null);
  const [problemId, setProblemId] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("c"); // Default to C
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'description' | 'solution' | 'discussion' | 'submissions'>('description');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(SAMPLE_COMMENTS);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'test-results' | 'memory-profile' | 'cache-profile'>('test-results');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  
  // Subscribe to container status updates via WebSocket
  const containerStatus = useContainerStatus(containerToken || undefined);
  
  // Update loading state based on container status
  useEffect(() => {
    if (containerStatus) {
      console.log('Container status update received:', containerStatus);
      
      // Check if we need to update the token from temporary to real token
      if (containerStatus.token && 
          containerToken && 
          containerToken.startsWith('temp-') && 
          containerStatus.token !== containerToken) {
        console.log('Updating from temporary token to real token:', containerStatus.token);
        // Update the token in state and localStorage
        setContainerToken(containerStatus.token);
        localStorage.setItem('containerToken', containerStatus.token);
      }
      
      if (containerStatus.status === 'ready') {
        setIsLoading(false);
        // When container is ready, update the URL if available
        if (containerStatus.containerUrl) {
          setContainerUrl(containerStatus.containerUrl);
          // No toast notification for ready environment
        }
      } else if (containerStatus.status === 'creating') {
        setIsLoading(true);
        // No toast notifications for environment creation
      } else if (containerStatus.status === 'error') {
        setIsLoading(false);
        // Only show error notifications for critical issues
        toast({
          title: "Environment Error",
          description: containerStatus.message || "Failed to set up coding environment",
          variant: "destructive",
        });
      }
    }
  }, [containerStatus, toast, containerToken]);

  useEffect(() => {
    // Extract params from URL
    const queryParams = new URLSearchParams(window.location.search);
    
    const urlParam = queryParams.get('containerUrl');
    const tokenParam = queryParams.get('containerToken');
    const idParam = queryParams.get('id') || queryParams.get('problemId');
    const qIdParam = queryParams.get('questionId');
    const langParam = queryParams.get('language');
    
    // Handle direct URL (legacy support)
    if (urlParam) {
      setContainerUrl(decodeURIComponent(urlParam));
    }
    
    // Handle token-based system (preferred)
    if (tokenParam) {
      setContainerToken(tokenParam);
      
      // Check if it's a temporary token (starts with 'temp-')
      if (tokenParam.startsWith('temp-')) {
        console.log('Using temporary token, waiting for real token via WebSocket:', tokenParam);
        // Show loading indicator immediately to improve UX
        setIsLoading(true);
        // No toast notification for temporary token
        // No need to call redirect API for temporary tokens
      } else {
        // For real tokens, convert token to URL through API
        (async () => {
          try {
            // Call the redirect endpoint to get the URL
            const redirectUrl = `/api/container-redirect/${tokenParam}`;
            setContainerUrl(redirectUrl);
          } catch (error) {
            console.error("Error resolving container token:", error);
            toast({
              title: "Error",
              description: "Failed to access coding environment",
              variant: "destructive",
            });
          }
        })();
      }
    }
    
    if (idParam) {
      setProblemId(idParam);
    }

    if (qIdParam) {
      setQuestionId(qIdParam);
    }
    
    if (langParam) {
      setLanguage(langParam);
    }
    
    // Setup codebase if we have a problem ID and question ID but no container URL yet
    if (idParam && qIdParam && !containerUrl && !containerToken && user?.username) {
      // Make the API call to set up the codebase
      (async () => {
        try {
          const res = await fetch('/api/setup-codebase', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              questionId: qIdParam,
              language: langParam || 'c',
            }),
          });
          
          const data = await res.json();
          
          if (data.containerToken) {
            setContainerToken(data.containerToken);
            const redirectUrl = `/api/container-redirect/${data.containerToken}`;
            setContainerUrl(redirectUrl);
          } else if (data.containerUrl) {
            // Legacy support
            setContainerUrl(data.containerUrl);
          }
        } catch (error) {
          console.error("Error setting up codebase:", error);
          toast({
            title: "Background setup error",
            description: "Environment setup encountered an issue. Please try again.",
            variant: "destructive",
          });
        }
      })();
    }
  }, [toast, user]);
  
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
  
  const toggleDescription = (section?: 'description' | 'solution' | 'discussion' | 'submissions') => {
    if (section && !isDescriptionOpen) {
      // If panel is closed, open it with the selected section
      setIsDescriptionOpen(true);
      setActiveSection(section);
    } else if (section && isDescriptionOpen) {
      if (activeSection === section) {
        // Toggle panel off
        setIsDescriptionOpen(false);
      } else {
        // Switch to the selected section
        setActiveSection(section);
      }
    } else {
      // Toggle the description panel on/off
      setIsDescriptionOpen(!isDescriptionOpen);
    }
  };
  
  const goHome = () => {
    // Always go back to dashboard
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

          <div className="border-t border-[#3E3E42] w-10 my-2"></div>

          {/* Problem Description button */}
          <div className="my-2">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeSection === 'description' && isDescriptionOpen ? "secondary" : "ghost"}
                  size="icon" 
                  onClick={() => toggleDescription('description')}
                  className={cn(
                    "h-12 w-12",
                    activeSection === 'description' && isDescriptionOpen 
                      ? "bg-[#c2ee4a] hover:bg-[#b2de3a] text-black" 
                      : "hover:bg-[#2D2D30]"
                  )}
                >
                  <FileText className={cn(
                    "h-5 w-5", 
                    activeSection === 'description' && isDescriptionOpen 
                      ? "text-black" 
                      : "text-gray-400"
                  )} />
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
                  className={cn(
                    "h-12 w-12",
                    activeSection === 'solution' && isDescriptionOpen 
                      ? "bg-[#c2ee4a] hover:bg-[#b2de3a] text-black" 
                      : "hover:bg-[#2D2D30]"
                  )}
                >
                  <ScrollText className={cn(
                    "h-5 w-5", 
                    activeSection === 'solution' && isDescriptionOpen 
                      ? "text-black" 
                      : "text-gray-400"
                  )} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Solution</p>
              </TooltipContent>
            </Tooltip>
          </div>


          
          {/* Discussion button */}
          <div className="my-2">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeSection === 'discussion' && isDescriptionOpen ? "secondary" : "ghost"}
                  size="icon" 
                  onClick={() => toggleDescription('discussion')}
                  className={cn(
                    "h-12 w-12",
                    activeSection === 'discussion' && isDescriptionOpen 
                      ? "bg-[#c2ee4a] hover:bg-[#b2de3a] text-black" 
                      : "hover:bg-[#2D2D30]"
                  )}
                >
                  <MessagesSquare className={cn(
                    "h-5 w-5", 
                    activeSection === 'discussion' && isDescriptionOpen 
                      ? "text-black" 
                      : "text-gray-400"
                  )} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Discussion Forum</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {/* Submissions button */}
          <div className="my-2">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeSection === 'submissions' && isDescriptionOpen ? "secondary" : "ghost"}
                  size="icon" 
                  onClick={() => toggleDescription('submissions')}
                  className={cn(
                    "h-12 w-12",
                    activeSection === 'submissions' && isDescriptionOpen 
                      ? "bg-[#c2ee4a] hover:bg-[#b2de3a] text-black" 
                      : "hover:bg-[#2D2D30]",
                    submissionResult ? "ring-1 ring-green-500" : ""
                  )}
                >
                  <ClipboardCheck className={cn(
                    "h-5 w-5", 
                    activeSection === 'submissions' && isDescriptionOpen 
                      ? "text-black" 
                      : submissionResult ? "text-green-500" : "text-gray-400"
                  )} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Submission Results</p>
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
                  className="h-12 w-12 hover:bg-[#2D2D30]"
                >
                  <RefreshCw className="h-5 w-5 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Refresh Workspace</p>
              </TooltipContent>
            </Tooltip>
          </div>


        </TooltipProvider>
      </div>
      
      {/* Code execution buttons will be rendered inside the iframe */}
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Problem Description (when open) */}
        {isDescriptionOpen && (
          <div className="w-2/5 min-w-[480px] max-w-2xl border-r border-[#1E1E1E] bg-[#252526] text-white">
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
                <div className="p-4 pb-24">
                  {activeSection === 'description' && (
                    <div>
                      {/* Problem metadata section - streamlined with no separate box */}
                      <div className="mb-5 space-y-4">
                        {/* Language */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Language:</span>
                          <Badge variant="outline" className="bg-[#3E3E42] text-[#c2ee4a] border-[#c2ee4a]">
                            {language === "c" ? "C" : language === "cpp" ? "C++" : language}
                          </Badge>
                        </div>
                        
                        {/* Acceptance rate */}
                        {problem.acceptance_rate && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Acceptance Rate:</span>
                            <Badge variant="outline" className="bg-[#3E3E42]">
                              {problem.acceptance_rate.toFixed(1)}%
                            </Badge>
                          </div>
                        )}
                        
                        {/* Companies */}
                        {problem.companies && problem.companies.length > 0 && (
                          <div>
                            <span className="text-sm font-medium block mb-2">Companies:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {problem.companies.map((company, idx) => (
                                <Badge key={idx} variant="outline" className="bg-[#2D2D30] text-white">
                                  {company}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Tags */}
                        {problem.tags && problem.tags.length > 0 && (
                          <div>
                            <span className="text-sm font-medium block mb-2">Tags:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {problem.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="bg-[#3E3E42] text-white">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Problem description */}
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
                  

                  
                  {activeSection === 'submissions' && submissionResult && (
                    <div className="space-y-6">
                      <div className="bg-[#1E1E1E] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h2 className="text-xl font-bold">Submission Result</h2>
                          <Badge 
                            variant="outline"
                            className={submissionResult.output.metadata.overall_status === "PASS" ? "bg-green-600" : "bg-red-600"}
                          >
                            {submissionResult.output.metadata.overall_status}
                          </Badge>
                        </div>
                        <p className="text-gray-400 mb-4">Execution completed in {submissionResult.output.metadata.Total_Time.toFixed(2)}ms</p>
                        
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-[#2D2D30] p-2">
                              <Clock className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Runtime</p>
                              <p className="font-semibold">{submissionResult.output.metadata.Total_Time.toFixed(2)}ms</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-[#2D2D30] p-2">
                              <Database className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Memory</p>
                              <p className="font-semibold">{(submissionResult.output.metadata.mem_stat.footprint.total_ram / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-[#2D2D30] p-2">
                              <AlertCircle className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Memory Leaks</p>
                              <p className="font-semibold">{submissionResult.output.metadata.mem_stat.memory_leak.definitely_lost} bytes</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Test case summary */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Test Cases: {Object.values(submissionResult.output.test_cases).filter(tc => tc.status === "PASS").length}/{Object.keys(submissionResult.output.test_cases).length} passed</h3>
                            <p className="text-sm text-gray-400">
                              {((Object.values(submissionResult.output.test_cases).filter(tc => tc.status === "PASS").length / Object.keys(submissionResult.output.test_cases).length) * 100).toFixed(1)}%
                            </p>
                          </div>
                          <div className="w-full bg-[#2D2D30] rounded-full h-2.5">
                            <div 
                              className="bg-green-600 h-2.5 rounded-full" 
                              style={{ 
                                width: `${(Object.values(submissionResult.output.test_cases).filter(tc => tc.status === "PASS").length / Object.keys(submissionResult.output.test_cases).length) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Tab buttons for test results, memory profile, etc. */}
                        <div className="border-b border-[#3E3E42] mb-6">
                          <div className="flex space-x-4">
                            <button 
                              className={`pb-2 px-1 ${activeTab === 'test-results' ? 'border-b-2 border-[#c2ee4a] text-black font-medium' : 'text-gray-400'}`}
                              onClick={() => setActiveTab('test-results')}
                            >
                              Test Results
                            </button>
                            <button 
                              className={`pb-2 px-1 ${activeTab === 'memory-profile' ? 'border-b-2 border-[#c2ee4a] text-black font-medium' : 'text-gray-400'}`}
                              onClick={() => setActiveTab('memory-profile')}
                            >
                              Memory Profile
                            </button>
                            <button 
                              className={`pb-2 px-1 ${activeTab === 'cache-profile' ? 'border-b-2 border-[#c2ee4a] text-black font-medium' : 'text-gray-400'}`}
                              onClick={() => setActiveTab('cache-profile')}
                            >
                              Cache Profile
                            </button>
                          </div>
                        </div>
                        
                        {/* Tab content */}
                        {activeTab === 'test-results' && (
                          <div className="space-y-4">
                            <h3 className="font-medium text-lg">Test Case Results</h3>
                            <p className="text-sm text-gray-400 mb-4">
                              {Object.values(submissionResult.output.test_cases).filter(tc => tc.status === "PASS").length} passed, {Object.values(submissionResult.output.test_cases).filter(tc => tc.status === "FAIL").length} failed
                            </p>
                            
                            <div className="space-y-4">
                              {Object.entries(submissionResult.output.test_cases).map(([testName, testCase]) => (
                                <div key={testName} className="flex items-start justify-between border-b border-[#3E3E42] pb-4">
                                  <div className="flex items-center gap-2">
                                    {testCase.status === "PASS" ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                    <span className="font-mono text-sm">{testName}</span>
                                  </div>
                                  <Badge 
                                    variant={testCase.status === "PASS" ? "outline" : "destructive"}
                                    className={testCase.status === "PASS" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                                  >
                                    {testCase.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {activeTab === 'memory-profile' && (
                          <div className="space-y-4">
                            <h3 className="font-medium text-lg">Memory Profile</h3>
                            
                            <div className="bg-[#2D2D30] p-4 rounded-md">
                              <h4 className="text-sm font-medium mb-2">Memory Footprint</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-xs text-gray-400">Heap Usage</p>
                                  <p className="font-mono">{(submissionResult.output.metadata.mem_stat.footprint.heap_usage / 1024).toFixed(2)} KB</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Stack Usage</p>
                                  <p className="font-mono">{(submissionResult.output.metadata.mem_stat.footprint.stack_usage / 1024).toFixed(2)} KB</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Total RAM</p>
                                  <p className="font-mono">{(submissionResult.output.metadata.mem_stat.footprint.total_ram / 1024).toFixed(2)} KB</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-[#2D2D30] p-4 rounded-md">
                              <h4 className="text-sm font-medium mb-2">Memory Leaks</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-xs text-gray-400">Definitely Lost</p>
                                  <p className="font-mono">{submissionResult.output.metadata.mem_stat.memory_leak.definitely_lost} bytes</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Indirectly Lost</p>
                                  <p className="font-mono">{submissionResult.output.metadata.mem_stat.memory_leak.indirectly_lost} bytes</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Possibly Lost</p>
                                  <p className="font-mono">{submissionResult.output.metadata.mem_stat.memory_leak.possibly_lost} bytes</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {activeTab === 'cache-profile' && (
                          <div className="space-y-4">
                            <h3 className="font-medium text-lg">Cache Profile</h3>
                            
                            <div className="bg-[#2D2D30] p-4 rounded-md">
                              <h4 className="text-sm font-medium mb-2">Cache Misses</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-xs text-gray-400">L1 Cache Misses</p>
                                  <p className="font-mono">{submissionResult.output.metadata.mem_stat.cache_profile.l1_miss}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">L2 Cache Misses</p>
                                  <p className="font-mono">{submissionResult.output.metadata.mem_stat.cache_profile.l2_miss}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Branch Misses</p>
                                  <p className="font-mono">{submissionResult.output.metadata.mem_stat.cache_profile.branch_miss}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {activeSection === 'discussion' && (
                    <div className="space-y-6">
                      <h3 className="font-medium text-lg">Discussion Forum</h3>
                      
                      {/* Comment form */}
                      <div className="bg-[#2D2D30] p-3 rounded-md">
                        <h4 className="text-sm font-medium mb-2">Add your thoughts</h4>
                        <Textarea 
                          placeholder="Share your solution approach, tips, or ask questions..." 
                          className="resize-none bg-[#1E1E1E] border-[#3E3E42]" 
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          rows={4}
                        />
                        <div className="flex justify-end mt-2">
                          <Button 
                            size="sm" 
                            className="gap-1"
                            disabled={!commentText.trim() || !user}
                            onClick={() => {
                              if (!problemId || !user) return;

                              // In a real app, this would be an API call
                              const newComment: Comment = {
                                id: comments.length + 1,
                                problemId: problemId,
                                userId: user.id,
                                username: user.username,
                                avatarUrl: user.avatarUrl || undefined,
                                content: commentText,
                                createdAt: new Date().toISOString(),
                                upvotes: 0,
                                downvotes: 0,
                              };

                              setComments([...comments, newComment]);
                              setCommentText('');
                              toast({
                                title: 'Comment added',
                                description: 'Your comment has been posted successfully',
                              });
                            }}
                          >
                            <Send className="h-3.5 w-3.5" />
                            Post
                          </Button>
                        </div>
                        {!user && (
                          <p className="text-xs text-gray-400 mt-1 text-center">
                            You need to be logged in to post comments.
                          </p>
                        )}
                      </div>

                      {/* Comments list */}
                      <div className="space-y-4">
                        {/* Sort comments by upvotes and put user's comments at the top */}
                        {comments
                          .slice()
                          .sort((a, b) => {
                            // First put user's comments at the top
                            if (user && a.userId === user.id && b.userId !== user.id) return -1;
                            if (user && a.userId !== user.id && b.userId === user.id) return 1;
                            // Then sort by upvotes
                            return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
                          })
                          .map((comment) => (
                          <div 
                            key={comment.id} 
                            className={cn(
                              "p-3 rounded-md",
                              user && comment.userId === user.id 
                                ? "bg-gradient-to-r from-[#2D2D30] to-[#2D3340] border border-blue-700/20" 
                                : "bg-[#2D2D30]"
                            )}>
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={comment.avatarUrl} />
                                  <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{comment.username}</p>
                                  <p className="text-xs text-gray-400">
                                    {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                                  </p>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      // This would be an API call in a real app
                                      navigator.clipboard.writeText(comment.content);
                                      toast({
                                        title: 'Comment copied',
                                        description: 'Comment text copied to clipboard',
                                      });
                                    }}
                                  >
                                    Copy text
                                  </DropdownMenuItem>
                                  {user && comment.userId === user.id && (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        // This would be an API call in a real app
                                        setComments(comments.filter(c => c.id !== comment.id));
                                        toast({
                                          title: 'Comment deleted',
                                          description: 'Your comment has been deleted',
                                        });
                                      }}
                                      className="text-red-500"
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="mt-2 text-sm">
                              {comment.content}
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-7 px-2 text-xs gap-1 text-gray-400 hover:text-white"
                                onClick={() => {
                                  // This would be an API call in a real app
                                  const updatedComments = comments.map(c => {
                                    if (c.id === comment.id) {
                                      // If already upvoted, remove upvote
                                      if (c.userVote === 'upvote') {
                                        return { 
                                          ...c, 
                                          upvotes: c.upvotes - 1,
                                          userVote: null as ('upvote' | 'downvote' | null)
                                        };
                                      } 
                                      // If downvoted, switch to upvote
                                      else if (c.userVote === 'downvote') {
                                        return { 
                                          ...c, 
                                          upvotes: c.upvotes + 1,
                                          downvotes: c.downvotes - 1,
                                          userVote: 'upvote' as ('upvote' | 'downvote' | null)
                                        };
                                      } 
                                      // If no vote, add upvote
                                      else {
                                        return { 
                                          ...c, 
                                          upvotes: c.upvotes + 1,
                                          userVote: 'upvote' as ('upvote' | 'downvote' | null)
                                        };
                                      }
                                    }
                                    return c;
                                  });
                                  setComments(updatedComments as Comment[]);
                                }}
                              >
                                <ThumbsUp className={cn(
                                  "h-3.5 w-3.5",
                                  comment.userVote === 'upvote' && "fill-current text-blue-500"
                                )} />
                                {comment.upvotes > 0 && <span>{comment.upvotes}</span>}
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-7 px-2 text-xs gap-1 text-gray-400 hover:text-white"
                                onClick={() => {
                                  // This would be an API call in a real app
                                  const updatedComments = comments.map(c => {
                                    if (c.id === comment.id) {
                                      // If already downvoted, remove downvote
                                      if (c.userVote === 'downvote') {
                                        return { 
                                          ...c, 
                                          downvotes: c.downvotes - 1,
                                          userVote: null as ('upvote' | 'downvote' | null)
                                        };
                                      } 
                                      // If upvoted, switch to downvote
                                      else if (c.userVote === 'upvote') {
                                        return { 
                                          ...c, 
                                          upvotes: c.upvotes - 1,
                                          downvotes: c.downvotes + 1,
                                          userVote: 'downvote' as ('upvote' | 'downvote' | null)
                                        };
                                      } 
                                      // If no vote, add downvote
                                      else {
                                        return { 
                                          ...c, 
                                          downvotes: c.downvotes + 1,
                                          userVote: 'downvote' as ('upvote' | 'downvote' | null)
                                        };
                                      }
                                    }
                                    return c;
                                  });
                                  setComments(updatedComments as Comment[]);
                                }}
                              >
                                <ThumbsDown className={cn(
                                  "h-3.5 w-3.5",
                                  comment.userVote === 'downvote' && "fill-current text-red-500"
                                )} />
                                {comment.downvotes > 0 && <span>{comment.downvotes}</span>}
                              </Button>
                            </div>
                          </div>
                        ))}

                        {comments.length === 0 && (
                          <div className="text-center py-8">
                            <MessagesSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
                          </div>
                        )}
                      </div>
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
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-[#252526] rounded-md text-white z-10 flex items-center gap-2">
              <span className="text-sm font-medium truncate max-w-md">
                {problem?.title || "Coding Environment"}
              </span>
              <Badge variant="outline" className="bg-[#3E3E42] text-[#c2ee4a] border-[#c2ee4a] text-xs uppercase">
                {language === "c" ? "C" : language === "cpp" ? "C++" : language}
              </Badge>
            </div>
          )}
          
          {containerUrl ? (
            <div className="relative flex-grow w-full">
              {/* Action buttons overlay */}
              <div className="absolute top-1 left-[95px] z-10 flex items-center space-x-2">
                <Button 
                  variant="default"
                  className="h-6 px-3 text-xs bg-[#c2ee4a] hover:bg-[#b2de3a] text-black border-none rounded-full"
                  onClick={async () => {
                    if (!questionId || !user) {
                      toast({
                        title: 'Error',
                        description: 'Problem ID or user information is missing.',
                        variant: 'destructive'
                      });
                      return;
                    }
                    
                    toast({
                      title: 'Run Code',
                      description: 'Running your code...',
                    });
                    
                    try {
                      const response = await fetch('https://dspcoder-backend-prod.azurewebsites.net/api/build_and_run_question', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          username: user.username,
                          question_id: questionId,
                          lang: language,
                          profile: 'False'
                        })
                      });
                      
                      const data = await response.json();
                      
                      if (response.ok) {
                        toast({
                          title: 'Success',
                          description: 'Code ran successfully!',
                        });
                        console.log('Run result:', data);
                      } else {
                        toast({
                          title: 'Error',
                          description: data.message || 'Failed to run code.',
                          variant: 'destructive'
                        });
                      }
                    } catch (error) {
                      console.error('Error running code:', error);
                      toast({
                        title: 'Error',
                        description: 'Failed to run code. Please try again.',
                        variant: 'destructive'
                      });
                    }
                  }}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Run
                </Button>
                <Button 
                  variant="default"
                  className="h-6 px-3 text-xs bg-[#c2ee4a] hover:bg-[#b2de3a] text-black border-none rounded-full"
                  onClick={async () => {
                    if (!questionId || !user) {
                      toast({
                        title: 'Error',
                        description: 'Problem ID or user information is missing.',
                        variant: 'destructive'
                      });
                      return;
                    }
                    
                    toast({
                      title: 'Submit Solution',
                      description: 'Submitting your solution for evaluation...',
                    });
                    
                    try {
                      const response = await fetch('https://dspcoder-backend-prod.azurewebsites.net/api/submit_question', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          username: user.username,
                          question_id: questionId,
                          lang: language,
                          profile: 'False'
                        })
                      });
                      
                      const data = await response.json();
                      
                      if (response.ok) {
                        // Store the submission result
                        if (data.response && data.response.status) {
                          setSubmissionResult(data.response);
                          
                          // Make sure the submissions panel is open
                          // We need to ensure this doesn't toggle off if already open
                          setIsDescriptionOpen(true);
                          setActiveSection('submissions');
                          
                          toast({
                            title: 'Success',
                            description: 'Solution submitted successfully!',
                          });
                          console.log('Submit result:', data);
                        } else {
                          toast({
                            title: 'Success',
                            description: 'Solution submitted, but no detailed results available.',
                          });
                        }
                      } else {
                        toast({
                          title: 'Error',
                          description: data.message || 'Failed to submit solution.',
                          variant: 'destructive'
                        });
                      }
                    } catch (error) {
                      console.error('Error submitting solution:', error);
                      toast({
                        title: 'Error',
                        description: 'Failed to submit solution. Please try again.',
                        variant: 'destructive'
                      });
                    }
                  }}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Submit
                </Button>
              </div>
              {isLoading || containerStatus?.status === 'creating' ? (
                <div className="flex flex-col items-center justify-center w-full h-full bg-[#1E1E1E] text-white">
                  <div className="flex flex-col items-center justify-center p-8">
                    <div className="relative mb-4">
                      <Loader2 className="h-10 w-10 text-[#c2ee4a] animate-spin" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {containerStatus?.status === 'creating' ? 'Setting up your environment' : 'Loading your coding environment'}
                    </h3>
                    <p className="text-gray-400 text-center max-w-md">
                      {containerStatus?.message || 'Please wait while we prepare your coding workspace. This may take a moment...'}
                    </p>
                  </div>
                </div>
              ) : containerStatus?.status === 'error' ? (
                <div className="flex flex-col items-center justify-center w-full h-full bg-[#1E1E1E] text-white">
                  <div className="flex flex-col items-center justify-center p-8">
                    <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Environment Error</h3>
                    <p className="text-gray-400 text-center max-w-md">
                      {containerStatus?.message || 'We encountered an error setting up your coding environment. Please try again.'}
                    </p>
                    <Button 
                      variant="default" 
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : (
                <iframe 
                  ref={iframeRef}
                  src={containerUrl} 
                  className="w-full h-full border-0"
                  title="Coding Environment"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
                  loading="eager"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-white">
              <div className="flex flex-col items-center justify-center mb-6">
                <Loader2 className="h-12 w-12 text-[#c2ee4a] animate-spin mb-4" />
                <h2 className="text-xl font-semibold mb-2">Setting up your coding environment...</h2>
                <p className="text-gray-400 text-center max-w-md">
                  We're preparing your container with the necessary code files and development environment.
                  This may take a few moments.
                </p>
              </div>
              
              <Button onClick={goHome} variant="outline" className="gap-2 mt-4">
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