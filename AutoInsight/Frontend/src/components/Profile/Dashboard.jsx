import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NotLoggedIn } from "../NotLoggedIn.jsx";
import AddIcon from "../../assets/addIcon.svg";
import PermissionModal from "./PermissionModal.jsx"; // Import modal component
import { marginActions } from "../../store/index";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"; // Import axios

const Dashboard = () => {
  const { datasetName } = useParams(); // Get dataset name from URL params
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for permissions
  const [selectedImage, setSelectedImage] = useState(null); // To store the clicked image URL
  const [insightsUrls, setInsightsUrls] = useState([]); // State to store insights URLs
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    // Fetch insights URLs from backend using axios
    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/datasets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInsightsUrls(response.data.body.insights_urls); // Set the insights URLs
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [id]);

  useEffect(() => {
    dispatch(marginActions.setColor("bg-white"));
    dispatch(marginActions.removeUserName());
    dispatch(marginActions.addLogoutIcon());
    return () => {
      dispatch(marginActions.setMargin(""));
      dispatch(marginActions.setColor("bg-purple-50"));
      dispatch(marginActions.addUserName());
      dispatch(marginActions.removeLogoutIcon());
    };
  }, [dispatch]);

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  const handleImageClick = (url) => {
    setSelectedImage(url); // Set the clicked image URL
  };

  const closeModal = () => {
    setSelectedImage(null); // Close the modal by setting selected image to null
  };

  return (
    <div className="flex flex-col items-center px-4 pt-28">
      <div className="w-full max-w-6xl">
        {/* Dataset Name and Permission Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-purple-900">
            <span className="text-purple-900">{datasetName || "Unknown Dataset"}</span> Dashboard
          </h2>
          <button
            className="flex items-center justify-center gap-2 bg-purple-900 text-white px-5 py-3 rounded-lg hover:bg-purple-800 transition"
            onClick={() => setIsModalOpen(true)} // Open permission modal
          >
            <img src={AddIcon} alt="Add Icon" className="w-5 h-5" />
            <span className="text-sm font-medium">Give Permission</span>
          </button>
        </div>

        <h3 className="text-sm text-gray-600 mt-2">
          Date Created: (Add timestamp here if available)
        </h3>
      </div>

      {/* Image Grid for insights URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 w-full max-w-[2500px]">
        {insightsUrls.length > 0
          ? insightsUrls.map((url, index) => (
            <div
              key={index}
              className="relative group w-[90%] h-[40rem] rounded-lg shadow-md overflow-hidden cursor-pointer"
              onClick={() => handleImageClick(url)} // Open modal on click
            >
              <img
                src={url}
                alt={`Insight Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white text-lg font-semibold">
                Click to View Larger
              </div>
            </div>
          ))
          : Array(6)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="w-[90%] h-[40rem] bg-gray-300 rounded-lg flex items-center justify-center text-gray-600"
              >
                No Image
              </div>
            ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="relative">
            {/* Image with border */}
            <div className="relative border-4 border-white rounded-lg">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-0 right-0 text-white p-4 text-3xl bg-black bg-opacity-50 rounded-full"
              >
                &times;
              </button>
              <img
                src={selectedImage}
                alt="Selected Insight"
                className="max-w-4xl max-h-[90vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
      {/* Show Permission Modal */}
      {isModalOpen && <PermissionModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Dashboard;
