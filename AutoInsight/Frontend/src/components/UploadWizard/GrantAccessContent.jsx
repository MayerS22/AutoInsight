/* eslint-disable react/prop-types */
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const GrantAccessContent = ({ onNext, onPrevious }) => {
  const [searchQuery, setSearchQuery] = useState("");
  // Start with an empty array for added users.
  const [users, setUsers] = useState([]);
  
  // State to hold the default access permission for new users.
  const [defaultAccess, setDefaultAccess] = useState("view");
  // State to toggle the dropdown in the search section.
  const [defaultDropdownOpen, setDefaultDropdownOpen] = useState(false);
  // This state tracks which user's dropdown (in the user list) is open.
  const [openDropdown, setOpenDropdown] = useState(null);

  // Adds a user to the list based on the search query.
  const handleAddUser = () => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return;

    let newUser;

    // Check if search matches Mazen.
    if (trimmed.includes("mazen")) {
      newUser = {
        id: Date.now(),
        name: "Mazen Raafat",
        email: "mazenraafat@gmail.com",
        // Use a hard-coded access for Mazen if needed,
        // or you can opt to use defaultAccess instead.
        access: "edit",
        avatar: "MR",
      };
    }
    // Check if search matches Mayer.
    else if (trimmed.includes("mayer")) {
      newUser = {
        id: Date.now(),
        name: "Mayer Soliman",
        email: "mayer88@gmail.com",
        access: "view",
        avatar: "MS",
      };
    }
    // Otherwise, create a generic user from whatever is typed.
    else {
      // Derive initials from the search query.
      const initials = searchQuery
        .split(" ")
        .map((word) => word[0]?.toUpperCase() || "")
        .join("");

      newUser = {
        id: Date.now(),
        name: searchQuery,
        email: `${trimmed.replace(/\s+/g, "")}@example.com`,
        // Use the defaultAccess value here.
        access: defaultAccess,
        avatar: initials || "U", // 'U' for unknown.
      };
    }

    setUsers((prev) => [...prev, newUser]);
    setSearchQuery(""); // Clear the input.
  };

  // Update a user's access field from the list.
  const toggleAccess = (userId, newAccess) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, access: newAccess } : user
      )
    );
  };

  return (
    <div>
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
      <div className="flex items-center mb-6">
        <div className="relative flex-1 mr-2">
          <input
            type="text"
            placeholder="Mazen Mostafa"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          {/* Simple search icon */}
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

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="bg-purple/500 text-white px-4 py-2 rounded-md hover:bg-purple-800 "
        >
          <span className="mr-1">←</span> Previous
        </button>
        <button
          onClick={onNext}
          className="bg-purple/500 text-white px-8 py-2 rounded-md hover:bg-purple-800 "
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GrantAccessContent;
