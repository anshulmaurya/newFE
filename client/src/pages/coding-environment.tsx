import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animation-utils';

export default function CodingEnvironment() {
  const [, setLocation] = useLocation();
  const [containerUrl, setContainerUrl] = useState<string | null>(null);
  const [problemId, setProblemId] = useState<string | null>(null);
  const [problemTitle, setProblemTitle] = useState<string | null>(null);
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
  
  // Set problem title from query result if available
  useEffect(() => {
    if (problemData && !problemTitle) {
      setProblemTitle(problemData.title);
    }
  }, [problemData, problemTitle]);
  
  const handleOpenEditor = () => {
    if (containerUrl) {
      // Open the container URL in a new tab
      window.open(containerUrl, '_blank', 'noopener,noreferrer');
      
      // Show success toast
      toast({
        title: "Editor opened in new tab",
        description: "You can now start coding in the online environment",
        variant: "default",
      });
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
  
  return (
    <motion.div 
      variants={fadeIn("up")} 
      initial="hidden" 
      animate="show"
      className="container py-8 max-w-4xl"
    >
      <Button 
        variant="ghost" 
        onClick={goBack}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to {problemId ? 'Problem' : 'Dashboard'}
      </Button>
      
      <Card className="shadow-lg border-2">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            {isLoadingProblem && problemId && !problemTitle ? (
              <Skeleton className="h-8 w-64" />
            ) : (
              problemTitle || "Coding Environment"
            )}
          </CardTitle>
          <CardDescription>
            Online IDE and development environment for solving embedded problems
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {containerUrl ? (
            <>
              <Alert className="mb-6">
                <Check className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  Your coding environment is ready! Click the button below to open it in a new tab.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  You'll be redirected to a fully configured VS Code-like environment where you can write, compile, and test your code. All necessary libraries and configurations are pre-installed.
                </p>
                
                <div className="p-4 bg-muted rounded-lg break-all">
                  <p className="font-mono text-xs">
                    <span className="text-muted-foreground mr-2">Environment URL:</span> 
                    {containerUrl}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Container URL not found. Please go back and try setting up the codebase again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={goBack}>
            Cancel
          </Button>
          
          <Button 
            onClick={handleOpenEditor} 
            disabled={!containerUrl}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open Coding Environment
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}