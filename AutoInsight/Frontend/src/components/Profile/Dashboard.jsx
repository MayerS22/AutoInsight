import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { NotLoggedIn } from "../NotLoggedIn";
import AddIcon from "../../assets/AddPermision.svg";
import PermissionModal from "./PermissionModal.jsx"; // Import modal component

const Dashboard = () => {
  const { datasetName } = useParams(); // Get dataset name from URL params
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    // Fetch images from backend (mock API call for now)
    const fetchImages = async () => {
      try {
        const response = await fetch("https://your-backend-api.com/images"); // Replace with real API
        const data = await response.json();
        setImages(data.images || []);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  return (
    <div className="flex flex-col items-center px-4 pt-28">
      <div className="w-full max-w-6xl">
        {/* Dataset Name and Permission Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-purple-900">
            <span className="text-purple-900">
              {datasetName || "Unknown Dataset"}
            </span>{" "}
            Dashboard
          </h2>
          <button
            className="flex items-center justify-center gap-2 bg-purple-900 text-white px-5 py-3 rounded-lg hover:bg-purple-800 transition"
            onClick={() => setIsModalOpen(true)} // Open modal
          >
            <img src={AddIcon} alt="Add Icon" className="w-5 h-5" />
            <span className="text-sm font-medium">Give Permission</span>
          </button>
        </div>

        <h3 className="text-sm text-gray-600 mt-2">
          Date Created: (Add timestamp here if available)
        </h3>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 w-full max-w-6xl">
        {images.length > 0
          ? images.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Dataset Image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            ))
          : Array(6)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="w-full h-48 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600"
                >
                  No Image
                </div>
              ))}
      </div>

      {/* Show Modal when isModalOpen is true */}
      {isModalOpen && <PermissionModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Dashboard;
