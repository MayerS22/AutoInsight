import React from "react";

const BusinessDomainChart = () => {
  return (
    <div className="bg-white p-4">
      <h2 className="text-lg font-semibold mb-4">Most Used Business Domain</h2>
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
            {/* 60% Label */}
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
            {/* 40% Label */}
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
  );
};

export default BusinessDomainChart;