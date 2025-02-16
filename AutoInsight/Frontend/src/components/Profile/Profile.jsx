/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import DashboardLogo from "../../assets/Dashboard.svg";
import DownloadLogo from "../../assets/Download.svg";
import TrashLogo from "../../assets/Trash.svg";
import OpenLogo from "../../assets/Open.svg";
import { useDispatch, useSelector } from "react-redux";
import { marginActions,authActions } from "../../store/index";
import { NotLoggedIn } from "../NotLoggedIn";
import Swal from 'sweetalert2';
import { dashboards } from "../../util/dashboard"
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DatasetPage = () => {
  const [clickedDashboardId, setClickedDashboardId] = useState(null);
  const [hoveredDashboardId, setHoveredDashboardId] = useState(null);
  const [dashboardList, setDashboardList] = useState(() => [...dashboards]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false); // New state for profile loading
  const [isUploadingProfile, setIsUploadingProfile] = useState(false); // New state for profile upload
  const profileInputRef = useRef(null);
  const navigate = useNavigate();
  // const allowedTypes = ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const profilePicture= useSelector((state)=>state.auth.profilePicture);
  const username= useSelector((state)=>state.auth.username);
  // const email = useSelector((state) => state.auth.isLoggedIn);
  const fileInputRef = useRef(null);
  const popupRef = useRef(null);

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

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    setIsProfileLoading(true); // Set loading to true when fetching starts
    try {
      const response = await axios.get("http://localhost:3000/api/v1/users/user-data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(authActions.addProfilePicture(response.data.body.profile_picture));
      dispatch(authActions.addUsername(response.data.body.username));
      console.log("Profile picture:", response.data.body.profile_picture);
      console.log("Username:", response.data.body.username);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    } finally {
      setIsProfileLoading(false); // Set loading to false when fetching is done
    }
  };
  
  // Call fetchUserProfile inside useEffect when the component mounts or user logs in
  useEffect(() => {
    fetchUserProfile();
  }, [isLoggedIn]);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setClickedDashboardId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const token = localStorage.getItem("token");

  const handlePermissionClick = (datasetId) => {
    setClickedDashboardId(datasetId === clickedDashboardId ? null : datasetId);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = [
        "text/csv",
        "text/xlsx",
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

            if (response.status === 201) {
              console.log("upload successful" + response.status);

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

  const handleProfilePictureClick = () => {
    profileInputRef.current.click();
  };

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
  
    const token = localStorage.getItem("token");
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
  
      console.log("Full Response:", response);
  
      if (response.status === 200) {
        const profilePic = response.data.body?.profile_picture || null;
        fetchUserProfile();
  
        if (profilePic) {
          dispatch(authActions.addProfilePicture(profilePic));
        } else {
          console.warn("No profile picture returned from API:", response.data);
        }
  
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
  
  

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E53E3E",
      cancelButtonColor: "#6B46C1",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setDashboardList((prevDashboards) => prevDashboards.filter((dashboard) => dashboard.id !== id));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The dashboard has been removed.",
          confirmButtonColor: "#6B46C1",
        });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen items-center pt-16 mt-[50px] px-4">
    {/* Profile Section */}
    <div className="flex flex-col items-center mt-8 w-full max-w-md">
      <div className="relative w-24 h-24 md:w-40 md:h-40">
        <div className="w-full h-full bg-purple-600 text-white rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold overflow-hidden relative">
          {isProfileLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            </div>
          ) : profilePicture ? (
            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            getInitials(username)
          )}
        </div>

        {/* Plus Button for Profile Picture Upload */}
        <button
          onClick={handleProfilePictureClick}
          className="absolute bottom-0 right-0 bg-purple-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl border-2 border-white hover:bg-purple-500 transition"
          disabled={isUploadingProfile}
        >
          {isUploadingProfile ? (
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
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
      <h2 className="text-xl font-bold mt-3 text-purple-900 text-center">{username}</h2>
      <button
        onClick={handleUploadClick}
        className="mt-3 bg-purple-900 h-[50px] text-white px-5 font-bold py-2 rounded-md hover:bg-purple-700 w-full md:w-auto flex items-center justify-center"
        disabled={isLoading}
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
          {dashboardList.map((dataset) => (
            <li
              key={dataset.id}
              className="flex flex-col md:flex-row items-center p-4 bg-white rounded-lg hover:bg-slate-50 transition-all duration-200 w-full group"
              onMouseEnter={() => setHoveredDashboardId(dataset.id)}
              onMouseLeave={() => setHoveredDashboardId(null)}
              style={{ zIndex: hoveredDashboardId === dataset.id || clickedDashboardId === dataset.id ? 10 : 1 }}
            >
              {/* Left Side (Dataset Logo & Name) */}
              <div className="flex items-center gap-4 flex-1 w-full">
                <div className="bg-purple-200 p-3 rounded-md flex items-center justify-center w-12 h-12">
                  <img src={DashboardLogo} alt="Dataset logo" className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium">{dataset.name}</h4>
                  <p className="text-xs text-gray-500">{dataset.time}</p>
                </div>
              </div>

              {/* Middle Section (Dataset Name & Permissions) */}
              <div className="flex flex-col md:flex-row flex-1 justify-center md:justify-start mt-4 md:mt-0 text-center md:text-left w-full items-center">
                {/* Fixed Width for Dataset Name */}
                <div className="text-purple-900 font-medium min-w-[150px] max-w-[150px] text-center truncate">
                  {dataset.datasetName}
                </div>

                {/* Users with Permission Button */}
                <button
                  className="text-purple-800 underline relative mt-2 md:mt-0 md:ml-48" // Adjust ml-10 for spacing
                  onClick={() => handlePermissionClick(dataset.id)}
                >
                  {dataset.usersWithPermission.length} users have permission
                  {clickedDashboardId === dataset.id && (
                    <div ref={popupRef} className="absolute top-full left-0 bg-purple-100 p-4 rounded-lg shadow-md z-50 w-full md:w-[173px]">
                      <ul>
                        {dataset.usersWithPermission.map((user, index) => (
                          <li key={index} className="text-purple-900 font-medium py-1 mt-3">
                            {user}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </button>
              </div>

              {/* Right Side (Buttons with Hover Popup) */}
              <div className="flex justify-center md:justify-end flex-1 mt-4 md:mt-0 w-full">
                <div className="relative group">
                  <button className="p-2 rounded-lg hover:bg-gray-200 transition">
                    <img src={DownloadLogo} alt="Download" className="w-6 h-6" />
                  </button>
                </div>
                <div className="relative group">
                  <button onClick={()=>{
                    navigate("/dashboard")
                  }} className="p-2 rounded-lg hover:bg-gray-200 transition">
                    <img src={OpenLogo} alt="Open" className="w-6 h-6" />
                  </button>
                </div>
                <div className="relative group">
                  <button onClick={() => handleDelete(dataset.id)} className="p-2 rounded-lg hover:bg-red-200 transition">
                    <img src={TrashLogo} alt="Trash" className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DatasetPage;