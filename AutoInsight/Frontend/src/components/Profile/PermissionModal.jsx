/* eslint-disable react/prop-types */


const PermissionModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-bold">Add Users</h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        {/* Search Input */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 border rounded-md text-gray-700"
          />
        </div>

        {/* User List */}
        <div className="mt-4">
          <div className="flex items-center space-x-3 p-2  rounded-md">
            <div className="w-10 h-10 flex items-center justify-center bg-purple-900 text-white rounded-full text-lg">
              MR
            </div>
            <div>
              <p className="font-medium">Mazen Raafat</p>
              <p className="text-gray-500 text-sm">mazenraafat@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2 rounded-md mt-2">
            <div className="w-10 h-10 flex items-center justify-center bg-purple-900 text-white rounded-full text-lg">
              MS
            </div>
            <div>
              <p className="font-medium">Mayer Soliman</p>
              <p className="text-gray-500 text-sm">mayer88@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Give Permission Button */}
        <div className="mt-4 flex justify-end">
          <button
            className="bg-purple-900 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition"
            onClick={() => alert("Permission Granted!")}
          >
            Give Permission
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
