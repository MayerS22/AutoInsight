/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Loader } from "lucide-react";
const SetupSummaryContent = ({
  businessDomain,
  uploadedFile,
  processingOption,
  onPrevious,
  onFinish,
  isProcessing
}) => {


  // Fetch the list of business domains from the API
  if(isProcessing)
  {
    // Show a loading spinner while waiting for the API response
    return (
      <div className="flex justify-center flex-col items-center h-full">
        <Loader className="animate-spin" size={48} />
        <p className="text-lg text-gray-500 mt-2 font-bold">Analyzing...</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-purple/500 mb-2">Setup Summary</h2>
      <p className="text-sm text-orig/600 mb-6">Review your selections before finishing.</p>
      <div className="text-bold mb-4">
        <strong className="text-purple/500">Business Domain:</strong> {businessDomain}
      </div>
      <div className="mb-4">
        <strong className="text-purple/500">Dataset:</strong> {uploadedFile ? uploadedFile.name : "No dataset uploaded"}
      </div>
      <div className="mb-4">
        <strong className="text-purple/500">Processing Option:</strong> {processingOption}
      </div>
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="bg-purple/500 text-white px-4 py-2 rounded-md hover:bg-purple-800"
        >
          <span className="mr-1">←</span> Previous
        </button>
        <button
          onClick={onFinish}
          className="bg-purple/500 text-white px-8 py-2 rounded-md hover:bg-purple-800"
        >
      Finish
        </button>
      </div>
    </div>
  );
};

export default SetupSummaryContent;
