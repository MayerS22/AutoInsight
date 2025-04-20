
const TopJobTitles = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Top Job Titles of Our Users</h2>
      <div className="flex">
        <div className="w-1/2">
          <div className="w-28 h-28 mx-auto">
            {/* Donut chart */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#7C3AED"
                strokeWidth="15"
                strokeDasharray="75 180"
                strokeDashoffset="0"
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
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#C4B5FD"
                strokeWidth="15"
                strokeDasharray="25 180"
                strokeDashoffset="-180"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#DDD6FE"
                strokeWidth="15"
                strokeDasharray="15 180"
                strokeDashoffset="-205"
              />
            </svg>
          </div>
        </div>
        <div className="w-1/2 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
              <span className="ml-2 text-sm">Data Analyst</span>
            </div>
            <span className="text-xs text-gray-500">100 Users</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="ml-2 text-sm">Data Engineer</span>
            </div>
            <span className="text-xs text-gray-500">73 Users</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
              <span className="ml-2 text-sm">Data Scientist</span>
            </div>
            <span className="text-xs text-gray-500">48 Users</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
              <span className="ml-2 text-sm">Manager</span>
            </div>
            <span className="text-xs text-gray-500">29 Users</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-300"></div>
              <span className="ml-2 text-sm">Others</span>
            </div>
            <span className="text-xs text-gray-500">10 Users</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopJobTitles;