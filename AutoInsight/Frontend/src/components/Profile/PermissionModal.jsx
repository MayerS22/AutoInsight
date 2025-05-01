/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, Loader, CheckCircle, XCircle } from "lucide-react";
import SearchIcon from "../../assets/SearchIcon.svg";
import CloseIcon from "../../assets/Close.svg";
import { searchUsers } from "../../services/Api_Services";
import axios from "axios";
import TrashLogo from "../../assets/Trash.svg";

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
  const [currentUserPermission, setCurrentUserPermission] = useState(null);
  
  // Refs for handling outside clicks
  const modalRef = useRef(null);
  const dropdownRef = useRef(null);
  const roleDropdownRef = useRef(null);

  // Get user info from Redux and token from localStorage
  const token = localStorage.getItem("token");
  const userId = useSelector((state) => state.auth.id);

  // Check if current user is the uploader (owner)
  const isOwner = userId === uploaderId;

  // Permission display mapping
  const permissionLabels = {
    admin: "Owner",
    edit: "Can edit",
    view: "Can view",
  };

  // Handle clicks outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close suggestions dropdown if click is outside
      if (suggestions.length > 0 && 
          !event.target.closest('.search-container')) {
        setSuggestions([]);
      }
      
      // Close role dropdown if click is outside
      if (openRoleDropdown && 
          roleDropdownRef.current && 
          !roleDropdownRef.current.contains(event.target)) {
        setOpenRoleDropdown(false);
      }
      
      // Close permission dropdown if click is outside
      if (openDropdown && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [suggestions.length, openRoleDropdown, openDropdown]);

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

        // Find current user's permission
        const userPermission = permissionsData.find((perm) => perm.user_id === userId);
        if (userPermission) {
          setCurrentUserPermission(userPermission.permission);
        } else if (userId === uploaderId) {
          // If user is uploader but not in permissions list, they have admin rights
          setCurrentUserPermission("admin");
        }

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

        // Add the uploader with admin permission if not already in the list
        const uploaderExists = usersWithDetails.some((user) => user._id === uploaderId);
        if (!uploaderExists && uploaderId !== userId) {
          try {
            const uploaderResponse = await axios.get(
              `${API_BASE_URL}/users/${uploaderId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
              }
            );
            usersWithDetails.push({
              _id: uploaderId,
              ...uploaderResponse.data.body,
              access: "admin",
            });
          } catch (error) {
            console.error(`Error fetching uploader ${uploaderId}:`, error);
            usersWithDetails.push({
              _id: uploaderId,
              username: `User ${uploaderId.substring(0, 6)} (Owner)`,
              email: "No email available",
              profile_picture: null,
              access: "admin",
            });
          }
        }

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
  }, [datasetId, token, userId, uploaderId]);

  // Handle search input changes
  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedUser(null);

    // Clear success and error messages when typing
    setSuccessMessage("");
    setErrorMessage("");

    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await searchUsers(query);
      // Filter out the current user and users who already have permissions
      const filteredUsers = response.data.data.filter(
        (u) => u._id !== userId && !users.some((existingUser) => existingUser._id === u._id)
      );
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

    // Clear success and error messages when selecting a user
    setSuccessMessage("");
    setErrorMessage("");
  };

  // Show success message temporarily
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Get available permissions based on current user's role
  const getAvailablePermissions = () => {
    // Uploader can assign any permission
    if (isOwner) {
      return ["admin", "edit", "view"];
    }

    // Users with edit permission can only assign view or edit
    if (currentUserPermission === "edit") {
      return ["edit", "view"];
    }

    // Users with admin but not uploader can assign admin, edit, or view
    if (currentUserPermission === "admin") {
      return ["admin", "edit", "view"];
    }

    // View-only users cannot assign permissions
    return [];
  };

  // Add a new user permission
  const handleAddUser = async () => {
    if (!selectedUser) return;

    // Check if current user has permission to add users
    if (!isOwner && currentUserPermission !== "admin" && currentUserPermission !== "edit") {
      setErrorMessage("You don't have permission to add users.");
      return;
    }

    // Check if trying to add the owner
    if (selectedUser._id === uploaderId) {
      setErrorMessage("You cannot modify the owner's permissions.");
      return;
    }

    // Prevent adding a user who already has permission
    if (users.some((u) => u._id === selectedUser._id)) {
      setErrorMessage("This user already has permissions.");
      return;
    }

    // For users with edit permission, restrict to view/edit permissions only
    if (currentUserPermission === "edit" && selectedPermission === "admin") {
      setErrorMessage("You can only assign view or edit permissions.");
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

  // Check if the current user can edit a specific user's permission
  const canEditSpecificUserPermission = (user) => {
    // 1. Uploader can edit anyone except admins they didn't create
    if (isOwner) {
      return true;
    }

    // 2. Admin users can edit anyone except the uploader and other admins
    if (currentUserPermission === "admin" && !isOwner) {
      return user._id !== uploaderId && user.access !== "admin";
    }

    // 3. Users with edit permission can only edit view/edit permissions, not admin
    if (currentUserPermission === "edit") {
      return user.access !== "admin";
    }

    // 4. Users with view permission cannot edit anyone
    return false;
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

    // Check if current user has permission to modify this user
    if (!canEditSpecificUserPermission(userToEdit)) {
      setErrorMessage("You don't have permission to modify this user's access.");
      return;
    }

    // Prevent non-owners from setting admin permissions
    if (newAccess === "admin" && !isOwner && currentUserPermission !== "admin") {
      setErrorMessage("Only owners and admins can assign admin permissions.");
      return;
    }

    // Prevent users with edit permission from setting admin permissions
    if (newAccess === "admin" && currentUserPermission === "edit") {
      setErrorMessage("Users with edit permission cannot assign admin permissions.");
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
        showSuccessMessage("Permission updated successfully!");
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

  // Check if current user can delete a specific user's permission
  const canDeletePermission = (user) => {
    // Only the uploader can delete admin permissions
    if (user.access === "admin") {
      return isOwner;
    }

    // Uploader and admins can delete non-admin permissions
    return isOwner || currentUserPermission === "admin";
  };

  // Delete a user's permission
  const handleDeleteUserPermission = async (userIdToDelete) => {
    const userToDelete = users.find((u) => u._id === userIdToDelete);

    // Check if user can be deleted
    if (!canDeletePermission(userToDelete)) {
      setErrorMessage("You don't have permission to remove this user.");
      return;
    }

    // Prevent deleting the uploader
    if (userIdToDelete === uploaderId) {
      setErrorMessage("You cannot remove the owner's permission.");
      return;
    }

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
        <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center text-white font-semibold">
          {initials}
        </div>
      );
    }
  };

  // Get available permissions for dropdown based on user role and the target user
  const getAvailablePermissionsForUser = (user) => {
    // 1. If the current user is uploader, they can set any permission
    if (isOwner) {
      return Object.entries(permissionLabels);
    }

    // 2. If the current user is admin (but not uploader)
    if (currentUserPermission === "admin" && !isOwner) {
      // Cannot modify uploader or other admins
      if (user._id === uploaderId || user.access === "admin") {
        return [];
      }
      return Object.entries(permissionLabels);
    }

    // 3. If the current user has edit permission
    if (currentUserPermission === "edit") {
      // Can only set edit or view permissions
      return Object.entries(permissionLabels).filter(([value]) =>
        value === "view" || value === "edit"
      );
    }

    // 4. Users with view permission cannot edit any permissions
    return [];
  };

  // Check if user can perform any actions
  const canAddUsers = isOwner || currentUserPermission === "admin" || currentUserPermission === "edit";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => {
        setOpenDropdown(null);
        setOpenRoleDropdown(false);
        setSuggestions([]);
      }}
    >
      <div
        ref={modalRef}
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

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center justify-center bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md mb-4">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="flex items-center justify-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
            <XCircle className="w-5 h-5 mr-2" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Search and Add Section - Only visible to users who can add permissions */}
        {canAddUsers && (
          <div className="flex items-center gap-2 mb-6">
            {/* User search input */}
            <div className="relative flex-1 search-container">
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
                  {suggestions.map((user) => !(user.admin)&&(
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
            <div className="relative" ref={roleDropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenRoleDropdown((prev) => !prev);
                }}
                className="flex items-center justify-between bg-purple-100 border border-purple-900 font-bold text-purple-900 rounded-md px-4 py-1 text-sm"
              >
                <span>{permissionLabels[selectedPermission]}</span>
                <ChevronDown size={16} />
              </button>

              {openRoleDropdown && (
                <div className="absolute right-0 mt-1 w-32 bg-purple-100 border font-bold text-purple-900 border-gray-200 rounded-md shadow-lg z-10">
                  {getAvailablePermissions().map((value) => (
                    <button
                      key={value}
                      onClick={(e) => {
                        e.stopPropagation();
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
        )}

        {/* List of Users with Permissions */}
        {isFetchingPermissions ? (
          <div className="flex justify-center items-center mb-6">
            <Loader className="animate-spin text-purple-900" />
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
                      {user._id === uploaderId && " (Owner)"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.email || "No Email"}
                    </p>
                  </div>
                </div>

                {/* Permission controls */}
                <div className="flex items-center gap-2">
                  {/* Permission dropdown */}
                  <div className="relative" ref={openDropdown === user._id ? dropdownRef : null}>
                    {updatingUserId === user._id ? (
                      <div className="flex items-center justify-center bg-purple-100 border border-purple-300 rounded-md px-4 py-1 text-sm">
                        <Loader size={16} className="animate-spin"/>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (canEditSpecificUserPermission(user)) {
                            setOpenDropdown(openDropdown === user._id ? null : user._id);
                          }
                        }}
                        className={`flex items-center justify-between bg-purple-100 border border-purple-900 font-bold text-purple-900 rounded-md px-4 py-1 text-sm ${
                          !canEditSpecificUserPermission(user) ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        <span>
                          {permissionLabels[user.access]}
                        </span>
                        {canEditSpecificUserPermission(user) && <ChevronDown size={16} />}
                      </button>
                    )}

                    {openDropdown === user._id && canEditSpecificUserPermission(user) && updatingUserId !== user._id && (
                      <div className="absolute right-0 mt-1 w-32 bg-purple-100 border border-gray-200 rounded-md shadow-lg z-10 font-bold text-purple-900">
                        {getAvailablePermissionsForUser(user).map(([value, label]) => (
                          <button
                            key={value}
                            onClick={(e) => {
                              e.stopPropagation();
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

                  {/* Delete permission button - only shown if user can delete */}
                  {canDeletePermission(user) && user._id !== uploaderId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUserPermission(user._id);
                      }}
                      disabled={deletingUserId === user._id}
                      className="text-purple-900 hover:text-red-700"
                    >
                      {deletingUserId === user._id ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <img src={TrashLogo} />
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