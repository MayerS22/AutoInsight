/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NotLoggedIn } from "../NotLoggedIn.jsx";
import AddIcon from "../../assets/addIcon.svg";
import PermissionModal from "./PermissionModal.jsx";
import { authActions, marginActions } from "../../store/index";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchUserProfile } from "../../services/Api_Services.js";
import ChartContainer from "./Dashboard/ChartContainer.jsx";
import LoadingSpinner from "./Dashboard/LoadingSpinner.jsx";
import EmptyState from "./Dashboard/EmptyState.jsx";
import SummaryReport from "./Dashboard/SummaryReport.jsx";

const Dashboard = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insightsUrls, setInsightsUrls] = useState({});
  const [datasetName, setDatasetName] = useState("Loading...");
  const [creationDate, setCreationDate] = useState("");
  const [activeChartType, setActiveChartType] = useState("bar_graph");
  const [isGraphTypesOpen, setIsGraphTypesOpen] = useState(false);
  const [barChartFilter, setBarChartFilter] = useState(10);
  const [forecastMonthsFilter, setForecastMonthsFilter] = useState(12);
  const [userPermission, setUserPermission] = useState(null);
  const [availableBarFilters, setAvailableBarFilters] = useState([5, 10, 15, 20]);
  const [availableForecastMonths, setAvailableForecastMonths] = useState([6, 9, 12, 18, 24]);
  const [ownerId, setOwnerId] = useState(null);
  const [sharedUsernames, setSharedUsernames] = useState([]);
  const [domain, setDomain] = useState("");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [histogramFilter, setHistogramFilter] = useState(10);
  const [availableHistogramFilters, setAvailableHistogramFilters] = useState([5, 10, 15, 20]);
  const theme = useSelector((state) => state.theme.mode);
  const token = localStorage.getItem("token");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  
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
      fetchUserProfile(token, authActions, dispatch);
    }
  }, [isLoggedIn, dispatch, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);        
        const datasetResponse = await axios.get(`http://localhost:3000/api/v1/datasets/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const datasetDetails = datasetResponse.data.body;
        if (datasetDetails) {
          setDatasetName(datasetDetails.dataset?.dataset_name || "Unnamed Dataset");
          setCreationDate(new Date(datasetDetails.dataset?.createdAt).toLocaleDateString());
          setOwnerId(datasetDetails.dataset?.user_id);
          setDomain(datasetDetails.dataset?.business_domain || "");
          setInsightsUrls(datasetDetails.dataset?.insights_urls || {});
        }
        
        // Fetch chart data
        const chartResponse = await axios.get(`http://localhost:3000/api/v1/datasets/${id}/chart-data`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const chartDataResponse = chartResponse.data.body;
        
        // Check if the new extracted_data field exists
        if (chartDataResponse.extracted_data) {
          // Use the new structured data format
          setChartData({
            bar_graph: chartDataResponse.extracted_data.bar_graph || [],
            pie_chart: chartDataResponse.extracted_data.pie_chart || [],
            histogram: chartDataResponse.extracted_data.histogram || [],
            kde: chartDataResponse.extracted_data.kde || [],
            correlation: chartDataResponse.extracted_data.correlation || null,
            forecast: chartDataResponse.extracted_data.forecast || [],
            summary_report: chartDataResponse.summary_report || null
          });
          console.log("Using extracted chart data:", chartDataResponse.extracted_data);
        } else {
          // Fall back to the old format
          setChartData(chartDataResponse.chartData);
          console.log("Using legacy chart data format");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };
    
    if (token && id) {
      fetchData();
    }
  }, [id, token]);

  // Handle chart type selection
  const handleChartTypeChange = (type) => {
    setActiveChartType(type);
    setIsGraphTypesOpen(false);
  };

  // Filter bar chart data based on the selected filter
  const getFilteredBarChartData = (chart) => {
    if (!chart || !chart.categories) return chart;
    
    // Create a copy of the chart data
    const filteredChart = { ...chart };
    
    // Sort the data by values in descending order
    const sortedIndices = chart.values
      .map((value, index) => ({ value, index }))
      .sort((a, b) => b.value - a.value)
      .map(item => item.index);
    
    // Get the top N categories and values based on the filter
    filteredChart.categories = sortedIndices
      .slice(0, barChartFilter)
      .map(index => chart.categories[index]);
    
    filteredChart.values = sortedIndices
      .slice(0, barChartFilter)
      .map(index => chart.values[index]);
    
    return filteredChart;
  };

  // Filter forecast data based on the selected month count
  const getFilteredForecastData = (chart) => {
    if (!chart || !chart.forecast_dates) return chart;
    
    const filteredChart = { ...chart };
    
    // Calculate the historical data length
    const historicalLength = chart.dates.length;
    
    // Calculate how many months to show in total (historical + forecast)
    const totalMonthsToShow = historicalLength + forecastMonthsFilter;
    
    // Trim forecast data to the selected number of months
    filteredChart.forecast_dates = chart.forecast_dates.slice(0, totalMonthsToShow);
    filteredChart.forecast_values = chart.forecast_values.slice(0, totalMonthsToShow);
    filteredChart.forecast_lower = chart.forecast_lower.slice(0, totalMonthsToShow);
    filteredChart.forecast_upper = chart.forecast_upper.slice(0, totalMonthsToShow);
    
    return filteredChart;
  };

  // Filter histogram data based on the selected filter 
  const getFilteredHistogramData = (chart) => {
    if (!chart || !chart.frequencies) return chart;
    
    // Create a copy of the chart data
    const filteredChart = { ...chart };
    
    // Create array of objects with frequency and index
    const frequencyData = chart.frequencies.map((freq, index) => ({
      frequency: freq,
      binStart: chart.bins[index],
      binEnd: chart.bins[index + 1],
      index
    }));
    
    // Sort by frequency in descending order and take top N
    const sortedData = frequencyData
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, histogramFilter);
    
    // Reconstruct the filtered data
    filteredChart.frequencies = sortedData.map(d => d.frequency);
    filteredChart.bins = [];
    sortedData.forEach(d => {
      if (filteredChart.bins.indexOf(d.binStart) === -1) {
        filteredChart.bins.push(d.binStart);
      }
      if (filteredChart.bins.indexOf(d.binEnd) === -1) {
        filteredChart.bins.push(d.binEnd);
      }
    });
    
    return filteredChart;
  };

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  if (loading) {
    return (
      <div className="flex flex-col pt-28 px-8 sm:px-12 lg:px-24 mt-10">
        <LoadingSpinner message="Loading dashboard data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col pt-28 px-8 sm:px-12 lg:px-24 mt-10">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex flex-col pt-28 px-8 sm:px-12 lg:px-24 mt-10">
        <EmptyState message="No chart data available for this dataset." />
      </div>
    );
  }

  // Available chart types based on what we have in the data
  const availableChartTypes = [];
  if (chartData.bar_graph?.length > 0) availableChartTypes.push("bar_graph");
  if (chartData.pie_chart?.length > 0) availableChartTypes.push("pie_chart");
  if (chartData.histogram?.length > 0) availableChartTypes.push("histogram");
  if (chartData.kde?.length > 0) availableChartTypes.push("kde");
  if (chartData.correlation?.columns?.length > 0) availableChartTypes.push("correlation");
  // Only add forecast for ecommerce domain
  if (domain === 'ecommerce' && chartData.forecast?.length > 0) availableChartTypes.push("forecast");

  return (
    <div className="flex flex-col pt-28 px-8 sm:px-12 lg:px-24 mt-10">
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">{datasetName}</h1>
          <p className="text-gray-500">Created on {creationDate}</p>
          <p className="text-gray-500">Domain: {domain}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Graph Type Filter */}
          <div className="relative">
            <select
              className="px-3 py-2 border-2 text-purple-900 font-semibold border-purple-900  rounded-md bg-white shadow-sm"
              value={activeChartType}
              onChange={(e) => setActiveChartType(e.target.value)}
            >
              {availableChartTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'bar_graph' ? 'Bar Charts' :
                   type === 'pie_chart' ? 'Pie Charts' :
                   type === 'histogram' ? 'Histograms' :
                   type === 'kde' ? 'KDE Plots' :
                   type === 'correlation' ? 'Correlation' :
                   type === 'forecast' ? 'Forecasts' : type}
                </option>
              ))}
              <option value="reports">Reports</option>
            </select>
          </div>
          
          {/* Bar Chart Top Filter */}
          {(activeChartType === 'all' || activeChartType === 'bar_graph') && 
           chartData.bar_graph?.length > 0 && 
           domain !== 'education' && (
            <select 
              className="px-3 py-2 border text-purple-900 font-semibold border-purple-900 rounded-md bg-white shadow-sm"
              value={barChartFilter}
              onChange={(e) => setBarChartFilter(Number(e.target.value))}
            >
              {availableBarFilters.map(count => (
                <option key={`bar-filter-${count}`} value={count}>
                  Top {count}
                </option>
              ))}
            </select>
          )}
          
          {/* Histogram Top Filter */}
          {(activeChartType === 'all' || activeChartType === 'histogram') && 
           chartData.histogram?.length > 0 && 
           domain !== 'education' && (
            <select 
              className="px-3 py-2 border text-purple-900 font-semibold border-purple-900 rounded-md bg-white shadow-sm"
              value={histogramFilter}
              onChange={(e) => setHistogramFilter(Number(e.target.value))}
            >
              {availableHistogramFilters.map(count => (
                <option key={`histogram-filter-${count}`} value={count}>
                  Top {count}
                </option>
              ))}
            </select>
          )}
          
          {/* Forecast Months Filter */}
          {domain === 'ecommerce' && (activeChartType === 'all' || activeChartType === 'forecast') && chartData.forecast?.length > 0 && (
            <select 
              className="px-3 py-2 border rounded-md text-purple-900 font-semibold border-purple-900 bg-white shadow-sm"
              value={forecastMonthsFilter}
              onChange={(e) => setForecastMonthsFilter(Number(e.target.value))}
            >
              {availableForecastMonths.map(count => (
                <option key={`forecast-month-${count}`} value={count}>
                  {count} Months
                </option>
              ))}
            </select>
          )}
          
          {/* Add Permissions Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-purple-900 text-white rounded-md hover:bg-purple-700 transition"
          >
            <img src={AddIcon} alt="Add" className="w-4 h-4 mr-2" />
            Add Permissions
          </button>
        </div>
      </div>
      
      {/* Summary Report Section - Show in reports view and all charts view */}
      {(activeChartType === 'reports' ) && (
        <SummaryReport chartData={chartData} domain={domain} />
      )}
      
      {/* Charts section */}
      {activeChartType !== 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">
          {/* Bar Charts */}
          {(activeChartType === 'all' || activeChartType === 'bar_graph') && chartData.bar_graph?.length > 0 && 
            chartData.bar_graph.map((chart, index) => (
              <ChartContainer 
                key={`bar-${index}-${barChartFilter}`} 
                title={domain === 'ecommerce' 
                  ? `${chart.column} Distribution (Top ${barChartFilter})` 
                  : `${chart.column} Distribution`}
                type="bar"
                data={getFilteredBarChartData(chart)}
                className="col-span-1"
              />
            ))
          }
          
          {/* Pie Charts */}
          {(activeChartType === 'all' || activeChartType === 'pie_chart') && chartData.pie_chart?.length > 0 && 
            chartData.pie_chart.map((chart, index) => (
              <ChartContainer 
                key={`pie-${index}`} 
                title={`${chart.column} Distribution`}
                type="pie"
                data={chart}
                className="col-span-1"
              />
            ))
          }
          
          {/* Histograms */}
          {(activeChartType === 'all' || activeChartType === 'histogram') && chartData.histogram?.length > 0 && 
            chartData.histogram.map((chart, index) => (
              <ChartContainer 
                key={`histogram-${index}-${histogramFilter}`} 
                title={`${chart.column} Distribution (Top ${histogramFilter})`}
                type="histogram"
                data={getFilteredHistogramData(chart)}
                className="col-span-1"
              />
            ))
          }
          
          {/* KDE Plots */}
          {(activeChartType === 'all' || activeChartType === 'kde') && chartData.kde?.length > 0 && 
            chartData.kde.map((chart, index) => (
              <ChartContainer 
                key={`kde-${index}`} 
                title={`${chart.column} Density`}
                type="kde"
                data={chart}
                className="col-span-1"
              />
            ))
          }
          
          {/* Correlation Matrix */}
          {(activeChartType === 'all' || activeChartType === 'correlation') && chartData.correlation?.columns?.length > 0 && (
            <ChartContainer 
              key="correlation"
              title="Correlation Matrix"
              type="correlation"
              data={chartData.correlation}
              className="col-span-1 md:col-span-2 lg:col-span-2"
            />
          )}
          
          {/* Forecast Charts - Only for ecommerce domain */}
          {domain === 'ecommerce' && (activeChartType === 'all' || activeChartType === 'forecast') && chartData.forecast?.length > 0 && 
            chartData.forecast.map((chart, index) => (
              <ChartContainer 
                key={`forecast-${index}-${forecastMonthsFilter}`} 
                title={`${chart.column} Forecast (${forecastMonthsFilter} Months)`}
                type="forecast"
                data={getFilteredForecastData(chart)}
                className="col-span-1 md:col-span-2 lg:col-span-2"
              />
            ))
          }
        </div>
      )}
   
      {isModalOpen && (
        <PermissionModal
          setIsModalOpen={setIsModalOpen}
          datasetId={id}
          uploaderId={ownerId}
          currentUserPermission={userPermission}
          sharedUsernames={sharedUsernames}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;