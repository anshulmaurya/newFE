import { useRef, useState, useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import Problems from "@/components/home/problems";
import Demo from "@/components/home/demo";
import Companies from "@/components/home/companies";
import Community from "@/components/home/community";
import PlatformFeatures from "@/components/home/platform-features";
import "@/styles/circuit.css";

export default function Home() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const problemsRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[rgb(24,24,26)] text-slate-200 font-sans min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="circuit-lines absolute inset-0 z-0 pointer-events-none"></div>
      
      <Header 
        onNavigateFeatures={() => scrollToSection(featuresRef)}
        onNavigateProblems={() => scrollToSection(problemsRef)}
        isScrolled={isScrolled}
      />
      
      <main className="flex-grow">
        <Hero 
          onScrollToFeatures={() => scrollToSection(featuresRef)}
        />
        
        {/* Features section removed as requested */}
        
        <div ref={problemsRef}>
          <Problems />
        </div>
        
        <Demo />
        
        <PlatformFeatures />
        
        <Companies />
        
        <Community />
      </main>
      
      <Footer />
    </div>
  );
}
