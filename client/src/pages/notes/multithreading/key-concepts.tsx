import React, { useState } from 'react';
import { Link } from 'wouter';

export default function MultithreadingKeyConcepts() {
  const [darkMode] = useState(true);
  
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

  return (
    <>
      <div className="flex items-center mb-1 text-gray-500 text-sm">
        <span>Docs</span>
        <span className="mx-2">›</span>
        <span className="mx-2"><Link href="/notes/multithreading" className="hover:underline">Multithreading</Link></span>
        <span className={darkMode ? 'text-gray-300' : 'text-gray-800'}>Key Concepts</span>
      </div>
      <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Multithreading Key Concepts</h1>

      <div className={`prose ${darkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
        <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Thread vs. Process</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Process:</strong> Independent execution unit with its own memory space.</li>
            <li><strong>Thread:</strong> Lightweight unit within a process sharing memory, making context switches faster.</li>
          </ul>
        </div>

        <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Concurrency vs. Parallelism</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Concurrency:</strong> Overlapping execution of tasks (may be interleaved on a single CPU core).</li>
            <li><strong>Parallelism:</strong> Simultaneous execution on multiple cores.</li>
          </ul>
        </div>

        <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Thread Life Cycle</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Creation:</strong> Threads are spawned.</li>
            <li><strong>Execution:</strong> Threads run concurrently.</li>
            <li><strong>Synchronization:</strong> Threads coordinate access to shared resources.</li>
            <li><strong>Termination:</strong> Threads complete and exit.</li>
          </ol>
        </div>

        <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Synchronization Techniques</h3>
          <p>
            Mutexes, semaphores, locks, and condition variables are used to prevent race conditions and ensure thread safety.
          </p>
        </div>

        <h2 id="practical-example">Practical Example with pthread</h2>
        <p>
          Below is a simple C code example using the pthread library. It demonstrates creating multiple threads that print a message and then exit.
        </p>

        <pre className={`${themeClasses.codeBlock} p-4 rounded-md overflow-x-auto`}>
          <code className="language-c">
{`#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

// Thread function that prints a message
void* threadFunction(void* arg) {
    int threadNum = *((int*)arg);
    printf("Hello from thread %d\\n", threadNum);
    pthread_exit(NULL);
}

int main() {
    int numThreads = 5;
    pthread_t threads[numThreads];
    int threadArgs[numThreads];

    // Create threads
    for (int i = 0; i < numThreads; i++) {
        threadArgs[i] = i;
        int rc = pthread_create(&threads[i], NULL, threadFunction, (void*)&threadArgs[i]);
        if (rc) {
            printf("ERROR: pthread_create returned %d\\n", rc);
            exit(EXIT_FAILURE);
        }
    }

    // Wait for threads to finish
    for (int i = 0; i < numThreads; i++) {
        pthread_join(threads[i], NULL);
    }

    return 0;
}`}
          </code>
        </pre>

        <div className={`${themeClasses.infoBlock} p-5 border-l-4 rounded-r my-6`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${themeClasses.infoTextDark}`}>Explanation</h3>
              <div className={`text-sm ${themeClasses.infoText}`}>
                <ul className="list-disc pl-5 space-y-1">
                  <li><code>pthread_create</code>: Spawns a new thread running threadFunction.</li>
                  <li><code>pthread_join</code>: Waits for each thread to complete before the program exits.</li>
                  <li><strong>Thread Safety:</strong> In more complex applications, ensure shared resources are properly synchronized to avoid race conditions.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h2 id="common-challenges">Common Multithreading Challenges</h2>
        <p>
          Working with threads introduces some key challenges that developers must address:
        </p>

        <ol>
          <li><strong>Race Conditions:</strong> When multiple threads access shared data concurrently, the outcome depends on the timing of their execution.</li>
          <li><strong>Deadlocks:</strong> When threads are blocked forever, each waiting for resources held by another thread.</li>
          <li><strong>Priority Inversion:</strong> When a high-priority thread is blocked waiting for a resource held by a low-priority thread.</li>
          <li><strong>Thread Safety:</strong> Ensuring that code functions correctly during simultaneous execution by multiple threads.</li>
        </ol>

      </div>
    </>
  );
}