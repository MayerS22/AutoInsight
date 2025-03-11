/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import CloseICon from "../../assets/Close.svg"
import SetupSidebar from "./SetupSidebar";
import BusinessDomainContent from "./BusinessDomainContent";
import UploadDatasetContent from "./UploadDatasetContent";
import CustomizeProcessingContent from "./CustomizeProcessingContent";
import GrantAccessContent from "./GrantAccessContent";
import SetupSummaryContent from "./SetupSummaryContent";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useDispatch } from "react-redux";
import { authActions } from "../../store";
import { getUserData, generateInsights } from "../../services/Api_Services";

const DashboardSetupFlow = ({ onClose, onUploadSuccess, showCleaningDashboard }) => {
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
  const [isCleaning, setIsCleaning] = useState("")
  const [users, setUsers] = useState([]);
  const [success,setSuccess]=useState(false)



  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await getUserData(token);
        dispatch(authActions.addProfilePicture(response.data.body.profile_picture));
        dispatch(authActions.addUsername(response.data.body.username));
        dispatch(authActions.addID(response.data.body._id));
        console.log(response.data.body._id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

  const steps = [
    { number: 1, title: "Choose Business Domain" },
    { number: 2, title: "Upload Dataset" },
    { number: 3, title: "Customize Your Processing" },
    { number: 4, title: "Grant Access to Users" },
    { number: 5, title: "Dashboard Setup Summary" },
  ];

  const handleNext = () => {
    if (currentStep === 2 && !uploadedFile) {
      setShowError(true);
      return;
    }
    setShowError(false);
  
    setCurrentStep((prev) => {
      if (processingOption === "clean_only" && prev === 3) {
        return 5; // Skip step 4
      }
      return Math.min(prev + 1, 5);
    });
  };
  
  const handlePrevious = () => {
    setShowError(false);
  
    setCurrentStep((prev) => {
      if (processingOption === "clean_only" && prev === 5) {
        return 3; // Skip step 4 in reverse
      }
      return Math.max(prev - 1, 1);
    });
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
      console.log(token);

      const response = await generateInsights(token);
      console.log("Finish Response:", response.data);

      // If downloadAfterCreating is true, proceed to download files
      if (downloadAfterCreating) {
        if (processingOption === "clean_only") {
          const cleanedUrl =
            response.data.body?.dataset?.cleaned_dataset_url ||
            response.data.cleaned_dataset_url ||
            response.data.body?.cleaned_dataset_url;

          if (cleanedUrl) {
            const fileResponse = await fetch(cleanedUrl);
            const blob = await fileResponse.blob();
            saveAs(blob, "cleaned_dataset.csv");
          } else {
            console.error("cleaned_dataset_url not found in response:", response.data);
          }
        } else if (processingOption === "clean_and_generate") {
          // Download the cleaned dataset
          const cleanedUrl = 
            response.data.body?.dataset?.cleaned_dataset_url || 
            response.data.cleaned_dataset_url || 
            response.data.body?.cleaned_dataset_url;
        
          if (cleanedUrl) {
            try {
              const fileResponse = await fetch(cleanedUrl);
              const blob = await fileResponse.blob();
              saveAs(blob, "cleaned_dataset.csv");
            } catch (err) {
              console.error("Error downloading cleaned dataset:", err);
            }
          } else {
            console.error("cleaned_dataset_url not found in response:", response.data);
          }
        
          // Download insights images as ZIP
          const insightsUrls = response.data.body?.dataset?.insights_urls || response.data.body?.insights_urls;
        
          if (insightsUrls) {
            const zip = new JSZip();
            for (const chartType in insightsUrls) {
              // eslint-disable-next-line no-prototype-builtins
              if (insightsUrls.hasOwnProperty(chartType)) {
                const folder = zip.folder(chartType);
                const urls = insightsUrls[chartType];
                for (let i = 0; i < urls.length; i++) {
                  try {
                    const res = await fetch(urls[i]);
                    const blob = await res.blob();
                    folder.file(`${chartType}_${i + 1}.jpg`, blob);
                  } catch (err) {
                    console.error(`Error fetching image from ${chartType}:`, urls[i], err);
                  }
                }
              }
            }
            zip.generateAsync({ type: "blob" }).then((content) => {
              saveAs(content, "insights_images.zip");
            });
          } else {
            console.error("insights_urls not found in response:", response.data);
          }
        }
        
      }

      setIsProcessing(false);
      setSuccess(true)
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
    <>
      {showCleaningDashboard ? (
        <div className="relative bg-white rounded-lg w-full max-w-5xl p-4 md:p-12">
          <button
            onClick={handleClose}
            className={`absolute top-4 right-4 ${isProcessing
                ? "text-gray-400 cursor-not-allowed"
                : "hover:text-purple-900"
              }`}
            disabled={isProcessing}
          >
            {isProcessing || isCleaning === "yes" ? "" : <img src={CloseICon} alt="close-x-icon"/>}
          </button>

          <UploadDatasetContent
            isCleaning={isCleaning}
            setIsCleaning={setIsCleaning}
            showCleaningDashboard={showCleaningDashboard}
            onClose={onClose}
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
        </div>
      ) : (
        <div className="relative bg-white rounded-lg w-full max-w-5xl p-4 md:p-12">
          <button
            onClick={handleClose}
            className={`absolute top-4 right-4 ${isProcessing
                ? "text-gray-400 cursor-not-allowed"
                : " rounded-xl text-white hover:text-purple-900 border-none"
              }`}
            disabled={isProcessing}
          >
            {isProcessing || isCleaning === "yes" ? "" : <img src={CloseICon} alt="close-x-icon"/>}
          </button>

          <div className="flex flex-col md:flex-row">
            <SetupSidebar
              processingOption={processingOption}
              steps={steps}
              currentStep={currentStep}
            />

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
                  businessDomain={businessDomain}
                  processingOption={processingOption}
                  downloadAfterCreating={downloadAfterCreating}
                  onProcessingOptionChange={handleProcessingOptionChange}
                  onDownloadToggle={() =>
                    setDownloadAfterCreating(!downloadAfterCreating)
                  }
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              )}

              {processingOption === "clean_and_generate" && currentStep === 4 && (
                <GrantAccessContent
                  users={users}
                  setUsers={setUsers}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              )}

              {currentStep === 5 && (
                <SetupSummaryContent
                  users={users}
                  businessDomain={businessDomain}
                  uploadedFile={uploadedFile}
                  processingOption={processingOption}
                  onPrevious={handlePrevious}
                  onFinish={handleFinish}
                  isProcessing={isProcessing}
                  success={success}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );

};

export default DashboardSetupFlow;
