import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useLocation } from "wouter";

export default function Pricing() {
  const [_, setLocation] = useLocation();
  
  const navigateToFeatures = () => {
    setLocation("/#features");
  };
  
  const navigateToProblems = () => {
    setLocation("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header 
        onNavigateFeatures={navigateToFeatures}
        onNavigateProblems={navigateToProblems}
        isScrolled={true}
      />
      
      <main className="flex-grow container mx-auto px-4 py-12 pt-24">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            All features are currently free to use as we're in the early access phase. Paid plans will be introduced in the future.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
          {/* Free Tier */}
          <Card className="bg-[rgb(24,24,26)] border border-gray-800 text-white shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold">Free Access</CardTitle>
                <Badge className="bg-blue-600 text-white">CURRENT</Badge>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-400 mb-6">Free access to all features during our early access phase</p>
              <ul className="space-y-3">
                <FeatureItem>Access to public problem database</FeatureItem>
                <FeatureItem>Basic problem filtering</FeatureItem>
                <FeatureItem>Practice coding environment</FeatureItem>
                <FeatureItem>Limited notes access</FeatureItem>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full py-6 text-black font-medium bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)]">
                Current Plan
              </Button>
            </CardFooter>
          </Card>
          
          {/* Pro Tier (Coming Soon) */}
          <Card className="bg-[rgb(24,24,26)] border border-gray-800 text-white shadow-xl relative overflow-hidden transform transition-all md:scale-105">
            <div className="absolute -right-12 top-6 rotate-45 bg-[rgb(214,251,65)] text-black py-1 px-12 text-sm font-semibold shadow-lg">
              COMING SOON
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold">Pro</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$XX</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-400 mb-6">Enhanced features for serious interview preparation</p>
              <ul className="space-y-3">
                <FeatureItem>Everything in Free tier</FeatureItem>
                <FeatureItem>Advanced problem filtering</FeatureItem>
                <FeatureItem>Enhanced coding environment</FeatureItem>
                <FeatureItem>Progress tracking & analytics</FeatureItem>
                <FeatureItem>Full notes access</FeatureItem>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full py-6 font-medium" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
          
          {/* Team Tier (Coming Soon) */}
          <Card className="bg-[rgb(24,24,26)] border border-gray-800 text-white shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold">Team</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$XX</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-400 mb-6">Designed for teams preparing together</p>
              <ul className="space-y-3">
                <FeatureItem>Everything in Pro tier</FeatureItem>
                <FeatureItem>Team management dashboard</FeatureItem>
                <FeatureItem>Collaborative problem solving</FeatureItem>
                <FeatureItem>Team progress reports</FeatureItem>
                <FeatureItem>Custom content & challenges</FeatureItem>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full py-6 font-medium" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-20 max-w-3xl mx-auto bg-[rgb(30,30,32)] rounded-xl p-8 border border-gray-800/50">
          <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">When will paid plans be available?</h3>
              <p className="text-gray-400">We're currently focused on building the best platform possible. Paid plans will be introduced once we've established a comprehensive feature set that delivers exceptional value.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Will current free features become paid in the future?</h3>
              <p className="text-gray-400">We're committed to maintaining a valuable free tier. While some advanced features may move to paid plans, core learning and practice capabilities will remain available to all users.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Will there be educational or non-profit discounts?</h3>
              <p className="text-gray-400">Yes, we plan to offer special pricing for educational institutions, non-profits, and students. Contact us for more information when paid plans launch.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start">
      <span className="mr-3 mt-1 text-[rgb(214,251,65)]">
        <Check size={16} className="stroke-[3]" />
      </span>
      <span className="text-gray-300">{children}</span>
    </li>
  );
}