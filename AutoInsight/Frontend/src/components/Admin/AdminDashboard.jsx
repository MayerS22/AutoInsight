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
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  fetchTotalCleanedDatasets,
  fetchTotalGeneratedDashboards,
  fetchNumberOfUsers,
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

  const accounts = [
    {
      name: "Mazen Rafaat",
      time: "1:30 PM",
      color: "bg-yellow-400",
      initial: "M",
    },
    {
      name: "Hannah Morgan",
      time: "Yesterday at 5:00 PM",
      color: "bg-blue-600",
      initial: "H",
    },
    {
      name: "Jake Clark",
      time: "Yesterday at 3:20 PM",
      color: "bg-pink-500",
      initial: "J",
    },
    {
      name: "Suzzana Jonas",
      time: "Last Month",
      color: "bg-purple-500",
      initial: "S",
    },
  ];

  const [content, setContent] = useState("");
  const [totalCleanedDatasets, setTotalCleanedDatasets] = useState("0");
  const [totalGeneratedDashboards, setTotalGeneratedDashboards] = useState("0");
  const [totalUsersCount, setTotalUsersCount] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback static data in case API fetch fails
  const useStaticData = () => {
    setTotalCleanedDatasets("9,933");
    setTotalGeneratedDashboards("852");
    setTotalUsersCount("25");
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch the data from the API
        const cleanedDatasetsCount = await fetchTotalCleanedDatasets();
        const dashboardsCount = await fetchTotalGeneratedDashboards();
        const usersCount = await fetchNumberOfUsers();

        setTotalCleanedDatasets(String(cleanedDatasetsCount));
        setTotalGeneratedDashboards(String(dashboardsCount));
        setTotalUsersCount(String(usersCount));
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (err.message.includes("No authentication token")) {
          console.warn(
            "No authentication token found. Using static data instead."
          );
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
                <RecentAccounts accounts={accounts} />
              </div>
            </div>
            {/* Bottom Section: Audience Location */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <AudienceLocation
                setTooltipContent={setContent}
                content={content}
              />
              <Tooltip id="map-tooltip">{content}</Tooltip>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Top Section: Business Domain, Reviews Analysis, User Growth */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Domain Chart */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <BusinessDomainChart />
              </div>
              {/* Reviews Analysis & User Growth */}
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
