/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import SearchIcon from "../../assets/SearchIcon.svg";
import { searchUsers, grantAccessToUsers } from "../../services/Api_Services";

const GrantAccessContent = ({ onNext, onPrevious, datasetId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");
  const userId = useSelector((state) => state.auth.id);

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedUser(null);

    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await searchUsers(query);
      // Filter out the current user
      const filteredUsers = response.data.data.filter(u => u._id !== userId);
      setSuggestions(filteredUsers || []);
    } catch (error) {
      setSuggestions([]);
    }
  };

  const handleSelectUser = (user) => {
    setSearchQuery(user.username);
    setSelectedUser(user);
    setSuggestions([]);
  };

  const handleAddUser = () => {
    if (selectedUser && !users.some(u => u._id === selectedUser._id)) {
      setUsers(prev => [
        ...prev,
        { ...selectedUser, access: "view" } // Default access level
      ]);
      setSearchQuery("");
      setSelectedUser(null);
    }
  };

  const handleNext = async () => {
    setErrorMessage("");

    // If no users have been added, simply proceed to the next step.
    if (users.length === 0) {
      onNext();
      return;
    }

    try {
      const response = await grantAccessToUsers(users, token);
      if (response.data.status === 200) {
        onNext();
      } else {
        setErrorMessage(response.data.message || "Failed to grant access");
      }
    } catch (error) {
      console.error("Error granting access:", error.response?.data?.message);
      setErrorMessage("An error occurred while granting access.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-purple-500 mb-2">
        Grant Access to Users
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Securely share your dashboard by inviting team members and assigning specific permissions.
      </p>

      {errorMessage && (
        <div className="text-red-500 mb-4 text-center">{errorMessage}</div>
      )}

      {/* Search and Add section */}
      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <div className="relative w-full">
            <img
              src={SearchIcon}
              alt="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Enter user name"
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 bg-purple-200"
            />
          </div>
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {suggestions.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex-shrink-0 mr-3">
                    {user.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt={`${user.username}'s profile`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-950 flex items-center justify-center text-white font-semibold">
                        {user.username
                          .split(" ")
                          .slice(0, 2)
                          .map((name) => name.charAt(0).toUpperCase())
                          .join("")}
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <span className="font-medium text-gray-900">{user.username}</span>
                    <span className="block text-sm text-gray-500">{user.email}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleAddUser}
          disabled={!selectedUser}
          className="bg-purple-950 text-white px-8 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {/* User list */}
      <div className="space-y-4 mb-8">
        {users.map((user) => (
          <div
            key={user._id}
            className="relative flex items-center justify-between pb-4"
          >
            <div className="flex items-center space-x-3">
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 font-semibold">
                  {user.username
                    .split(" ")
                    .slice(0, 2)
                    .map((name) => name.charAt(0).toUpperCase())
                    .join("")}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === user._id ? null : user._id
                  )
                }
                className="flex items-center justify-between bg-purple-100 border border-purple-300 rounded-md px-4 py-1 text-sm"
              >
                <span>
                  {user.access === "admin" ? `All` : `Can ${user.access}`}
                </span>
                <ChevronDown size={16} />
              </button>

              {openDropdown === user._id && (
                <div className="absolute right-0 mt-1 w-32 bg-purple-100 border border-gray-200 rounded-md shadow-lg z-10">
                  {["view", "edit", "admin"].map((access) => (
                    <button
                      key={access}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-purple-200"
                      onClick={() => {
                        setUsers(prev =>
                          prev.map(u =>
                            u._id === user._id ? { ...u, access } : u
                          )
                        );
                        setOpenDropdown(null);
                      }}
                    >
                      {access === "admin" ? `All` : `Can ${access}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="bg-purple-900 text-white px-4 py-2 rounded-md hover:bg-purple-800"
        >
          <span className="mr-1">←</span> Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-purple-900 text-white px-8 py-2 rounded-md hover:bg-purple-800"
        >
          Next <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  );
};

export default GrantAccessContent;
