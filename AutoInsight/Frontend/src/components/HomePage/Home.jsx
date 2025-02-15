/* eslint-disable no-unused-vars */
import { useRef ,useState} from "react";
import { useOutletContext } from "react-router-dom";
import TabelAnalysis from "../../assets/Work automation, console control.svg";
import CuteRobot from "../../assets/cute robot.svg";
import { toast } from 'react-toastify';
import {authActions} from "../../store/index";
import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert
import axios from "axios";



export default function Home() {

  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const [isLoading,setIsLoading]=useState(false);
  const fileInputRef = useRef(null); // Ref for the file input
  const navigate = useNavigate();
  const handleLoadDataset = () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "You must be logged in to upload a file",
        text: "Redirecting to login page...",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    // Trigger the file input dialog
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const token = localStorage.getItem("token");
  
    if (file) {
      const allowedTypes = [
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
  
      if (allowedTypes.includes(file.type)) {
        if (file.size <= maxFileSize) {
  
          const formData = new FormData();
          formData.append("file", file);
          formData.append("dataset_name", file.name); // Use the actual file name
  
          console.log("Uploading file:", file.name);
          console.log("Token:", token);
  
          try {
            setIsLoading(true);
            const response = await axios.post(
              "http://localhost:3000/api/v1/datasets/upload",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
  
            if (response.status===201) {
              console.log("upload successful"+response.status);
              
              Swal.fire({
                icon: "success",
                title: "Upload Successful!",
                text: `Your file "${file.name}" has been uploaded successfully.`,
                confirmButtonColor: "#6B46C1",
              });
            }
  
            console.log("File name after upload:", file.name); // Fix: Use 'file' instead of 'selectedFile'
            fileInputRef.current.value = ""; // Clear input field
          } catch (error) {
            const errorMessage =
              error.response?.data?.message ||
              error.message ||
              "Something went wrong while uploading your file.";
  
            Swal.fire({
              icon: "error",
              title: "Upload Error",
              text: errorMessage,
              confirmButtonColor: "#E53E3E",
            });
  
            console.error("Upload Error:", error);
            if (error.response) {
              console.error("Server Response:", error.response.data);
            }
          } finally {
            setIsLoading(false);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "File Too Large",
            text: `The file "${file.name}" exceeds the maximum allowed size of 10MB.`,
            confirmButtonColor: "#E53E3E",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid File Format",
          text: "Please upload a CSV or Excel (.xlsx) file.",
          confirmButtonColor: "#E53E3E",
        });
      }
    }
  
    console.log("Is Loading:", isLoading);
  };

  return (
    <div>
      {/* Header */}
      {/* Main Content */}
      <div id="home" className="pt-[30px]">
        {/* Hero Section */}
        <main className="flex-grow flex items-center justify-between md:px-10">
          {/* Left Content */}
          <div className="max-w-2xl pt-20">
            <h2 className="text-2xl md:text-5xl font-bold text-purple-900">
              Empowering companies with instant data analytics.
            </h2>
            <p className="mt-4 text-purple-900 text-lg">
              Advanced analytics made simple for everyone—from data analysts to
              non-technical users.
            </p>
            <button
              onClick={handleLoadDataset}
              className="mt-6 bg-purple-900 text-white px-6 py-3 rounded hover:bg-purple-600"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Uploading...
            </div>
          ) : (
            "Load Dataset"
          )}
        </button>
            {/* Hidden file input */}
            <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".csv, .xlsx"
        />
          </div>

          {/* Right Illustration */}
          <div className="flex flex-col items-center pt-20">
            <img
              src={TabelAnalysis}
              alt="Tablet Analytics Illustration"
              className="max-w-full h-auto"
            />
            <img
              src={CuteRobot}
              alt="Cute Robot"
              className="w-40 h-40 md:w-80 mt-8 pl-20"
            />
          </div>
        </main>
      </div>
    </div>
  );
}