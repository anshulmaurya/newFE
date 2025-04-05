import React, { useState } from 'react';
import { Link } from 'wouter';
import NotesLayout from '../../../components/layout/notes-layout';

export default function MultithreadingIntroduction() {
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
        <span className="mx-2"><Link href="/notes/multithreading" className="hover:underline">Multithreading</Link></span>
        <span className={darkMode ? 'text-gray-300' : 'text-gray-800'}>Introduction</span>
      </div>
      <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Introduction to Multithreading</h1>

      <div className={`prose ${darkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
        <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Definition</h3>
          <p>
            Multithreading is the concurrent execution of multiple threads within a single process, 
            where each thread shares the same memory space. This approach enables efficient utilization of CPU resources.
          </p>
        </div>

        <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Purpose</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Boosts performance by leveraging multiple CPU cores.</li>
            <li>Enhances responsiveness in applications (e.g., maintaining interactive UIs while processing background tasks).</li>
          </ul>
        </div>

        <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Use Cases</h3>
          <p>
            Real-time systems, web servers, gaming, and other applications that require concurrent operations.
          </p>
        </div>

        <h2 id="what-is-multithreading">In Embedded Systems</h2>
        <p>
          In embedded systems, multithreading is especially valuable for:
        </p>
        <ul>
          <li>Handling multiple sensors or interfaces simultaneously</li>
          <li>Maintaining UI responsiveness while processing data</li>
          <li>Managing time-critical operations alongside regular processing</li>
          <li>Simplifying complex state machines by dedicating threads to specific functions</li>
        </ul>

        <h2 id="thread-lifecycle">Thread Lifecycle</h2>
        <p>
          In embedded RTOS environments, threads typically transition through several states:
        </p>
        
        <ol>
          <li><strong>Created</strong>: Thread is initialized but not yet ready to run</li>
          <li><strong>Ready</strong>: Thread is ready to run but waiting for CPU time</li>
          <li><strong>Running</strong>: Thread is currently executing on the CPU</li>
          <li><strong>Blocked/Waiting</strong>: Thread is waiting for a resource or event</li>
          <li><strong>Terminated</strong>: Thread has completed execution</li>
        </ol>

        <div className={`${themeClasses.infoBlock} p-5 border-l-4 rounded-r my-6`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${themeClasses.infoTextDark}`}>Important Distinction</h3>
              <div className={`text-sm ${themeClasses.infoText}`}>
                <p>Don't confuse multithreading (multiple threads in one process) with multiprocessing (multiple processes running independently). 
                Threads share memory space, making them more efficient but requiring careful synchronization.</p>
              </div>
            </div>
          </div>
        </div>

        <h2 id="performance-benefits">Performance Benefits</h2>
        <p>
          Multithreaded applications provide several key advantages:
        </p>
        <ul>
          <li>Continue execution in other threads when one thread is blocked on I/O</li>
          <li>Take advantage of multiple CPU cores for true parallelism</li>
          <li>Assign different priorities to different tasks based on criticality</li>
          <li>Improve responsiveness for user-facing applications</li>
        </ul>
      </div>
    </>
  );
  
  return (
    <NotesLayout darkMode={darkMode} toggleTheme={toggleTheme}>
      {content}
    </NotesLayout>
  );
}