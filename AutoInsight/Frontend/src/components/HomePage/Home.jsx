import { useState } from "react";
import { useSelector } from "react-redux";
import TabelAnalysis from "../../assets/Work automation, console control.svg";
import CuteRobot from "../../assets/cute robot.svg";
import Chatbot from "../Chatbot/Chatbot";
import DashboardSetupFlow from "../UploadWizard/DashboardSetupFlow";
import DatasetsButton from "./HomePageComponents/DatasetsButton";

export default function Home() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [showUploadingDashboard, setShowUploadingDashboard] = useState(false);
  const [showCleaningDashboard, setShowCleaningDashboard] = useState(false)
  const [chatbotIsOpen, setChatbotIsOpen] = useState(false);
  return (
    <div>
      <div id="home" className="pt-8 md:pt-30">
        <main className="flex flex-col md:flex-row items-center justify-between md:px-10 px-4 mt-12">
          <div className="max-w-2xl text-center md:text-left flex flex-col justify-center h-full">
            <h2 className="text-2xl md:text-5xl font-bold text-purple-900">
              Empowering companies with instant data analytics.
            </h2>
            <p className="mt-4 text-purple-900 text-lg">
              Advanced analytics made simple for everyone—from data analysts to non-technical users.
            </p>
            <div className="mt-6 flex justify-center md:justify-start">
              <DatasetsButton
                isLoggedIn={isLoggedIn}
                setShowUploadingDashboard={setShowUploadingDashboard}
                setShowCleaningDashboard={setShowCleaningDashboard}
                actionType="upload"
                className="bg-purple-900 text-white px-6 py-3 rounded hover:bg-purple-600"
              >
                Load Dataset
              </DatasetsButton>
              <DatasetsButton
                isLoggedIn={isLoggedIn}
                setShowUploadingDashboard={setShowUploadingDashboard}
                setShowCleaningDashboard={setShowCleaningDashboard}
                actionType="clean"
                className="bg-white ml-2 border border-purple-800 text-purple-800 px-6 py-3 rounded hover:bg-purple-600 hover:text-white"
              >
                Clean Dataset
              </DatasetsButton>

            </div>
          </div>
          <div className="flex flex-col items-center pt-10 md:pt-20">
            <img
              src={TabelAnalysis}
              alt="Tablet Analytics Illustration"
              className="w-auto max-w-full h-auto"
            />
          </div>
        </main>

        <div
          onClick={() => setChatbotIsOpen(true)}
          className="fixed bottom-5 right-5 md:bottom-10 md:right-10 z-50 cursor-pointer animate-bounce"
          aria-label="Open Chatbot"
        >
          <img
            src={CuteRobot}
            alt="Chatbot"
            className="w-32 h-32 md:w-40 md:h-40 hover:scale-110 transition-transform duration-100"
          />
        </div>

        {chatbotIsOpen && <Chatbot open={chatbotIsOpen} setOpen={setChatbotIsOpen} />}

        {showUploadingDashboard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <DashboardSetupFlow onClose={setShowUploadingDashboard} showCleaningDashboard={showCleaningDashboard}/>
          </div>
        )}
      </div>
    </div>
  );
}
