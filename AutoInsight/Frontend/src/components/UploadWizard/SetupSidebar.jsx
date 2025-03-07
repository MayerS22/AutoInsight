/* eslint-disable react/prop-types */
import { Check } from 'lucide-react';

// eslint-disable-next-line no-unused-vars
const SetupSidebar = ({ steps, currentStep, processingOption = 'clean_and_generate' }) => {
  return (
    <div className="flex md:flex-col md:space-y-4 space-x-4 md:space-x-0 w-full md:w-64 mb-6 md:mb-0 md:mr-8 overflow-x-auto md:overflow-visible border-r">
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
            className={`flex w-[247px] items-center whitespace-nowrap ${step.number === currentStep ? 'bg-purple-100 rounded-lg' : ''}`}
          >
            <div 
              className={`w-8 h-8 text-xl font-bold rounded-full flex items-center justify-center mr-3 
                ${step.number < currentStep ? 'bg-green-500 text-white' : 
                  showAsOptional ? 'border-[3px] bg-gray-200 text-white' :
                  step.number === currentStep ? 'bg-purple-900 text-white' : 'bg-gray-200 text-gray-500'}`}
            >
              {step.number < currentStep ? (
                <Check size={20} className="text-bold"/>
              ) : showAsOptional ? (
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              ) : step.number === currentStep ? (
                <span>{step.number}</span>
              ) : (
                step.number
              )}
            </div>
            <span className={`
              ${step.number < currentStep ? 'text-green-500' : 
                showAsOptional ? 'text-gray-600' :
                step.number === currentStep ? 'text-purple-900 font-bold' : 'text-gray-600'}
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