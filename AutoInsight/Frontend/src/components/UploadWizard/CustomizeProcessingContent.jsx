/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';

const CustomizeProcessingContent = ({ 
  processingOption, 
  downloadAfterCreating,
  onProcessingOptionChange, 
  onDownloadToggle,
  onNext, 
  onPrevious 
}) => {
  return (
    <>
      <h2 className="text-2xl font-medium text-purple-700 mb-2">Customize Your Processing</h2>
      <p className="text-sm text-gray-600 mb-6">
        In this step, choose the intent of data processing. Opt to simply clean your dataset for manual review later,
        or clean and auto-generate a dashboard loaded with key insights to kickstart your analysis.
      </p>

      <div className="space-y-6 mb-8">
        <label className="flex items-start space-x-2">
          <input 
            type="radio" 
            name="processing" 
            value="clean_only"
            checked={processingOption === 'clean_only'}
            onChange={() => onProcessingOptionChange('clean_only')}
            className="mt-1 text-purple-700"
          />
          <div>
            <p className="font-medium">Clean Only</p>
            <p className="text-sm text-purple-600">
              Choose this option if you prefer to focus solely on preparing your data. Our cleaning process will address
              inconsistencies, handle missing values, and standardize your data, ensuring a robust foundation for any 
              future analysis or manual dashboard creation.
            </p>
          </div>
        </label>

        <label className="flex items-start space-x-2">
          <input 
            type="radio" 
            name="processing" 
            value="clean_and_generate"
            checked={processingOption === 'clean_and_generate'}
            onChange={() => onProcessingOptionChange('clean_and_generate')}
            className="mt-1 text-purple-700"
          />
          <div>
            <p className="font-medium">Clean & Generate Dashboard</p>
            <p className="text-sm text-purple-600">
              Choose this option to not only clean your dataset but also to automatically generate a fully dashboard.
              This option provides immediate visual insights by transforming your data into actionable analytics,
              perfect for users looking to jump straight into data exploration.
            </p>
          </div>
        </label>
      </div>

      <div className="mb-8">
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={downloadAfterCreating}
            onChange={onDownloadToggle}
            className="text-purple-700"
          />
          <span>Download after creating</span>
        </label>
      </div>

      <div className="flex justify-between">
        <button 
          onClick={onPrevious}
          className="border border-purple-700 text-purple-700 px-4 py-2 rounded-md flex items-center"
        >
          <span className="mr-1">←</span> Previous
        </button>
        <button 
          onClick={onNext}
          className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800"
        >
          Next <span className="ml-1">→</span>
        </button>
      </div>
    </>
  );
};

export default CustomizeProcessingContent;
