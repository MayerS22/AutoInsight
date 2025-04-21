"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Tooltip, Cell } from "recharts";
import { useState } from "react";

const chartData = [
  { jobTitle: "Data Analyst", users: 100, fill: "#7C3AED" },
  { jobTitle: "Data Engineer", users: 73, fill: "#8B5CF6" },
  { jobTitle: "Data Scientist", users: 48, fill: "#A78BFA" },
  { jobTitle: "Manager", users: 29, fill: "#C4B5FD" },
  { jobTitle: "Others", users: 10, fill: "#DDD6FE" },
];

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

  return (
    <div className="bg-white rounded-lg">
      <div>
        <h2 className="text-lg font-bold">Top Job Titles of Our Users</h2>
        <p className="text-sm text-gray-500">January - June 2024</p>
      </div>

      <div className="flex justify-between items-center">
        {/* Chart Section - Left aligned */}
        <div className="flex-shrink-0">
          <PieChart  width={300} height={300}>
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
        <div className="space-y-2 pr-8">
          {chartData.map((item) => (
            <div key={item.jobTitle} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-3"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-lg font-bold">{item.jobTitle}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopJobTitles;