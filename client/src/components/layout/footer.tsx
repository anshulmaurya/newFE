import { Twitter, Linkedin, Github, MessageSquare } from "lucide-react";

interface FooterProps {
  onScrollToWaitlist: () => void;
}

export default function Footer({ onScrollToWaitlist }: FooterProps) {
  return (
    <footer className="py-10 border-t border-slate-700/30 relative">
      <div className="circuit-lines absolute inset-0 z-0 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-900 font-bold font-display text-lg">
                ES
              </div>
              <h2 className="font-display font-bold text-lg tracking-tight">
                <span className="text-white">Embedded</span><span className="text-primary">Systems</span>
              </h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Master embedded programming with interactive practice and real-world challenges.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Problem Categories</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Learning Paths</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Community</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-slate-700/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} EmbeddedSystems.io. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={onScrollToWaitlist}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
            >
              Join the Waitlist
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
