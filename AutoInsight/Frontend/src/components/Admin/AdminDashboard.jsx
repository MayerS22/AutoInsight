import React from "react";
import Card from "./DashBoardComponents/Card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import Header from "../HomePage/HomePageComponents/Header";
import totalDatasets from "../../assets/totalDatasets.svg";
import totalUsers from "../../assets/totalUsers.svg";
import totalDashboard from "../../assets/totalDashboard.svg";

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

  return (
    <div className="min-h-screen bg-purple-50">
      <Header />

      <div className="pt-28 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats Cards */}
          <div className="bg-purple-50 lg:col-span-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="mt-4">
              <Card
                icon={totalDashboard}
                label="Total Dashboards Generated"
                value="9,933"
              />
            </div>
          </div>

          {/* Recent Created Accounts */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Recent Created Accounts
            </h2>
            <div className="space-y-4">
              {[
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
              ].map((user, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 ${user.color} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white text-sm">{user.initial}</span>
                    </div>
                    <span className="ml-3 font-medium">{user.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{user.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Business Domain Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Most Used Business Domain
            </h2>
            <div className="flex items-center justify-center space-x-12">
              <div className="w-36 h-36 relative">
                <svg className="w-full h-full" viewBox="0 0 32 32">
                  {/* Slice 1 (60%): Ecommerce */}
                  <path
                    d="M16 16 L16 0 A16 16 0 1 1 5.36 5.36 Z"
                    fill="#A78BFA"
                  />

                  {/* Slice 2 (40%): Education */}
                  <path
                    d="M16 16 L5.36 5.36 A16 16 0 0 1 16 0 Z"
                    fill="#E5E7EB"
                  />

                  {/* 60% Label in purple area (Ecommerce) */}
                  <text
                    x="23"
                    y="20"
                    fontSize="2.5"
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    60%
                  </text>

                  {/* 40% Label in gray area (Education) */}
                  <text
                    x="10"
                    y="9"
                    fontSize="2.5"
                    fill="#333"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    40%
                  </text>
                </svg>
              </div>

              {/* Legend */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="ml-2">Ecommerce</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="ml-2">Education</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
          {/* Audience Location */}
          <div className="md:col-span-7 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Audience Location</h2>
            <div className="h-64 bg-gray-100 rounded-lg relative overflow-hidden">
              {/* World Map SVG */}
              <svg className="w-full h-full" viewBox="0 0 1000 500">
                <g>
                  <path
                    d="M150,120 L350,120 L350,220 L150,220 Z"
                    fill="#4C1D95"
                  />
                  <path
                    d="M380,150 L450,150 L450,200 L380,200 Z"
                    fill="#4C1D95"
                  />
                  <path
                    d="M500,100 L550,100 L550,150 L500,150 Z"
                    fill="#4C1D95"
                  />
                  <path
                    d="M600,150 L650,150 L650,180 L600,180 Z"
                    fill="#4C1D95"
                  />
                  <path
                    d="M200,250 L300,250 L300,300 L200,300 Z"
                    fill="#6D28D9"
                    opacity="0.5"
                  />
                  <path
                    d="M450,220 L500,220 L500,250 L450,250 Z"
                    fill="#6D28D9"
                    opacity="0.5"
                  />
                  <path
                    d="M320,170 L350,170 L350,200 L320,200 Z"
                    fill="#6D28D9"
                    opacity="0.3"
                  />
                </g>
              </svg>
            </div>

            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Top Countries</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div
                    className="w-6 h-4"
                    style={{
                      background:
                        "linear-gradient(to bottom, red 33%, white 33%, white 66%, black 66%)",
                    }}
                  ></div>
                  <span className="ml-2">Egypt</span>
                </div>
                <div className="flex items-center">
                  <div
                    className="w-6 h-4"
                    style={{
                      background:
                        "linear-gradient(to bottom, red 33%, white 33%, white 66%, black 66%)",
                    }}
                  ></div>
                  <span className="ml-2">UAE</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-4 bg-blue-500 relative">
                    <div className="absolute w-full h-1 bg-white top-2"></div>
                    <div className="absolute w-full h-1 bg-white top-4"></div>
                  </div>
                  <span className="ml-2">USA</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-4 bg-white relative">
                    <div
                      className="absolute inset-0 bg-red-500"
                      style={{
                        clipPath:
                          "polygon(0 0, 25% 0, 25% 100%, 0 100%, 75% 0, 100% 0, 100% 100%, 75% 100%)",
                      }}
                    ></div>
                  </div>
                  <span className="ml-2">Canada</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Charts */}
          <div className="md:col-span-5 space-y-6">
            {/* Reviews */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Reviews Analysis</h2>
                <button className="px-3 py-1 bg-purple-700 text-white text-sm rounded">
                  View
                </button>
              </div>
              <div className="flex justify-center">
                <div className="w-40 h-20 relative">
                  <div className="w-full h-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full flex justify-center">
                    <div className="h-full w-1 bg-gray-800 transform rotate-12 origin-bottom rounded-full"></div>
                  </div>
                  <div className="absolute -bottom-8 left-0 w-full text-center">
                    <span className="font-bold text-xl">60%</span>
                    <div className="inline-block px-2 py-0.5 text-xs text-green-700 bg-green-100 rounded-full mt-1">
                      Positive
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-2">
                User Growth Over Time
              </h2>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 60]} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#6d28d9"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">
                Top Job Titles of Our Users
              </h2>
              <div className="flex">
                <div className="w-1/2">
                  <svg className="w-28 h-28 mx-auto" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#7C3AED"
                      strokeWidth="15"
                      strokeDasharray="75 180"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#8B5CF6"
                      strokeWidth="15"
                      strokeDasharray="60 180"
                      strokeDashoffset="-75"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#A78BFA"
                      strokeWidth="15"
                      strokeDasharray="45 180"
                      strokeDashoffset="-135"
                    />
                  </svg>
                </div>
                <div className="w-1/2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                      <span className="ml-2 text-sm">Data Analyst</span>
                    </div>
                    <span className="text-xs text-gray-500">100 Users</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="ml-2 text-sm">Data Engineer</span>
                    </div>
                    <span className="text-xs text-gray-500">73 Users</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <span className="ml-2 text-sm">Data Scientist</span>
                    </div>
                    <span className="text-xs text-gray-500">48 Users</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
