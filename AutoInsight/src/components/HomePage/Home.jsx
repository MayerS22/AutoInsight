/* eslint-disable no-unused-vars */
import { useRef } from "react";
import { useOutletContext } from "react-router-dom";
import TabelAnalysis from "../../assets/Work automation, console control.svg";
import CuteRobot from "../../assets/cute robot.svg";
import { toast } from 'react-toastify';
import {authActions} from "../../store/index";
import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert



export default function Home() {

  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
      // Show SweetAlert on successful file upload
      Swal.fire({
        title: "File Upload Successful",
        text: `File "${file.name}" uploaded successfully!`,
        icon: "success",
        confirmButtonText: "Great",
      });
      // Add your file upload logic here (e.g., send to backend)
    }
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
              Load Dataset
            </button>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileUpload}
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