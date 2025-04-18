/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { authActions } from "../../store/index";


const ProfilePictureComponent = ({ 
  profilePicture, 
  onProfileUpdate 
}) => {
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const dispatch = useDispatch();
  const profileInputRef = useRef(null);
  const username = useSelector((state) => state.auth.username);
  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleProfilePictureClick = () => {
    profileInputRef.current?.click();
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxFileSize = 5 * 1024 * 1024;
    const token = localStorage.getItem("token");

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
      
      const newImageUrl = response.data.profilePicture;
      console.log("New Image URL:", newImageUrl);
      
      dispatch(authActions.addProfilePicture(newImageUrl));      
      
      
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile picture has been updated successfully.",
        confirmButtonColor: "#6B46C1",
      });
    } catch (error) {
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

  return (
    <div className="flex flex-col items-center mt-8 w-full max-w-md">
      <div className="relative w-24 h-24 md:w-40 md:h-40">
        <div className="w-full h-full bg-purple-600 text-white rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold overflow-hidden relative">
          {isProfileLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : profilePicture ? (
            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            getInitials(username)
          )}
        </div>
        <button
          onClick={handleProfilePictureClick}
          className="absolute bottom-2 right-1 bg-purple-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl border-2 border-white hover:bg-purple-500 transition"
          disabled={isUploadingProfile}
        >
          {isUploadingProfile ? (
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : "+"}
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
    </div>
  );
};

export default ProfilePictureComponent;