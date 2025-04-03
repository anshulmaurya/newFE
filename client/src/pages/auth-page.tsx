import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiGithub } from "react-icons/si";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Lock } from "lucide-react";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  
  // Check for error in URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const errorParam = searchParams.get("error");
    
    if (errorParam) {
      if (errorParam === "github_auth_failed") {
        setError("GitHub authentication failed. Please try again.");
      } else {
        setError("Authentication error. Please try again.");
      }
    }
  }, []);
  
  // Redirect to dashboard if already logged in
  if (!isLoading && user) {
    return <Redirect to="/dashboard" />;
  }
  
  const handleGitHubLogin = () => {
    window.location.href = "/api/auth/github";
  };
  
  const handleBackToDashboard = () => {
    setLocation("/dashboard");
  };
  
  return (
    <div className="fixed inset-0 bg-[rgb(24,24,26)] text-white flex items-center justify-center">
      <Card className="border-gray-800 bg-[rgb(30,30,32)] w-full max-w-md mx-4 shadow-xl">
        <CardHeader className="flex flex-col items-center text-center pb-2">
          <Lock className="h-10 w-10 text-primary mb-1" />
          <CardTitle className="text-xl font-bold text-white">
            Sign in to access DSPCoder
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-2">
          <p className="text-gray-400 text-center text-xs">
            Login with GitHub to access interactive features, track your progress, and start coding.
          </p>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            className="w-full py-4" 
            onClick={handleGitHubLogin}
          >
            <SiGithub className="mr-2 h-4 w-4" />
            <span>Continue with GitHub</span>
          </Button>
          
          <div className="text-center">
            <Button variant="link" onClick={handleBackToDashboard} className="text-sm h-8 px-2">
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}