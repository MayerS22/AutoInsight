/* eslint-disable react/prop-types */
import { useState } from "react";
import { XCircle, AlertCircle, CheckCircle } from "lucide-react";
import FileLogo from "../../assets/FileLogo.png";
import CloudAdd from "../../assets/cloud-add.svg";
import { uploadDataset } from "../../services/Api_Services";
import { Loader } from "lucide-react";
import axios from "axios";


const UploadDatasetContent = ({
  onNext,
  onPrevious,
  onFileUploaded,
  setUploadedDataset,
  uploadedDataset,
  uploadComplete,
  setUploadComplete,
  uploadProgress,
  setUploadProgress,
  showCleaningDashboard = false,
  isCleaning,
  setIsCleaning,
}) => {
  const [showError, setShowError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dropAnimation, setDropAnimation] = useState(false);
  const [cleaningError, setCleaningError] = useState(false);

  // Helper function to format file sizes to MB with two decimals
  const formatFileSize = (sizeInBytes) => {
    const mb = sizeInBytes / (1024 * 1024);
    return `${mb.toFixed(2)}MB`;
  };

  // Refactored function to handle file upload logic using the API service
  const uploadFile = async (file) => {
    setUploadedDataset(file);
    setShowError(false);
    setUploadProgress(0);
    setUploadComplete(false);

    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.error("Session ID is missing!");
      setShowError(true);
      return;
    }

    try {
      const response = await uploadDataset(file, token, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      });

      if (response.status === 200) {
        console.log("File uploaded successfully:", response.data);
        setUploadProgress(100);
        setUploadComplete(true);
        if (onFileUploaded) {
          onFileUploaded(file);
        }
      }
    } catch (error) {
      console.error("File upload failed:", error);
      setShowError(true);
    }
  };

  // Handle file selection via file input
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    uploadFile(file);
  };

  // Prevent default behavior when a file is dragged over the drop area
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Handle file drop event with animation feedback
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
      setDropAnimation(true);
      setTimeout(() => setDropAnimation(false), 300);
    }
  };

  // Handle File Removal
  const handleRemoveFile = () => {
    setUploadedDataset(null);
    setUploadProgress(0);
    setUploadComplete(false);
  };


  const cleanDataset = async () => {
    setIsCleaning("yes");
    setCleaningError(false);
  
    if (!uploadedDataset) {
      console.error("No dataset available for cleaning.");
      setCleaningError(true);
      return;
    }
  
    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");
  
    if (!sessionId) {
      console.error("Session ID is missing!");
      setShowError(true);
      setCleaningError(true);
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("file", uploadedDataset);
  
      const response = await axios.post(
        "http://localhost:3000/api/v1/datasets/clean-dataset/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Cleaned dataset response:", response.data);
      setIsCleaning("no");
    } catch (error) {
      console.error("Dataset cleaning failed:", error);
      setCleaningError(true);
      setIsCleaning("no");
    }
  };
  


  if (isCleaning === "yes") {
    // Show a loading spinner while waiting for the API response
    return (
      <div className="flex justify-center flex-col items-center h-full">
        <Loader className="animate-spin text-purple/500" size={48} />
        <p className="text-lg text-purple/500 mt-2 font-bold">Analyzing...</p>
      </div>
    );
  }

  
  if (isCleaning === "no") {
    return (
      <div className="flex justify-center flex-col items-center h-full">
        <CheckCircle size={59} className="text-green-600 text-bold" />

        <p className="text-lg text-green-600 mt-2 font-bold"> Dataset Cleaned Successfully!</p>
        <p className="text-sm text-gray-500">Your data is now ready for use.</p>
      </div>
    );
  }

  if (cleaningError) {
    return (
      <div className="flex justify-center flex-col items-center h-full">
        <XCircle size={59} className="text-red-600" />
        <p className="text-lg text-red-600 mt-2 font-bold">
          Dataset Cleaning Failed!
        </p>
        <p className="text-sm text-gray-500">
          Please try again or check your file.
        </p>
      </div>
    );
  }
  

  return (
    <>
      <h2 className="text-2xl font-bold text-purple/500 mb-2">
        Upload Dataset
      </h2>
      <p className="text-sm text-orig/600 mb-6">
        Securely upload your data file to start building your dashboard. Our
        platform supports multiple file formats (CSV, Excel, JSON, etc.). Preview
        your data to ensure accuracy before moving forward.
      </p>

      <div
        className={`border-4 border-dashed ${showError
          ? "border-red-500"
          : isDragging
            ? "border-blue-400"
            : "border-gray-200"
          } rounded-lg p-4 md:p-8 flex flex-col items-center justify-center mb-4 transition-transform duration-300 ${dropAnimation ? "scale-105" : ""
          }`}
        onDragOver={handleDragOver}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <img src={CloudAdd} alt="Cloud Add" className="h-14 w-14" />
        <p className="font-poppins text-orig/500 text-base md:text-lg text-center pt-2 mb-2">
          Choose a file or drag & drop it here
        </p>
        <p className="text-xs md:text-sm text-gray-400 mb-4">
          CSV, Excel, and JSON files
        </p>
        <button
          onClick={() => document.getElementById("file-upload").click()}
          className={`${showError ? "bg-red-500" : "bg-purple/500"
            } text-white px-4 py-2 rounded-md hover:opacity-90`}
        >
          Browse File
        </button>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept=".csv,.xls,.xlsx,.json"
        />
      </div>

      {showError && (
        <div className="flex items-center mb-4 text-red-500 text-sm">
          <AlertCircle size={16} className="mr-2" />
          <span>Failed to upload file. Please try again.</span>
        </div>
      )}

      {uploadedDataset && (
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-10 h-12 rounded mr-3 flex items-center justify-center">
                {uploadComplete ? (
                  <CheckCircle size={24} className="text-green-600 text-bold" />
                ) : (
                  <img
                    src={FileLogo}
                    alt="file-logo"
                    className="w-[30px] animate-pulse"
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center space-x-4">
                <span className="font-medium text-sm md:text-base">
                  {uploadedDataset.name}
                </span>
                <span className="text-xs md:text-sm text-gray-500">
                  {`${formatFileSize(
                    uploadedDataset.size * (uploadProgress / 100)
                  )} / ${formatFileSize(uploadedDataset.size)}`}
                </span>
                <span className="text-xs md:text-sm text-gray-500">
                  {uploadComplete
                    ? "Upload Complete ✅"
                    : `Uploading... (${uploadProgress}%)`}
                </span>
              </div>
            </div>
            <button className="text-gray-500" onClick={handleRemoveFile}>
              <XCircle size={20} />
            </button>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-purple-600 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className={`flex ${showCleaningDashboard ? "justify-end" : "justify-between"}`}>
        {!showCleaningDashboard && (
          <button
            onClick={onPrevious}
            className={`border bg-purple/500 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center 
          ${uploadedDataset && !uploadComplete ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={uploadedDataset && !uploadComplete} // Disable only while uploading
          >
            <span className="mr-1">←</span> Previous
          </button>

        )}

        <button
          onClick={() => {
            if (showCleaningDashboard) {
              cleanDataset();
            } else if (uploadComplete) {
              onNext();
            }
          }}
          className={`${!uploadComplete ? "bg-purple-400 cursor-not-allowed" : "bg-purple/500 hover:bg-purple-700"
            } text-white px-6 py-2 rounded-md`}
          disabled={!uploadComplete}
        >
          {showCleaningDashboard ? "Clean Dataset" : <span> Next <span className="ml-1">→</span></span>}
        </button>
      </div>

    </>
  );
};

export default UploadDatasetContent;
