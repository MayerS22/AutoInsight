import { useState } from "react";
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

  return (
    <div className="bg-purple-50 min-h-screen pt-20">
      <div className="max-w-8xl mx-auto p-8">
        {/* Parent Container with Flexbox */}
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
                    value="25"
                    badge="↑ 25%"
                  />
                  <Card
                    icon={totalDatasets}
                    label="Total Datasets Uploaded"
                    value="9,933"
                  />
                </div>
                {/* Second Row: Third Card spanning full width */}
                <div>
                  <Card
                    icon={totalDashboard}
                    label="Total Dashboards Generated"
                    value="9,933"
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
              {/* Right Side: Reviews Analysis & User Growth in a vertical stack */}
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
