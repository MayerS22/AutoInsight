/* eslint-disable react/prop-types */
import { useState } from "react";
import { XCircle, Upload, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import uploadCloud from "../../assets/cloud-add.svg";

const UploadDatasetContent = ({ onNext, onPrevious, onFileUploaded }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Handle File Upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setShowError(false);
    setUploadProgress(0);
    setUploadedBytes(0);
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
          withCredentials: true, // Ensures session cookie is sent with the request
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
            setUploadedBytes(progressEvent.loaded);
          },
        }
      );

      if (response.status === 200) {
        console.log("File uploaded successfully:", response.data);
        setUploadProgress(100);
        setUploadedBytes(file.size);
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

  // Handle File Removal
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setUploadedBytes(0);
    setUploadComplete(false);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload({ target: { files } });
      e.dataTransfer.clearData();
    }
  };

  // Calculate MB values
  const totalMB = uploadedFile ? uploadedFile.size / (1024 * 1024) : 0;
  const uploadedMB = uploadedBytes / (1024 * 1024);

  return (
    <>
      <h2 className="text-2xl font-bold text-purple/500 mb-2">Upload Dataset</h2>
      <p className="text-sm text-orig/600 mb-6">
        Securely upload your data file to start building your dashboard. Our platform supports multiple file formats
        (CSV, Excel, JSON, etc.). Preview your data to ensure accuracy before moving forward.
      </p>

      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-4 border-dashed ${
          showError ? "border-red-500" : "border-gray-200"
        } ${isDragging ? "ring-2 ring-purple/500 shadow-2xl" : ""} rounded-lg p-4 md:p-8 flex flex-col items-center justify-center mb-4`}
      >
        <img src={uploadCloud} alt="Upload Cloud Icon" className="w-12 h-12 mb-4" />
        <p className="font-Poppins md:text-xl text-center mb-2 text-orig/600">
          Choose a file or drag & drop it here
        </p>
        <p className="text-xs md:text-sm text-gray-400 mb-4">CSV, Excel, and JSON up to 50MB</p>
        <button
          onClick={() => document.getElementById("file-upload").click()}
          className={`${showError ? "bg-red-500" : "bg-purple/500"} text-white px-4 py-2 rounded-md hover:opacity-90`}
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

      {uploadedFile && (
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-10 h-12 bg-purple-200 rounded mr-3 flex items-center justify-center">
                {uploadComplete ? (
                  <CheckCircle size={24} className="text-green-600" />
                ) : (
                  <Upload size={24} className="text-gray-500" />
                )}
              </div>
              <p className="font-medium text-sm md:text-base">{uploadedFile.name}</p>
            </div>
            <div className="flex items-center">
              <p
                className={`text-xs md:text-sm text-gray-500 text-right ${
                  uploadComplete ? "" : "animate-pulse"
                }`}
              >
                {uploadComplete
                  ? "Upload Complete ✅"
                  : `Uploading... ${uploadedMB.toFixed(2)} MB / ${totalMB.toFixed(2)} MB (${uploadProgress}%)`}
              </p>
              <button className="text-gray-500 ml-4" onClick={handleRemoveFile}>
                <XCircle size={20} />
              </button>
            </div>
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
          className="border bg-purple/500 hover:bg-purple-700 text-white px-6 py-2 rounded-md flex items-center"
        >
          <span className="mr-1">←</span> Previous
        </button>
        <button
          onClick={() => {
            if (uploadComplete) {
              onNext();
            }
          }}
          className={`${
            !uploadComplete
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple/500 hover:bg-purple-700"
          } text-white px-6 py-2 rounded-md`}
          disabled={!uploadComplete}
        >
          Next <span className="ml-1">→</span>
        </button>
      </div>
    </>
  );
};

export default UploadDatasetContent;
