/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, Trash2, Loader } from "lucide-react";
import SearchIcon from "../../assets/SearchIcon.svg";
import CloseIcon from "../../assets/Close.svg";
import { searchUsers } from "../../services/Api_Services";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

const PermissionModal = ({ onClose, datasetId, uploaderId, currentUserPermission, sharedUsernames = [] }) => {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFetchingPermissions, setIsFetchingPermissions] = useState(false);

  // Dropdown state for role selection
  const [selectedPermission, setSelectedPermission] = useState("view");
  const [openRoleDropdown, setOpenRoleDropdown] = useState(false);

  // Operation loaders
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  // Redux state
  const token = localStorage.getItem("token");
  const userId = useSelector((state) => state.auth.id);
  const currentUsername = useSelector((state) => state.auth.username);

  // Available roles configuration
  const isOwnerOrAdmin = currentUserPermission === "owner" || currentUserPermission === "admin";
  
  const availableRolesForAdding = [
    ...(isOwnerOrAdmin ? [{ label: "Owner", value: "admin" }] : []),
    { label: "Can view", value: "view" },
    { label: "Can edit", value: "edit" }
  ];
  
  const availableRolesForInline = [...availableRolesForAdding];

  // Show and clear messages
  const showSuccessMessage = useCallback((message) => {
    setSuccessMessage(message);
    setErrorMessage("");
    setTimeout(() => setSuccessMessage(""), 3000);
  }, []);

  const showErrorMessage = useCallback((message) => {
    setErrorMessage(message);
    setSuccessMessage("");
  }, []);

  // Fetch user permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      setIsFetchingPermissions(true);
      try {
        let detailedUsers = [];
  
        // Always fetch actual permissions from the API endpoint
        const permissionsResponse = await axios.get(
          `${API_BASE_URL}/datasets/${datasetId}/share`,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        const permissionsData = permissionsResponse.data?.body || [];
        
        // Create a map of user_id -> permission for quick lookup
        const permissionsMap = {};
        permissionsData.forEach(perm => {
          permissionsMap[perm.user_id] = perm.permission;
        });
        
        // If we have shared usernames, use those to fetch user details
        if (sharedUsernames?.length > 0) {
          detailedUsers = await Promise.all(
            sharedUsernames.map(async (username) => {
              try {
                const response = await searchUsers(username);
                const userDetail = response.data.data?.[0] || {};
                const userId = userDetail._id || `dummy-${username}`;
                
                return {
                  _id: userId,
                  username: userDetail.username || username,
                  email: userDetail.email || "Not available",
                  profile_picture: userDetail.profile_picture || null,
                  // Use the permission from the permissionsMap if available, otherwise default to view
                  access: permissionsMap[userId] || "view",
                };
              } catch (error) {
                console.error("Error fetching user by search:", error);
                const userId = `dummy-${username}`;
                return {
                  _id: userId,
                  username,
                  email: "Not available",
                  profile_picture: null,
                  access: permissionsMap[userId] || "view",
                };
              }
            })
          );
        } else {
          // Otherwise, fetch user details based on permissions data
          detailedUsers = await Promise.all(
            permissionsData.map(async (perm) => {
              try {
                const userResponse = await axios.get(
                  `${API_BASE_URL}/users/${perm.user_id}`,
                  { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
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
                  email: "Not available",
                  profile_picture: null,
                  access: perm.permission,
                };
              }
            })
          );
        }
  
        // Filter out the current user
        const filteredUsers = detailedUsers.filter((u) => u.username !== currentUsername);
        console.log("filtered users : ",filteredUsers);
        
        setUsers(filteredUsers);
        setErrorMessage("");
      } catch (error) {
        if (error.response?.status === 403) {
          setUsers([]);
          setErrorMessage("");
        } else {
          console.error("Error fetching permissions:", error.response?.data || error.message);
          showErrorMessage("Error fetching permissions");
        }
      } finally {
        setIsFetchingPermissions(false);
      }
    };
  
    fetchPermissions();
  }, [datasetId, token, userId, sharedUsernames, currentUsername, showErrorMessage]);

  // Search users
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

  // Add user permission
  const handleAddUser = async () => {
    if (!selectedUser) return;
    
    if (selectedUser._id === uploaderId) {
      showErrorMessage("You are already the owner of the dataset.");
      return;
    }
    
    if (users.some((u) => u._id === selectedUser._id)) {
      showErrorMessage("This user already has permissions.");
      return;
    }
    
    setIsAddingUser(true);
    
    try {
      const payload = { user_id: selectedUser._id, permission: selectedPermission };
      
      const response = await axios.post(
        `${API_BASE_URL}/datasets/${datasetId}/share`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      
      if (response.data.status === 200) {
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
        showSuccessMessage("User added successfully!");
      } else {
        showErrorMessage(response.data.message || "Failed to grant access");
      }
    } catch (error) {
      console.error("Error granting access:", error.response?.data?.message);
      showErrorMessage("An error occurred while granting access.");
    } finally {
      setIsAddingUser(false);
    }
  };

  // Update user permission
  const toggleAccess = async (userIdToToggle, newAccess) => {
    const userToEdit = users.find((u) => u._id === userIdToToggle);
    
    if (!userToEdit) return;
    
    if (userToEdit.access === newAccess) {
      showErrorMessage(`User already has the "${newAccess}" permission.`);
      return;
    }
    
    setUpdatingUserId(userIdToToggle);
    
    try {
      const payload = { user_id: userIdToToggle, permission: newAccess };
      
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
          prev.map((u) => (u._id === userIdToToggle ? { ...u, access: newAccess } : u))
        );
        setErrorMessage("");
      } else {
        showErrorMessage(response.data.message || "Failed to update permission");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      
      // If the server returns that the user already has that permission,
      // update local state and clear the error.
      if (errorMsg.includes("already has")) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userIdToToggle ? { ...u, access: newAccess } : u))
        );
        setErrorMessage("");
      } else {
        console.error("Error updating permission:", errorMsg);
        showErrorMessage("An error occurred while updating permission.");
      }
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Delete user permission
  const handleDeleteUserPermission = async (userIdToDelete) => {
    if (currentUserPermission === "edit") return;
    
    setDeletingUserId(userIdToDelete);
    
    try {
      const payload = { user_id: userIdToDelete };
      
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
        showSuccessMessage("User permission removed successfully!");
      } else {
        showErrorMessage(response.data.message || "Failed to remove permission");
      }
    } catch (error) {
      console.error("Error deleting permission:", error.response?.data?.message);
      showErrorMessage("An error occurred while deleting permission.");
    } finally {
      setDeletingUserId(null);
    }
  };

  // Helper for rendering user avatar
  const renderUserAvatar = (user) => {
    if (user.profile_picture) {
      return (
        <img 
          src={user.profile_picture} 
          alt={user.username || "No Name"} 
          className="w-10 h-10 rounded-full object-cover" 
        />
      );
    }
    
    return (
      <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 font-semibold">
        {(user.username || "").split(" ").slice(0, 2).map((n) => n.charAt(0).toUpperCase()).join("") || "U"}
      </div>
    );
  };

  // Helper for rendering permission text
  const getPermissionLabel = (access) => {
    switch (access) {
      case "admin": return "Owner";
      case "view": return "Can view";
      case "edit": return "Can edit";
      default: return access;
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
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <img src={CloseIcon} alt="close-icon" className="w-[25px]" />
        </button>
        
        <h2 className="text-2xl font-bold text-purple/500 mb-2">Permissions</h2>
        
        {/* Status messages */}
        {errorMessage && <div className="text-red-500 mb-4 text-center">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 mb-4 text-center">{successMessage}</div>}

        {/* Search and Add Section */}
        <div className="flex items-center gap-2 mb-6">
          {/* Search input */}
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
            
            {/* User suggestions dropdown */}
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
                      <span className="font-medium text-gray-900">{user.username || "No Name"}</span>
                      <span className="block text-sm text-gray-500">{user.email || "Not available"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Role Selection Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenRoleDropdown((prev) => !prev)}
              className="flex items-center justify-between bg-purple-100 border border-purple-300 rounded-md px-4 py-1 text-sm"
            >
              <span>{getPermissionLabel(selectedPermission)}</span>
              <ChevronDown size={16} />
            </button>
            
            {openRoleDropdown && (
              <div className="absolute right-0 mt-1 w-32 bg-purple-100 border border-gray-200 rounded-md shadow-lg z-10">
                {availableRolesForAdding.map((role) => (
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

          {/* Add user button */}
          <button
            onClick={handleAddUser}
            disabled={!selectedUser || isAddingUser}
            className="bg-purple-900 text-white px-8 py-2 rounded-md hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingUser ? "Adding..." : "Add"}
          </button>
        </div>

        {/* Users List */}
        {isFetchingPermissions ? (
          <div className="flex justify-center items-center mb-6">
            <Loader className="animate-spin text-purple-900" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-gray-500 text-center mb-6 animate-pulse">No users with permissions.</div>
        ) : (
          <div className="space-y-4 mb-8">
            {users.map((user) => (
              <div key={user._id} className="flex items-center justify-between pb-4 border-b border-gray-300">
                {/* User info */}
                <div className="flex items-center space-x-3">
                  {renderUserAvatar(user)}
                  <div>
                    <p className="font-medium text-gray-900">{user.username || "No Name"}</p>
                    <p className="text-sm text-gray-500">{user.email || "Not available"}</p>
                  </div>
                </div>
                
                {/* User actions */}
                <div className="flex items-center gap-2">
                  {/* Inline Permission Dropdown */}
                  <div className="relative">
                    {updatingUserId === user._id ? (
                      <div className="flex items-center justify-center bg-purple-100 border border-purple-300 rounded-md px-4 py-1 text-sm">
                        <Loader size={16} />
                      </div>
                    ) : (
                      <button
                        onClick={() => setOpenDropdown(openDropdown === user._id ? null : user._id)}
                        className="flex items-center justify-between bg-purple-100 border border-purple-300 rounded-md px-4 py-1 text-sm"
                      >
                        <span>{getPermissionLabel(user.access)}</span>
                        <ChevronDown size={16} />
                      </button>
                    )}
                    
                    {openDropdown === user._id && updatingUserId !== user._id && (
                      <div className="absolute right-0 mt-1 w-32 bg-purple-100 border border-gray-200 rounded-md shadow-lg z-10">
                        {availableRolesForInline.map((role) => (
                          <button 
                            key={role.value} 
                            onClick={() => { 
                              toggleAccess(user._id, role.value); 
                              setOpenDropdown(null); 
                            }} 
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-purple-200"
                          >
                            {role.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Delete button - only visible for admin/owner */}
                  {isOwnerOrAdmin && (
                    <button 
                      onClick={() => handleDeleteUserPermission(user._id)} 
                      disabled={deletingUserId === user._id} 
                      className="text-red-500 hover:text-red-700"
                    >
                      {deletingUserId === user._id ? <Loader size={16} /> : <Trash2 size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
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