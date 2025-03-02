import { useState } from "react";
import { XCircle } from "lucide-react";
import SetupSidebar from "./SetUpSideBar";
import BusinessDomainContent from "./BusinessDomainContent";
import UploadDatasetContent from "./UploadDatasetContent";
import CustomizeProcessingContent from "./CustomizeProcessingContent";
import GrantAccessContent from "./GrantAccessContent"; // Import the new component
import SetupSummaryContent from "./SetupSummaryContent";

const DashboardSetupFlow = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [businessDomain, setBusinessDomain] = useState("ecommerce");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processingOption, setProcessingOption] = useState("clean_only");
  const [downloadAfterCreating, setDownloadAfterCreating] = useState(true);
  const [showError, setShowError] = useState(false);

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

  const handleFinish = () => {
    // Add your finish logic here
    console.log("Finish clicked");
  };

  return (
    <div className="relative bg-white rounded-lg w-full max-w-4xl p-4 md:p-12">
      <button onClick={() => onClose(false)} className="absolute top-4 right-4 text-purple-800">
        <XCircle size={24} />
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSetupFlow;