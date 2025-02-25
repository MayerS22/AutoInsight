/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { marginActions, authActions } from "../../store/index";
import { NotLoggedIn } from "../NotLoggedIn";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import DashboardList from "./DashboardList";

const DatasetPage = () => {
  // Component state and refs
  const [clickedDashboardId, setClickedDashboardId] = useState(null);
  const [hoveredDashboardId, setHoveredDashboardId] = useState(null);
  const [dashboardList, setDashboardList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false); // New state for dashboard loading
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
    setIsDashboardLoading(true); // Set loading state to true
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while fetching the datasets.",
        confirmButtonColor: "#E53E3E",
      });
    } finally {
      setIsDashboardLoading(false); // Set loading state to false
    }
  };

  // Toggle permission popup for a dataset
  const handlePermissionClick = (datasetId) => {
    setClickedDashboardId(clickedDashboardId === datasetId ? null : datasetId);
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

  const handleDownload = async (imageUrls) => {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;
  
    const zip = new JSZip();
    const folder = zip.folder("insights_images");
  
    // Function to fetch an image as a blob
    const fetchImageAsBlob = async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${url}`);
      }
      return await response.blob();
    };
  
    // Fetch each image and add it to the zip
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const blob = await fetchImageAsBlob(imageUrls[i]);
        // Optionally, determine file extension from URL or blob.type
        folder.file(`image_${i + 1}.jpg`, blob);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    }
  
    // Generate the zip file and trigger the download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "insights_images.zip");
    });
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
          await axios.delete(`http://localhost:3000/api/v1/datasets/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

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
   <DashboardList
   isProfileLoading={isProfileLoading} profilePicture={profilePicture} username={username} getInitials={getInitials} 
    handleProfilePictureClick={handleProfilePictureClick} isUploadingProfile={isUploadingProfile}
    profileInputRef={profileInputRef} handleProfilePictureUpload={handleProfilePictureUpload} handleUploadClick={handleUploadClick}
    isLoading={isLoading} fileInputRef={fileInputRef} handleFileChange={handleFileChange} isDashboardLoading={isDashboardLoading} dashboardList={dashboardList}
    setHoveredDashboardId={setHoveredDashboardId} hoveredDashboardId={hoveredDashboardId} clickedDashboardId={clickedDashboardId}
    handlePermissionClick={handlePermissionClick} popupRef={popupRef} handleDownload={handleDownload} navigate={navigate} handleDelete={handleDelete}
   />
  );
};

export default DatasetPage;