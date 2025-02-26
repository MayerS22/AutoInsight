import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NotLoggedIn } from "../NotLoggedIn.jsx";
import AddIcon from "../../assets/addIcon.svg";
import PermissionModal from "./PermissionModal.jsx";
import { marginActions } from "../../store/index";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Dashboard = () => {
  const { id } = useParams(); // Get dataset ID from URL params
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [insightsUrls, setInsightsUrls] = useState([]);
  const [datasetName, setDatasetName] = useState("Loading...");
  const [creationDate, setCreationDate] = useState("");
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const fetchDatasetDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/datasets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);

        // Ensure response has the expected structure
        if (response.data.body && response.data.body.dataset) {
          const { dataset_name, createdAt, insights_urls } = response.data.body.dataset;

          setDatasetName(dataset_name || "Unnamed Dataset");
          setCreationDate(createdAt ? new Date(createdAt).toLocaleDateString() : "Unknown");
          setInsightsUrls(insights_urls || []);
        } else {
          console.error("Invalid API response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching dataset details:", error);
      }
    };

    fetchDatasetDetails();
  }, [id, token]);

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
    setSelectedImage(url);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col pt-28 px-8 sm:px-12 lg:px-16">
      {/* Top Section with Title and Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full">
        {/* Dashboard Title (Left-Aligned) */}
        <h2 className="text-3xl font-bold text-purple-900 mb-4 sm:mb-0">
          {datasetName} Dashboard
        </h2>

        {/* Permission Button (Right-Aligned) */}
        <button
          className="bg-purple-900 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-purple-800 transition"
          onClick={() => setIsModalOpen(true)}
        >
          <img src={AddIcon} alt="Add Icon" className="w-5 h-5" />
          <span className="text-sm font-medium">Give Permission</span>
        </button>
      </div>

      {/* Dataset Creation Date */}
      <h3 className="text-sm text-gray-600 mt-2">
        Date Created:{" "}
        {new Date(creationDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h3>

      {/* Image Grid for Insights URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 w-full max-w-[2300px]">
        {insightsUrls.length > 0
          ? insightsUrls.map((url, index) => (
              <div
                key={index}
                className="relative group w-full h-64 sm:h-96 rounded-lg shadow-md overflow-hidden cursor-pointer"
                onClick={() => handleImageClick(url)}
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
                  className="w-full h-64 sm:h-96 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600"
                >
                  No Image
                </div>
              ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 sm:px-6 lg:px-8">
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Image with border */}
            <div className="relative border-4 border-white rounded-lg">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-0 right-0 text-white w-9 h-9 text-3xl bg-black bg-opacity-50 rounded-full"
              >
                &times;
              </button>
              <img
                src={selectedImage}
                alt="Selected Insight"
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Show Permission Modal */}
      {isModalOpen && (
        <PermissionModal
          setIsModalOpen={setIsModalOpen}
          datasetId={id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
