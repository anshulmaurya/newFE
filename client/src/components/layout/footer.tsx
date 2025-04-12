import { useLocation } from "wouter";

export default function Footer() {
  const [_, navigate] = useLocation();
  return (
    <footer className="py-10 relative bg-[rgb(24,24,26)] w-full">
      <div className="circuit-lines absolute inset-0 z-0 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-9 w-9 flex items-center justify-center mr-1">
                <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Left curly brace */}
                  <path d="M30 20C24 20 20 25 20 32V40C20 46 16 48 10 48C16 48 20 50 20 56V64C20 71 24 76 30 76" stroke="#d6fb41" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                  
                  {/* Right curly brace */}
                  <path d="M70 20C76 20 80 25 80 32V40C80 46 84 48 90 48C84 48 80 50 80 56V64C80 71 76 76 70 76" stroke="#d6fb41" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                  
                  {/* Forward slash in the middle */}
                  <path d="M50 20L50 80" stroke="#d6fb41" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" transform="rotate(15 50 50)"/>
                </svg>
              </div>
              <h2 className="font-display font-bold text-lg tracking-tight">
                <span className="text-white">dsp</span><span className="text-[rgb(214,251,65)]">coder.com</span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Master embedded programming with interactive practice and real-world challenges.
            </p>
            {/* Social media links removed as requested */}
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a onClick={() => navigate("/terms-of-service")} className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors cursor-pointer">Terms of Service</a></li>
              <li><a onClick={() => navigate("/privacy-policy")} className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors cursor-pointer">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Site</h3>
            <ul className="space-y-2 text-sm">
              <li><a onClick={() => navigate("/pricing")} className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors cursor-pointer">Pricing</a></li>
              <li><a onClick={() => navigate("/about-us")} className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors cursor-pointer">About Us</a></li>
              <li><a href="mailto:contact@dspcoder.com" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-700/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} dspcoder.com. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a 
              href="https://discord.gg/embeddeddev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#5865F2] hover:bg-[#4a57e0] rounded-lg text-sm text-white transition-colors inline-flex items-center gap-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 127.14 96.36"
                fill="currentColor"
              >
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
