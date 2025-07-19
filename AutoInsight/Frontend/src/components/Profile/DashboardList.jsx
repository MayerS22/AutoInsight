/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions, marginActions } from "../../store";
import { Allignment } from "./Allignment";

// Import components from the Dashboard subdirectory
import DashboardContainer from "./Dashboard/DashboardContainer";
import DashboardContent from "./Dashboard/DashboardContent";

// Import utility functions from their respective files
import {
  downloadCleanedDataset,
  downloadInsightsByFolder,
  handleDownloadModule as utilsHandleDownloadModule,
  deleteDataset,
  renameDashboard
} from "./Dashboard/DatasetUtils";

import { fetchAllDatasets } from "./Dashboard/ApiService";

const DashboardListComponent = ({
  onDashboardDeleted,
  refreshTrigger,
  isStandAlone,
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [clickedDashboardId, setClickedDashboardId] = useState(null);
  const [hoveredDashboardId, setHoveredDashboardId] = useState(null);
  const [dashboardList, setDashboardList] = useState([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  
  const username = useSelector((state) => state.auth.username);
  const userId = useSelector((state) => state.auth.id);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  // A dataset is considered "cleaned" if it does not have any insights images.
  // If dataset.insights_urls is null, undefined, or if every array inside it is empty,
  // then the dataset is treated as a cleaned dataset.
  const isCleanedDataset = (dataset) => {
    const insights = dataset.insights_urls;
    if (!insights) return true; // No insights available, so it's cleaned
    // Check if any insights array has at least one image
    for (const key in insights) {
      if (Array.isArray(insights[key]) && insights[key].length > 0) {
        return false; // Insights exist, so it's not cleaned
      }
    }
    return true; // insights exists but all arrays are empty
  };

  // Function to handle renaming of the dashboard
  const handleEditDashboardName = async (dashboard, itemType) => {
    await renameDashboard(dashboard, itemType, token, fetchDatasets);
  };

  // Function to handle dataset deletion
  const handleDeleteDataset = async (dataset, activeTab) => {
    await deleteDataset(dataset, activeTab, token, setDashboardList, onDashboardDeleted);
  };

  // Set up UI state on component mount
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


  // Fetch datasets from API
  const fetchDatasets = async () => {
    setIsDashboardLoading(true);
    
    const { ownedDatasets, sharedDatasets, ownerId } = await fetchAllDatasets(token);
    
    if (ownerId) {
      dispatch(authActions.addDatasetOwnerId(ownerId));
    }
    
    const combinedDatasets = [...ownedDatasets, ...sharedDatasets];
    setDashboardList(combinedDatasets);
    setIsDashboardLoading(false);
  };

  // Load datasets on component mount and when refresh is triggered
  useEffect(() => {
    fetchDatasets();
  }, []);

  useEffect(() => {
    if (refreshTrigger) {
      fetchDatasets();
    }
  }, [refreshTrigger]);

  // Handle permission popup click
  const handlePermissionClick = (datasetId) => {
    setClickedDashboardId(clickedDashboardId === datasetId ? null : datasetId);
  };

  // Close permission popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setClickedDashboardId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  // Wrapper for handleDownloadModule to provide the necessary functions
  const handleDownloadModule = (dataset) => {
    utilsHandleDownloadModule(dataset, downloadCleanedDataset, downloadInsightsByFolder);
  };

  // Filter datasets based on active tab
  const cleanedDatasets = dashboardList.filter(isCleanedDataset);
  const nonCleanedDashboards = dashboardList.filter((dataset) => !isCleanedDataset(dataset));
  const myDatasets = nonCleanedDashboards.filter(
    (dataset) => !dataset.shared_usernames?.includes(username)
  );
  const sharedDatasets = nonCleanedDashboards.filter((dataset) =>
    dataset.shared_usernames?.includes(username)
  );

  const tabs = [
    { key: "all", label: "All Dashboards" },
    { key: "my", label: "My Dashboards" },
    { key: "shared", label: "Shared Dashboards" },
    { key: "cleaned", label: "Cleaned Datasets" },
  ];

  const filteredDashboards =
    activeTab === "all"
      ? nonCleanedDashboards
      : activeTab === "my"
      ? myDatasets
      : activeTab === "shared"
      ? sharedDatasets
      : activeTab === "cleaned"
      ? cleanedDatasets
      : nonCleanedDashboards;

  const dashboardContent = (
    <DashboardContent
      isDashboardLoading={isDashboardLoading}
      filteredDashboards={filteredDashboards}
      activeTab={activeTab}
      username={username}
      handleEditDashboardName={handleEditDashboardName}
      handlePermissionClick={handlePermissionClick}
      clickedDashboardId={clickedDashboardId}
      popupRef={popupRef}
      downloadCleanedDataset={downloadCleanedDataset}
      handleDownloadModule={handleDownloadModule}
      handleDeleteDataset={handleDeleteDataset}
      setHoveredDashboardId={setHoveredDashboardId}
    />
  );

  return (
    <>
      {isStandAlone ? (
        <Allignment>
          <DashboardContainer tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
            {dashboardContent}
          </DashboardContainer>
        </Allignment>
      ) : (
        <DashboardContainer tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
          {dashboardContent}
        </DashboardContainer>
      )}
    </>
  );
};

export default DashboardListComponent;
