import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import { ChevronDown } from 'lucide-react';
import { Link } from 'wouter';

interface SubpageLayoutProps {
  title: string;
  children?: React.ReactNode;
}

export default function SubpageLayout({ title, children }: SubpageLayoutProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Function to handle navigation to different sections
  const handleNavigateFeatures = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleNavigateProblems = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Toggle section expansion in sidebar
  const toggleSection = (section: string) => {
    setExpandedSection(prev => {
      if (prev === section) {
        return null;
      }
      return section;
    });
  };

  return (
    <div className="bg-[rgb(14,14,16)] text-white h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header 
        onNavigateFeatures={handleNavigateFeatures}
        onNavigateProblems={handleNavigateProblems}
        isScrolled={true}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - fixed */}
        <div className="hidden lg:block w-56 bg-[rgb(14,14,16)] fixed left-0 top-16 bottom-0 overflow-y-auto border-r border-[rgb(35,35,40)]">
          <div className="px-4 py-4 flex flex-col h-full">
            <Link href="/dashboard">
              <a className="block text-white text-sm font-medium py-2 px-3 bg-[rgb(24,24,27)] rounded-md mb-3">
                Dashboard
              </a>
            </Link>
            
            {/* Quick Prep Bundles */}
            <div className="mb-4">
              <button 
                className="flex justify-between items-center w-full text-gray-200 hover:text-white text-sm py-2 px-3 rounded-md transition-colors"
                onClick={() => toggleSection('quick-prep')}
              >
                <span>Quick Prep Bundles</span>
                <span><ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'quick-prep' ? 'rotate-180' : ''}`} /></span>
              </button>
              
              {expandedSection === 'quick-prep' && (
                <div className="mt-1 pl-3">
                  <Link href="/quick-prep/blind-75">
                    <a className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left block">
                      Blind 75
                    </a>
                  </Link>
                  
                  <Link href="/quick-prep/linux-basics">
                    <a className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left block">
                      Linux Basics
                    </a>
                  </Link>
                  
                  <Link href="/quick-prep/embedded-essentials">
                    <a className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left block">
                      Embedded Essentials
                    </a>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Target Companies */}
            <div className="mb-4">
              <button 
                className="flex justify-between items-center w-full text-gray-200 hover:text-white text-sm py-2 px-3 rounded-md transition-colors"
                onClick={() => toggleSection('target-companies')}
              >
                <span>Target Companies</span>
                <span><ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'target-companies' ? 'rotate-180' : ''}`} /></span>
              </button>
              
              {expandedSection === 'target-companies' && (
                <div className="mt-1 pl-3">
                  <Link href="/companies/arm">
                    <a className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left block">
                      ARM
                    </a>
                  </Link>
                  
                  <Link href="/companies/amd">
                    <a className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left block">
                      AMD
                    </a>
                  </Link>
                  
                  <Link href="/companies/nvidia">
                    <a className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left block">
                      NVIDIA
                    </a>
                  </Link>
                </div>
              )}
            </div>
            
            {/* JD Based */}
            <div className="mb-4">
              <button 
                className="flex justify-between items-center w-full text-gray-200 hover:text-white text-sm py-2 px-3 rounded-md transition-colors"
                onClick={() => toggleSection('jd-based')}
              >
                <span>JD Based</span>
                <span><ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'jd-based' ? 'rotate-180' : ''}`} /></span>
              </button>
              
              {expandedSection === 'jd-based' && (
                <div className="mt-1 pl-3">
                  <Link href="/jd-based">
                    <a className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left block">
                      Enter Job Description
                    </a>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Time-Based Prep */}
            <div className="mb-4">
              <button 
                className="flex justify-between items-center w-full text-gray-200 hover:text-white text-sm py-2 px-3 rounded-md transition-colors"
                onClick={() => toggleSection('time-based')}
              >
                <span>Time-Based Prep</span>
                <span><ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'time-based' ? 'rotate-180' : ''}`} /></span>
              </button>
              
              {expandedSection === 'time-based' && (
                <div className="mt-1 pl-3">
                  <Link href="/time-based/one-week">
                    <a className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left block">
                      1-Week Crash Course
                    </a>
                  </Link>
                  
                  <Link href="/time-based/two-weeks">
                    <a className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left block">
                      2-Week Prep
                    </a>
                  </Link>
                  
                  <Link href="/time-based/one-month">
                    <a className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left block">
                      1-Month Complete Prep
                    </a>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Experience Level */}
            <div className="mb-4">
              <button 
                className="flex justify-between items-center w-full text-gray-200 hover:text-white text-sm py-2 px-3 rounded-md transition-colors"
                onClick={() => toggleSection('experience-level')}
              >
                <span>Experience Level</span>
                <span><ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'experience-level' ? 'rotate-180' : ''}`} /></span>
              </button>
              
              {expandedSection === 'experience-level' && (
                <div className="mt-1 pl-3">
                  <Link href="/experience/entry-level">
                    <a className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left block">
                      Entry Level (0-2 YOE)
                    </a>
                  </Link>
                  
                  <Link href="/experience/mid-level">
                    <a className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left block">
                      Mid Level (3-5 YOE)
                    </a>
                  </Link>
                  
                  <Link href="/experience/senior-level">
                    <a className="text-gray-400 hover:text-white py-2 px-3 text-xs rounded-md w-full text-left block">
                      Senior (5+ YOE)
                    </a>
                  </Link>
                </div>
              )}
            </div>
          
            {/* Simple divider */}
            <div className="mt-auto mb-3">
              <div className="flex items-center">
                <div className="flex-grow h-px bg-[rgb(35,35,40)]"></div>
              </div>
            </div>
          
            {/* Discord community section */}
            <div className="mb-2">
              <div className="rounded-md p-3">
                <a href="https://discord.gg/HxAqXd8Xwt" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-[rgb(214,251,65)]">
                  Join our Discord Community
                  <span className="inline-block ml-1">→</span>
                </a>
              </div>
            </div>
            
            <div className="flex justify-between mb-3">
              <a href="https://discord.gg/HxAqXd8Xwt" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                </svg>
              </a>
              <a href="#github" className="text-gray-500 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </a>
              <a href="#linkedin" className="text-gray-500 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
            
        {/* Main content - scrollable */}
        <div className="w-full lg:ml-56 overflow-y-auto overflow-x-hidden px-4 lg:px-8 py-6 pb-0">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            {children || (
              <div className="bg-[rgb(20,20,22)] border border-[rgb(35,35,40)] rounded-lg p-8 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <p className="text-gray-400">Content for this section is under development</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}