/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UploadDatasetComponent = ({ onUploadSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const maxFileSize = 10 * 1024 * 1024;
    const token = localStorage.getItem("token");

    if (allowedTypes.includes(file.type) && file.size <= maxFileSize) {
      const { value: dashboardName } = await Swal.fire({
        title: "Enter Dashboard Name",
        input: "text",
        inputPlaceholder: "Enter a dashboard name",
        showCancelButton: true,
        inputValidator: (value) => !value && "You need to provide a dashboard name!",
      });

      if (!dashboardName) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("dataset_name", dashboardName);

      try {
        setIsLoading(true);
        await axios.post("http://localhost:3000/api/v1/datasets/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (typeof onUploadSuccess === 'function') {
          onUploadSuccess();
        }
        
        Swal.fire({
          icon: "success",
          title: "Upload Successful!",
          text: `Your file "${dashboardName}" has been uploaded successfully.`,
          confirmButtonColor: "#6B46C1",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Upload Error",
          text: error.response?.data?.message || "Upload failed",
          confirmButtonColor: "#E53E3E",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload a CSV or Excel file smaller than 10MB.",
        confirmButtonColor: "#E53E3E",
      });
    }
  };

  return (
    <div className="mt-3 w-full flex justify-center">
      <button
        onClick={handleUploadClick}
        className="bg-purple-900 h-[50px] text-white px-5 font-bold py-2 rounded-md hover:bg-purple-700 w-full md:w-auto flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Uploading...
          </div>
        ) : "Upload Dataset"}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept=".csv, .xlsx"
      />
    </div>
  );
};

export default UploadDatasetComponent;