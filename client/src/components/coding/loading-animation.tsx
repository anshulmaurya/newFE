import React, { useEffect, useState } from 'react';
import { Loader2, Code, Server, Check, Cpu } from 'lucide-react';

/**
 * A modern, professional loading animation component for the coding environment
 * Displays various stages of the environment setup with smooth transitions
 */
const LoadingAnimation: React.FC<{ title?: string }> = ({ title }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState('');
  
  const steps = [
    {
      icon: <Server className="h-8 w-8 text-[rgb(214,251,65)] animate-pulse" />,
      text: 'Initializing container'
    },
    {
      icon: <Code className="h-8 w-8 text-[rgb(214,251,65)] animate-pulse" />,
      text: 'Setting up code environment'
    },
    {
      icon: <Cpu className="h-8 w-8 text-[rgb(214,251,65)] animate-pulse" />,
      text: 'Preparing development tools'
    },
    {
      icon: <Check className="h-8 w-8 text-[rgb(214,251,65)]" />,
      text: 'Almost ready'
    }
  ];
  
  // Progress through the steps automatically to create an animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }, 1800); // Progress to next step every 1.8 seconds
    
    return () => clearTimeout(timer);
  }, [currentStep, steps.length]);
  
  // Animate the loading dots
  useEffect(() => {
    const dotsTimer = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 400); // Change dots every 400ms
    
    return () => clearInterval(dotsTimer);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[rgb(14,14,16)] text-white p-4">
      {/* Header with problem title if available */}
      {title && (
        <h1 className="text-xl md:text-2xl font-bold mb-8 text-center">
          {title}
        </h1>
      )}
      
      {/* Main loading container */}
      <div className="w-full max-w-md bg-[rgb(22,22,26)] border border-[rgb(35,35,40)] rounded-lg p-6 shadow-lg">
        {/* Progress indicator */}
        <div className="w-full bg-[rgb(35,35,40)] h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[rgb(214,251,65)] to-[rgb(144,181,0)] h-full rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${Math.min(100, (currentStep + 1) * 25)}%` 
            }}
          />
        </div>
        
        {/* Current step information */}
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {steps[currentStep].icon}
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-medium text-white mb-1">
              {steps[currentStep].text}<span className="text-[rgb(214,251,65)]">{dots}</span>
            </h3>
            <p className="text-sm text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>
        
        {/* Tips or messages */}
        <div className="mt-8 p-4 bg-[rgb(28,28,32)] rounded-md border border-[rgb(45,45,50)] text-sm">
          <p className="text-gray-300 italic">
            {[
              "Setting up your embedded development environment with all the tools you need...",
              "Loading code files, compilers, and embedded system libraries...",
              "Preparing debugger and hardware simulations for testing your solution...",
              "Almost there! Just a few more seconds..."
            ][currentStep]}
          </p>
        </div>
      </div>
      
      {/* Helpful text */}
      <p className="text-gray-400 text-sm mt-8 max-w-md text-center">
        We're setting up your coding environment. This may take a few moments as we initialize your container and prepare all the necessary tools.
      </p>
    </div>
  );
};

export default LoadingAnimation;