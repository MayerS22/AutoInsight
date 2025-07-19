/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
const LoadingSpinner = ({ type = "dashboard" }) => {
  const theme = useSelector((state) => state.theme.mode);
  if (type === "dashboardList") {
    return (
      <div className="w-full space-y-2 sm:space-y-4 mt-2 sm:mt-4 px-2 sm:px-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className={` rounded-lg shadow-sm p-3 sm:p-6 animate-pulse border  ${theme === 'dark' ? 'bg-gray-900 border-gray-100' : 'bg-white'}`}>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0">
              {/* Left side - Name and date */}
              <div className="space-y-2">
                <div className={`h-4 sm:h-5 w-32 sm:w-48 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                <div className={`h-3 sm:h-4 w-24 sm:w-32 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                <div className={`h-3 sm:h-4 w-16 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
              </div>
              
              {/* Right side - Actions */}
              <div className="flex space-x-2">
                <div className={`h-8 sm:h-9 w-8 sm:w-9 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                <div className={`h-8 sm:h-9 w-8 sm:w-9 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                <div className={`h-8 sm:h-9 w-8 sm:w-9 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default dashboard view loading spinner
  return (
    <div className={`w-full px-2 sm:px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} min-h-screen`}>
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="space-y-2">
          <div className={`h-6 sm:h-8 w-48 sm:w-64 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
          <div className={`h-3 sm:h-4 w-36 sm:w-48 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
          <div className={`h-3 sm:h-4 w-24 sm:w-32 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
        </div>      
        
        {/* Controls Skeleton */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <div className={`h-8 sm:h-10 w-28 sm:w-36 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
          <div className={`h-8 sm:h-10 w-24 sm:w-28 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
          <div className={`h-8 sm:h-10 w-32 sm:w-40 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
        </div>
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`rounded-lg p-3 sm:p-4 md:p-6 border ${theme === 'dark' ? 'bg-gray-900 border-gray-100' : 'bg-white border-gray-200'}`}>
            <div className={`h-5 sm:h-6 w-36 sm:w-48 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse mb-4 sm:mb-6`}></div>
            <div className={`h-[200px] sm:h-[250px] md:h-[300px] ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
          </div>
        ))}
        
        {/* Correlation Matrix Skeleton */}
        <div className={`rounded-lg shadow-lg p-3 sm:p-4 md:p-6 border ${theme === 'dark' ? 'bg-gray-900 border-gray-100' : 'bg-white border-gray-200'} col-span-1 md:col-span-2`}>
          <div className={`h-5 sm:h-6 w-36 sm:w-48 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse mb-4 sm:mb-6`}></div>
          <div className={`h-[250px] sm:h-[300px] md:h-[400px] ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;