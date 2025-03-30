import { useState } from 'react';
import SubpageLayout from '@/components/layout/subpage-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Question {
  id: string;
  title: string;
  difficulty: string;
  description: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function JDBasedPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [generatedNotes, setGeneratedNotes] = useState<Note[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!jobDescription.trim()) return;
    
    setIsLoading(true);
    setSubmitted(true);
    
    // Simulate API request delay
    setTimeout(() => {
      // Example questions for demo purposes
      const sampleQuestions: Question[] = [
        {
          id: '1',
          title: 'Implement a circular buffer for UART communication',
          difficulty: 'Medium',
          description: 'Design a circular buffer that can efficiently handle UART data transmission and reception without data loss.'
        },
        {
          id: '2',
          title: 'Design a memory-efficient state machine',
          difficulty: 'Hard',
          description: 'Create a state machine implementation suitable for an embedded system with memory constraints.'
        },
        {
          id: '3',
          title: 'Write a device driver for I2C communication',
          difficulty: 'Medium',
          description: 'Implement a driver that handles I2C bus communication with proper error handling and retry mechanisms.'
        },
        {
          id: '4',
          title: 'Optimize an interrupt handler for minimal latency',
          difficulty: 'Hard',
          description: 'Modify an existing interrupt handler to minimize latency and prioritize critical operations.'
        },
        {
          id: '5',
          title: 'Implement a task scheduler for a real-time system',
          difficulty: 'Hard',
          description: 'Create a priority-based task scheduler that ensures deadlines are met for critical tasks.'
        }
      ];
      
      const sampleNotes: Note[] = [
        {
          id: '1',
          title: 'Key Skills to Highlight',
          content: 'Based on the job description, you should focus on demonstrating your experience with:\n- Real-time operating systems (FreeRTOS/ThreadX)\n- Low-level driver development\n- Power management for battery-operated devices\n- Debugging with logic analyzers and oscilloscopes'
        },
        {
          id: '2',
          title: 'Technical Concepts to Review',
          content: '- Memory management in resource-constrained environments\n- Interrupt handling and prioritization\n- Power optimization techniques\n- Communication protocols (I2C, SPI, UART)\n- Real-time scheduling algorithms'
        },
        {
          id: '3',
          title: 'Common Interview Questions',
          content: '1. Explain the difference between hard and soft real-time systems\n2. How would you debug a memory leak in an embedded system?\n3. Describe your approach to power optimization in battery-powered devices\n4. How do you ensure code quality in embedded systems?'
        }
      ];
      
      setGeneratedQuestions(sampleQuestions);
      setGeneratedNotes(sampleNotes);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <SubpageLayout title="JD Based Prep">
      <div className="bg-[rgb(20,20,22)] border border-[rgb(35,35,40)] rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Enter Job Description</h2>
        <p className="text-gray-400 mb-4 text-sm">
          Paste the job description and we'll generate customized practice questions and study notes
          tailored to the specific requirements.
        </p>
        
        <Textarea
          placeholder="Paste job description here..."
          className="min-h-[200px] bg-[rgb(24,24,27)] border-[rgb(35,35,40)] mb-4"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !jobDescription.trim()}
          className="bg-[#56B2FF] hover:bg-[#4499e0] text-white"
        >
          {isLoading ? 'Generating...' : 'Generate Questions & Notes'}
        </Button>
      </div>
      
      {submitted && (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className={isLoading ? "animate-pulse" : ""}>
            <h2 className="text-lg font-medium mb-4">Recommended Questions</h2>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-[rgb(20,20,22)] border border-[rgb(35,35,40)] rounded-lg p-4">
                    <div className="h-4 bg-[rgb(35,35,40)] rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-[rgb(35,35,40)] rounded w-1/4 mb-3"></div>
                    <div className="h-3 bg-[rgb(35,35,40)] rounded w-full mb-2"></div>
                    <div className="h-3 bg-[rgb(35,35,40)] rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {generatedQuestions.map((question) => (
                  <div key={question.id} className="bg-[rgb(20,20,22)] border border-[rgb(35,35,40)] rounded-lg p-4">
                    <h3 className="font-medium text-md mb-1">{question.title}</h3>
                    <div className="mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        question.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400' :
                        question.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-red-900/30 text-red-400'
                      }`}>
                        {question.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{question.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className={isLoading ? "animate-pulse" : ""}>
            <h2 className="text-lg font-medium mb-4">Study Notes</h2>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[rgb(20,20,22)] border border-[rgb(35,35,40)] rounded-lg p-4">
                    <div className="h-4 bg-[rgb(35,35,40)] rounded w-1/2 mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-[rgb(35,35,40)] rounded w-full"></div>
                      <div className="h-3 bg-[rgb(35,35,40)] rounded w-full"></div>
                      <div className="h-3 bg-[rgb(35,35,40)] rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {generatedNotes.map((note) => (
                  <div key={note.id} className="bg-[rgb(20,20,22)] border border-[rgb(35,35,40)] rounded-lg p-4">
                    <h3 className="font-medium text-md mb-2">{note.title}</h3>
                    <div className="text-sm text-gray-400 whitespace-pre-line">{note.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </SubpageLayout>
  );
}