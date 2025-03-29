import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(24,24,26)]">
      <div className="text-center p-8 max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="text-white">Project Mode</span> <span className="text-[rgb(214,251,65)]">Coming Soon</span>
        </h1>
        <p className="text-gray-300 text-lg mb-12">
          We're working hard to bring you the project mode with exciting features.
          Check back soon for updates!
        </p>
        <Link to="/">
          <a className="inline-flex items-center gap-2 px-6 py-3 bg-[rgb(214,251,65)] hover:bg-[rgb(194,231,45)] rounded-lg text-black font-bold transition-all shadow-[0_0_15px_rgba(214,251,65,0.5)] hover:shadow-[0_0_20px_rgba(214,251,65,0.7)] border border-[rgb(224,255,75)]">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </a>
        </Link>
      </div>
    </div>
  );
}