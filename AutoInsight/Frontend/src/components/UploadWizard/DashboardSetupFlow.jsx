/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { XCircle } from "lucide-react";
import SetupSidebar from "./SetUpSideBar";
import BusinessDomainContent from "./BusinessDomainContent";
import UploadDatasetContent from "./UploadDatasetContent";
import CustomizeProcessingContent from "./CustomizeProcessingContent";

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
    { number: 4, title: "Grant Access to Users" }
  ];

  const handleNext = () => {
    if (currentStep === 2 && !uploadedFile) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setCurrentStep((prev) => Math.min(prev + 1, 4));
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
            <div>
              <h2 className="text-2xl font-medium text-purple-700 mb-2">Grant Access to Users</h2>
              <p className="text-sm text-gray-600 mb-6">
                Specify which users or teams should have access to this dashboard.
              </p>
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  className="border border-purple-700 text-purple-700 px-4 py-2 rounded-md flex items-center"
                >
                  <span className="mr-1">←</span> Previous
                </button>
                <button className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800">
                  Finish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSetupFlow;
