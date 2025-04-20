import  { useState } from "react";
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
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

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
    <div className="bg-purple-50 min-h-screen">
      <div className="pt-32 container mx-auto px-4 py-6">
        {/* Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Row: Two Cards */}
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
            {/* Second Row: One Card */}
            <div className="md:col-span-2">
              <Card
                icon={totalDashboard}
                label="Total Dashboards Generated"
                value="9,933"
              />
            </div>
          </div>

          {/* Recent Accounts */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <RecentAccounts accounts={accounts} />
          </div>

          {/* Business Domain Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <BusinessDomainChart />
          </div>
        </div>

        {/* Other Sections */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
          <div className="md:col-span-7 bg-white p-4 rounded-lg shadow-md">
            <AudienceLocation setTooltipContent={setContent} content={content} />
            <Tooltip id="map-tooltip">{content}</Tooltip>
          </div>
          <div className="md:col-span-5 space-y-6">
            <TopJobTitles />
            <ReviewsAnalysis />
            <UserGrowthChart data={userGrowthData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;