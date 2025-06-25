/* eslint-disable no-unused-vars */
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
import { Allignment } from "../Profile/Allignment.jsx";
import "react-tooltip/dist/react-tooltip.css";
import {
  fetchTotalCleanedDatasets,
  fetchTotalGeneratedDashboards,
  fetchNumberOfUsers,
  fetchRecentUsers,
  fetchUserGrowthData
} from "./Services/Admin_API.js";

const AdminDashboard = () => {
  const [content, setContent] = useState("");
  const [totalCleanedDatasets, setTotalCleanedDatasets] = useState("0");
  const [totalGeneratedDashboards, setTotalGeneratedDashboards] = useState("0");
  const [totalUsersCount, setTotalUsersCount] = useState("0");
  const [recentAccounts, setRecentAccounts] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [
          cleanedDatasetsCount,
          dashboardsCount,
          usersCount,
          recentUsersResponse,
          userGrowthResponse
        ] = await Promise.all([
          fetchTotalCleanedDatasets(),
          fetchTotalGeneratedDashboards(),
          fetchNumberOfUsers(),
          fetchRecentUsers(),
          fetchUserGrowthData()
        ]);

        setTotalCleanedDatasets(String(cleanedDatasetsCount));
        setTotalGeneratedDashboards(String(dashboardsCount));
        setTotalUsersCount(String(usersCount));

        let recentUsersData = recentUsersResponse;
        if (recentUsersResponse?.body) {
          recentUsersData = recentUsersResponse.body;
        }

        const formattedRecentAccounts = recentUsersData.map(user => {
          let timeDisplay = "No timestamp";
          if (user.createdAt) {
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
              timeDisplay = new Date(user.createdAt).toLocaleString();
            }
          }

          return {
            name: user.username || "Unknown User",
            time: timeDisplay,
            profilePic: user.profile_picture || null,
            initial: (user.username || "U").charAt(0).toUpperCase()
          };
        });

        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "June",
          "July", "Aug", "Sept", "Octr", "Nov", "Dec"
        ];

        const formattedGrowthData = userGrowthResponse.map(item => ({
          name: monthNames[item.month - 1], // Convert month number to name
          value: item.count
        }));


        setRecentAccounts(formattedRecentAccounts);
        setUserGrowthData(formattedGrowthData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (!isAdmin) {
    return (
      <>
        <Allignment>
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-red-600">403 - Unauthorized</h1>
            <p className="text-lg mt-4">You do not have permission to view this page.</p>
          </div>

        </Allignment>
      </>
    )
  }

  return (
    <div className="bg-purple-50 min-h-screen pt-20 mt-10">
      <div className="container mx-auto px-2 sm:px-4 md:px-8 py-4">
        <div className="flex flex-col gap-8 items-stretch lg:flex-row">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6 w-full min-w-0">
            {/* Top Cards and Recent Accounts */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-4 min-w-0">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <div>
                  <Card
                    icon={totalDashboard}
                    label="Total Dashboards Generated"
                    value={isLoading ? "Loading..." : totalGeneratedDashboards}
                    error={error ? "Failed to load" : null}
                  />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md h-full mt-4 md:mt-0 min-w-0">
                <RecentAccounts accounts={recentAccounts} />
              </div>
            </div>
            {/* Audience Location */}
            <div className="bg-white p-4 rounded-lg shadow-md mt-4 min-w-0">
              <AudienceLocation setTooltipContent={setContent} content={content} />
              <Tooltip id="map-tooltip">{content}</Tooltip>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-6 w-full mt-8 lg:mt-0 min-w-0">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="bg-white p-4 rounded-lg shadow-md min-w-0">
                <BusinessDomainChart />
              </div>
              <div className="flex flex-col gap-2 min-w-0">
                <div className="bg-white p-2 rounded-lg shadow-md mb-2">
                  <ReviewsAnalysis />
                </div>
                <div className="bg-white p-2 rounded-lg shadow-md">
                  <UserGrowthChart data={userGrowthData} />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md mt-4 min-w-0">
              <TopJobTitles />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
