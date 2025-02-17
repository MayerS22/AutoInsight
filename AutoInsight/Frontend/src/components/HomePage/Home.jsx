import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";
import TabelAnalysis from "../../assets/Work automation, console control.svg";
import CuteRobot from "../../assets/cute robot.svg";
import Chatbot from "../Chatbot/Chatbot";

export default function Home() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [chatbotIsOpen,setChatbotIsOpen]=useState(false);
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
      const maxFileSize = 10 * 1024 * 1024; // 10MB

      if (allowedTypes.includes(file.type)) {
        if (file.size <= maxFileSize) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("dataset_name", file.name);

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

            if (response.status === 201) {
              Swal.fire({
                icon: "success",
                title: "Upload Successful!",
                text: `Your file "${file.name}" has been uploaded successfully.`,
                confirmButtonColor: "#6B46C1",
              });
            }

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
  };

  const handleChatbotClick = () => {
    setChatbotIsOpen(true)
    // You can replace this with an actual chatbot popup/modal logic
  };

  return (
    <div>
      {/* Main Content */}
      <div id="home" className="pt-8 md:pt-30">
        <main className="flex flex-col md:flex-row items-center justify-between md:px-10 px-4 mt-12">
          
          {/* Left Content (Developer Text Centered Left) */}
          <div className="max-w-2xl text-center md:text-left flex flex-col justify-center h-full">
            <h2 className="text-2xl md:text-5xl font-bold text-purple-900">
              Empowering companies with instant data analytics.
            </h2>
            <p className="mt-4 text-purple-900 text-lg">
              Advanced analytics made simple for everyone—from data analysts to
              non-technical users.
            </p>
            <div className="mt-6 flex justify-center md:justify-start">
              <button
                onClick={handleLoadDataset}
                className="bg-purple-900 text-white px-6 py-3 rounded hover:bg-purple-600 flex items-center"
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
            </div>
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
          <div className="flex flex-col items-center pt-10 md:pt-20">
            <img
              src={TabelAnalysis}
              alt="Tablet Analytics Illustration"
              className="w-auto max-w-full h-auto"
            />
          </div>
        </main>

        {/* Chatbot (Fixed at Bottom Right) */}
        <div 
          onClick={handleChatbotClick}
          className="fixed bottom-5 right-5 md:bottom-10 md:right-10 cursor-pointer"
        >
          <img
            src={CuteRobot}
            alt="Chatbot"
            className="w-32 h-32 md:w-40 md:h-40 hover:scale-110 transition-transform duration-300"
          />
        </div>
         {chatbotIsOpen&& <Chatbot open={chatbotIsOpen} setOpen={setChatbotIsOpen}/>}
      </div>
   

    </div>
  );
}
