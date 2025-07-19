/* eslint-disable react/prop-types */
import { useState } from "react";
import { processOptions } from "./../../services/Api_Services"; 
import { useSelector } from "react-redux";

const CustomizeProcessingContent = ({
  processingOption,
  downloadAfterCreating,
  onProcessingOptionChange,
  onDownloadToggle,
  onNext,
  onPrevious,
  businessDomain
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const theme = useSelector((state) => state.theme.mode);

  // When Next is clicked, send the request using the API service.
  const handleNextClick = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const response = await processOptions(processingOption, downloadAfterCreating, token);

      console.log("Download after creating:", downloadAfterCreating);
      console.log("Processing option:", processingOption);

      if (response.status === 200) {
        onProcessingOptionChange(processingOption);
        console.log("Success");
        onNext();
      } else {
        console.error("Failed to update processing option.", response.data);
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
      <h2 className={`text-2xl font-bold ${theme === "light" ? "text-purple-950" : "text-purple-200"} mb-2`}>
        Customize Your Processing
      </h2>
      <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-300"} mb-6`}>
        Choose your data processing intent. You can either clean the dataset for
        manual review or clean it while generating a dashboard with key
        insights.
      </p>

      <div className="space-y-6 mb-8">
        <label className="flex items-start space-x-2">
          <input
            type="radio"
            name="processing"
            value="clean_only"
            checked={processingOption === "clean_only"}
            onChange={() => onProcessingOptionChange("clean_only")}
            className="mt-1 accent-purple/500"
          />
          <div>
            <p className={`font-bold ${theme === "light" ? "text-purple-950" : "text-purple-200"}`}>Clean Only</p>
            <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
              Choose this option if you prefer to focus solely on preparing your
              data. Our cleaning process will address inconsistencies, handle
              missing values, and standardize your data, ensuring a robust
              foundation for any future analysis or manual dashboard creation.
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
            className="mt-1 accent-purple/500"
            disabled={businessDomain==="HR"}
            title={businessDomain === "HR" ? "This option is disabled for HR" : ""}
          />
          <div>
            <p className={`font-bold ${theme === "light" ? "text-purple-950" : "text-purple-200"}`}>
              Clean & Generate Dashboard
            </p>
            <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
              Choose this option to not only clean your dataset but also to
              automatically generate a fully dashboard. This option provides
              immediate visual insights by transforming your data into
              actionable analytics, perfect for users looking to jump straight
              into data exploration.
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
            className="accent-purple/500"
          />
          <span className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>Download after creating</span>
        </label>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="bg-purple/500 text-white px-6 py-2 rounded-md hover:bg-purple-800 flex items-center"
        >
          <span className="mr-1">←</span> Previous
        </button>
        <button
          onClick={handleNextClick}
          className="bg-purple/500 text-white px-6 py-2 rounded-md hover:bg-purple-800"
          disabled={isSubmitting || isButtonDisabled}
        >
          Next <span className="ml-1">→</span>
        </button>
      </div>
    </>
  );
};

export default CustomizeProcessingContent;
