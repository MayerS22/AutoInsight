/* eslint-disable react/prop-types */
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// eslint-disable-next-line no-unused-vars
const SetupSidebar = ({ steps, currentStep, processingOption = 'clean_and_generate' }) => {
  const [isVisible, setIsVisible] = useState(true); 
  const theme = useSelector((state) => state.theme.mode);
  
  useEffect(() => {
    // Function to check window width and update visibility
    const checkWidth = () => {
      setIsVisible(window.innerWidth >= 768); // 768px is the md breakpoint in Tailwind
    };
    
    // Set initial visibility
    checkWidth();
    
    // Listen for resize events
    window.addEventListener('resize', checkWidth);
    
    // Clean up event listener
    return () => window.removeEventListener('resize', checkWidth);
  }, []);
  
  // Return null (render nothing) if not visible
  if (!isVisible) {
    return null;
  }
  
  // Otherwise render the sidebar normally
  return (
    <div className="flex flex-col space-y-4 w-64 mb-0 mr-8 overflow-visible border-r">
      {steps.map((step) => {
        // Check if this step is the "Grant Access to Users" step
        const isGrantAccessStep = step.title === 'Grant Access to Users';

        // Determine if we should show this step as optional
        // Only show as optional if:
        // 1. It's the Grant Access step
        // 2. We haven't reached this step yet (step number is greater than current step)
        const showAsOptional = isGrantAccessStep && step.number > currentStep;

        return (
          <div
            key={step.number}
            className={`flex w-[247px] p-1 items-center whitespace-nowrap ${step.number === currentStep ? 'bg-purple-100 rounded-md' : ''}`}
          >
            <div
              className={`w-8 h-8 text-xl font-bold rounded-full flex items-center justify-center mr-3 
                ${step.number < currentStep ? 'bg-green-500 text-white' :
                  showAsOptional ? 'border-[3px] bg-gray-200 text-white' :
                    step.number === currentStep ? 'bg-purple-900 text-white' : 'bg-gray-200 text-gray-500'}`}
            >
              {step.number < currentStep ? (
                <Check size={20} className="text-bold" />
              ) : showAsOptional ? (
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              ) : step.number === currentStep ? (
                <span>{step.number === 4 ? <div className="w-3 h-3 bg-white rounded-full"></div>
                  : step.number}</span>
              ) : (
                step.number
              )}
            </div>
            <span className={`
              ${step.number < currentStep ? 'text-green-500' :
                showAsOptional ? theme === "light" ? 'text-gray-600' : 'text-gray-300' :
                  step.number === currentStep ? 'text-purple-900 font-bold' : theme === "light" ? 'text-gray-600' : 'text-gray-300'}
            `}>
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SetupSidebar;