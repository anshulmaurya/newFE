import React, { useState, useEffect, useRef } from 'react';
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
// Removed toast imports - No notifications
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
  // Create a dummy toast function that just logs to console instead of showing notifications
  const toast = (config: any) => {
    console.log(`[SUPPRESSED TOAST] ${config.title}: ${config.description}`);
    // This function does nothing but log to console
    return null;
  };
  
  // Subscribe to container status updates via WebSocket
  const containerStatus = useContainerStatus(containerToken || undefined);
  
  // Update loading state based on container status - With NO toasts
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
          // Only update URL if it actually changed to prevent iframe reloads
          if (containerStatus.containerUrl !== containerUrl) {
            setContainerUrl(containerStatus.containerUrl);
          }
        }
      } else if (containerStatus.status === 'creating') {
        setIsLoading(true);
      } else if (containerStatus.status === 'error') {
        setIsLoading(false);
        // No toast notifications for errors either
        console.error("Environment Error:", containerStatus.message);
      }
    }
  }, [containerStatus, containerToken, containerUrl]);

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
      } else {
        // For real tokens, convert token to URL through API
        (async () => {
          try {
            // Call the redirect endpoint to get the URL
            const redirectUrl = `/api/container-redirect/${tokenParam}`;
            setContainerUrl(redirectUrl);
          } catch (error) {
            console.error("Error resolving container token:", error);
            // No toast notification for this error either
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
          // No toast notification for this error
        }
      })();
    }
  }, [user]); // Removed toast dependency
  
  // Fetch problem description from the external API using file_path
  const { data: problemDescription, isLoading: isLoadingDescription, error: descriptionError } = useQuery<ProblemDescriptionResponse>({
    queryKey: ['problemDescription', problemId],
    refetchOnWindowFocus: false, // Don't refetch on window focus
    staleTime: Infinity, // Keep data fresh indefinitely
    queryFn: async () => {
      try {
        console.log('Fetching problem data for ID:', problemId);
        // Try to get problem data including file_path
        const problemRes = await fetch(`/api/problems/${problemId}`);
        if (!problemRes.ok) {
          console.error('Failed to fetch problem data:', await problemRes.text());
          throw new Error('Failed to fetch problem data');
        }
        
        const problemData = await problemRes.json();
        console.log('Problem data received:', JSON.stringify(problemData, null, 2));
        
        // DEBUG: Inspect the structure of problemData to check all properties
        console.log('Problem data structure:');
        for (const key in problemData) {
          console.log(`${key}: ${typeof problemData[key]}`, problemData[key]);
        }
        
        // Store problem title and difficulty from database for display
        if (problemData.title) {
          setDbProblemTitle(problemData.title);
        }
        
        if (problemData.difficulty) {
          setDbProblemDifficulty(problemData.difficulty);
        }
        
        // Handle both camelCase and snake_case property names
        const questionIdValue = problemData.questionId || problemData.question_id;
        if (questionIdValue) {
          // Set question ID for other uses if it's available
          console.log('Setting question ID:', questionIdValue);
          setQuestionId(questionIdValue);
        }
        
        // CRITICAL FIX: The database field is 'filePath' (camelCase) not 'file_path' (snake_case)
        // We need to check both properties to be sure
        const filePath = problemData.filePath || problemData.file_path;
        console.log('Original file_path from database:', filePath);
        console.log('Full problem data structure to check property names:', problemData);
        
        // CRITICAL FIX: Make sure file_path exists and is not undefined!
        // It should come from the database. If it's missing, we need a better error message
        if (!filePath) {
          console.error('File path is missing for this problem (checked both filePath and file_path)');
          // Try using question_id directly as fallback if file_path is missing
          if (problemData.questionId || problemData.question_id) {
            const questionIdValue = problemData.questionId || problemData.question_id;
            console.log('Falling back to using question_id instead:', questionIdValue);
            // We'll set questionId but continue - later code will use it for fallback API call
            setQuestionId(questionIdValue);
            // Directly go to question_id method
            throw new Error('File path is missing, using question_id instead');
          } else {
            throw new Error('File path is missing for this problem');
          }
        }
        
        // Extract the folder name from container URL or file_path
        let folderName = filePath;
        
        // For debugging purposes, log the folder name before any manipulation
        console.log('Before any manipulation, folderName:', folderName);
        
        // IMPORTANT: We shouldn't modify the file_path at all! The API expects the complete path from the database
        console.log('KEEPING ORIGINAL FILE PATH FROM DATABASE');
        
        // Add debugging for the problem data
        console.log('Full problem data from database:', problemData);
        console.log('filePath type:', typeof filePath);
        
        // Show explicit log message to help debug camelCase vs snake_case issue
        console.log('Property names in problem data:');
        for (const key in problemData) {
          console.log(`- ${key}: ${typeof problemData[key]}`);
        }
        
        // DO NOT extract just the folder name from the URL
        // DO NOT modify the file_path in any way
        // The API expects the complete file_path from the database: 
        // e.g., https://dspcoderproblem.blob.core.windows.net/problem-bucket/10101_reverse_linked_list/
        
        // Containers might use a folder param in format "/home/username/FolderName"
        // We want to extract just "FolderName" for the API call
        if (!folderName && containerUrl) {
          try {
            // Handle containerUrl directly or as a redirect endpoint
            let url = containerUrl;
            
            // If it's our internal redirect URL, we need to extract the token and look at localStorage
            if (containerUrl.includes('/api/container-redirect/')) {
              const token = containerToken || containerUrl.split('/api/container-redirect/')[1];
              console.log('Using container token to determine folderName:', token);
              
              // Check if we have the original URL stored
              if (containerStatus?.containerUrl) {
                url = containerStatus.containerUrl;
                console.log('Using containerStatus.containerUrl:', url);
              }
            }
            
            // Try to extract folder from URL parameters
            const folderParam = new URL(url).searchParams.get('folder');
            console.log('Extracted folder parameter:', folderParam);
            
            if (folderParam) {
              // Split by path separator and get the last part
              const parts = folderParam.split('/');
              folderName = parts[parts.length - 1];
              console.log('Parsed folder name from path:', folderName);
            }
            
            // If we still don't have a folder name, try with the question ID
            if (!folderName && questionId) {
              // Extract the name part from the question ID format "10101_reverse_linked_list"
              const questionIdParts = questionId.split('_');
              if (questionIdParts.length > 1) {
                // Remove the number prefix and join the rest with underscores
                folderName = questionIdParts.slice(1).join('_');
                // Convert to proper format with first letters capitalized
                folderName = folderName.split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join('_');
                
                console.log('Derived folder name from question ID:', folderName);
              }
            }
          } catch (e) {
            console.error('Error parsing containerUrl:', e);
          }
        }
        
        console.log('Final extracted folder name for problem description:', folderName);
        
        // If we still don't have a folder name, check if we can use the current path from the iframe
        if (!folderName && iframeRef.current) {
          try {
            // Try to get the path from iframe location
            const iframePath = new URL(iframeRef.current.src).searchParams.get('folder');
            if (iframePath) {
              folderName = iframePath.split('/').pop();
              console.log('Extracted folder name from iframe src:', folderName);
            }
          } catch (e) {
            console.error('Error getting path from iframe:', e);
          }
        }
        
        // For Reverse Linked List specifically
        if (!folderName && questionId && questionId.includes('reverse_linked_list')) {
          folderName = 'Reverse_Linked_List_C';
          console.log('Using hardcoded folder name for Reverse Linked List:', folderName);
        }
        
        if (!folderName) {
          console.error('Could not determine folder name from file_path, container URL or question ID');
          throw new Error('Missing folder name for problem description');
        }
        
        // For handling the format of file_path from the database
        // The file_path in the database is like "https://dspcoderproblem.blob.core.windows.net/problem-bucket/10101_reverse_linked_list/"
        // The API works with the full URL, so we should keep it as is
        if (folderName && folderName.includes('dspcoderproblem.blob.core.windows.net/problem-bucket/')) {
          console.log('Using full file_path URL from database:', folderName);
          // Keep the full URL as is - the API works with it
        }
        
        // Add direct support for Reverse Linked List as fallback with full path format
        if ((!folderName || folderName === "") && questionId && questionId.includes('reverse_linked_list')) {
          folderName = 'https://dspcoderproblem.blob.core.windows.net/problem-bucket/10101_reverse_linked_list/';
          console.log('Using hard-coded full URL for Reverse Linked List:', folderName);
        }

        // Let's try both API endpoints - first by file path, then by question ID if that fails
        try {
          // IMPORTANT: When using the file_path from the database, it must be properly URL-encoded
          // The API expects the full URL in the file_path parameter, but properly encoded
          const encodedFilePath = encodeURIComponent(folderName);
          const filePathUrl = `https://dspcoder-backend-prod.azurewebsites.net/api/get_problem_description_by_file_path?file_path=${encodedFilePath}`;
          console.log('Fetching problem description using URL (file_path method):', filePathUrl);
          console.log('Original file_path:', folderName);
          console.log('Encoded file_path:', encodedFilePath);
          
          const filePathRes = await fetch(filePathUrl);
          
          if (!filePathRes.ok) {
            const errorText = await filePathRes.text();
            console.warn(`File path method failed with: ${errorText}`);
            throw new Error('File path method failed');
          }
          
          const filePathData = await filePathRes.json();
          console.log('Problem description response (file_path method):', filePathData);
          
          console.log('Final problem description response:', JSON.stringify(filePathData, null, 2));
          return filePathData;
        } catch (filePathError) {
          console.log('File path method failed, trying question_id method...');
          
          // Try the question_id approach as a fallback
          if (questionId) {
            try {
              // Make sure we use the latest question ID value
              const finalQuestionId = questionId || questionIdValue;
              const questionIdUrl = `https://dspcoder-backend-prod.azurewebsites.net/api/get_problem_description?question_id=${encodeURIComponent(finalQuestionId)}`;
              console.log('Fetching problem description using URL (question_id method):', questionIdUrl);
              console.log('Using question_id:', finalQuestionId);
              
              const questionIdRes = await fetch(questionIdUrl);
              
              if (!questionIdRes.ok) {
                const errorText = await questionIdRes.text();
                console.error('Question ID method also failed:', errorText);
                throw new Error(`Failed to fetch problem description: ${errorText}`);
              }
              
              const questionIdData = await questionIdRes.json();
              console.log('Problem description response (question_id method):', questionIdData);
              
              console.log('Final problem description response:', JSON.stringify(questionIdData, null, 2));
              return questionIdData;
            } catch (questionIdError) {
              console.error('Both methods failed to get problem description');
              throw questionIdError;
            }
          } else {
            console.error('No question ID available for fallback');
            throw filePathError;
          }
        }
      } catch (error) {
        console.error('Error in problem description query:', error);
        throw error;
      }
    },
    enabled: !!problemId,
    retry: 2,
  });
  
  // Log any errors for debugging
  React.useEffect(() => {
    if (descriptionError) {
      console.error('Problem description query error:', descriptionError);
    }
  }, [descriptionError]);
  
  const refreshIframe = () => {
    if (iframeRef.current && iframeRef.current.src) {
      iframeRef.current.src = iframeRef.current.src;
      // Removed toast notification
      console.log("Refreshing workspace");
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
  
  // Store both database problem data and external problem description
  const [dbProblemTitle, setDbProblemTitle] = useState<string | null>(null);
  const [dbProblemDifficulty, setDbProblemDifficulty] = useState<string | null>(null);
  const problem = problemDescription?.data;
  
  // Removed debug component

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
                    dbProblemTitle || problem?.title || "Loading problem..."
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
                          {problem.readme === "Readme file not found or inaccessible." ? 
                            `## Problem Description Not Available 

This problem's README file could not be found or is inaccessible.

**Problem Details:**
- Problem ID: ${problemId}
- Question ID: ${questionId}
- File Path: ${problem?.file_path || 'Not provided'}

You can still work on the problem in the coding environment.`
                            : 
                            problem.readme || "No description available."}
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
                        {problem.solution === "Solution file not found or inaccessible." ? 
                          `## Solution Not Available 

The solution file for this problem could not be found or is inaccessible.

**Problem Details:**
- Problem ID: ${problemId}
- Question ID: ${questionId}
- File Path: ${problem?.file_path || 'Not provided'}`
                          : 
                          problem.solution || "Solution is not available yet."}
                      </ReactMarkdown>
                    </div>
                  )}
                  

                  
                  {activeSection === 'submissions' && (
                    <div className="space-y-6">
                      {submissionResult ? (
                        <>
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
                          </div>
                          
                          {/* Tab buttons for test results, memory profile, etc. */}
                          <div className="border-b border-[#3E3E42] mb-6">
                            <div className="flex space-x-4">
                              <button 
                                className={`pb-2 px-1 ${activeTab === 'test-results' ? 'border-b-2 border-[#c2ee4a] text-[#c2ee4a] font-medium' : 'text-gray-400'}`}
                                onClick={() => setActiveTab('test-results')}
                              >
                                Test Results
                              </button>
                              <button 
                                className={`pb-2 px-1 ${activeTab === 'memory-profile' ? 'border-b-2 border-[#c2ee4a] text-[#c2ee4a] font-medium' : 'text-gray-400'}`}
                                onClick={() => setActiveTab('memory-profile')}
                              >
                                Memory Profile
                              </button>
                              <button 
                                className={`pb-2 px-1 ${activeTab === 'cache-profile' ? 'border-b-2 border-[#c2ee4a] text-[#c2ee4a] font-medium' : 'text-gray-400'}`}
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
                        </>
                      ) : (
                        <div className="bg-[#1E1E1E] rounded-lg p-6 text-center">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <div className="rounded-full bg-[#2D2D30] p-4">
                              <Send className="h-10 w-10 text-[#c2ee4a]" />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold mb-2">No Submissions Yet</h2>
                              <p className="text-gray-400 mb-4 max-w-md mx-auto">
                                You haven't submitted your solution for this problem yet. 
                                Write your code and click the "Submit" button to run your solution against all test cases.
                              </p>
                            </div>
                            <div className="border border-dashed border-[#3E3E42] w-full p-4 rounded-md bg-[#2D2D30] mt-2">
                              <h3 className="font-medium text-[#c2ee4a] mb-2">What happens when you submit?</h3>
                              <ul className="text-left text-sm text-gray-300 space-y-2">
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                  <span>Your code runs against all test cases</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                  <span>Memory usage and leaks are analyzed</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                  <span>Runtime performance is measured</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                  <span>Your solution is saved to your progress</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
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