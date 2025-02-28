/* eslint-disable react/prop-types */
import { useState } from "react";
import DashboardLogo from "../../assets/Dashboard.svg";
import DownloadLogo from "../../assets/Download.svg";
import TrashLogo from "../../assets/Trash.svg";
import OpenLogo from "../../assets/Open.svg";

function DashboardList({
  isProfileLoading,
  profilePicture,
  username,
  getInitials,
  handleProfilePictureClick,
  isUploadingProfile,
  profileInputRef,
  handleProfilePictureUpload,
  handleUploadClick,
  isLoading,
  fileInputRef,
  handleFileChange,
  isDashboardLoading,
  dashboardList,
  setHoveredDashboardId,
  hoveredDashboardId,
  clickedDashboardId,
  handlePermissionClick,
  popupRef,
  handleDownload,
  navigate,
  handleDelete,
}) {
  // State to track active tab: "all", "my" or "shared"
  const [activeTab, setActiveTab] = useState("all");

  // Filter dashboards based on ownership and sharing status
  const myDatasets = dashboardList.filter(
    (dataset) =>
      !(dataset.shared_usernames && dataset.shared_usernames.includes(username))
  );
  const sharedDatasets = dashboardList.filter(
    (dataset) =>
      dataset.shared_usernames && dataset.shared_usernames.includes(username)
  );

  const filteredDashboards =
    activeTab === "all"
      ? dashboardList
      : activeTab === "my"
      ? myDatasets
      : sharedDatasets;

  return (
    <>
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
          <h2 className="text-2xl font-bold text-purple-900">Dashboards</h2>

          {/* Segmented Tabs */}
          <div className="mt-4">
            <div className="inline-flex rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 border border-r-0 border-purple-600 focus:outline-none ${
                  activeTab === "all"
                    ? "bg-purple-900 text-white"
                    : "bg-white text-purple-600 hover:bg-purple-100"
                } rounded-l-lg`}
              >
                All Dashboards
              </button>
              <button
                onClick={() => setActiveTab("my")}
                className={`px-4 py-2 border-t border-b border-purple-600 focus:outline-none ${
                  activeTab === "my"
                    ? "bg-purple-900 text-white"
                    : "bg-white text-purple-600 hover:bg-purple-100"
                }`}
              >
                My Dashboards
              </button>
              <button
                onClick={() => setActiveTab("shared")}
                className={`px-4 py-2 border border-purple-600 focus:outline-none ${
                  activeTab === "shared"
                    ? "bg-purple-900 text-white"
                    : "bg-white text-purple-600 hover:bg-purple-100"
                } rounded-r-lg`}
              >
                Shared Dashboards
              </button>
            </div>
          </div>

          {isDashboardLoading ? (
            <div className="flex justify-center items-center h-40">
              <svg
                className="animate-spin h-8 w-8 text-purple-600"
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
          ) : filteredDashboards.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No dashboards available.
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredDashboards.map((dataset, idx) => (
                <li
                  key={dataset._id || dataset.id || idx}
                  className="flex flex-col md:flex-row items-center p-4 bg-white rounded-lg hover:bg-slate-50 transition-all duration-200 w-full group"
                  onMouseEnter={() => setHoveredDashboardId(dataset._id)}
                  onMouseLeave={() => setHoveredDashboardId(null)}
                  style={{
                    zIndex:
                      hoveredDashboardId === dataset._id ||
                      clickedDashboardId === dataset._id
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
                      {/* Badge indicating ownership or shared status */}
                      {!(
                        dataset.shared_usernames &&
                        dataset.shared_usernames.includes(username)
                      ) ? (
                        <span className="text-xs text-green-500">
                          Owned by you
                        </span>
                      ) : (
                        dataset.shared_usernames &&
                        dataset.shared_usernames.includes(username) && (
                          <span className="text-xs text-blue-500">
                            Shared with you
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Middle Section: Permissions info */}
                  <div className="flex flex-col md:flex-row flex-1 justify-center md:justify-start mt-4 md:mt-0 text-center md:text-left w-full items-center">
                    <div className="text-purple-900 font-medium min-w-[150px] max-w-[150px] text-center truncate">
                      {dataset.dataset_name}
                    </div>
                    <button
                      className="text-purple-800 underline relative mt-2 md:mt-0 md:ml-48"
                      onClick={() => handlePermissionClick(dataset._id)}
                    >
                      {dataset.permissions.length === 0 ? (
                        <span>No users have permission</span>
                      ) : (
                        <span>
                          {dataset.permissions.length} users have permission
                        </span>
                      )}
                      {clickedDashboardId === dataset._id && (
                        <div
                          ref={popupRef}
                          className="absolute top-full left-0 bg-purple-100 p-4 rounded-lg shadow-md z-50 w-full md:w-[173px]"
                        >
                          {dataset.shared_usernames &&
                          dataset.shared_usernames.length > 0 ? (
                            <ul>
                              {dataset.shared_usernames.map((user, index) => (
                                <li
                                  key={`${user}-${index}`}
                                  className="text-sm text-gray-700 py-1"
                                >
                                  {username === user ? "you" : user}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-700">No users</p>
                          )}
                        </div>
                      )}
                    </button>
                  </div>
                  {/* Right Side: Action buttons */}
                  <div className="flex items-center">
                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(dataset.insights_urls)}
                      className="bg-white text-purple-600 hover:bg-purple-100 rounded-full p-2"
                    >
                      <img
                        src={DownloadLogo}
                        alt="Download dataset"
                        className="w-8 h-8"
                      />
                    </button>
                    {/* Open Button */}
                    <button
                      onClick={() => navigate(`/dashboard/${dataset._id}`)}
                      className="bg-white text-purple-600 hover:bg-purple-100 rounded-full p-2"
                    >
                      <img
                        src={OpenLogo}
                        alt="Open dataset"
                        className="w-8 h-8"
                      />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(dataset._id)}
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
          )}
        </div>
        
      </div>
    </>
  );
}

export default DashboardList;
