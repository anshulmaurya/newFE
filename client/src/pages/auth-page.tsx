import { Button } from "@/components/ui/button";
import { SiGithub } from "react-icons/si";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft, Code, LockKeyhole } from "lucide-react";
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
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#131314] via-[#1E1E20] to-[#131314] text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] right-[-10%] bottom-[-10%] opacity-30 z-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 400 + 100}px`,
                height: `${Math.random() * 400 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: 'radial-gradient(circle, rgba(0,200,255,0.1) 0%, rgba(0,200,255,0) 70%)',
                transform: `scale(${Math.random() * 0.8 + 0.6})`,
                animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Back to dashboard button */}
      <button 
        onClick={handleBackToDashboard}
        className="absolute top-5 left-5 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Dashboard</span>
      </button>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="relative bg-[rgba(30,30,32,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] shadow-2xl overflow-hidden">
          {/* Top design accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[rgb(214,251,65)] to-[rgb(224,255,75)]"></div>
          
          {/* Logo and title */}
          <div className="pt-8 pb-4 px-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-[rgb(214,251,65)] to-[rgb(224,255,75)] flex items-center justify-center">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Welcome to DSPCoder</h1>
            <p className="text-gray-400 text-sm">
              Sign in to access embedded systems interview prep resources
            </p>
          </div>
          
          {/* Error alert */}
          {error && (
            <div className="px-8 pb-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          
          {/* Login button */}
          <div className="px-8 pb-6">
            <Button 
              className="w-full py-6 bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)] border border-[rgb(224,255,75)] transition-all text-black"
              onClick={handleGitHubLogin}
            >
              <SiGithub className="mr-2 h-5 w-5" />
              <span className="font-medium">Continue with GitHub</span>
            </Button>
          </div>
          
          {/* Footer */}
          <div className="bg-[rgba(20,20,22,0.5)] py-4 px-8 text-xs text-center text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <LockKeyhole className="w-3 h-3" />
              <span>Secure login via GitHub's OAuth</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating code blocks - decorative */}
      <div className="absolute top-[15%] left-[10%] opacity-20 blur-[1px] transform -rotate-6 hidden md:block">
        <pre className="text-blue-300 text-xs">
          {`struct Node {
  int data;
  Node* next;
};`}
        </pre>
      </div>
      
      <div className="absolute bottom-[20%] right-[10%] opacity-20 blur-[1px] transform rotate-3 hidden md:block">
        <pre className="text-green-300 text-xs">
          {`void* thread_func(void* arg) {
  sem_wait(&mutex);
  // Critical section
  sem_post(&mutex);
}`}
        </pre>
      </div>
    </div>
  );
}