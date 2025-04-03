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
    <div className="bg-[rgb(24,24,26)] text-white min-h-screen flex items-center justify-center p-4">
      <Card className="border-gray-800 bg-[rgb(30,30,32)] w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-2 text-center">
          <Lock className="h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-2xl font-bold text-white">
            Sign in to access DSPCoder
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-gray-400 text-center">
            Login with GitHub to access interactive features, track your progress, and start coding.
          </p>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            className="w-full py-6" 
            onClick={handleGitHubLogin}
          >
            <SiGithub className="mr-2 h-5 w-5" />
            <span>Continue with GitHub</span>
          </Button>
          
          <div className="text-center">
            <Button variant="link" onClick={handleBackToDashboard}>
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}