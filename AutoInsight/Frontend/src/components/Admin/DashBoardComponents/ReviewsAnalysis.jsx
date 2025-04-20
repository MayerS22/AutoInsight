import React from "react";

const ReviewsAnalysis = () => {
  return (
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
  );
};

export default ReviewsAnalysis;