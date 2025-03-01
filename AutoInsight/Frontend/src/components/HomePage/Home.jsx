/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import TabelAnalysis from "../../assets/Work automation, console control.svg";
import CuteRobot from "../../assets/cute robot.svg";
import Chatbot from "../Chatbot/Chatbot";
import DashboardSetupFlow from "../Profile/UploadDatasetWizard";

export default function Home() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadingDashboard, setShowUploadingDashboard] = useState(false);
  const [chatbotIsOpen, setChatbotIsOpen] = useState(false);
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
    // Open the UploadingDashboard modal
    setShowUploadingDashboard(true);
  };

  const handleChatbotClick = () => {
    setChatbotIsOpen(true);
  };

  return (
    <div>
      {/* Main Content */}
      <div id="home" className="pt-8 md:pt-30">
        <main className="flex flex-col md:flex-row items-center justify-between md:px-10 px-4 mt-12">
          {/* Left Content */}
          <div className="max-w-2xl text-center md:text-left flex flex-col justify-center h-full">
            <h2 className="text-2xl md:text-5xl font-bold text-purple-900">
              Empowering companies with instant data analytics.
            </h2>
            <p className="mt-4 text-purple-900 text-lg">
              Advanced analytics made simple for everyone—from data analysts to non-technical users.
            </p>
            <div className="mt-6 flex justify-center md:justify-start">
              <button
                onClick={handleLoadDataset}
                className="bg-purple-900 text-white px-6 py-3 rounded hover:bg-purple-600 flex items-center"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Uploading...
                  </div>
                ) : (
                  "Load Dataset"
                )}
              </button>
            </div>
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
          style={{ animationDuration: "2s" }}
          className="fixed bottom-5 right-5 md:bottom-10 md:right-10 z-50 cursor-pointer animate-bounce"
          aria-label="Open Chatbot"
        >
          <img
            src={CuteRobot}
            alt="Chatbot"
            className="w-32 h-32 md:w-40 md:h-40 hover:scale-110 transition-transform duration-100"
          />
        </div>

        {chatbotIsOpen && (
          <Chatbot open={chatbotIsOpen} setOpen={setChatbotIsOpen} />
        )}

        {/* UploadingDashboard Modal */}
        {showUploadingDashboard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
           
              {/* Close button */}             
              <DashboardSetupFlow onClose={setShowUploadingDashboard}/>
          </div>
        )}
      </div>
    </div>
  );
}