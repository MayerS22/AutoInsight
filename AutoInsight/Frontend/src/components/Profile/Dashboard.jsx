/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NotLoggedIn } from "../NotLoggedIn.jsx";
import AddIcon from "../../assets/addIcon.svg";
import PermissionModal from "./PermissionModal.jsx";
import { marginActions } from "../../store/index";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Dashboard = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [insightsUrls, setInsightsUrls] = useState({});
  const [filteredInsights, setFilteredInsights] = useState({});
  const [datasetName, setDatasetName] = useState("Loading...");
  const [creationDate, setCreationDate] = useState("");
  const [activeChartType, setActiveChartType] = useState("all");
  const [isGraphTypesOpen, setIsGraphTypesOpen] = useState(false);
  const [isBarFilterOpen, setIsBarFilterOpen] = useState(false);
  const [barChartFilter, setBarChartFilter] = useState(null); // Initialize with null
  const [hasAdminAccess, setHasAdminAccess] = useState(null);
  const [availableBarFilters, setAvailableBarFilters] = useState([]);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const loggedInUserId = useSelector((state) => state.auth.id);
  const DatasetOwnerId = useSelector((state) => state.auth.DatasetOwnerId);

  const fetchDatasetDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/datasets/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.body && response.data.body.dataset) {
        const dataset = response.data.body.dataset;

        setDatasetName(dataset.dataset_name || "Unnamed Dataset");
        setCreationDate(
          dataset.createdAt
            ? new Date(dataset.createdAt).toLocaleDateString()
            : "Unknown"
        );

        // Process the insights_urls ensuring all expected keys exist
        const processedUrls = {
          bar_chart: [],
          pie_chart: dataset.insights_urls?.pie_chart || [],
          histogram: dataset.insights_urls?.histogram || [],
          kde: dataset.insights_urls?.kde || [],
          correlation: dataset.insights_urls?.correlation || [],
          forecast: dataset.insights_urls?.forecast || [],
          reports: dataset.insights_urls?.others || [],
        };

        // Extract bar chart URLs and determine available filters
        if (dataset.insights_urls?.bar_chart) {
          // Get all available filter numbers
          const filterNumbers = new Set(
            dataset.insights_urls.bar_chart.map((item) => item.filterNumber)
          );
          const filters = Array.from(filterNumbers).sort((a, b) => a - b);
          setAvailableBarFilters(filters);

          // Set the default bar chart filter to the first available filter
          if (filters.length > 0) {
            setBarChartFilter(filters[0]);
          }

          // Process bar chart data to be compatible with our component
          processedUrls.bar_chart = dataset.insights_urls.bar_chart.map(
            (chart) => chart.url
          );

          // Keep the original data for filtering
          processedUrls.bar_chart_data = dataset.insights_urls.bar_chart;
        }

        setInsightsUrls(processedUrls);
        setFilteredInsights(processedUrls);

        // If the logged in user is the owner, grant full access immediately
        if (dataset.user_id === loggedInUserId) {
          setHasAdminAccess(true);
        }
      } else {
        console.error("Invalid API response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching dataset details:", error);
    }
  };

  useEffect(() => {
    fetchDatasetDetails();
  }, [loggedInUserId, id]);

  // If not the owner, check if the user has been shared admin permission
  const fetchPermissionForUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/datasets/${id}/share`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const permissions = response.data.body || [];

      const currentUserPermission = permissions.find(
        (p) => p.user_id === loggedInUserId
      );
      const currentOwner = loggedInUserId === DatasetOwnerId;
      if (currentOwner || currentUserPermission?.permission === "admin") {
        setHasAdminAccess(true);
      } else if (currentUserPermission?.permission === "edit") {
        setHasAdminAccess(false);
      }
    } catch (error) {
      console.error("Error fetching permissions for dataset:", error);
    }
  };

  useEffect(() => {
    fetchPermissionForUser();
  }, [loggedInUserId, id]);

  // Filter insights based on selected chart type and bar chart filter
  useEffect(() => {
    const filtered = {};

    if (activeChartType === "all") {
      // Show all graph types, but apply bar chart filter to bar charts
      Object.keys(insightsUrls).forEach((type) => {
        if (type === "bar_chart") {
          // Apply bar chart filtering based on the selected filter
          const filteredBarCharts = insightsUrls.bar_chart_data
            ?.filter((chart) => chart.filterNumber === parseInt(barChartFilter))
            .map((chart) => chart.url) || [];
          filtered[type] = filteredBarCharts;
        } else if (type !== "bar_chart_data") {
          // For other chart types, return all insights
          filtered[type] = insightsUrls[type] || [];
        }
      });
    } else if (activeChartType === "bar_chart") {
      // Only show bar charts with specific filtering
      const filteredBarCharts = insightsUrls.bar_chart_data
        ?.filter((chart) => chart.filterNumber === parseInt(barChartFilter))
        .map((chart) => chart.url) || [];
      filtered[activeChartType] = filteredBarCharts;
    } else {
      // For any other specific chart type, return all insights
      filtered[activeChartType] = insightsUrls[activeChartType] || [];
    }

    setFilteredInsights(filtered);
  }, [activeChartType, insightsUrls, barChartFilter]);

  useEffect(() => {
    dispatch(marginActions.setColor("bg-white"));
    return () => {
      dispatch(marginActions.setColor("bg-purple-50"));
    };
  }, [dispatch]);

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const selectChartType = (type) => {
    setActiveChartType(type);
    setIsGraphTypesOpen(false);
  };

  const handleBarFilterChange = (value) => {
    setBarChartFilter(value);
    setIsBarFilterOpen(false);
  };

  // Display name for the current chart type filter
  const getActiveChartTypeDisplay = () => {
    if (activeChartType === "all") return "All Graphs";
    if (activeChartType === "reports") return "Report";
    return activeChartType.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="flex flex-col pt-28 px-8 sm:px-12 lg:px-16">
      {/* Top Section with Title and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full">
        <h2 className="text-3xl font-bold text-purple-900 mb-4 sm:mb-0">
          {datasetName} Dashboard
        </h2>

        {/* Only show admin controls if the user is owner or has admin permission */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Graph types dropdown */}
          <div className="relative">
            <button
              className="bg-white border text-purple-800 font-bold border-purple-800 px-4 py-2.5 rounded-lg flex items-center justify-between gap-2 hover:bg-gray-50 transition min-w-[150px]"
              onClick={() => setIsGraphTypesOpen(!isGraphTypesOpen)}
            >
              {getActiveChartTypeDisplay()}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isGraphTypesOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                ></path>
              </svg>
            </button>
            {isGraphTypesOpen && (
              <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-full text-purple-800 font-bold">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-purple-50 transition"
                  onClick={() => selectChartType("all")}
                >
                  All Graphs
                </button>
                {Object.keys(insightsUrls)
                  .filter((key) => key !== "bar_chart_data")
                  .map((type) => (
                    <button
                      key={type}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 transition capitalize text-purple-800 font-bold"
                      onClick={() => selectChartType(type)}
                    >
                      {type === "reports" ? "Report" : type.replace("_", " ")}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Bar Chart Filter - Always visible if filters are available */}
          {(activeChartType === "all" ||
            activeChartType === "bar_chart" ||
            activeChartType === "histogram") &&
            availableBarFilters.length > 0 && (
              <div className="relative">
                <button
                  className="bg-white border border-purple-800 px-4 py-2.5 rounded-lg flex items-center justify-between gap-2 hover:bg-gray-50 transition min-w-[140px] text-purple-800 font-bold"
                  onClick={() => setIsBarFilterOpen(!isBarFilterOpen)}
                >
                  Top {barChartFilter}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={isBarFilterOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    ></path>
                  </svg>
                </button>
                {isBarFilterOpen && (
                  <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-full">
                    {availableBarFilters.map((value) => (
                      <button
                        key={value}
                        className="w-full text-left px-4 py-2 hover:bg-purple-50 transition text-purple-800 font-bold"
                        onClick={() => handleBarFilterChange(value)}
                      >
                        Top {value}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

          {/* Permissions Button */}
          <div className="flex gap-4">
            {hasAdminAccess === null ? (
              // Placeholder skeleton while loading
              <div className="bg-gray-300 animate-pulse rounded-lg px-5 py-2.5 w-[140px] h-[40px] flex items-center justify-center">
                <div className="w-5 h-5 bg-gray-400 rounded-full mr-2"></div>
                <div className="w-20 h-4 bg-gray-400 rounded-md"></div>
              </div>
            ) : (
              hasAdminAccess && (
                <button
                  className="bg-purple-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-purple-800 transition"
                  onClick={() => setIsModalOpen(true)}
                >
                  <img src={AddIcon} alt="Add Icon" className="w-5 h-5" />
                  <span className="text-sm font-medium">Permissions</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <h3 className="text-sm text-gray-600 mt-2">
        Date Created:{" "}
        {new Date(creationDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h3>

      <div className="mt-12">
        {Object.entries(filteredInsights).map(([chartType, urls]) => (
          <div key={chartType} className="mb-10">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 capitalize">
              {chartType === "reports"
                ? "Report"
                : `${chartType.replace("_", " ")} Insights`}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {urls.length > 0 ? (
                urls.map((url, index) => (
                  <div
                    key={index}
                    className="relative group w-full h-64 sm:h-96 rounded-lg shadow-md overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(url)}
                  >
                    <img
                      src={url}
                      alt={`${chartType} Insight ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white text-lg font-semibold">
                      Click to View Larger
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-64 sm:h-96 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600">
                  No{" "}
                  {chartType === "reports"
                    ? "Report"
                    : `${chartType.replace("_", " ")} Images`}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 sm:px-6 lg:px-8">
          <div className="relative w-full max-w-4xl mx-auto">
            <div className="relative border-4 border-white rounded-lg">
              <button
                onClick={closeModal}
                className="absolute top-0 right-0 text-white w-9 h-9 text-3xl bg-black bg-opacity-50 rounded-full"
              >
                &times;
              </button>
              <img
                src={selectedImage}
                alt="Selected Insight"
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <PermissionModal
          setIsModalOpen={setIsModalOpen}
          datasetId={id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;