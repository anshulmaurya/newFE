import React, { useState } from 'react';
import { Link } from 'wouter';
import NotesLayout from '../../components/layout/notes-layout';

export default function Multithreading() {
  const [darkMode, setDarkMode] = useState(true);
  
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  // Determine theme classes
  const themeClasses = darkMode 
    ? {
        bg: "bg-[rgb(10,10,14)]",
        text: "text-gray-300",
        textDark: "text-gray-500",
        sidebarBg: "bg-[rgb(20,20,25)]",
        borderColor: "border-gray-800",
        card: "bg-[rgb(30,30,34)] border-gray-800",
        activeItem: "bg-lime-600 text-white",
        infoBlock: "bg-[rgb(35,35,50)] border-blue-800",
        infoText: "text-gray-300",
        infoTextDark: "text-gray-100",
        codeBlock: "bg-[rgb(20,20,26)]"
      }
    : {
        bg: "bg-white",
        text: "text-gray-600",
        textDark: "text-gray-400",
        sidebarBg: "bg-gray-50",
        borderColor: "border-gray-200",
        card: "bg-white border-gray-200",
        activeItem: "bg-lime-500 text-white",
        infoBlock: "bg-blue-50 border-blue-200",
        infoText: "text-gray-600",
        infoTextDark: "text-gray-800",
        codeBlock: "bg-gray-50"
      };

  const content = (
    <>
      <div className="flex items-center mb-1 text-gray-500 text-sm">
        <span>Docs</span>
        <span className="mx-2">›</span>
        <span className={darkMode ? 'text-gray-300' : 'text-gray-800'}>Multithreading</span>
      </div>
      <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Multithreading Overview</h1>

      <div className={`prose ${darkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
        <p className="lead">
          Multithreading is a fundamental programming concept that allows multiple execution paths to run concurrently
          within a single process. This guide provides a comprehensive overview of multithreading concepts, 
          implementation techniques, and best practices for embedded systems.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className={`${themeClasses.card} p-5 border rounded-lg`}>
            <div className="flex items-center mb-2">
              <h2 className="text-lg font-semibold m-0">Introduction</h2>
            </div>
            <p className="text-sm mb-3">Learn what multithreading is, its purpose, and common use cases in embedded systems.</p>
            <Link 
              to="/notes/multithreading/introduction"
              className="text-xs px-3 py-1.5 rounded-md bg-lime-500 text-black font-medium hover:bg-lime-600 transition-colors inline-block"
            >
              Read Introduction
            </Link>
          </div>

          <div className={`${themeClasses.card} p-5 border rounded-lg`}>
            <div className="flex items-center mb-2">
              <h2 className="text-lg font-semibold m-0">Key Concepts</h2>
            </div>
            <p className="text-sm mb-3">Explore critical multithreading concepts like concurrency vs. parallelism, thread lifecycle, and synchronization.</p>
            <Link 
              to="/notes/multithreading/key-concepts"
              className="text-xs px-3 py-1.5 rounded-md bg-lime-500 text-black font-medium hover:bg-lime-600 transition-colors inline-block"
            >
              Explore Concepts
            </Link>
          </div>

          <div className={`${themeClasses.card} p-5 border rounded-lg`}>
            <div className="flex items-center mb-2">
              <h2 className="text-lg font-semibold m-0">Interview Tips</h2>
            </div>
            <p className="text-sm mb-3">Prepare for technical interviews with common multithreading questions and effective answering strategies.</p>
            <Link 
              to="/notes/multithreading/interview-tips"
              className="text-xs px-3 py-1.5 rounded-md bg-lime-500 text-black font-medium hover:bg-lime-600 transition-colors inline-block"
            >
              View Interview Tips
            </Link>
          </div>
        </div>

        <div className={`${themeClasses.infoBlock} p-5 border-l-4 rounded-r my-8`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${themeClasses.infoTextDark}`}>Why Study Multithreading?</h3>
              <div className={`text-sm ${themeClasses.infoText}`}>
                <p>Multithreading is a critical skill for embedded systems engineers, especially when working with real-time operating systems (RTOS). Mastering these concepts will help you build more efficient, responsive, and scalable embedded applications.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
  return (
    <NotesLayout darkMode={darkMode} toggleTheme={toggleTheme}>
      {content}
    </NotesLayout>
  );
}