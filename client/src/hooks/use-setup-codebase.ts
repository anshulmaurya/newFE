import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
// Removed toast import since we're removing all notifications
import { useLocation } from 'wouter';

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
  // No toast imports or usage - removed
  const [, navigate] = useLocation();
  
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
      // After successful setup, we store the container token in localStorage
      console.log('Codebase setup successful:', data);
      
      if (data.containerToken) {
        localStorage.setItem('containerToken', data.containerToken);
      }
    },
    onError: (error) => {
      // Log error but don't show toast - user requested no popups
      console.error("Background setup error:", (error as Error).message);
    }
  });

  return {
    setupCodebase: (params: SetupCodebaseParams) => {
      const { problemId, questionId, language } = params;
      
      // Generate a temporary container token for immediate navigation
      const tempToken = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // No toast notifications as per user request
      // We'll just navigate immediately and handle setup in the background
      
      // IMPORTANT: Navigate immediately to the coding environment
      // with the temporary token to prevent UI freezing
      const queryParams = new URLSearchParams({
        id: problemId,
        language: language,
        containerToken: tempToken
      });
      
      if (questionId) {
        queryParams.append('questionId', questionId);
      }
      
      // Use wouter navigation to avoid full page reload - DO THIS FIRST
      navigate(`/coding-environment?${queryParams.toString()}`);
      
      // THEN trigger the API call to set up the codebase in the background
      // This will run after navigation, preventing UI freeze
      if (questionId) {
        // Store temporary token in localStorage until real one arrives
        localStorage.setItem('containerToken', tempToken);
        
        setTimeout(() => {
          setupCodebaseMutation.mutate({ 
            questionId, 
            language 
          }, {
            onSuccess: (data) => {
              if (data.containerToken) {
                // Update the token in localStorage with the real one
                localStorage.setItem('containerToken', data.containerToken);
                
                // No need to navigate again, the WebSocket updates will handle
                // updating the container status in the already-loaded coding page
                console.log('Container setup completed in background, token:', data.containerToken);
              }
            }
          });
        }, 100); // Small delay to ensure navigation completes first
      }
    }
  };
}