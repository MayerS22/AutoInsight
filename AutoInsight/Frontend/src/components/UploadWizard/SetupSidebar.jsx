/* eslint-disable react/prop-types */
import { Check, CheckCircle } from 'lucide-react';

const SetupSidebar = ({ steps, currentStep }) => {
  return (
    <div className="flex md:flex-col md:space-y-4 space-x-4 md:space-x-0 w-full md:w-64 mb-6 md:mb-0 md:mr-8 overflow-x-auto md:overflow-visible">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`flex items-center whitespace-nowrap ${step.number === currentStep ? 'bg-purple-100 rounded-lg ' : ''}`}
        >
          <div 
            className={`w-8 h-8 text-xl font-bold rounded-full flex items-center justify-center mr-3 
              ${step.number < currentStep ? 'bg-green-500 text-white' : 
                step.number === currentStep ? 'bg-purple/500 text-white' : 'bg-gray-200 text-gray-500'}`}
          >
            {step.number < currentStep ? (
              <Check size={20} className='text-bold'/>
            ) : step.number === currentStep ? (
              <span>{step.number}</span>
            ) : (
              step.number
            )}
          </div>
          <span className={`
            ${step.number < currentStep ? 'text-green-500' : 
              step.number === currentStep ? 'text-purple/500 font-bold' : 'text-gray-600'}
          `}>
            {step.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SetupSidebar;
