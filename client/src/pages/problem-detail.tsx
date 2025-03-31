import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import SubpageLayout from "@/components/layout/subpage-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ExternalLink, PlayCircle, CheckCircle, BookOpen, GraduationCap, Code } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  content?: string;
  hints?: string[];
  code_template?: string;
  solution?: string;
  tags?: string[];
  type?: string;
  acceptance_rate?: string;
  companies?: string[];
  question_id?: string; // Added this field based on MongoDB data
}

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("description");

  // Fetch problem details
  const { data: problem, isLoading, error } = useQuery<Problem>({
    queryKey: ["/api/problems", id],
    queryFn: async () => {
      const res = await fetch(`/api/problems/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch problem");
      }
      return res.json();
    },
  });

  // Setup codebase mutation
  const setupCodebaseMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Problem ID is required");
      if (!problem) throw new Error("Problem data is not loaded");
      if (!problem.question_id) throw new Error("Question ID is missing in problem data");
      
      // Use the question_id field from MongoDB instead of the id field
      const res = await apiRequest("POST", "/api/setup-codebase", { 
        questionId: problem.question_id 
      });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Codebase setup successful",
        description: "Your coding environment is ready. You'll be redirected momentarily.",
      });
      
      // Redirect to coding environment page with the container URL
      if (data && data.containerUrl) {
        // Encode the URL to pass it as a query parameter
        const encodedUrl = encodeURIComponent(data.containerUrl);
        const encodedTitle = encodeURIComponent(problem?.title || 'Coding Problem');
        
        // Include the question_id if available for direct API call
        const questionIdParam = problem?.question_id ? 
          `&questionId=${encodeURIComponent(problem.question_id)}` : '';
        
        // Redirect to the coding environment page
        setLocation(`/coding-environment?containerUrl=${encodedUrl}&problemId=${id}${questionIdParam}&title=${encodedTitle}`);
      } else {
        toast({
          title: "Missing container URL",
          description: "The environment was set up, but we couldn't get the container URL.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Setup failed",
        description: error.message || "Failed to set up the coding environment",
        variant: "destructive",
      });
    },
  });

  // Handle setup codebase
  const handleSetupCodebase = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to start coding",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }
    
    setupCodebaseMutation.mutate();
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-500 bg-green-500/10';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'hard':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  if (isLoading) {
    return (
      <SubpageLayout title="Problem">
        <div className="py-10">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <div className="flex gap-2 mb-6">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-48 w-full mb-8" />
            <Skeleton className="h-8 w-40" />
          </div>
        </div>
      </SubpageLayout>
    );
  }

  if (error || !problem) {
    return (
      <SubpageLayout title="Problem">
        <div className="py-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Problem not found</h2>
            <p className="text-gray-400 mb-6">We couldn't find the problem you're looking for.</p>
            <Button onClick={() => setLocation("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </SubpageLayout>
    );
  }

  return (
    <SubpageLayout title="Problem">
      <div className="py-4 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            <Card className="border-[rgb(35,35,40)] bg-[rgb(18,18,20)]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl md:text-2xl font-bold">{problem.title}</CardTitle>
                  <Badge className={`px-3 py-1 ${getDifficultyColor(problem.difficulty || 'Medium')}`}>
                    {problem.difficulty || 'Medium'}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400 flex flex-wrap gap-2 mt-2">
                  {problem.tags?.map((tag, idx) => (
                    <Badge key={idx} className="bg-transparent text-gray-400 border border-gray-700">
                      {tag}
                    </Badge>
                  ))}
                  {!problem.tags?.length && (
                    <Badge className="bg-transparent text-gray-400 border border-gray-700">
                      {problem.type || "embedded"}
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-4 bg-[rgb(24,24,26)]">
                    <TabsTrigger value="description" className="data-[state=active]:bg-[rgb(35,35,40)]">
                      Description
                    </TabsTrigger>
                    <TabsTrigger value="hints" className="data-[state=active]:bg-[rgb(35,35,40)]">
                      Hints
                    </TabsTrigger>
                    <TabsTrigger value="solution" className="data-[state=active]:bg-[rgb(35,35,40)]">
                      Solution
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="p-2">
                    <div 
                      className="prose prose-sm prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: problem.content || problem.description || 'No description available.' }}
                    />
                  </TabsContent>
                  
                  <TabsContent value="hints" className="space-y-4 p-2">
                    {problem.hints && problem.hints.length > 0 ? (
                      <div className="space-y-4">
                        {problem.hints.map((hint, idx) => (
                          <div key={idx} className="bg-[rgb(24,24,26)] p-4 rounded-md">
                            <h3 className="font-medium mb-2">Hint {idx + 1}</h3>
                            <p className="text-gray-400">{hint}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-[rgb(24,24,26)] p-6 rounded-md text-center">
                        <BookOpen className="h-8 w-8 text-gray-500 mx-auto mb-3" />
                        <h3 className="font-medium mb-1">No hints available</h3>
                        <p className="text-gray-400 text-sm">
                          Try to solve this problem on your own first.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="solution" className="p-2">
                    {problem.solution ? (
                      <div 
                        className="prose prose-sm prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: problem.solution }}
                      />
                    ) : (
                      <div className="bg-[rgb(24,24,26)] p-6 rounded-md text-center">
                        <GraduationCap className="h-8 w-8 text-gray-500 mx-auto mb-3" />
                        <h3 className="font-medium mb-1">Solution locked</h3>
                        <p className="text-gray-400 text-sm">
                          Try to solve the problem first before viewing the solution.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:w-1/4">
            <Card className="border-[rgb(35,35,40)] bg-[rgb(18,18,20)]">
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleSetupCodebase}
                  className="w-full bg-[rgb(214,251,65)] text-black hover:bg-[rgb(214,251,65)]/90 gap-2"
                  disabled={setupCodebaseMutation.isPending}
                >
                  {setupCodebaseMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <PlayCircle className="h-4 w-4" />
                  )}
                  {setupCodebaseMutation.isPending ? 'Setting up...' : 'Start Coding'}
                </Button>
                
                <Separator className="my-4 bg-[rgb(35,35,40)]" />
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Acceptance Rate:</span>
                    <span>{problem.acceptance_rate || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Category:</span>
                    <span>{problem.type || 'Embedded Systems'}</span>
                  </div>
                </div>
                
                {problem.companies && problem.companies.length > 0 && (
                  <>
                    <Separator className="my-4 bg-[rgb(35,35,40)]" />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Companies</h4>
                      <div className="flex flex-wrap gap-2">
                        {problem.companies.map((company, idx) => (
                          <Badge key={idx} variant="outline" className="bg-[rgb(30,30,32)]">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                <Separator className="my-4 bg-[rgb(35,35,40)]" />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Related Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags?.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="bg-[rgb(30,30,32)]">
                        {tag}
                      </Badge>
                    ))}
                    {!problem.tags?.length && (
                      <Badge variant="outline" className="bg-[rgb(30,30,32)]">
                        {problem.type || "Embedded Systems"}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SubpageLayout>
  );
}