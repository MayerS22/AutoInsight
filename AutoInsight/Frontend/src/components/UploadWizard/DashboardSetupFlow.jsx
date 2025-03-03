/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState,useEffect } from "react";
import { XCircle, Loader } from "lucide-react";
import SetupSidebar from "./SetupSidebar";
import BusinessDomainContent from "./BusinessDomainContent";
import UploadDatasetContent from "./UploadDatasetContent";
import CustomizeProcessingContent from "./CustomizeProcessingContent";
import GrantAccessContent from "./GrantAccessContent"; // Import the new component
import SetupSummaryContent from "./SetupSummaryContent";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useDispatch } from "react-redux";
import { authActions } from "../../store";

const DashboardSetupFlow = ({ onClose, onUploadSuccess }) => {
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

  const dispatch = useDispatch();
  
    useEffect(()=>{
      const fetchUserData=async()=>{
        const token = localStorage.getItem('token');
        try{
          const response = await axios.get(`http://localhost:3000/api/v1/users/user-data`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          dispatch(authActions.addProfilePicture(response.data.body.profile_picture));
          dispatch(authActions.addUsername(response.data.body.username));
          dispatch(authActions.addID(response.data.body._id));
          console.log(response.data.body._id);
            
        } catch (error) {
          console.error(error);
        }
      }
      fetchUserData();
    },[])
  
  const steps = [
    { number: 1, title: "Choose Business Domain" },
    { number: 2, title: "Upload Dataset" },
    { number: 3, title: "Customize Your Processing" },
    { number: 4, title: "Grant Access to Users" },
    { number: 5, title: "Setup Summary" },
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
      console.log("Sending request with:", {
        analysis_option: processingOption,
      });
      console.log(token);
      
      const response = await axios.post(
        "http://localhost:3000/api/v1/datasets/generate-insights",
        {}, // No body needed
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
    
      

      console.log("Finish Response:", response.data);

      // If downloadAfterCreating is true, proceed to download files
      if (downloadAfterCreating) {
        if (processingOption === "clean_only") {
          // Check for the cleaned_dataset_url inside body.dataset first
          const cleanedUrl =
            response.data.body?.dataset?.cleaned_dataset_url ||
            response.data.cleaned_dataset_url ||
            response.data.body?.cleaned_dataset_url;

          if (cleanedUrl) {
            const fileResponse = await axios.get(cleanedUrl, {
              responseType: "blob",
            });
            saveAs(fileResponse.data, "cleaned_dataset.csv");
          } else {
            console.error(
              "cleaned_dataset_url not found in response:",
              response.data
            );
          }
        } else if (processingOption === "clean_and_generate") {
          // Retrieve insights_urls from the nested dataset field
          const insightsUrls =
            response.data.body?.dataset?.insights_urls ||
            response.data.body?.insights_urls;
          if (insightsUrls) {
            const zip = new JSZip();
            // For each chart type, create a folder and add each image file
            for (const chartType in insightsUrls) {
              // eslint-disable-next-line no-prototype-builtins
              if (insightsUrls.hasOwnProperty(chartType)) {
                const folder = zip.folder(chartType);
                const urls = insightsUrls[chartType];
                for (let i = 0; i < urls.length; i++) {
                  try {
                    const res = await fetch(urls[i]);
                    const blob = await res.blob();
                    // Name each file with the chart type and index
                    folder.file(`${chartType}_${i + 1}.jpg`, blob);
                  } catch (err) {
                    console.error(
                      `Error fetching image from ${chartType}:`,
                      urls[i],
                      err
                    );
                  }
                }
              }
            }
            // Generate zip and trigger download
            zip.generateAsync({ type: "blob" }).then((content) => {
              saveAs(content, "insights_images.zip");
            });
          } else {
            console.error(
              "insights_urls not found in response:",
              response.data
            );
          }
        }
      }

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
    <div className="relative bg-white rounded-lg w-full max-w-5xl p-4 md:p-12">
      <button
        onClick={handleClose}
        className={`absolute top-4 right-4 ${
          isProcessing
            ? "text-gray-400 cursor-not-allowed"
            : "text-purple-800  hover:text-purple-900"
        }`}
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
              onDownloadToggle={() =>
                setDownloadAfterCreating(!downloadAfterCreating)
              }
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
