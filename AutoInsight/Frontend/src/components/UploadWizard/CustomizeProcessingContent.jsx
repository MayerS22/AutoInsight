/* eslint-disable react/prop-types */
import { useState } from "react";

const CustomizeProcessingContent = ({ 
  processingOption, 
  downloadAfterCreating,
  onProcessingOptionChange, 
  onDownloadToggle,
  onNext, 
  onPrevious 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // When Next is clicked, send the request.
  const handleNextClick = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/v1/datasets/processing-options/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          analysis_option: processingOption,
          downloadAfterCreating: downloadAfterCreating
        })
      });
      
      const data = await response.json();
      console.log(downloadAfterCreating);
      console.log("processing options: "+processingOption);
      
      
      
      
      if (response.ok) {
        onProcessingOptionChange(processingOption);
      console.log("success");

        onNext();
      } else {
        console.error("Failed to update processing option.", data);
        setIsButtonDisabled(true);
      }
    } catch (error) {
      console.error("Error updating processing option:", error);
      setIsButtonDisabled(true);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <h2 className="text-2xl font-medium text-purple-700 mb-2">Customize Your Processing</h2>
      <p className="text-sm text-gray-600 mb-6">
        Choose your data processing intent. You can either clean the dataset for manual review
        or clean it while generating a dashboard with key insights.
      </p>

      <div className="space-y-6 mb-8">
        <label className="flex items-start space-x-2">
          <input 
            type="radio" 
            name="processing" 
            value="clean_only"
            checked={processingOption === "clean_only"}
            onChange={() => onProcessingOptionChange("clean_only")}
            className="mt-1 text-purple-700"
          />
          <div>
            <p className="font-medium">Clean Only</p>
            <p className="text-sm text-purple-600">
              This option prepares your data by handling inconsistencies and missing values,
              ensuring a robust foundation for analysis.
            </p>
          </div>
        </label>

        <label className="flex items-start space-x-2">
          <input 
            type="radio" 
            name="processing" 
            value="clean_and_generate"
            checked={processingOption === "clean_and_generate"}
            onChange={() => onProcessingOptionChange("clean_and_generate")} 
            className="mt-1 text-purple-700"
          />
          <div>
            <p className="font-medium">Clean & Generate Dashboard</p>
            <p className="text-sm text-purple-600">
              This option cleans your data and generates an interactive dashboard for instant insights.
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
          onClick={handleNextClick}
          className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800"
          disabled={isSubmitting || isButtonDisabled}
        >
          Next <span className="ml-1">→</span>
        </button>
      </div>
    </>
  );
};

export default CustomizeProcessingContent;
