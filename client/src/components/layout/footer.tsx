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
              <div className="h-8 w-8 flex items-center justify-center">
                <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 10C15 7.23858 17.2386 5 20 5H35C37.7614 5 40 7.23858 40 10C40 12.7614 37.7614 15 35 15H20C17.2386 15 15 12.7614 15 10Z" fill="#d6fb41"/>
                  <path d="M85 90C85 92.7614 82.7614 95 80 95H65C62.2386 95 60 92.7614 60 90C60 87.2386 62.2386 85 65 85H80C82.7614 85 85 87.2386 85 90Z" fill="#d6fb41"/>
                  <path d="M10 25C10 22.2386 12.2386 20 15 20C17.7614 20 20 22.2386 20 25V75C20 77.7614 17.7614 80 15 80C12.2386 80 10 77.7614 10 75V25Z" fill="#d6fb41"/>
                  <path d="M90 75C90 77.7614 87.7614 80 85 80C82.2386 80 80 77.7614 80 75V25C80 22.2386 82.2386 20 85 20C87.7614 20 90 22.2386 90 25V75Z" fill="#d6fb41"/>
                  <path d="M34 50C34 47.2386 36.2386 45 39 45C41.7614 45 44 47.2386 44 50C44 52.7614 41.7614 55 39 55C36.2386 55 34 52.7614 34 50Z" fill="#d6fb41"/>
                  <path d="M75 50C75 40 65 30 50 30" stroke="#d6fb41" strokeWidth="5" strokeLinecap="round"/>
                  <path d="M25 50C25 60 35 70 50 70" stroke="#d6fb41" strokeWidth="5" strokeLinecap="round"/>
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
