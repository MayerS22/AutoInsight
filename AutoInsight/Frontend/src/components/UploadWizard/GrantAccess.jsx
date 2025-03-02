/* eslint-disable react/prop-types */

const GrantAccessContent = ({ onPrevious, onFinish }) => {
  return (
    <div>
      <h2 className="text-2xl font-medium text-purple-700 mb-2">Grant Access to Users</h2>
      <p className="text-sm text-gray-600 mb-6">
        Specify which users or teams should have access to this dashboard.
      </p>
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="border border-purple-700 text-purple-700 px-4 py-2 rounded-md flex items-center"
        >
          <span className="mr-1">←</span> Previous
        </button>
        <button 
          onClick={onFinish}
          className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800"
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default GrantAccessContent;