/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import DashboardSetupFlow from "../UploadWizard/DashboardSetupFlow";
const UploadDatasetComponent = ({onUploadSuccess}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
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
    // Open the DashboardSetUpFlow modal
    setIsModalOpen(true);
  };

  return (
    <div className="mt-3 w-full flex justify-center">
      <button
        onClick={handleLoadDataset}
        className="bg-purple-950 h-[50px] text-white px-5 font-bold py-2 rounded-md hover:bg-purple-700 w-full md:w-auto flex items-center justify-center"
      >
        Upload Dataset
      </button>

      {/* Show Dashboard Setup Flow Modal if open */}
      {isModalOpen && 
      
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <DashboardSetupFlow onUploadSuccess={onUploadSuccess} onClose={() => setIsModalOpen(false)} />
        </div>
        
        }
    </div>
  );
};

export default UploadDatasetComponent;
