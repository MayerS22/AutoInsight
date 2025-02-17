import React from "react";
import DownloadLogo from "../../assets/Download.svg";
import TrashLogo from "../../assets/Trash.svg";
import OpenLogo from "../../assets/Open.svg";

const DatasetItem = ({ dataset, handleDownload, handleDelete, handlePermissionClick, clickedDashboardId, hoveredDashboardId, setHoveredDashboardId }) => {
  return (
    <li
      className="flex flex-col md:flex-row items-center p-4 bg-white rounded-lg hover:bg-slate-50 transition-all duration-200 w-full group"
      onMouseEnter={() => setHoveredDashboardId(dataset.id)}
      onMouseLeave={() => setHoveredDashboardId(null)}
      style={{
        zIndex:
          hoveredDashboardId === dataset.id || clickedDashboardId === dataset.id
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
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleDownload(dataset.dataset_url)}
          className="bg-white text-purple-600 hover:bg-purple-100 rounded-full p-2"
        >
          <img
            src={DownloadLogo}
            alt="Download dataset"
            className="w-5 h-5"
          />
        </button>
        <button className="bg-white text-purple-600 hover:bg-purple-100 rounded-full p-2">
          <img src={OpenLogo} alt="Open dataset" className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleDelete(dataset._id)}
          className="bg-white text-red-600 hover:bg-red-100 rounded-full p-2"
        >
          <img
            src={TrashLogo}
            alt="Delete dataset"
            className="w-5 h-5"
          />
        </button>
      </div>
    </li>
  );
};

export default DatasetItem;