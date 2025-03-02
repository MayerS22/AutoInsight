/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { XCircle, Loader } from "lucide-react";
import SetupSidebar from "./SetUpSideBar";
import BusinessDomainContent from "./BusinessDomainContent";
import UploadDatasetContent from "./UploadDatasetContent";
import CustomizeProcessingContent from "./CustomizeProcessingContent";
import GrantAccessContent from "./GrantAccessContent"; // Import the new component
import SetupSummaryContent from "./SetupSummaryContent";
import axios from "axios";


const DashboardSetupFlow = ({ onClose,onUploadSuccess}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [businessDomain, setBusinessDomain] = useState("ecommerce");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processingOption, setProcessingOption] = useState("clean_only");
  const [downloadAfterCreating, setDownloadAfterCreating] = useState(true);
  const [showError, setShowError] = useState(false);
  const [uploadedDataset, setUploadedDataset] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { number: 1, title: "Choose Business Domain" },
    { number: 2, title: "Upload Dataset" },
    { number: 3, title: "Customize Your Processing" },
    { number: 4, title: "Grant Access to Users" },
    { number: 5, title: "Setup Summary" }
  ];

  const handleNext = () => {
    if (currentStep === 2 && !uploadedFile) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevious = () => {
    setShowError(false);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Callback to update parent's file state upon successful upload
  const handleFileUploaded = (file) => {
    setUploadedFile(file);
  };

  const handleDomainChange = (domain) => {
    setBusinessDomain(domain);
  };

  const handleProcessingOptionChange = (option) => {
    setProcessingOption(option);
  };

  const handleFinish = async () => {
    setIsProcessing(true);
    const token = localStorage.getItem("token");
 
    if (!token) {
       console.error("Error: Missing authentication token.");
       setIsProcessing(false);
       return;
    }
    if (!processingOption) {
       console.error("Error: processingOption is undefined.");
       setIsProcessing(false);
       return;
    }
 
    try {
       console.log("Sending request with:", { analysis_option: processingOption });
 
       const response = await axios.post(
          "http://localhost:3000/api/v1/datasets/generate-insights",
          {},
          {
             headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              
             },
             withCredentials: true, // Ensures cookies are sent with the request
          }
       );
 
       console.log("Finish Response:", response.data);
       setIsProcessing(false);
       onClose(false);
       if (onUploadSuccess) {
        onUploadSuccess();
      } else {
        console.log("Default upload success action");
      }
    } catch (error) {
       console.error(
          "Request failed:",
          error.response?.data?.message || error.response?.data || error.message
       );
       setIsProcessing(false);
    }
  };
 
  const handleClose = () => {
    if (!isProcessing) {
      onClose(false);
    }
  };

  return (
    <div className="relative bg-white rounded-lg w-full max-w-4xl p-4 md:p-12">
      <button 
        onClick={handleClose} 
        className={`absolute top-4 right-4 ${isProcessing ? 'text-gray-400 cursor-not-allowed' : 'text-purple-800 hover:text-purple-900'}`}
        disabled={isProcessing}
      >
        {isProcessing ? "" : <XCircle size={24} />}
      </button>

      <div className="flex flex-col md:flex-row">
        <SetupSidebar steps={steps} currentStep={currentStep} />

        <div className="flex-1">
          {currentStep === 1 && (
            <BusinessDomainContent
              businessDomain={businessDomain}
              onDomainChange={handleDomainChange}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <UploadDatasetContent
              onNext={handleNext}
              onPrevious={handlePrevious}
              onFileUploaded={handleFileUploaded}
              uploadedDataset={uploadedDataset}
              setUploadedDataset={setUploadedDataset}
              uploadComplete={uploadComplete}
              setUploadComplete={setUploadComplete}
              setUploadProgress={setUploadProgress}
              uploadProgress={uploadProgress}
            />
          )}

          {currentStep === 3 && (
            <CustomizeProcessingContent
              processingOption={processingOption}
              downloadAfterCreating={downloadAfterCreating}
              onProcessingOptionChange={handleProcessingOptionChange}
              onDownloadToggle={() => setDownloadAfterCreating(!downloadAfterCreating)}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}

          {currentStep === 4 && (
            <GrantAccessContent
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}

          {currentStep === 5 && (
            <SetupSummaryContent
              businessDomain={businessDomain}
              uploadedFile={uploadedFile}
              processingOption={processingOption}
              onPrevious={handlePrevious}
              onFinish={handleFinish}
              isProcessing={isProcessing}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSetupFlow;