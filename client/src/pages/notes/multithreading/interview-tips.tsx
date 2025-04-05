import React, { useState } from 'react';
import { Link } from 'wouter';
import NotesLayout from '../../../components/layout/notes-layout';

export default function MultithreadingInterviewTips() {
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
        <span className={darkMode ? 'text-gray-300' : 'text-gray-800'}>Interview Tips</span>
      </div>
      <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>Multithreading Interview Tips</h1>

      <div className={`prose ${darkMode ? 'prose-invert' : 'prose-slate'} max-w-none`}>
        <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Understand the Basics</h3>
          <p>
            Be prepared to explain what multithreading is, its benefits, and its challenges.
          </p>
        </div>

        <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Discuss Common Problems</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Explain issues like race conditions, deadlocks, and thread starvation.</li>
            <li>Highlight how synchronization mechanisms (mutexes, semaphores) are used to address these issues.</li>
          </ul>
        </div>

        <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Practical Examples</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Discuss scenarios where multithreading improves application performance or responsiveness.</li>
            <li>Reference code examples (like the pthread example in Key Concepts) to illustrate thread creation and synchronization.</li>
          </ul>
        </div>

        <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Thread Management</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Understand how threads are created, managed, and terminated in your language of choice.</li>
            <li>Familiarize yourself with debugging and performance tuning of multithreaded applications.</li>
          </ul>
        </div>

        <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Best Practices</h3>
          <p>
            Write thread-safe code, minimize shared resource usage, and design with scalability in mind.
          </p>
        </div>

        <div className={`${themeClasses.card} p-5 border rounded-md mb-6`}>
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-xl mb-3`}>Stay Updated</h3>
          <p>
            Know the threading libraries and frameworks specific to the languages you use, such as pthreads in C/C++.
          </p>
        </div>

        <h2 id="common-questions">Common Interview Questions</h2>
        <div className={`${themeClasses.card} p-4 border rounded-md my-6`}>
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Conceptual Questions:</h3>
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <strong>What is the difference between a process and a thread?</strong>
              <p className="mt-1 text-sm">
                Focus on memory space (shared vs. separate), resource overhead, and isolation characteristics.
                Mention that threads are lightweight with shared memory, while processes are isolated with higher overhead.
              </p>
            </li>
            <li>
              <strong>Explain mutex vs. semaphore and when to use each.</strong>
              <p className="mt-1 text-sm">
                Describe mutex as ownership-based (one owner at a time) and semaphores as signaling mechanisms (potentially multiple resources).
                Give concrete examples: mutex for shared data protection, semaphore for producer-consumer problems.
              </p>
            </li>
            <li>
              <strong>What is a race condition and how do you prevent it?</strong>
              <p className="mt-1 text-sm">
                Define race conditions as timing-dependent bugs where outcome depends on thread execution order.
                Discuss synchronization mechanisms, atomic operations, and proper design as prevention strategies.
              </p>
            </li>
          </ol>
        </div>

        <div className={`${themeClasses.infoBlock} p-5 border-l-4 rounded-r my-6`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${themeClasses.infoTextDark}`}>Preparation Tip</h3>
              <div className={`text-sm ${themeClasses.infoText}`}>
                <p>Before your interview, review the job description carefully to identify what threading technologies and frameworks they use. 
                For embedded positions, be familiar with RTOS-specific threading models and their implications for critical systems.</p>
              </div>
            </div>
          </div>
        </div>

        <h2 id="answering-strategies">Effective Answering Strategies</h2>
        <p>
          Follow these guidelines to structure clear, comprehensive answers:
        </p>

        <ol>
          <li><strong>Start with definitions</strong> - Always begin by defining key terms</li>
          <li><strong>Provide examples</strong> - Use real-world examples to illustrate concepts</li>
          <li><strong>Discuss implementation details</strong> - Show your technical depth</li>
          <li><strong>Address trade-offs</strong> - Demonstrate you understand there's rarely a perfect solution</li>
          <li><strong>Connect to performance</strong> - Discuss how threading choices impact system performance</li>
        </ol>

        <h2 id="code-review">Code Review Skills</h2>
        <p>
          Many interviews include code review exercises where you must identify threading issues. Common things to look for:
        </p>
        
        <ul>
          <li>Unprotected shared variables</li>
          <li>Potential deadlocks from incorrect lock acquisition order</li>
          <li>Missing thread cleanup or resource release</li>
          <li>Improper synchronization for producer-consumer relationships</li>
          <li>Busy-waiting loops that waste CPU cycles</li>
        </ul>

        <pre className={`${themeClasses.codeBlock} p-4 rounded-md overflow-x-auto`}>
          <code className="language-c">
{`// Producer-Consumer with FreeRTOS
QueueHandle_t dataQueue;
SemaphoreHandle_t mutex;

void producerTask(void *pvParameters) {
    int data = 0;
    while(1) {
        // Produce new item
        data++;
        
        // Send to queue with timeout
        if (xQueueSend(dataQueue, &data, pdMS_TO_TICKS(100)) != pdPASS) {
            // Handle queue full
        }
        
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}

void consumerTask(void *pvParameters) {
    int receivedData;
    while(1) {
        // Wait for item with timeout
        if (xQueueReceive(dataQueue, &receivedData, pdMS_TO_TICKS(200)) == pdPASS) {
            // Process data
            if (xSemaphoreTake(mutex, pdMS_TO_TICKS(100)) == pdTRUE) {
                // Update shared resource with received data
                xSemaphoreGive(mutex);
            }
        }
    }
}`}
          </code>
        </pre>

        <h2 id="system-design">Be Ready for System Design Questions</h2>
        <p>
          Senior-level interviews often include designing multithreaded embedded systems. Prepare by:
        </p>
        <ul>
          <li>Practicing thread/task decomposition for different applications</li>
          <li>Considering priority assignments based on real-time requirements</li>
          <li>Identifying potential synchronization points and shared resources</li>
          <li>Planning for error handling and recovery in multithreaded contexts</li>
          <li>Addressing memory constraints and stack sizing</li>
        </ul>

        <h2 id="rtos-knowledge">RTOS Knowledge Is Critical</h2>
        <p>
          Be familiar with at least one real-time operating system (FreeRTOS, RTX, ThreadX, etc.) and its:
        </p>
        <ul>
          <li>Task management functions (creation, deletion, suspension)</li>
          <li>Synchronization primitives (mutex, semaphore, event groups)</li>
          <li>Communication mechanisms (queues, message buffers)</li>
          <li>Memory management and protection features</li>
          <li>Scheduling algorithms and priority handling</li>
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