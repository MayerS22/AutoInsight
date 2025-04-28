/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Tooltip, Cell } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";
import { fetchTopJobTitles } from "../Services/Admin_API";



const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow-sm border text-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p>{payload[0].value} Users</p>
      </div>
    );
  }
  return null;
};


const TopJobTitles = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [chartData, setChartData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const topJobTitles = await fetchTopJobTitles();
        console.log(topJobTitles); // this is the object you showed

        // Transform the topJobTitles object into an array
        const COLORS = ["#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#6366F1", "#4F46E5"];

        const transformedData = Object.keys(topJobTitles)
          .filter(key => key !== "undefined" && key !== "Not provided") // Skip undefined and Not provided
          .map((jobTitle, index) => ({
            jobTitle: jobTitle.replace(/_/g, " "), // optional: replace underscores with spaces
            users: topJobTitles[jobTitle],
            fill: COLORS[index % COLORS.length],
          }));

        setChartData(transformedData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);



  return (
    <div className="bg-white rounded-lg">
      <div>
        <h2 className="text-lg font-bold">Top Job Titles of Our Users</h2>
        <p className="text-sm text-gray-500">January - June 2024</p>
      </div>

      <div className="flex justify-between items-center">
        {/* Chart Section - Left aligned */}
        <div className="flex-shrink-0">
          <PieChart width={300} height={300}>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="jobTitle"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={0}
              activeIndex={activeIndex}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  className="transition-all duration-200"
                />
              ))}
            </Pie>
          </PieChart>
        </div>

        {/* Legend Section - Right aligned */}
        <div className="space-y-2 pr-8 mr-8">
          {chartData.map((item) => (
            <div key={item.jobTitle} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-3"
                style={{ backgroundColor: "#8A70D6" }}
              />
              <span className="text-lg font-medium flex-1">{item.jobTitle}</span>
              <span className="text-sm text-gray-500 ml-12">{item.users} Users</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopJobTitles;