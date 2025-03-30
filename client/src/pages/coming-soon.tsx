import { useState } from "react";
import { ArrowLeft, BellRing, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // In a real scenario, we would send this to a backend API
    console.log("Submitted email:", email);
    setIsSubmitted(true);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(24,24,26)]">
      <div className="text-center p-8 max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="text-white">Project Mode</span> <span className="text-[#56B2FF]">Coming Soon</span>
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          We're working hard to bring you the project mode with exciting features.
          Get notified when we launch!
        </p>
        
        <div className="mb-10 p-6 bg-[rgb(30,30,32)] rounded-xl border border-gray-700">
          <div className="flex items-center mb-4">
            <BellRing className="text-[#56B2FF] mr-2" size={22} />
            <h2 className="text-white text-xl font-semibold">Get Notified</h2>
          </div>
          
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-4">
              <CheckCircle className="text-[#56B2FF] mb-2" size={40} />
              <p className="text-gray-200 mb-1">Thank you for your interest!</p>
              <p className="text-gray-400 text-sm">We'll notify you when Project Mode launches.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col items-start">
                <label htmlFor="email" className="text-gray-300 text-sm mb-1 self-start">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-[rgb(40,40,42)] border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#56B2FF] focus:border-transparent"
                />
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-[#56B2FF] hover:bg-[#3D9DF5] rounded-md text-white font-medium transition-all shadow-[0_0_15px_rgba(86,178,255,0.3)] hover:shadow-[0_0_20px_rgba(86,178,255,0.5)] border border-[#78C1FF]"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link to="/">
            <a className="inline-flex items-center gap-2 px-5 py-2.5 bg-[rgb(40,40,42)] hover:bg-[rgb(50,50,52)] rounded-lg text-white transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </a>
          </Link>
          
          <a 
            href="https://discord.gg/HxAqXd8Xwt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5865F2] hover:bg-[#4a57e0] rounded-lg text-white transition-all"
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
            Join Our Discord
          </a>
        </div>
        
        <p className="text-gray-500 text-sm">
          Stay connected and be the first to know when we launch. We're excited to bring you an amazing project experience!
        </p>
      </div>
    </div>
  );
}