/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import Card from "./DashBoardComponents/Card.jsx";
import RecentAccounts from "./DashBoardComponents/RecentAccounts.jsx";
import BusinessDomainChart from "./DashBoardComponents/BusinessDomainChart.jsx";
import AudienceLocation from "./DashBoardComponents/AudienceLocation.jsx";
import ReviewsAnalysis from "./DashBoardComponents/ReviewsAnalysis.jsx";
import UserGrowthChart from "./DashBoardComponents/UserGrowthChart.jsx";
import TopJobTitles from "./DashBoardComponents/TopJobTitles.jsx";
import totalDatasets from "../../assets/totalDatasets.svg";
import totalUsers from "../../assets/totalUsers.svg";
import totalDashboard from "../../assets/totalDashboard.svg";
import { useSelector } from "react-redux";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  fetchTotalCleanedDatasets,
  fetchTotalGeneratedDashboards,
  fetchNumberOfUsers,
  fetchRecentUsers
} from "./Services/Admin_API.js";

const AdminDashboard = () => {
  const userGrowthData = [
    { name: "Jan", value: 20 },
    { name: "Feb", value: 40 },
    { name: "Mar", value: 30 },
    { name: "Apr", value: 45 },
    { name: "May", value: 25 },
    { name: "Jun", value: 38 },
    { name: "Jul", value: 42 },
  ];


  const [content, setContent] = useState("");
  const [totalCleanedDatasets, setTotalCleanedDatasets] = useState("0");
  const [totalGeneratedDashboards, setTotalGeneratedDashboards] = useState("0");
  const [totalUsersCount, setTotalUsersCount] = useState("0");
  const [recentAccounts, setRecentAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  // Updated transformUserData function for the AdminDashboard component

const transformUserData = (users) => {
  if (!users || (!Array.isArray(users) && typeof users !== 'object')) {
    console.warn("Invalid user data received:", users);
    return [];
  }
  
  const userArray = Array.isArray(users) ? users : [users];
  
  return userArray.map(user => {
    console.log("User data from API:", user);
    
    // Format the timestamp before sending to the component
    const formatTimeAgo = (timestamp) => {
      if (!timestamp) return "No timestamp";
      
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return "Invalid date";
        
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hr ago`;
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 30) return `${diffDays} days ago`;
        
        return date.toLocaleDateString();
      } catch (err) {
        console.error("Error formatting date:", err, "for timestamp:", timestamp);
        return "Date error";
      }
    };
    
    // Get the timestamp from the available fields
    const timestamp = user.createdAt || user.created_at || user.timestamp;
    
    return {
      // Use the username as the display name
      name: user.username || user.name || "Unknown User",
      
      // Pre-format the time before passing to component
      time: formatTimeAgo(timestamp),
      
      // Use the profile picture if provided
      profilePic: user.profile_picture || user.profilePic || user.avatar || null,
      
      // Fallback initial uses the first letter of the username
      initial: (user.username || user.name || "U").charAt(0).toUpperCase(),
    };
  });
};

  // Fallback static data in case API fetch fails.
  const useStaticData = () => {
    setTotalCleanedDatasets("9,933");
    setTotalGeneratedDashboards("852");
    setTotalUsersCount("25");
    setRecentAccounts(staticRecentAccounts);
    setIsLoading(false);
  };

 // Replace your useEffect in AdminDashboard.jsx with this updated version

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [
        cleanedDatasetsCount,
        dashboardsCount,
        usersCount,
        recentUsersResponse
      ] = await Promise.all([
        fetchTotalCleanedDatasets(),
        fetchTotalGeneratedDashboards(),
        fetchNumberOfUsers(),
        fetchRecentUsers()
      ]);

      setTotalCleanedDatasets(String(cleanedDatasetsCount));
      setTotalGeneratedDashboards(String(dashboardsCount));
      setTotalUsersCount(String(usersCount));

      // Debug the raw response
      console.log("Raw recent users response:", recentUsersResponse);
      
      // Handle different response structures
      let recentUsersData = recentUsersResponse;
      
      // If the response is in { body: [...] } format (common in Express APIs)
      if (recentUsersResponse && recentUsersResponse.body) {
        recentUsersData = recentUsersResponse.body;
        console.log("Extracted data from response body");
      }
      
      console.log("Processed recent users data:", recentUsersData);
      
      // Even more robust user data transformation
      const formattedRecentAccounts = recentUsersData.map(user => {
        console.log("Processing user:", user);
        
        // Format timestamp directly
        let timeDisplay = "No timestamp";
        
        if (user.createdAt) {
          console.log("Found createdAt timestamp:", user.createdAt);
          try {
            const date = new Date(user.createdAt);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            
            if (diffMins < 60) {
              timeDisplay = diffMins <= 1 ? "Just now" : `${diffMins} min ago`;
            } else {
              const diffHours = Math.floor(diffMins / 60);
              if (diffHours < 24) {
                timeDisplay = `${diffHours} hr ago`;
              } else {
                const diffDays = Math.floor(diffHours / 24);
                if (diffDays === 1) {
                  timeDisplay = "Yesterday";
                } else if (diffDays < 30) {
                  timeDisplay = `${diffDays} days ago`;
                } else {
                  timeDisplay = date.toLocaleDateString();
                }
              }
            }
          } catch (err) {
            console.error("Error formatting date:", err);
            timeDisplay = new Date(user.createdAt).toLocaleString(); // Fallback
          }
        } else {
          console.warn("No createdAt timestamp found for user:", user);
        }
        
        return {
          name: user.username || "Unknown User",
          time: timeDisplay,
          profilePic: user.profile_picture || null,
          initial: (user.username || "U").charAt(0).toUpperCase()
        };
      });
      
      console.log("Formatted accounts:", formattedRecentAccounts);
      setRecentAccounts(formattedRecentAccounts);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      if (err.message && err.message.includes("No authentication token")) {
        useStaticData();
      } else if (err.response && err.response.status === 401) {
        setError("Authentication failed. Please login again.");
        useStaticData();
      } else {
        setError("Failed to load dashboard data");
        useStaticData();
      }
    }
  };

  fetchDashboardData();
}, []);

  return (
    <div className="bg-purple-50 min-h-screen pt-20">
      <div className="max-w-8xl mx-auto p-8">
        <div className="flex gap-8 items-stretch">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Top Section: Cards & Recent Accounts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cards Section */}
              <div className="flex flex-col gap-4">
                {/* Top Row: Two Cards side-by-side */}
                <div className="grid grid-cols-2 gap-4">
                  <Card
                    icon={totalUsers}
                    label="Total Users"
                    value={isLoading ? "Loading..." : totalUsersCount}
                    error={error ? "Failed to load" : null}
                    badge={<span className="text-green-500">+25%</span>}
                  />
                  <Card
                    icon={totalDatasets}
                    label="Total Datasets Uploaded"
                    value={isLoading ? "Loading..." : totalCleanedDatasets}
                    error={error ? "Failed to load" : null}
                  />
                </div>
                {/* Second Row: Third Card spanning full width */}
                <div>
                  <Card
                    icon={totalDashboard}
                    label="Total Dashboards Generated"
                    value={isLoading ? "Loading..." : totalGeneratedDashboards}
                    error={error ? "Failed to load" : null}
                  />
                </div>
              </div>
              {/* Recent Accounts Section */}
              <div className="bg-white p-4 rounded-lg shadow-md h-full">
                <RecentAccounts accounts={recentAccounts} />
              </div>
            </div>
            {/* Bottom Section: Audience Location */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <AudienceLocation setTooltipContent={setContent} content={content} />
              <Tooltip id="map-tooltip">{content}</Tooltip>
            </div>
          </div>
          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Top Section: Business Domain, Reviews Analysis, User Growth */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <BusinessDomainChart />
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-white p-2 rounded-lg shadow-md">
                  <ReviewsAnalysis />
                </div>
                <div className="bg-white p-2 rounded-lg shadow-md">
                  <UserGrowthChart data={userGrowthData} />
                </div>
              </div>
            </div>
            {/* Bottom Section: Top Job Titles */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <TopJobTitles />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
