import { useRef } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import Problems from "@/components/home/problems";
import Demo from "@/components/home/demo";
import Companies from "@/components/home/companies";
import "@/styles/circuit.css";

export default function Home() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const problemsRef = useRef<HTMLDivElement>(null);
  
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[rgb(24,24,26)] text-slate-200 font-sans min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="circuit-lines absolute inset-0 z-0 pointer-events-none"></div>
      
      <Header 
        onNavigateFeatures={() => scrollToSection(featuresRef)}
        onNavigateProblems={() => scrollToSection(problemsRef)}
      />
      
      <main className="flex-grow">
        <Hero 
          onScrollToFeatures={() => scrollToSection(featuresRef)}
        />
        
        <div ref={featuresRef}>
          <Features />
        </div>
        
        <div ref={problemsRef}>
          <Problems />
        </div>
        
        <Demo />
        
        <Companies />
      </main>
      
      <Footer />
    </div>
  );
}
