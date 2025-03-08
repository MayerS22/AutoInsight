/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, Trash2 } from "lucide-react";
import SearchIcon from "../../assets/SearchIcon.svg";
import { searchUsers } from "../../services/Api_Services";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

const PermissionModal = ({ onClose, datasetId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [users, setUsers] = useState([]); // Holds fetched + added users
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // New state for permission dropdown beside the search input
  const [selectedPermission, setSelectedPermission] = useState("view");
  const [openRoleDropdown, setOpenRoleDropdown] = useState(false);

  const token = localStorage.getItem("token");
  const userId = useSelector((state) => state.auth.id);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        // Fetch permissions for the dataset
        const permissionsResponse = await axios.get(
          `${API_BASE_URL}/datasets/${datasetId}/share`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const permissionsData = permissionsResponse.data?.body || [];

        // Fetch user details for each permission using the correct endpoint
        const usersWithDetails = await Promise.all(
          permissionsData.map(async (perm) => {
            try {
              const userResponse = await axios.get(
                `${API_BASE_URL}/users/${perm.user_id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                  withCredentials: true,
                }
              );
              return {
                _id: perm.user_id,
                ...userResponse.data.body,
                access: perm.permission,
              };
            } catch (error) {
              console.error(`Error fetching user ${perm.user_id}:`, error);
              return {
                _id: perm.user_id,
                username: `User ${perm.user_id.substring(0, 6)}`,
                email: "No email available",
                profile_picture: null,
                access: perm.permission,
              };
            }
          })
        );

        setUsers(usersWithDetails);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setErrorMessage("Error fetching permissions");
      }
    };

    fetchPermissions();
  }, [datasetId, token]);

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
      // Filter out the current user from suggestions
      const filteredUsers = response.data.data.filter((u) => u._id !== userId);
      setSuggestions(filteredUsers || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setSuggestions([]);
    }
  };

  const handleSelectUser = (user) => {
    setSearchQuery(user.username);
    setSelectedUser(user);
    setSuggestions([]);
  };

  // Adds a new user permission and appends it to the list.
  const handleAddUser = async () => {
    if (selectedUser && !users.some((u) => u._id === selectedUser._id)) {
      const payload = { user_id: selectedUser._id, permission: selectedPermission };
      try {
        const response = await axios.post(
          `${API_BASE_URL}/datasets/${datasetId}/share`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        if (response.data.status === 200) {
          // Fetch the full user profile for the newly added user.
          const userResponse = await axios.get(
            `${API_BASE_URL}/users/${selectedUser._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          const newUser = {
            _id: selectedUser._id,
            ...userResponse.data.body,
            access: selectedPermission,
          };

          setUsers((prev) => [...prev, newUser]);
          setSearchQuery("");
          setSelectedUser(null);
          setErrorMessage("");
          setSuccessMessage("User added successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        } else {
          setErrorMessage(response.data.message || "Failed to grant access");
        }
      } catch (error) {
        console.error("Error granting access:", error.response?.data?.message);
        setErrorMessage("An error occurred while granting access.");
      }
    }
  };

  // Updates an existing user's permission.
  const toggleAccess = async (userIdToToggle, newAccess) => {
    const payload = { user_id: userIdToToggle, permission: newAccess };
    try {
      const response = await axios.post(
        `${API_BASE_URL}/datasets/${datasetId}/share`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.data.status === 200) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userIdToToggle ? { ...u, access: newAccess } : u
          )
        );
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message || "Failed to update permission");
      }
    } catch (error) {
      console.error("Error updating permission:", error.response?.data?.message);
      setErrorMessage("An error occurred while updating permission.");
    }
  };

  // Deletes a user's permission for the dataset.
  const handleDeleteUserPermission = async (userIdToDelete) => {
    const payload = { user_id: userIdToDelete };
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/datasets/${datasetId}/share`,
        {
          data: payload,
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.data.status === 200) {
        setUsers((prev) => prev.filter((u) => u._id !== userIdToDelete));
        setErrorMessage("");
        setSuccessMessage("User permission removed successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(response.data.message || "Failed to remove permission");
      }
    } catch (error) {
      console.error("Error deleting permission:", error.response?.data?.message);
      setErrorMessage("An error occurred while deleting permission.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-md relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          X
        </button>
        <h2 className="text-2xl font-bold text-purple-500 mb-2">
          Permissions
        </h2>
        {errorMessage && (
          <div className="text-red-500 mb-4 text-center">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 mb-4 text-center">{successMessage}</div>
        )}

        {/* Search and Add Section */}
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
                          alt={`${user.username || "No Name"}'s profile`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center text-white font-semibold">
                          {(user.username || "")
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n.charAt(0).toUpperCase())
                            .join("") || "U"}
                        </div>
                      )}
                    </div>
                    <div className="w-full">
                      <span className="font-medium text-gray-900">
                        {user.username || "No Name"}
                      </span>
                      <span className="block text-sm text-gray-500">
                        {user.email || "No Email"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown for Role Selection */}
          <div className="relative">
            <button
              onClick={() => setOpenRoleDropdown((prev) => !prev)}
              className="flex items-center justify-between bg-purple-100 border border-purple-300 rounded-md px-4 py-1 text-sm"
            >
              <span>
                {selectedPermission === "admin"
                  ? "All"
                  : selectedPermission === "view"
                  ? "Can view"
                  : "Can edit"}
              </span>
              <ChevronDown size={16} />
            </button>
            {openRoleDropdown && (
              <div className="absolute right-0 mt-1 w-32 bg-purple-100 border border-gray-200 rounded-md shadow-lg z-10">
                {[
                  { label: "All", value: "admin" },
                  { label: "Can view", value: "view" },
                  { label: "Can edit", value: "edit" },
                ].map((role) => (
                  <button
                    key={role.value}
                    onClick={() => {
                      setSelectedPermission(role.value);
                      setOpenRoleDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-purple-200"
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleAddUser}
            disabled={!selectedUser}
            className="bg-purple-900 text-white px-8 py-2 rounded-md hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>

        {/* List of Users with Permissions */}
        {users.length === 0 ? (
          <p className="text-gray-500 text-center mb-6">
            No users with permissions.
          </p>
        ) : (
          <div className="space-y-4 mb-8">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between pb-4 border-b border-gray-300"
              >
                <div className="flex items-center space-x-3">
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.username || "No Name"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 font-semibold">
                      {(user.username || "")
                        .split(" ")
                        .slice(0, 2)
                        .map((n) => n.charAt(0).toUpperCase())
                        .join("") || "U"}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.username || "No Name"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.email || "No Email"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Inline Dropdown for Changing Permission */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === user._id ? null : user._id)
                      }
                      className="flex items-center justify-between bg-purple-100 border border-purple-300 rounded-md px-4 py-1 text-sm"
                    >
                      <span>
                        {user.access === "admin" ? "All" : `Can ${user.access}`}
                      </span>
                      <ChevronDown size={16} />
                    </button>
                    {openDropdown === user._id && (
                      <div className="absolute right-0 mt-1 w-32 bg-purple-100 border border-gray-200 rounded-md shadow-lg z-10">
                        {["view", "edit", "admin"].map((access) => (
                          <button
                            key={access}
                            onClick={() => {
                              toggleAccess(user._id, access);
                              setOpenDropdown(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-purple-200"
                          >
                            {access === "admin" ? "All" : `Can ${access}`}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteUserPermission(user._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Close Modal Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-purple-900 text-white px-8 py-2 rounded-md hover:bg-purple-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
