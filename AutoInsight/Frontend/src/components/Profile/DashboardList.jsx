/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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

const DashboardListComponent = ({ onDashboardDeleted, refreshTrigger,isStandAlone}) => {
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

  const handleDownload = async (imageUrls) => {
    if (!imageUrls?.length) return;
    const zip = new JSZip();
    const folder = zip.folder("insights_images");

    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const response = await fetch(imageUrls[i]);
        const blob = await response.blob();
        folder.file(`image_${i + 1}.jpg`, blob);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "insights_images.zip");
    });
  };

  const handleDelete = (id) => {
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
          await axios.delete(`http://localhost:3000/api/v1/datasets/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDashboardList(prev => prev.filter(dashboard => dashboard._id !== id));

          if (typeof onDashboardDeleted === 'function') {
            onDashboardDeleted(id);
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
  };

  // Filter datasets based on active tab
  const myDatasets = dashboardList.filter(dataset =>
    !dataset.shared_usernames?.includes(username)
  );
  const sharedDatasets = dashboardList.filter(dataset =>
    dataset.shared_usernames?.includes(username)
  );
  const filteredDashboards = activeTab === "all" ? dashboardList :
    activeTab === "my" ? myDatasets : sharedDatasets;

  return (

    <>
      {isStandAlone && <Allignment>
        <div className="w-full max-w-[2000px] mt-8">
          <h2 className="text-2xl font-bold text-purple-900">Dashboards</h2>

          {/* Tabs */}
          <div className="mt-4">
            <div className="inline-flex rounded-lg shadow-sm overflow-hidden">
              {["all", "my", "shared"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 border border-purple-600 focus:outline-none ${activeTab === tab
                      ? "bg-purple-900 text-white"
                      : "bg-white text-purple-600 hover:bg-purple-100"
                    } ${tab === "all" ? "rounded-l-lg border-r-0" : ""} 
               ${tab === "shared" ? "rounded-r-lg border-l-0" : ""}`}
                >
                  {tab === "all" && "All Dashboards"}
                  {tab === "my" && "My Dashboards"}
                  {tab === "shared" && "Shared Dashboards"}
                </button>
              ))}
            </div>

          </div>

          {/* Dashboard List */}
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
                    <div>
                      <h4 className="font-medium">{dataset.dataset_name}</h4>
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
                      {dataset.permissions?.length || 0} users have permission
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
                      onClick={() => handleDownload(dataset.insights_urls)}
                      className="p-2 hover:bg-purple-100 rounded-full"
                    >
                      <img src={DownloadLogo} alt="Download" className="w-8 h-8" />
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/${dataset._id}`)}
                      className="p-2 hover:bg-purple-100 rounded-full"
                    >
                      <img src={OpenLogo} alt="Open" className="w-8 h-8" />
                    </button>
                    <button
                      onClick={() => handleDelete(dataset._id)}
                      className="p-2 hover:bg-red-100 rounded-full"
                    >
                      <img src={TrashLogo} alt="Delete" className="w-8 h-8" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Allignment>}
      {!isStandAlone && <div className="w-full max-w-[2000px] mt-8">

        <h2 className="text-2xl font-bold text-purple-900">Dashboards</h2>

        {/* Tabs */}
        <div className="mt-4">
          <div className="inline-flex rounded-lg shadow-sm overflow-hidden">
            {["all", "my", "shared"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 border border-purple-600 focus:outline-none ${activeTab === tab
                    ? "bg-purple-900 text-white"
                    : "bg-white text-purple-600 hover:bg-purple-100"
                  } ${tab === "all" ? "rounded-l-lg border-r-0" : ""} 
               ${tab === "shared" ? "rounded-r-lg border-l-0" : ""}`}
              >
                {tab === "all" && "All Dashboards"}
                {tab === "my" && "My Dashboards"}
                {tab === "shared" && "Shared Dashboards"}
              </button>
            ))}
          </div>
      

        </div>

        {/* Dashboard List */}
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
                  <div>
                    <h4 className="font-medium">{dataset.dataset_name}</h4>
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
                    {dataset.permissions?.length || 0} users have permission
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
                    onClick={() => handleDownload(dataset.insights_urls)}
                    className="p-2 hover:bg-purple-100 rounded-full"
                  >
                    <img src={DownloadLogo} alt="Download" className="w-8 h-8" />
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/${dataset._id}`)}
                    className="p-2 hover:bg-purple-100 rounded-full"
                  >
                    <img src={OpenLogo} alt="Open" className="w-8 h-8" />
                  </button>
                  <button
                    onClick={() => handleDelete(dataset._id)}
                    className="p-2 hover:bg-red-100 rounded-full"
                  >
                    <img src={TrashLogo} alt="Delete" className="w-8 h-8" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>}

    </>
  );
};

export default DashboardListComponent;