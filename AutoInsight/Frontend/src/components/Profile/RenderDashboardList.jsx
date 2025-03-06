import DashboardLogo from "../../assets/Dashboard.svg";
import DownloadLogo from "../../assets/Download.svg";
import TrashLogo from "../../assets/Trash.svg";
import OpenLogo from "../../assets/Open.svg";
import EditIcon from "../../assets/EditLogo.svg";
import axios from "axios";
import Swal from "sweetalert2";

const RenderDashboardList = ({
  isDashboardLoading,
  setHoveredDashboardId,
  handleEditDashboardName,
  handlePermissionClick,
  downloadCleanedDataset,
  handleDownloadModule,
  navigate,
  setDashboardList,
  onDashboardDeleted,
  filteredDashboards,
  username,
  activeTab,
  clickedDashboardId,
  popupRef,
  token,
}) => (
  <>
    {isDashboardLoading ? (
      <div className="flex justify-center items-center h-40">
        <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24">
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
      <ul className="space-y-4 mt-4">
        {filteredDashboards.map((dataset) => (
          <li
            key={dataset._id}
            className="flex flex-col md:flex-row items-center p-4 bg-white rounded-lg hover:bg-slate-50 transition-all duration-200 w-full group"
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
                  <button
                    onClick={() => handleEditDashboardName(dataset)}
                    className="ml-2 p-1 bg-purple-200 hover:bg-purple-100 rounded-full"
                  >
                    <img src={EditIcon} alt="Edit" />
                  </button>
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

            {/* Permissions */}
            <div className="flex flex-col md:flex-row flex-1 justify-center md:justify-start mt-4 md:mt-0 w-full items-center">
              <button
                className="text-purple-800 underline relative"
                onClick={() => handlePermissionClick(dataset._id)}
              >
                {dataset.shared_usernames?.length || 0} users have permission
                {clickedDashboardId === dataset._id && (
                  <div
                    ref={popupRef}
                    className="absolute top-full left-0 bg-purple-100 p-4 rounded-lg shadow-md z-50 w-full md:w-48"
                  >
                    {dataset.shared_usernames?.length > 0 ? (
                      <ul>
                        {dataset.shared_usernames.map((user) => (
                          <li key={user} className="text-sm text-gray-700 py-1">
                            {user === username ? "you" : user}
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

            {/* Actions */}
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
                className="p-2 hover:bg-purple-100 rounded-full"
              >
                <img src={DownloadLogo} alt="Download" className="w-8 h-8" />
              </button>
              {activeTab !== "cleaned" && (
                <button
                  onClick={() => navigate(`/dashboard/${dataset._id}`)}
                  className="p-2 hover:bg-purple-100 rounded-full"
                >
                  <img src={OpenLogo} alt="Open" className="w-8 h-8" />
                </button>
              )}
              <button
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "This action cannot be undone!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#E53E3E",
                    cancelButtonColor: "#6B46C1",
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      try {
                        await axios.delete(
                          `http://localhost:3000/api/v1/datasets/${dataset._id}`,
                          {
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );
                        setDashboardList((prev) =>
                          prev.filter((d) => d._id !== dataset._id)
                        );
                        if (typeof onDashboardDeleted === "function") {
                          onDashboardDeleted(dataset._id);
                        }
                        Swal.fire({
                          icon: "success",
                          title: "Deleted!",
                          text: "The dataset has been removed.",
                          confirmButtonColor: "#6B46C1",
                        });
                      } catch (error) {
                        Swal.fire({
                          icon: "error",
                          title: "Delete Error",
                          text:
                            error.response?.data?.message || "Deletion failed",
                          confirmButtonColor: "#E53E3E",
                        });
                      }
                    }
                  });
                }}
                className="p-2 hover:bg-red-100 rounded-full"
              >
                <img src={TrashLogo} alt="Delete" className="w-8 h-8" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </>
);

export default RenderDashboardList;
