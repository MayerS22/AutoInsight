/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store";
import axios from "axios";
import Swal from "sweetalert2";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import DashboardLogo from "../../assets/Dashboard.svg";
import DownloadLogo from "../../assets/Download.svg";
import TrashLogo from "../../assets/Trash.svg";
import OpenLogo from "../../assets/Open.svg";
import { marginActions } from "../../store";
import { Allignment } from "./Allignment";
import { Edit, XCircle, AlertCircle, CheckCircle } from "lucide-react";
import EditIcon from "../../assets/EditLogo.svg";


const DashboardListComponent = ({ onDashboardDeleted, refreshTrigger, isStandAlone }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [clickedDashboardId, setClickedDashboardId] = useState(null);
  const [hoveredDashboardId, setHoveredDashboardId] = useState(null);
  const [dashboardList, setDashboardList] = useState([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const username = useSelector((state) => state.auth.username);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

  // Helper function to check if a dataset is "cleaned"
  const isCleanedDataset = (dataset) => {
    const insights = dataset.insights_urls;
    if (!insights) return false;
    const keys = ["pie_chart", "bar_chart", "kde", "histogram", "correlation", "others"];
    return keys.every(key => Array.isArray(insights[key]) && insights[key].length === 0);
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
    }
  }, [isLoggedIn]);

  const fetchUserProfile = async () => {
    if (!token) return;
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/users/user-data",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(authActions.addProfilePicture(response.data.body.profile_picture));
      dispatch(authActions.addUsername(response.data.body.username));
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchDatasets = async () => {
    if (!token) return;
    setIsDashboardLoading(true);
    try {
      const [datasetsResponse, sharedDatasetsResponse] = await Promise.all([
        axios.get("http://localhost:3000/api/v1/datasets/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/v1/datasets/shared/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const combinedDatasets = [
        ...(datasetsResponse.data?.body?.datasets || []),
        ...(sharedDatasetsResponse.data?.body?.datasets || [])
      ];
      setDashboardList(combinedDatasets);
      console.log(combinedDatasets);
      
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while fetching the datasets.",
        confirmButtonColor: "#E53E3E",
      });
    } finally {
      setIsDashboardLoading(false);
    }
  };

  // Load dashboards when component mounts
  useEffect(() => {
    fetchDatasets();
  }, []);
   
  // Refresh dashboards when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) {
      fetchDatasets();
    }
  }, [refreshTrigger]);

  const handlePermissionClick = (datasetId) => {
    setClickedDashboardId(clickedDashboardId === datasetId ? null : datasetId);
  };

  // Function to download insights images organized by folders (chart types)
  const downloadInsightsByFolder = async (insights) => {
    const zip = new JSZip();
    const chartTypes = Object.keys(insights);
    for (const chartType of chartTypes) {
      const urls = insights[chartType];
      if (Array.isArray(urls) && urls.length > 0) {
        const folder = zip.folder(chartType);
        for (let i = 0; i < urls.length; i++) {
          try {
            const res = await fetch(urls[i]);
            const blob = await res.blob();
            folder.file(`${chartType}_${i + 1}.jpg`, blob);
          } catch (error) {
            console.error(`Error fetching image from ${chartType}:`, urls[i], error);
          }
        }
      }
    }
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "insights_images.zip");
    });
  };

  // Function to download the cleaned dataset as CSV
  const downloadCleanedDataset = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      // Here we assume the file is CSV; adjust the filename if needed
      saveAs(blob, "cleaned_dataset.csv");
    } catch (error) {
      console.error("Error downloading CSV:", error);
      Swal.fire({
        icon: "error",
        title: "Download Error",
        text: "Could not download cleaned dataset.",
        confirmButtonColor: "#E53E3E",
      });
    }
  };

  // Function to open download options modal using radio buttons.
  // Used only when not in the "cleaned" tab.
  const handleDownloadModule = (dataset) => {
    Swal.fire({
      title: "Download Options",
      html: `
        <div style="text-align: left;">
          <label style="display: block; margin-bottom: 10px;">
            <input type="radio" name="downloadType" value="cleaned" checked />
            Cleaned Dataset (CSV)
          </label>
          <label style="display: block;">
            <input type="radio" name="downloadType" value="insights" />
            Insights Images (ZIP)
          </label>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Download",
      preConfirm: () => {
        const selected = Swal.getPopup().querySelector('input[name="downloadType"]:checked').value;
        return selected;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedOption = result.value;
        if (selectedOption === "cleaned") {
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
        } else if (selectedOption === "insights") {
          const insights = dataset.insights_urls;
          let hasInsights = false;
          if (insights && typeof insights === "object") {
            for (const key in insights) {
              if (Array.isArray(insights[key]) && insights[key].length > 0) {
                hasInsights = true;
                break;
              }
            }
          }
          if (hasInsights) {
            downloadInsightsByFolder(insights);
          } else {
            Swal.fire({
              icon: "error",
              title: "No Insights",
              text: "No insights images available.",
              confirmButtonColor: "#E53E3E",
            });
          }
        }
      }
    });
  };

  // Function to open a modal to edit the dashboard name.
  const handleEditDashboardName = (dashboard) => {
    Swal.fire({
      title: "Rename Dashboard",
      input: "text",
      inputLabel: "New dashboard name",
      inputValue: dashboard.dataset_name,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: (newName) => {
        if (!newName || newName.trim() === "") {
          Swal.showValidationMessage("Dashboard name cannot be empty.");
        }
        return newName;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newName = result.value;
        try {
          // Call the backend to update the dashboard name.
          await axios.patch(
            `http://localhost:3000/api/v1/datasets/${dashboard._id}`,
            {
              dataset_name: newName,
              user_id: username // adjust this to pass the proper user identifier if needed
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );                  
          // Update the dashboard list state with the new name.
          setDashboardList((prevList) =>
            prevList.map((d) => (d._id === dashboard._id ? { ...d, dataset_name: newName } : d))
          );
          Swal.fire({
            icon: "success",
            title: "Renamed",
            text: "Dashboard name updated successfully.",
            confirmButtonColor: "#6B46C1",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to update dashboard name.",
            confirmButtonColor: "#E53E3E",
          });
        }
      }
    });
  };

  // Separate the datasets into cleaned and non-cleaned based on insights_urls
  const nonCleanedDashboards = dashboardList.filter(dataset => !isCleanedDataset(dataset));
  const cleanedDatasets = dashboardList.filter(isCleanedDataset);

  // Further filter non-cleaned datasets into "My" and "Shared"
  const myDatasets = nonCleanedDashboards.filter(dataset =>
    !dataset.shared_usernames?.includes(username)
  );
  const sharedDatasets = nonCleanedDashboards.filter(dataset =>
    dataset.shared_usernames?.includes(username)
  );

  // Array of tabs with display labels
  const tabs = [
    { key: "all", label: "All Dashboards" },
    { key: "my", label: "My Dashboards" },
    { key: "shared", label: "Shared Dashboards" },
    { key: "cleaned", label: "Cleaned Dataset" }
  ];

  // Show non-cleaned datasets in the default tabs and cleaned datasets in the "cleaned" tab.
  const filteredDashboards =
    activeTab === "all" ? nonCleanedDashboards :
    activeTab === "my" ? myDatasets :
    activeTab === "shared" ? sharedDatasets :
    activeTab === "cleaned" ? cleanedDatasets : nonCleanedDashboards;

  const renderDashboardList = () => (
    <>
      {isDashboardLoading ? (
        <div className="flex justify-center items-center h-40">
          <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
      ) : filteredDashboards.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">No dashboards available.</div>
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
                      className="ml-2 p-1 bg-purple-200  hover:bg-purple-100 rounded-full"
                    >
                      <img src={EditIcon} alt="" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(dataset.createdAt).toLocaleString()}
                  </p>
                  <span className="text-xs">
                    {!dataset.shared_usernames?.includes(username)
                      ? <span className="text-green-500">Owned by you </span>
                      : <span className="text-blue-400">Shared with you </span>}
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
                    // If in "cleaned" tab, directly download the CSV,
                    // otherwise open the download options modal.
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
                {/* Render navigate button only if not in "cleaned" tab */}
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
                          await axios.delete(`http://localhost:3000/api/v1/datasets/${dataset._id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          setDashboardList(prev => prev.filter(d => d._id !== dataset._id));
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
                            text: error.response?.data?.message || "Deletion failed",
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

  return (
    <>
      {isStandAlone ? (
        <Allignment>
          <div className="w-full max-w-[2000px] mt-8">
            <h2 className="text-2xl font-bold text-purple-900">Dashboards</h2>
            {/* Tabs */}
            <div className="mt-4">
              <div className="inline-flex rounded-lg shadow-sm overflow-hidden">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 border border-purple-600 focus:outline-none ${
                      activeTab === tab.key
                        ? "bg-purple-900 text-white"
                        : "bg-white text-purple-600 hover:bg-purple-100"
                    } ${index === 0 ? "rounded-l-lg border-r-0" : ""} 
                   ${index === tabs.length - 1 ? "rounded-r-lg border-l-0" : ""}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            {renderDashboardList()}
          </div>
        </Allignment>
      ) : (
        <div className="w-full max-w-[2000px] mt-8">
          <h2 className="text-2xl font-bold text-purple-900">Dashboards</h2>
          {/* Tabs */}
          <div className="mt-4">
            <div className="inline-flex rounded-lg shadow-sm overflow-hidden">
              {tabs.map((tab, index) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 border border-purple-600 focus:outline-none ${
                    activeTab === tab.key
                      ? "bg-purple-900 text-white"
                      : "bg-white text-purple-600 hover:bg-purple-100"
                  } ${index === 0 ? "rounded-l-lg border-r-0" : ""} 
                 ${index === tabs.length - 1 ? "rounded-r-lg border-l-0" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {renderDashboardList()}
        </div>
      )}
    </>
  );
};

export default DashboardListComponent;
