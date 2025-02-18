import { useEffect, useRef, useState } from "react";
import DashboardLogo from "../../assets/Dashboard.svg";
import DownloadLogo from "../../assets/Download.svg";
import TrashLogo from "../../assets/Trash.svg";
import OpenLogo from "../../assets/Open.svg";
import { useDispatch, useSelector } from "react-redux";
import { marginActions, authActions } from "../../store/index";
import { NotLoggedIn } from "../NotLoggedIn";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const DatasetPage = () => {
  // Component state and refs
  const [clickedDashboardId, setClickedDashboardId] = useState(null);
  const [hoveredDashboardId, setHoveredDashboardId] = useState(null);
  const [dashboardList, setDashboardList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const profileInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const popupRef = useRef(null);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const profilePicture = useSelector((state) => state.auth.profilePicture);
  const username = useSelector((state) => state.auth.username);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Helper function: Get initials from a full name
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // Trigger profile picture file input
  const handleProfilePictureClick = () => {
    if (profileInputRef.current) {
      profileInputRef.current.click();
    }
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload a JPG or PNG image.",
        confirmButtonColor: "#E53E3E",
      });
      return;
    }

    if (file.size > maxFileSize) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "The profile picture must be smaller than 5MB.",
        confirmButtonColor: "#E53E3E",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    if (!token) return;

    try {
      setIsUploadingProfile(true);
      const response = await axios.put(
        "http://localhost:3000/api/v1/users/profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Refresh profile data if needed
        fetchUserProfile();
        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Your profile picture has been updated successfully.",
          confirmButtonColor: "#6B46C1",
        });
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "An error occurred while updating your profile picture.",
        confirmButtonColor: "#E53E3E",
      });
    } finally {
      setIsUploadingProfile(false);
    }
  };

  // Trigger dataset file input
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    if (!token) return;
    setIsProfileLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/users/user-data",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(
        authActions.addProfilePicture(response.data.body.profile_picture)
      );
      dispatch(authActions.addUsername(response.data.body.username));
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Fetch datasets uploaded by or shared with the user
  
const fetchDatasets = async () => {
  if (!token) return;
  try {
    const response = await axios.get(
      "http://localhost:3000/api/v1/datasets/",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Extract the datasets array safely
    let datasets = [];
    if (response.data) {
      // If the response data itself is an array, use it
      if (Array.isArray(response.data)) {
        datasets = response.data;
      } 
      // Otherwise, check if response.data.body exists
      else if (response.data.body) {
        // If body is an array, use it directly
        if (Array.isArray(response.data.body)) {
          datasets = response.data.body;
        } 
        // Or if body.datasets is an array, use that
        else if (Array.isArray(response.data.body.datasets)) {
          datasets = response.data.body.datasets;
        }
      }
      
    }
    setDashboardList(datasets);
    console.log("datasets:", datasets);
    
  } catch (error) {
    console.error("Error fetching datasets:", error);
    console.log("datasets : "+dashboardList);
    
    
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while fetching the datasets.",
      confirmButtonColor: "#E53E3E",
    });
  } 
};


  // Toggle permission popup for a dataset
  const handlePermissionClick = (datasetId) => {
    setClickedDashboardId(datasetId === clickedDashboardId ? null : datasetId);
  };

  // Handle dataset file upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
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
              fetchDatasets(); // Refresh the list after upload
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Upload Error",
              text:
                error.response?.data?.message ||
                "Something went wrong while uploading your file.",
              confirmButtonColor: "#E53E3E",
            });
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

  const handleDownload = (datasetUrl) => {
    if (!datasetUrl) return;
    // Option 1: Open in new tab (often triggers a download)
    window.open(datasetUrl, "_blank");
  };

  // Delete a dataset from the database and update the UI
  const handleDelete = (id) => {
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Invalid Dataset",
        text: "Dataset ID is missing, unable to delete.",
        confirmButtonColor: "#E53E3E",
      });
      return;
    }
  
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E53E3E",
      cancelButtonColor: "#6B46C1",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Use the passed id directly (which is dataset._id)
          await axios.delete(
            `http://localhost:3000/api/v1/datasets/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
  
          // Filter by _id to remove the deleted dataset
          setDashboardList((prevDashboards) =>
            prevDashboards.filter((dashboard) => dashboard._id !== id)
          );
  
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The dataset has been removed.",
            confirmButtonColor: "#6B46C1",
          });
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire({
            icon: "error",
            title: "Delete Error",
            text:
              error.response?.data?.message ||
              "Something went wrong while deleting the dataset.",
            confirmButtonColor: "#E53E3E",
          });
        }
      }
    });
  };

  // Inside your list mapping, make sure you're passing the correct `id`
  {
    dashboardList.map((dataset, idx) => (
      <li
        key={dataset._id || dataset.id || idx}
        className="flex flex-col md:flex-row items-center p-4 bg-white rounded-lg hover:bg-slate-50 transition-all duration-200 w-full group"
        onMouseEnter={() => setHoveredDashboardId(dataset.id)}
        onMouseLeave={() => setHoveredDashboardId(null)}
        style={{
          zIndex:
            hoveredDashboardId === dataset.id ||
            clickedDashboardId === dataset.id
              ? 10
              : 1,
        }}
      >
        {/* Other content */}
        <button
          onClick={() => handleDelete(dataset.id)} // Pass the correct `id` here
          className="bg-white text-red-600 hover:bg-red-100 rounded-full p-2"
        >
          <img src={TrashLogo} alt="Delete dataset" className="w-5 h-5" />
        </button>
      </li>
    ));
  }

  // Set up some layout-related actions on mount/unmount
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

  // Fetch profile and datasets when user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
      fetchDatasets();
    }
  }, [isLoggedIn]);

  return !isLoggedIn ? (
    <NotLoggedIn />
  ) : (
    <div className="flex flex-col min-h-screen items-center pt-16 mt-[50px] px-4">
      {/* Profile Section */}
      <div className="flex flex-col items-center mt-8 w-full max-w-md">
        <div className="relative w-24 h-24 md:w-40 md:h-40">
          <div className="w-full h-full bg-purple-600 text-white rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold overflow-hidden relative">
            {isProfileLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
              </div>
            ) : profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(username)
            )}
          </div>

          {/* Button to trigger profile picture upload */}
          <button
            onClick={handleProfilePictureClick}
            className="absolute bottom-0 right-0 bg-purple-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl border-2 border-white hover:bg-purple-500 transition"
            disabled={isUploadingProfile}
          >
            {isUploadingProfile ? (
              <svg
                className="animate-spin h-4 w-4 text-white"
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
            ) : (
              "+"
            )}
          </button>
          <input
            type="file"
            ref={profileInputRef}
            className="hidden"
            onChange={handleProfilePictureUpload}
            accept="image/jpeg, image/png"
          />
        </div>
        <h2 className="text-xl font-bold mt-3 text-purple-900 text-center">
          {username}
        </h2>
        <button
          onClick={handleUploadClick}
          className="mt-3 bg-purple-900 h-[50px] text-white px-5 font-bold py-2 rounded-md hover:bg-purple-700 w-full md:w-auto flex items-center justify-center"
          disabled={isLoading}
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
            "Upload Dataset"
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".csv, .xlsx"
        />
      </div>

      {/* Dashboard Section */}
      <div className="w-full max-w-[1700px] mt-8">
        <h2 className="text-2xl font-bold text-purple-900">My Dashboards</h2>
        <h3 className="text-sm text-gray-600 mt-2">Recent dashboards</h3>
        <ul className="space-y-4">
          {dashboardList.map((dataset, idx) => (
            <li
              key={dataset._id || dataset.id || idx}
              className="flex flex-col md:flex-row items-center p-4 bg-white rounded-lg hover:bg-slate-50 transition-all duration-200 w-full group"
              onMouseEnter={() => setHoveredDashboardId(dataset.id)}
              onMouseLeave={() => setHoveredDashboardId(null)}
              style={{
                zIndex:
                  hoveredDashboardId === dataset.id ||
                  clickedDashboardId === dataset.id
                    ? 10
                    : 1,
              }}
            >
              {/* Left Side: Dataset info */}
              <div className="flex items-center gap-4 flex-1 w-full">
                <div className="bg-purple-200 p-3 rounded-md flex items-center justify-center w-12 h-12">
                  <img
                    src={DashboardLogo}
                    alt="Dataset logo"
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{dataset.dataset_name}</h4>
                  <p className="text-xs text-gray-500">
                    {new Date(dataset.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Middle Section: Permissions info */}
              <div className="flex flex-col md:flex-row flex-1 justify-center md:justify-start mt-4 md:mt-0 text-center md:text-left w-full items-center">
                <div className="text-purple-900 font-medium min-w-[150px] max-w-[150px] text-center truncate">
                  {dataset.dataset_name}
                </div>
                <button
                  className="text-purple-800 underline relative mt-2 md:mt-0 md:ml-48"
                  onClick={() => handlePermissionClick(dataset.id)}
                >
                  {dataset.permissions.length} users have permission
                  {clickedDashboardId === dataset.id && (
                    <div
                      ref={popupRef}
                      className="absolute top-full left-0 bg-purple-100 p-4 rounded-lg shadow-md z-50 w-full md:w-[173px]"
                    >
                      <ul>
                        {dataset.permissions.map((user, index) => (
                          <li
                            key={`${user.username}-${index}`}
                            className="text-sm text-gray-700 py-1"
                          >
                            {user.username}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </button>
              </div>

              {/* Right Side: Action buttons */}
              <div className="flex items-center">
                {/* Download Button */}
                <button
                  onClick={() => handleDownload(dataset.dataset_url)}
                  className="bg-white text-purple-600 hover:bg-purple-100 rounded-full p-2"
                >
                  <img
                    src={DownloadLogo}
                    alt="Download dataset"
                    className="w-8 h-8"
                  />
                </button>
                {/* Open Button */}
                <button onClick={() => navigate(`/dashboard/${dataset._id}`)} className="bg-white text-purple-600 hover:bg-purple-100 rounded-full p-2">
                <img src={OpenLogo} alt="Open dataset" className="w-8 h-8" />
                </button>
                {/* Delete Button */}
                
                <button
                  onClick={() => handleDelete(dataset._id)} // Pass dataset._id instead of dataset.id
                  className="bg-white text-red-600 hover:bg-red-100 rounded-full p-2"
                >
                  <img
                    src={TrashLogo}
                    alt="Delete dataset"
                    className="w-8 h-8"
                  />
                </button>
                
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DatasetPage;