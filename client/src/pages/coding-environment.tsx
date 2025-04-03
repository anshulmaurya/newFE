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
import LoadingAnimation from '@/components/coding/loading-animation';
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [problemTitle, setProblemTitle] = useState<string>('');
  const { user } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Extract params from URL
    const queryParams = new URLSearchParams(window.location.search);
    
    const urlParam = queryParams.get('containerUrl');
    const idParam = queryParams.get('problemId');
    const qIdParam = queryParams.get('questionId');
    const langParam = queryParams.get('language');
    const titleParam = queryParams.get('title');
    const loadingParam = queryParams.get('loading');
    
    // Set the loading state if specified
    if (loadingParam === 'true') {
      setIsLoading(true);
    }
    
    // Set the problem title if available
    if (titleParam) {
      setProblemTitle(decodeURIComponent(titleParam));
    }
    
    if (urlParam) {
      setContainerUrl(decodeURIComponent(urlParam));
      // Once we have the container URL, we're no longer loading
      setIsLoading(false);
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
      className="flex w-full h-screen overflow-hidden bg-[#1E1E1E] fixed inset-0"
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
      {isLoading ? (
        <div className="flex-1">
          <LoadingAnimation title={problemTitle} />
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Problem Description */}
          {isDescriptionOpen && (
            <div className="w-2/5 min-w-[480px] max-w-2xl border-r border-[#1E1E1E] bg-[#252526] text-white">
              {/* Panel contents... */}
            </div>
          )}
          
          {/* Main Panel - Coding Iframe */}
          <div className="flex-1 flex flex-col relative">
            {/* Display iframe or error message */}
            {containerUrl ? (
              <div className="relative flex-grow w-full">
                {/* Action buttons overlay */}
                <div className="absolute top-1 left-[95px] z-10 flex items-center space-x-2">
                  <Button 
                    variant="default"
                    size="sm"
                    className="bg-[#c2ee4a] hover:bg-[#b2de3a] text-black"
                    onClick={() => {
                      toast({
                        title: "Submitting solution...",
                        description: "Running tests and checking your solution",
                      });
                    }}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Submit
                  </Button>
                </div>
                <iframe 
                  ref={iframeRef}
                  src={containerUrl} 
                  className="w-full h-full border-0"
                  title="Coding Environment"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
                  loading="eager"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-white">
                <Alert variant="destructive" className="mb-6 max-w-md">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Container URL not found. Please go back and try setting up the codebase again.
                  </AlertDescription>
                </Alert>
                
                <Button onClick={goHome} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Return to Dashboard
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}