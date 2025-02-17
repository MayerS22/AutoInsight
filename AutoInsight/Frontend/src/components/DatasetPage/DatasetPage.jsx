import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { marginActions, authActions } from "../../store/index";
import { NotLoggedIn } from "../NotLoggedIn";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfileSection from "./ProfileSection";
import DashboardSection from "./DashboardSection";

const DatasetPage = () => {
  const [clickedDashboardId, setClickedDashboardId] = useState(null);
  const [hoveredDashboardId, setHoveredDashboardId] = useState(null);
  const [dashboardList, setDashboardList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const profileInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const profilePicture = useSelector((state) => state.auth.profilePicture);
  const username = useSelector((state) => state.auth.username);
  const token = localStorage.getItem("token");

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleProfilePictureClick = () => {
    if (profileInputRef.current) {
      profileInputRef.current.click();
    }
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

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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

  const fetchDatasets = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/datasets/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const datasets = Array.isArray(response.data)
        ? response.data
        : response.data.body;
      setDashboardList(datasets);
    } catch (error) {
      console.error("Error fetching datasets:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while fetching the datasets.",
        confirmButtonColor: "#E53E3E",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionClick = (datasetId) => {
    setClickedDashboardId(datasetId === clickedDashboardId ? null : datasetId);
  };

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
              fetchDatasets();
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
    window.open(datasetUrl, "_blank");
  };

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
          await axios.delete(
            `http://localhost:3000/api/v1/datasets/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

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
      <ProfileSection
        username={username}
        profilePicture={profilePicture}
        isProfileLoading={isProfileLoading}
        isUploadingProfile={isUploadingProfile}
        handleProfilePictureClick={handleProfilePictureClick}
        handleProfilePictureUpload={handleProfilePictureUpload}
        handleUploadClick={handleUploadClick}
        isLoading={isLoading}
      />
      <DashboardSection
        dashboardList={dashboardList}
        handleDownload={handleDownload}
        handleDelete={handleDelete}
        handlePermissionClick={handlePermissionClick}
        clickedDashboardId={clickedDashboardId}
        hoveredDashboardId={hoveredDashboardId}
        setHoveredDashboardId={setHoveredDashboardId}
      />
    </div>
  );
};

export default DatasetPage;