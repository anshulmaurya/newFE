import { useRef } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import Problems from "@/components/home/problems";
import Demo from "@/components/home/demo";
import Companies from "@/components/home/companies";
import WaitlistForm from "@/components/ui/waitlist-form";
import "@/styles/circuit.css";

export default function Home() {
  const waitlistRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const problemsRef = useRef<HTMLDivElement>(null);
  
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-primary-900 text-slate-200 font-sans min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="circuit-lines absolute inset-0 z-0 pointer-events-none"></div>
      
      <Header 
        onNavigateFeatures={() => scrollToSection(featuresRef)}
        onNavigateProblems={() => scrollToSection(problemsRef)}
        onNavigateWaitlist={() => scrollToSection(waitlistRef)} 
      />
      
      <main className="flex-grow">
        <Hero 
          onScrollToFeatures={() => scrollToSection(featuresRef)}
          onScrollToWaitlist={() => scrollToSection(waitlistRef)}
        />
        
        <div ref={featuresRef}>
          <Features />
        </div>
        
        <div ref={problemsRef}>
          <Problems />
        </div>
        
        <Demo />
        
        <div ref={waitlistRef} id="waitlist" className="py-16 md:py-24 relative">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary-900 to-transparent pointer-events-none"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto glass rounded-xl p-8 border border-slate-700/30">
              <div className="text-center mb-8">
                <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
                  <span className="text-white">Join the</span>
                  <span className="text-primary"> Waitlist</span>
                </h2>
                <p className="text-slate-300">
                  Be the first to get access when we launch. Early subscribers will receive special perks and discounts.
                </p>
              </div>
              
              <WaitlistForm />
              
              <div className="mt-6 text-center text-sm text-slate-400">
                By joining, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
              </div>
            </div>
          </div>
        </div>
        
        <Companies />
      </main>
      
      <Footer onScrollToWaitlist={() => scrollToSection(waitlistRef)} />
    </div>
  );
}
