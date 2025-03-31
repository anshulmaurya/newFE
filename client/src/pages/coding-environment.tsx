import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Code, 
  AlertTriangle, 
  Maximize2,
  Settings,
  RefreshCw,
  Monitor
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

interface ExampleData {
  input: string;
  output: string;
  explanation?: string;
}

// Mock data until you have the real API to fetch problem content
const mockExamples: ExampleData[] = [
  {
    input: "5\n1 2 3 4 5",
    output: "5 4 3 2 1",
    explanation: "The linked list 1 -> 2 -> 3 -> 4 -> 5 is reversed to 5 -> 4 -> 3 -> 2 -> 1."
  }
];

export default function CodingEnvironment() {
  const [, setLocation] = useLocation();
  const [containerUrl, setContainerUrl] = useState<string | null>(null);
  const [problemId, setProblemId] = useState<string | null>(null);
  const [problemTitle, setProblemTitle] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | null>('Easy');
  const [category, setCategory] = useState<string | null>('dsa');
  const [companies, setCompanies] = useState<string[]>(['Qualcomm', 'Microsoft', 'Amazon']);
  const [tags, setTags] = useState<string[]>(['Linked List']);
  const [description, setDescription] = useState<string>("Given the head of a singly linked list, your task is to reverse the list and return the reversed version.");
  const [examples, setExamples] = useState<ExampleData[]>(mockExamples);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Extract container URL from query parameters
    const queryParams = new URLSearchParams(window.location.search);
    
    const urlParam = queryParams.get('containerUrl');
    const idParam = queryParams.get('problemId');
    const titleParam = queryParams.get('title');
    
    if (urlParam) {
      setContainerUrl(decodeURIComponent(urlParam));
    }
    
    if (idParam) {
      setProblemId(idParam);
    }
    
    if (titleParam) {
      setProblemTitle(decodeURIComponent(titleParam));
    }
  }, []);
  
  // Fetch problem details if we only have an ID but no title
  const { data: problemData, isLoading: isLoadingProblem } = useQuery({
    queryKey: ['/api/problems', problemId],
    queryFn: async () => {
      if (!problemId) return null;
      const res = await fetch(`/api/problems/${problemId}`);
      if (!res.ok) throw new Error('Failed to fetch problem details');
      return res.json();
    },
    enabled: !!problemId && !problemTitle,
  });
  
  // Set problem title and other data from query result if available
  useEffect(() => {
    if (problemData) {
      if (!problemTitle) setProblemTitle(problemData.title);
      if (problemData.difficulty) setDifficulty(problemData.difficulty);
      if (problemData.category) setCategory(problemData.category);
      // Set other problem data as needed
    }
  }, [problemData, problemTitle]);
  
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
  
  const goBack = () => {
    // Go back to problem detail page if we have a problem ID, otherwise to dashboard
    if (problemId) {
      setLocation(`/problems/${problemId}`);
    } else {
      setLocation('/dashboard');
    }
  };

  // Function to get difficulty badge color
  const getDifficultyColor = (difficulty: string | null) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-500/15 text-green-500 hover:bg-green-500/20';
      case 'Medium': return 'bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/20';
      case 'Hard': return 'bg-red-500/15 text-red-500 hover:bg-red-500/20';
      default: return 'bg-green-500/15 text-green-500 hover:bg-green-500/20';
    }
  };
  
  return (
    <motion.div 
      variants={fadeIn("up")} 
      initial="hidden" 
      animate="show"
      className={cn(
        "flex flex-col w-full h-screen overflow-hidden",
        isFullscreen ? "p-0" : "p-4"
      )}
    >
      {!isFullscreen && (
        <div className="flex items-center justify-between mb-2">
          <Button 
            variant="ghost" 
            onClick={goBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> 
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refreshIframe} className="gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen} className="gap-1">
              <Maximize2 className="h-3.5 w-3.5" />
              Fullscreen
            </Button>
          </div>
        </div>
      )}
      
      <div className={cn(
        "flex flex-grow border rounded-lg overflow-hidden",
        isFullscreen ? "border-0 rounded-none" : "shadow-md"
      )}>
        {/* Left Panel - Problem Description */}
        <div className={cn(
          "flex flex-col overflow-y-auto",
          isFullscreen ? "hidden" : "w-2/5"
        )}>
          <div className="p-4 border-b flex flex-col gap-2">
            <div className="flex items-center gap-2 font-medium text-xl">
              {isLoadingProblem && problemId && !problemTitle ? (
                <Skeleton className="h-8 w-64" />
              ) : (
                problemTitle || "Reverse Linked List"
              )}
              <Code className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                {difficulty || 'Easy'}
              </Badge>
              
              {category && (
                <Badge variant="outline" className="bg-slate-100">
                  Type: {category}
                </Badge>
              )}
              
              {tags && tags.length > 0 && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                  {tags[0]}
                </Badge>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full bg-muted/50 rounded-none border-b">
              <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
              <TabsTrigger value="examples" className="flex-1">Examples</TabsTrigger>
              <TabsTrigger value="hints" className="flex-1">Hints</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="font-medium text-lg mb-2">Problem Description</h3>
                <p className="text-sm">{description}</p>
              </div>
              
              {companies && companies.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Companies:</h3>
                  <div className="flex gap-2 flex-wrap">
                    {companies.map((company, idx) => (
                      <Badge key={idx} variant="outline" className="bg-purple-500/10 text-purple-500">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="examples" className="mt-0">
              {examples.map((example, idx) => (
                <div key={idx} className="p-4 border-b last:border-b-0">
                  <h3 className="font-medium mb-2">Example {idx + 1}:</h3>
                  
                  <div className="mb-2">
                    <div className="text-sm font-medium mb-1">Input:</div>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs whitespace-pre">
                      {example.input}
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-sm font-medium mb-1">Output:</div>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs whitespace-pre">
                      {example.output}
                    </div>
                  </div>
                  
                  {example.explanation && (
                    <div>
                      <div className="text-sm font-medium mb-1">Explanation:</div>
                      <div className="text-xs">{example.explanation}</div>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="hints" className="p-4 space-y-4 mt-0">
              <Alert>
                <AlertDescription>
                  Consider using a three-pointer approach (prev, current, next) to reverse the linked list in-place.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Resizer */}
        {!isFullscreen && (
          <div className="w-1 hover:bg-blue-500 hover:cursor-col-resize flex-shrink-0 bg-border"></div>
        )}
        
        {/* Right Panel - Code Editor */}
        <div className={cn(
          "flex flex-col bg-background",
          isFullscreen ? "w-full" : "w-3/5"
        )}>
          {isFullscreen && (
            <div className="flex items-center justify-between p-2 border-b">
              <div className="font-medium">
                {problemTitle || "Reverse Linked List"} - Coding Environment
              </div>
              <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="gap-1">
                <Maximize2 className="h-3.5 w-3.5" />
                Exit Fullscreen
              </Button>
            </div>
          )}
          
          {containerUrl ? (
            <iframe 
              ref={iframeRef}
              src={containerUrl} 
              className="flex-grow w-full border-0"
              title="Coding Environment"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8">
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
      
      {/* Footer with controls - only visible when not in fullscreen */}
      {!isFullscreen && containerUrl && (
        <div className="py-2 px-4 mt-2 border rounded-lg flex items-center justify-between shadow-sm bg-background">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>Workspace running at:</span>
            <span className="font-mono text-xs truncate max-w-[300px]">{containerUrl}</span>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Button>
            <Button size="sm" variant="outline" onClick={refreshIframe} className="gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}