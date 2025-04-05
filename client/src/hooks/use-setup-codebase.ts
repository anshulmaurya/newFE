import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface SetupCodebaseParams {
  problemId: string;
  questionId?: string;
  language: string;
}

/**
 * Hook to handle codebase setup for a problem
 * This will navigate immediately to the coding environment page and show a loading state
 * while the API call is made in the background
 */
export function useSetupCodebase() {
  const { toast } = useToast();
  
  // Setup codebase mutation
  const setupCodebaseMutation = useMutation({
    mutationFn: async ({ questionId, language }: { questionId?: string, language: string }) => {
      if (!questionId) throw new Error("Question ID is missing");
      
      const res = await apiRequest("POST", "/api/setup-codebase", { 
        questionId: questionId,
        language: language 
      });
      return await res.json();
    },
    onSuccess: (data) => {
      // After successful setup, we don't need to do anything
      // as the user is already on the coding environment page
      console.log('Codebase setup successful:', data);
    },
    onError: (error) => {
      // Show error toast but don't redirect - user is already on coding page
      toast({
        title: "Background setup error",
        description: "Environment setup encountered an issue: " + (error as Error).message,
        variant: "destructive",
      });
    }
  });

  return {
    setupCodebase: (params: SetupCodebaseParams) => {
      const { problemId, questionId, language } = params;
      
      // Show a toast notification to inform the user that their environment is being prepared
      toast({
        title: "Setting up your environment",
        description: "Your coding environment is being prepared. Please wait...",
        duration: 5000, // Show for 5 seconds
      });
      
      // Navigate to the coding environment immediately
      const encodedTitle = encodeURIComponent(problemId || 'Coding Problem');
      const questionIdParam = questionId ? `&questionId=${encodeURIComponent(questionId)}` : '';
      
      // Navigate to the IDE page
      window.location.href = `/coding-environment?id=${problemId}${questionIdParam}&language=${language}`;
      
      // Also trigger the API call in the background
      if (questionId) {
        setupCodebaseMutation.mutate({ questionId, language });
      }
    }
  };
}