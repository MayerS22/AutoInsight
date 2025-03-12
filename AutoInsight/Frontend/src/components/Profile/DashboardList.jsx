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
import { marginActions } from "../../store";
import { Allignment } from "./Allignment";
import RenderDashboardList from "./RenderDashboardList";

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
  // Get logged in user id so we can check ownership
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
  const handleEditDashboardName = (dashboard, itemType) => {
    Swal.fire({
      title: `Rename ${itemType}`,
      input: "text",
      inputLabel: `New ${itemType} name`,
      inputValue: dashboard.dataset_name,
      showCancelButton: true,
      confirmButtonText: "Save",
      confirmButtonColor: "#4A266A",
      preConfirm: (newName) => {
        if (!newName || newName.trim() === "") {
          Swal.showValidationMessage("Dashboard name cannot be empty.");
        }
        return newName;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newName = result.value;
        try {
          await axios.patch(
            `http://localhost:3000/api/v1/datasets/${dashboard._id}`,
            { dataset_name: newName, user_id: username },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          await fetchDatasets();
          Swal.fire({
            icon: "success",
            title: `${itemType} Renamed!`,
            text: `The ${itemType} name has been updated successfully.`,
            confirmButtonColor: "#4A266A",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Rename Failed",
            text: `The ${itemType} could not be renamed.`,
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
    }
  }, [isLoggedIn]);

  const fetchUserProfile = async () => {
    if (!token) return;
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/users/user-data",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(
        authActions.addProfilePicture(response.data.body.profile_picture)
      );
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
        axios.get("http://localhost:3000/api/v1/datasets", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/v1/datasets/shared", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      dispatch(authActions.addDatasetOwnerId(datasetsResponse.data.body.user._id));
       
      // Mark main datasets as owned by the user
      const mainDatasets = datasetsResponse.data?.body?.datasets || [];
      const updatedMainDatasets = mainDatasets.map((dataset) => ({
        ...dataset,
        permission: "owner",
        canRename: true,
        canManagePermissions: true,
        canDelete: true,
      }));

      // Process shared datasets and assign permission flags
      const sharedDatasetEntries = sharedDatasetsResponse.data?.body || [];
      const sharedPermissionsMap = {};
      sharedDatasetEntries.forEach((entry) => {
        sharedPermissionsMap[entry.dataset_id] = entry.permission;
      });
      const sharedDatasetIds = sharedDatasetEntries.map(
        (entry) => entry.dataset_id
      );
      const sharedDatasetDetailsPromises = sharedDatasetIds.map((id) =>
        axios.get(`http://localhost:3000/api/v1/datasets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      const sharedDatasetDetailsResponses = await Promise.allSettled(
        sharedDatasetDetailsPromises
      );
      const sharedDatasets = sharedDatasetDetailsResponses
        .filter((response) => response.status === "fulfilled")
        .map((response) => {
          const dataset = response.value.data.body.dataset;
          const permission = sharedPermissionsMap[dataset._id] || "view";
          return {
            ...dataset,
            shared_permission: permission,
            canRename: (permission === "admin" || permission === "edit"),
            canManagePermissions: (permission === "admin" || permission === "edit"),
            canDelete: false,
            shared: true,
          };
        });
      const combinedDatasets = [...updatedMainDatasets, ...sharedDatasets];
      setDashboardList(combinedDatasets);
      console.log("combined datasets", combinedDatasets);
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

  useEffect(() => {
    fetchDatasets();
  }, []);

  useEffect(() => {
    if (refreshTrigger) {
      fetchDatasets();
    }
  }, [refreshTrigger]);

  const handlePermissionClick = (datasetId) => {
    setClickedDashboardId(clickedDashboardId === datasetId ? null : datasetId);
  };

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
            console.error(
              `Error fetching image from ${chartType}:`,
              urls[i],
              error
            );
          }
        }
      }
    }
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "insights_images.zip");
    });
  };

  const downloadCleanedDataset = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
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
        const selected = Swal.getPopup().querySelector(
          'input[name="downloadType"]:checked'
        ).value;
        return selected;
      },
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

  const cleanedDatasets = dashboardList.filter(isCleanedDataset);
  const nonCleanedDashboards = dashboardList.filter(
    (dataset) => !isCleanedDataset(dataset)
  );
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
                    } ${index === 0 ? "rounded-l-lg border-r-0" : ""} ${
                      index === tabs.length - 1 ? "rounded-r-lg border-l-0" : ""
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <RenderDashboardList
              isDashboardLoading={isDashboardLoading}
              setHoveredDashboardId={setHoveredDashboardId}
              handleEditDashboardName={handleEditDashboardName}
              handlePermissionClick={setClickedDashboardId}
              downloadCleanedDataset={downloadCleanedDataset}
              handleDownloadModule={handleDownloadModule}
              navigate={navigate}
              setDashboardList={setDashboardList}
              onDashboardDeleted={onDashboardDeleted}
              filteredDashboards={filteredDashboards}
              username={username}
              activeTab={activeTab}
              clickedDashboardId={clickedDashboardId}
              popupRef={popupRef}
              token={token}
            />
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
                  } ${index === 0 ? "rounded-l-lg border-r-0" : ""} ${
                    index === tabs.length - 1 ? "rounded-r-lg border-l-0" : ""
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <RenderDashboardList
            isDashboardLoading={isDashboardLoading}
            setHoveredDashboardId={setHoveredDashboardId}
            handleEditDashboardName={handleEditDashboardName}
            handlePermissionClick={setClickedDashboardId}
            downloadCleanedDataset={downloadCleanedDataset}
            handleDownloadModule={handleDownloadModule}
            navigate={navigate}
            setDashboardList={setDashboardList}
            onDashboardDeleted={onDashboardDeleted}
            filteredDashboards={filteredDashboards}
            username={username}
            activeTab={activeTab}
            clickedDashboardId={clickedDashboardId}
            popupRef={popupRef}
            token={token}
            userId={userId}

          />
        </div>
      )}
    </>
  );
};

export default DashboardListComponent;
