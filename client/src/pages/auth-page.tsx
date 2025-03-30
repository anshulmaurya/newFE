import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiGithub } from "react-icons/si";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  
  // Redirect to home if already logged in
  if (!isLoading && user) {
    return <Redirect to="/" />;
  }
  
  const handleGitHubLogin = () => {
    window.location.href = "/api/auth/github";
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Auth Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 md:p-10">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold">Welcome to DSPCoder</CardTitle>
              <CardDescription>
                Sign in to access your dashboard, track progress, and practice embedded system interview questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full py-6" 
                onClick={handleGitHubLogin}
              >
                <SiGithub className="mr-2 h-5 w-5" />
                <span>Continue with GitHub</span>
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-gray-500">
              By signing in, you agree to our Terms and Privacy Policy.
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Right side - Hero Section */}
      <div className="hidden lg:flex flex-col w-1/2 bg-black text-white p-10 justify-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-extrabold">
            <span className="block">Cracking Embedded</span>
            <span className="block text-primary">Interviews, Simplified.</span>
          </h1>
          <p className="text-lg text-gray-300">
            Practice real embedded systems interview questions from top companies. 
            Build your skills with hands-on tasks and realistic environments.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <div className="rounded-full bg-primary w-5 h-5 flex items-center justify-center mr-2">✓</div>
              <span>Realistic embedded code examples</span>
            </li>
            <li className="flex items-center">
              <div className="rounded-full bg-primary w-5 h-5 flex items-center justify-center mr-2">✓</div>
              <span>Interactive debugging environment</span>
            </li>
            <li className="flex items-center">
              <div className="rounded-full bg-primary w-5 h-5 flex items-center justify-center mr-2">✓</div>
              <span>Company-targeted practice bundles</span>
            </li>
            <li className="flex items-center">
              <div className="rounded-full bg-primary w-5 h-5 flex items-center justify-center mr-2">✓</div>
              <span>Join our community of embedded engineers</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}