/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, Trash2, Loader } from "lucide-react";
import SearchIcon from "../../assets/SearchIcon.svg";
import CloseIcon from "../../assets/Close.svg";
import { searchUsers } from "../../services/Api_Services";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

const PermissionModal = ({ onClose, datasetId, uploaderId }) => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFetchingPermissions, setIsFetchingPermissions] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState("view");
  const [openRoleDropdown, setOpenRoleDropdown] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  // Get user info from Redux and token from localStorage
  const token = localStorage.getItem("token");
  const userId = useSelector((state) => state.auth.id);

  // Permission display mapping
  const permissionLabels = {
    admin: "Owner",
    view: "Can view",
    edit: "Can edit"
  };

  // Fetch existing permissions on component mount
  useEffect(() => {
    const fetchPermissions = async () => {
      setIsFetchingPermissions(true);
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

        // Fetch user details for each permission
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
        // Filter out current user from the list
        setUsers(usersWithDetails.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setErrorMessage("Error fetching permissions");
      } finally {
        setIsFetchingPermissions(false);
      }
    };
    
    fetchPermissions();
  }, [datasetId, token, userId]);

  // Handle search input changes
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

  // Handle user selection from search results
  const handleSelectUser = (user) => {
    setSearchQuery(user.username);
    setSelectedUser(user);
    setSuggestions([]);
  };

  // Show success message temporarily
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Get available permissions based on current user's role
  const getAvailablePermissions = () => {
    // For simplicity, assume current user is uploader and has full rights
    // In a real app, you would check the current user's permissions
    const isOwner = userId === uploaderId;
    
    // Owner can assign any permission
    if (isOwner) {
      return ["admin", "edit", "view"];
    }
    
    // Non-owners with edit permission can only assign view or edit
    return ["edit", "view"];
  };

  // Add a new user permission
  const handleAddUser = async () => {
    if (!selectedUser) return;
    
    // Check if trying to add the owner
    if (selectedUser._id === uploaderId) {
      setErrorMessage("You are already the owner of the dataset.");
      return;
    }

    // Prevent adding a user who already has permission
    if (users.some((u) => u._id === selectedUser._id)) {
      setErrorMessage("This user already has permissions.");
      return;
    }

    const payload = { user_id: selectedUser._id, permission: selectedPermission };
    setIsAddingUser(true);
    
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
        // Fetch the full user profile for the newly added user
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
        showSuccessMessage("User added successfully!");
      } else {
        setErrorMessage(response.data.message || "Failed to grant access");
      }
    } catch (error) {
      console.error("Error granting access:", error.response?.data?.message);
      setErrorMessage("An error occurred while granting access.");
    } finally {
      setIsAddingUser(false);
    }
  };

  // Update an existing user's permission
  const toggleAccess = async (userIdToToggle, newAccess) => {
    const userToEdit = users.find((u) => u._id === userIdToToggle);
    if (!userToEdit) return;

    // Prevent updating if the permission is already the same
    if (userToEdit.access === newAccess) {
      setErrorMessage(`User already has the "${permissionLabels[newAccess]}" permission.`);
      return;
    }

    setUpdatingUserId(userIdToToggle);
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
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Delete a user's permission
  const handleDeleteUserPermission = async (userIdToDelete) => {
    setDeletingUserId(userIdToDelete);
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
        showSuccessMessage("User permission removed successfully!");
      } else {
        setErrorMessage(response.data.message || "Failed to remove permission");
      }
    } catch (error) {
      console.error("Error deleting permission:", error.response?.data?.message);
      setErrorMessage("An error occurred while deleting permission.");
    } finally {
      setDeletingUserId(null);
    }
  };

  // Render user avatar/initials
  const renderUserAvatar = (user) => {
    if (user.profile_picture) {
      return (
        <img
          src={user.profile_picture}
          alt={`${user.username || "No Name"}'s profile`}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    } else {
      const initials = (user.username || "")
        .split(" ")
        .slice(0, 2)
        .map((n) => n.charAt(0).toUpperCase())
        .join("") || "U";
        
      return (
        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 font-semibold">
          {initials}
        </div>
      );
    }
  };

  // Check if user can delete permissions (only owner can delete)
  const canDeletePermission = (user) => {
    // Only the uploader (owner) can delete permissions
    return userId === uploaderId;
  };

  // Check if user's permissions can be edited
  const canEditPermission = (user) => {
    // Users with admin or owner permissions cannot be edited
    return user.access !== "admin";
  };

  // Get available permissions for dropdown based on user role
  const getAvailablePermissionsForUser = (user) => {
    const isCurrentUserOwner = userId === uploaderId;
    
    // If current user is owner, they can set any permission
    if (isCurrentUserOwner) {
      return Object.entries(permissionLabels);
    }
    
    // Non-owners with edit permission can only set view or edit
    return Object.entries(permissionLabels).filter(([value]) => 
      value !== "admin"
    );
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
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <img src={CloseIcon} alt="close-icon" className="w-[25px]" />
        </button>
        
        {/* Modal title */}
        <h2 className="text-2xl font-bold text-purple/500 mb-2">
          Permissions
        </h2>
        
        {/* Error and success messages */}
        {errorMessage && (
          <div className="text-red-500 mb-4 text-center">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 mb-4 text-center">{successMessage}</div>
        )}

        {/* Search and Add Section */}
        <div className="flex items-center gap-2 mb-6">
          {/* User search input */}
          <div className="relative flex-1">
            <div className="relative w-full">
              <img
                src={SearchIcon}
                alt="Search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              />
              <input
                type="text"
                placeholder="Enter username"
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 bg-purple-200"
              />
            </div>
            
            {/* Search results dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {suggestions.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="flex-shrink-0 mr-3">
                      {renderUserAvatar(user)}
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

          {/* Permission selection dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenRoleDropdown((prev) => !prev)}
              className="flex items-center justify-between bg-purple-100 border border-purple-300 rounded-md px-4 py-1 text-sm"
            >
              <span>{permissionLabels[selectedPermission]}</span>
              <ChevronDown size={16} />
            </button>
            
            {openRoleDropdown && (
              <div className="absolute right-0 mt-1 w-32 bg-purple-100 border border-gray-200 rounded-md shadow-lg z-10">
                {getAvailablePermissions().map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setSelectedPermission(value);
                      setOpenRoleDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-purple-200"
                  >
                    {permissionLabels[value]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add user button */}
          <button
            onClick={handleAddUser}
            disabled={!selectedUser || isAddingUser}
            className="bg-purple-900 text-white px-8 py-2 rounded-md hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingUser ? "Adding..." : "Add"}
          </button>
        </div>

        {/* List of Users with Permissions */}
        {isFetchingPermissions ? (
          <div className="flex justify-center items-center mb-6">
            <Loader className="animate-spin text-purple-900"/>
          </div>
        ) : users.length === 0 ? (
          <div className="text-gray-500 text-center mb-6 animate-pulse">
            No users with permissions.
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between pb-4 border-b border-gray-300"
              >
                {/* User info */}
                <div className="flex items-center space-x-3">
                  {renderUserAvatar(user)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.username || "No Name"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.email || "No Email"}
                    </p>
                  </div>
                </div>
                
                {/* Permission controls */}
                <div className="flex items-center gap-2">
                  {/* Permission dropdown */}
                  <div className="relative">
                    {updatingUserId === user._id ? (
                      <div className="flex items-center justify-center bg-purple-100 border border-purple-300 rounded-md px-4 py-1 text-sm">
                        <Loader size={16} />
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (canEditPermission(user)) {
                            setOpenDropdown(openDropdown === user._id ? null : user._id);
                          }
                        }}
                        className={`flex items-center justify-between bg-purple-100 border border-purple-300 rounded-md px-4 py-1 text-sm ${
                          !canEditPermission(user) ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        <span>
                          {permissionLabels[user.access]}
                        </span>
                        {canEditPermission(user) && <ChevronDown size={16} />}
                      </button>
                    )}
                    
                    {openDropdown === user._id && canEditPermission(user) && updatingUserId !== user._id && (
                      <div className="absolute right-0 mt-1 w-32 bg-purple-100 border border-gray-200 rounded-md shadow-lg z-10">
                        {getAvailablePermissionsForUser(user).map(([value, label]) => (
                          <button
                            key={value}
                            onClick={() => {
                              toggleAccess(user._id, value);
                              setOpenDropdown(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-purple-200"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Delete permission button - only shown if current user is the owner */}
                  {canDeletePermission(user) && (
                    <button
                      onClick={() => handleDeleteUserPermission(user._id)}
                      disabled={deletingUserId === user._id}
                      className="text-red-500 hover:text-red-700"
                    >
                      {deletingUserId === user._id ? (
                        <Loader size={16} className="animate-spin"/>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  )}
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