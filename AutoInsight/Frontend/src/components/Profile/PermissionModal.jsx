import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { ChevronDown } from "react-feather";

const PermissionModal = ({ onClose, datasetId, setIsModalOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [defaultAccess, setDefaultAccess] = useState("view");
  const [defaultDropdownOpen, setDefaultDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Immediately call the API on every change using an absolute URL
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
  
    axios
      .get(`http://localhost:3000/api/v1/users/search?username=${query}`)
      .then((response) => {
        console.log("API response:", response.data);
  
        if (Array.isArray(response.data.data)) {
          setSuggestions(response.data.data); // Correctly access the array inside "data"
        } else {
          console.warn("Unexpected response structure", response.data);
          setSuggestions([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users");
      });
  };
  
  
  

  // When a suggestion is clicked, add the user and clear suggestions
  const handleSuggestionClick = (suggestion) => {
    const initials =
      suggestion.username
        ?.split(" ")
        .map((word) => word[0]?.toUpperCase() || "")
        .join("") || suggestion.username[0].toUpperCase();

    const newUser = {
      id: suggestion._id || Date.now(),
      name: suggestion.username,
      email: suggestion.email,
      access: defaultAccess,
      avatar: initials,
    };

    setUsers((prev) => [...prev, newUser]);
    setSearchQuery("");
    setSuggestions([]);
  };

  // Allow adding a custom user if no suggestion is selected
  const handleAddUser = () => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return;

    const initials = searchQuery
      .split(" ")
      .map((word) => word[0]?.toUpperCase() || "")
      .join("");
    const newUser = {
      id: Date.now(),
      name: searchQuery,
      email: `${trimmed.replace(/\s+/g, "")}@example.com`,
      access: defaultAccess,
      avatar: initials || "U",
    };

    setUsers((prev) => [...prev, newUser]);
    setSearchQuery("");
    setSuggestions([]);
  };

  const toggleAccess = (userId, newAccess) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, access: newAccess } : user
      )
    );
  };

  return (
    // Modal overlay: clicking here will call onClose.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      {/* Stop propagation to prevent closing when clicking inside the modal */}
      <div
        className="bg-white p-6 rounded-md relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          X
        </button>
        <h2 className="text-2xl font-bold text-purple/500 mb-2">
          Grant Access to Users
        </h2>
        <p className="text-sm text-orig/600 mb-6">
          Securely share your dashboard by inviting team members and assigning
          specific permissions. You can grant users view-only access for secure
          data consumption, or allow full editing rights to enable collaboration
          and dashboard customization.
        </p>

        {/* Search and Add section */}
        <div className="relative flex items-center mb-6">
          <div className="relative flex-1 mr-2">
            <input
              type="text"
              placeholder="Mazen Mostafa"
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute z-20 bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion._id || suggestion.username}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div>{suggestion.username}</div>
                    <div className="text-xs text-gray-500">
                      {suggestion.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Default Access Dropdown */}
          <div className="relative w-32 mr-2">
            <button
              onClick={() => setDefaultDropdownOpen(!defaultDropdownOpen)}
              className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-4 py-2 text-sm"
            >
              <span>Can {defaultAccess}</span>
              <ChevronDown size={16} />
            </button>
            {defaultDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setDefaultAccess("view");
                    setDefaultDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Can view
                </button>
                <button
                  onClick={() => {
                    setDefaultAccess("edit");
                    setDefaultDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Can edit
                </button>
                <button
                  onClick={() => {
                    setDefaultAccess("admin");
                    setDefaultDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Can admin
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleAddUser}
            className="bg-purple/500 text-white px-6 py-2 rounded-md hover:bg-purple-800"
          >
            Add
          </button>
        </div>

        {/* User list */}
        <div className="space-y-4 mb-8">
          {users.map((user) => (
            <div
              key={user.id}
              className="relative flex items-center justify-between border-b border-dashed border-gray-300 pb-4"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-800 text-white flex items-center justify-center mr-3">
                  {user.avatar}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Dropdown button & menu for each user */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === user.id ? null : user.id)
                  }
                  className="flex items-center justify-between bg-purple-100 border border-purple-300 rounded-md px-4 py-1 text-sm"
                >
                  <span>Can {user.access}</span>
                  <ChevronDown size={16} />
                </button>

                {openDropdown === user.id && (
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => {
                        toggleAccess(user.id, "view");
                        setOpenDropdown(null);
                      }}
                    >
                      Can view
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => {
                        toggleAccess(user.id, "edit");
                        setOpenDropdown(null);
                      }}
                    >
                      Can edit
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => {
                        toggleAccess(user.id, "admin");
                        setOpenDropdown(null);
                      }}
                    >
                      Can admin
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
