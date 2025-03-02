/* eslint-disable react/prop-types */
import { useState } from "react";
import { XCircle, Upload, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import FileLogo from "../../assets/FileLogo.png"

const UploadDatasetContent = ({ onNext,onPrevious, onFileUploaded,setUploadedDataset,uploadedDataset,uploadComplete,setUploadComplete,uploadProgress,setUploadProgress }) => {
  const [showError, setShowError] = useState(false);
   
  // Handle File Upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

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

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/datasets/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (response.status === 200) {
        console.log("File uploaded successfully:", response.data);
        setUploadProgress(100);
        setUploadComplete(true);
        // Update parent's state via callback
        if (onFileUploaded) {
          onFileUploaded(file);
        }
      }
    } catch (error) {
      console.error("File upload failed:", error);
      setShowError(true);
    }
  };

  // Handle File Removal
  const handleRemoveFile = () => {
    setUploadedDataset(null);
    setUploadProgress(0);
    setUploadComplete(false);
  };

  return (
    <>
      <h2 className="text-2xl font-medium text-purple-700 mb-2">Upload Dataset</h2>
      <p className="text-sm text-gray-600 mb-6">
        Securely upload your data file to start building your dashboard. Our platform supports multiple file formats
        (CSV, Excel, JSON, etc.). Preview your data to ensure accuracy before moving forward.
      </p>

      <div 
        className={`border-2 border-dashed ${showError ? "border-red-500" : "border-gray-300"} 
          rounded-lg p-4 md:p-8 flex flex-col items-center justify-center mb-4`}
      >
        <Upload className={`${showError ? "text-red-500" : "text-gray-400"} mb-4`} size={32} />
        <p className="text-base md:text-lg text-center mb-2">Choose a file or drag & drop it here</p>
        <p className="text-xs md:text-sm text-gray-500 mb-4">CSV, Excel, and JSON supported up to 500MB</p>
        <button 
          onClick={() => document.getElementById("file-upload").click()}
          className={`${showError ? "bg-red-500" : "bg-purple-700"} text-white px-4 py-2 rounded-md hover:opacity-90`}
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
                {uploadComplete ? <CheckCircle size={24} className="text-green-600" /> : <img  src={FileLogo} alt="file-logo" className="w-[30px]"/>}
              </div>
              <div>
                <p className="font-medium text-sm md:text-base">{uploadedDataset.name}</p>
                <p className="text-xs md:text-sm text-gray-500">
                  {uploadComplete ? "Upload Complete ✅" : `Uploading... (${uploadProgress}%)`}
                </p>
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

      <div className="flex justify-between">
        <button 
          onClick={onPrevious}
          className="border border-purple-700 text-purple-700 px-4 py-2 rounded-md flex items-center"
        >
          <span className="mr-1">←</span> Previous
        </button>
        <button 
          onClick={() => {
            if (uploadComplete) {
              onNext();
            }
          }}
          className={`${!uploadComplete ? "bg-purple-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-800"} 
            text-white px-6 py-2 rounded-md`}
          disabled={!uploadComplete}
        >
          Next <span className="ml-1">→</span>
        </button>
      </div>
    </>
  );
};

export default UploadDatasetContent;
