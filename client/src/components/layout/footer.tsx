import { Twitter, Linkedin, Github, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-10 relative bg-[rgb(24,24,26)]">
      <div className="circuit-lines absolute inset-0 z-0 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 flex items-center justify-center">
                <svg version="1.1" viewBox="0.0 0.0 100.0 100.0" fill="none" stroke="none" strokeLinecap="square" strokeMiterlimit="10" width="30" height="30">
                  <clipPath id="p.0">
                    <path d="m0 0l100.0 0l0 100.0l-100.0 0l0 -100.0z" clipRule="nonzero"/>
                  </clipPath>
                  <g clipPath="url(#p.0)">
                    <path fill="#000000" fillOpacity="0.0" d="m0 0l100.0 0l0 100.0l-100.0 0z" fillRule="evenodd"/>
                    <path fill="#000000" fillOpacity="0.0" d="m10.431272 9.52057l75.28909 0l0 80.957825l-75.28909 0z" fillRule="evenodd"/>
                    <path stroke="#d6fb41" strokeWidth="2.0" strokeLinejoin="round" strokeLinecap="butt" strokeDasharray="8.0,3.0,1.0,3.0" d="m10.431272 9.52057l75.28909 0l0 80.957825l-75.28909 0z" fillRule="evenodd"/>
                    <path fill="#000000" fillOpacity="0.0" d="m21.61335 20.375572l52.90764 0l0 59.226234l-52.90764 0z" fillRule="evenodd"/>
                    <path stroke="#d6fb41" strokeWidth="2.0" strokeLinejoin="round" strokeLinecap="butt" d="m21.61335 20.375572l52.90764 0l0 59.226234l-52.90764 0z" fillRule="evenodd"/>
                  </g>
                </svg>
              </div>
              <h2 className="font-display font-bold text-lg tracking-tight">
                <span className="text-white">dsp</span><span className="text-[rgb(214,251,65)]">coder.com</span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Master embedded programming with interactive practice and real-world challenges.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">Problem Categories</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">Learning Paths</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">Community</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[rgb(214,251,65)] transition-colors">Terms of Service</a></li>
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
