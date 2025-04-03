import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, MessageSquare, ArrowLeft } from "lucide-react";
import { useLocation, Link } from "wouter";

export default function AboutUs() {
  const [_, setLocation] = useLocation();
  
  const navigateToFeatures = () => {
    setLocation("/#features");
  };
  
  const navigateToProblems = () => {
    setLocation("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-black app-container">
      <Header 
        onNavigateFeatures={navigateToFeatures}
        onNavigateProblems={navigateToProblems}
        isScrolled={true}
      />
      
      <main className="flex-grow pt-24 pb-40 scrollable-content">
        <div className="container mx-auto px-4 pt-4">
          <Button 
            variant="ghost" 
            className="mb-2 text-gray-400 hover:text-white"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
        
        {/* Hero Section */}
        <section className="relative bg-black py-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.8)] to-black z-10"></div>
            <div className="grid grid-cols-12 grid-rows-6 gap-1 opacity-20 w-full h-full absolute">
              {Array.from({ length: 72 }).map((_, i) => (
                <div key={i} className="bg-gray-500/10 rounded"></div>
              ))}
            </div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 py-1.5 px-4 bg-[rgba(214,251,65,0.1)] text-[rgb(214,251,65)] border border-[rgb(214,251,65)]/20">
                About dspcoder.com
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Making Embedded Systems Interviews <span className="text-[rgb(214,251,65)]">Accessible</span>
              </h1>
              <p className="text-xl text-gray-400 mb-10">
                We're a team of former MAANG+ interviewers and embedded systems engineers on a mission to help candidates master technical interviews through interactive learning.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="py-20 bg-[rgb(18,18,20)]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-10">
                <div className="h-0.5 flex-grow bg-[rgb(214,251,65)]/20"></div>
                <h2 className="text-3xl font-bold text-white px-6">Our Story</h2>
                <div className="h-0.5 flex-grow bg-[rgb(214,251,65)]/20"></div>
              </div>
              
              <div className="prose prose-lg max-w-none text-gray-300 prose-headings:text-white prose-strong:text-[rgb(214,251,65)]">
                <p>
                  dspcoder.com was born from a simple observation: <strong>embedded systems interview preparation is unnecessarily difficult</strong>. While software engineers have countless platforms to prepare for coding interviews, embedded systems engineers have limited resources that don't reflect the unique challenges of the field.
                </p>
                <p>
                  Founded by a team of experienced embedded systems engineers who have conducted hundreds of technical interviews at leading technology companies, we set out to create the resource we wish we had when preparing for our own interviews.
                </p>
                <p>
                  Our platform is designed to bridge the gap between theoretical knowledge and practical application, providing a comprehensive environment where embedded systems engineers can practice realistic interview scenarios, solve industry-relevant problems, and develop the skills that actually matter in technical interviews.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Mission Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-xl text-gray-400">
                To demystify the embedded systems interview process and empower engineers to showcase their true capabilities.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-[rgb(24,24,26)] border border-gray-800 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="h-12 w-12 bg-[rgba(214,251,65,0.1)] rounded-lg flex items-center justify-center mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(214,251,65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Realistic Practice</h3>
                  <p className="text-gray-400">
                    Provide authentic interview questions and scenarios based on real industry experience.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[rgb(24,24,26)] border border-gray-800 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="h-12 w-12 bg-[rgba(214,251,65,0.1)] rounded-lg flex items-center justify-center mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(214,251,65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"></path>
                      <path d="M12 13v9"></path>
                      <path d="M12 2v4"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Interactive Learning</h3>
                  <p className="text-gray-400">
                    Create an engaging environment where theory meets practical application through hands-on code simulation.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[rgb(24,24,26)] border border-gray-800 text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="h-12 w-12 bg-[rgba(214,251,65,0.1)] rounded-lg flex items-center justify-center mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(214,251,65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Community Support</h3>
                  <p className="text-gray-400">
                    Foster a supportive community where engineers can learn from each other and industry experts.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-16 bg-[rgb(24,24,26)]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-[rgb(20,20,22)] to-[rgb(30,30,32)] rounded-2xl p-10 border border-gray-800/50">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
                <p className="text-xl text-gray-400 mb-8">
                  We're just getting started, and we'd love to have you be part of our journey. Sign up today to get early access to all our features.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth">
                    <Button className="py-6 text-black font-medium bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)]">
                      Get Started for Free
                    </Button>
                  </Link>
                  <a href="https://discord.gg/HxAqXd8Xwt" target="_blank" rel="noopener noreferrer">
                    <Button className="py-6 font-medium" variant="outline">
                      Join Our Discord
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
              <p className="text-xl text-gray-400">
                Have questions or feedback? We'd love to hear from you.
              </p>
              
              <div className="flex justify-center gap-6 mt-8">
                <a href="mailto:contact@dspcoder.com" className="flex items-center gap-2 text-gray-300 hover:text-[rgb(214,251,65)] transition-colors">
                  <MessageSquare size={20} />
                  <span>contact@dspcoder.com</span>
                </a>
                <a href="https://github.com/dspcoder" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-[rgb(214,251,65)] transition-colors">
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
                <a href="https://linkedin.com/company/dspcoder" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-[rgb(214,251,65)] transition-colors">
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}