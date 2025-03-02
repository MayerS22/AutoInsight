/* eslint-disable react/prop-types */
import React from "react";

const SetupSummaryContent = ({
  businessDomain,
  uploadedFile,
  processingOption,
  onPrevious,
  onFinish
}) => {
  return (
    <div>
      <h2 className="text-2xl font-medium text-purple-700 mb-2">Setup Summary</h2>
      <p className="text-sm text-gray-600 mb-6">Review your selections before finishing.</p>
      <div className="mb-4">
        <strong>Business Domain:</strong> {businessDomain}
      </div>
      <div className="mb-4">
        <strong>Dataset:</strong> {uploadedFile ? uploadedFile.name : "No dataset uploaded"}
      </div>
      <div className="mb-4">
        <strong>Processing Option:</strong> {processingOption}
      </div>
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="border border-purple-700 text-purple-700 px-4 py-2 rounded-md flex items-center"
        >
          <span className="mr-1">←</span> Previous
        </button>
        <button
          onClick={onFinish}
          className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800"
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default SetupSummaryContent;
