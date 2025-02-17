import React, { useRef } from "react";

const ProfileSection = ({
  username,
  profilePicture,
  isProfileLoading,
  isUploadingProfile,
  handleProfilePictureClick,
  handleProfilePictureUpload,
  handleUploadClick,
  isLoading,
}) => {
  const profileInputRef = useRef(null);

  return (
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
  );
};

export default ProfileSection;