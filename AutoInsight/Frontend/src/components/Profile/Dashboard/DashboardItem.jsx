import PropTypes from 'prop-types';
import DashboardLogo from "../../../assets/Dashboard.svg";
import TrashLogo from "../../../assets/Trash.svg";
import OpenLogo from "../../../assets/Open.svg";
import DownloadLogo from "../../../assets/Download.svg";
import EditIcon from "../../../assets/EditLogo.svg";
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';

function DashboardItem ({
  dataset,
  username,
  activeTab,
  handleEditDashboardName,
  handlePermissionClick,
  clickedDashboardId,
  popupRef,
  downloadCleanedDataset,
  handleDownloadModule,
  handleDeleteDataset,
  setHoveredDashboardId,
}) {
  const theme = useSelector((state) => state.theme.mode);
  return (
    <>
      <li
      className={`flex flex-col md:flex-row items-center p-4 ${theme === "light" ? "bg-white rounded-lg hover:bg-slate-50 transition-all duration-200 w-full group" : "bg-dark-background rounded-lg hover:bg-purple-950 transition-all duration-200 w-full group"}`}
    onMouseEnter={() => setHoveredDashboardId(dataset._id)}
    onMouseLeave={() => setHoveredDashboardId(null)}
  >
    {/* Dataset Info */}
    <div className="flex items-center gap-4 flex-1 w-full">
      <div className="bg-purple-200 p-3 rounded-md flex items-center justify-center w-12 h-12">
        <img src={DashboardLogo} alt="Dataset" className="w-6 h-6" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <h4 className="font-medium">{dataset.dataset_name}</h4>
          {dataset.canRename && (
            <button
              onClick={() => {
                const itemType = activeTab === "cleaned" ? "Dataset" : "Dashboard";
                handleEditDashboardName(dataset, itemType);
              }}
              className="ml-2 p-1 bg-purple-200 hover:bg-purple-100 rounded-full"
            >
              <img src={EditIcon} alt="Edit" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {new Date(dataset.createdAt).toLocaleString()}
        </p>
        <span className="text-xs">
          {!dataset.shared_usernames?.includes(username) ? (
            <span className="text-green-500">Owned by you</span>
          ) : (
            <span className="text-blue-400">Shared with you</span>
          )}
        </span>
      </div>
    </div>

    {activeTab !== "cleaned" && (
      <div className="flex flex-col md:flex-row flex-1 justify-center md:justify-start mt-4 md:mt-0 w-full items-center">
        <button
          className={`text-purple-800 ${dataset.shared_usernames?.length?"underline ":""}relative`}
          onClick={() => handlePermissionClick(dataset._id)}
          disabled={!dataset.shared_usernames?.length}
        >
          {dataset.shared_usernames?.length || "no"} users have permission
          {clickedDashboardId === dataset._id && (
            <div
              ref={popupRef}
              className="absolute top-full left-0 bg-purple-100 p-4 rounded-lg shadow-md z-50 w-full md:w-48"
            >
              {dataset.shared_usernames && dataset.shared_usernames.length > 0 ? (
                <ul>
                  {dataset.shared_usernames.map((user, index) => (
                    <li key={index} className="text-sm text-gray-700 py-1">
                      {user === username ? "you" : user}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-700 py-1">No users</div>
              )}
            </div>
          )}
        </button>
      </div>
    )}

    <div className="flex items-center">
      <button
        onClick={() => {
          if (activeTab === "cleaned") {
            if (dataset.cleaned_dataset_url) {
              downloadCleanedDataset(dataset.cleaned_dataset_url);
            } else {
              Swal.fire({
                icon: "error",
                title: "No Cleaned Dataset",
                text: "No cleaned dataset URL available.",
                confirmButtonColor: "#E53E3E",
              });
            }
          } else {
            handleDownloadModule(dataset);
          }
        }}
        className="p-2 hover:bg-purple-100 rounded-full "
      >
        <img src={DownloadLogo} alt="Download" className="w-8 h-8" />
      </button>
      {activeTab !== "cleaned" && (
        <button
          onClick={() => window.open(`/dashboard/${dataset._id}`)}
          className="p-2 hover:bg-purple-100 rounded-full"
        >
          <img src={OpenLogo} alt="Open" className="w-8 h-8" />
        </button>
      )}
      {dataset.canDelete && (
        <button
          onClick={() => handleDeleteDataset(dataset, activeTab)}
          className="p-2 hover:bg-red-100 rounded-full"
        >
          <img src={TrashLogo} alt="Delete" className="w-8 h-8" />
        </button>
      )}
    </div>
  </li>
    </>
  );
}

DashboardItem.propTypes = {
  dataset: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  handleEditDashboardName: PropTypes.func.isRequired,
  handlePermissionClick: PropTypes.func.isRequired,
  clickedDashboardId: PropTypes.string,
  popupRef: PropTypes.object,
  downloadCleanedDataset: PropTypes.func.isRequired,
  handleDownloadModule: PropTypes.func.isRequired,
  handleDeleteDataset: PropTypes.func.isRequired,
  setHoveredDashboardId: PropTypes.func.isRequired,
};

export default DashboardItem; 