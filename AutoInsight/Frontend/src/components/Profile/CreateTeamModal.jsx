/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import CloseIcon from "../../assets/Close.svg";
import { searchUsers } from "../../services/Api_Services";
import { useSelector } from 'react-redux';

// eslint-disable-next-line react/prop-types
export default function CreateTeamModal({ onClose, onCreateTeam, teamData = {} }) {
    const [teamName, setTeamName] = useState(teamData.name || "");
    const [users, setUsers] = useState(teamData.users || []);
    const [permissions, setPermissions] = useState(teamData.permission || "Can edit");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPermissionsDropdown, setShowPermissionsDropdown] = useState(false);
    const [error, setError] = useState("");
    const loggedInUserID = useSelector((state) => state.auth.id);

    const searchRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            if (searchQuery.trim() === "") {
                setSearchResults([]);
                setShowDropdown(false);
                return;
            }

            try {
                setIsSearching(true);
                const response = await searchUsers(searchQuery);

                const results = response.data.data
                    .filter((user) => user._id !== loggedInUserID)
                    .map((user) => ({
                        id: user._id,
                        name: user.username,
                        profilePicture: user.profile_picture,
                        email: user.email,
                    }));

                setSearchResults(results);
                setShowDropdown(true);
            } catch (error) {
                console.error("Error searching users:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const delaySearch = setTimeout(fetchUsers, 300);
        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

    const handleRemoveUser = (userToRemove) => {
        setUsers(users.filter((user) => user !== userToRemove));
    };

    const handleCreateTeam = () => {
        if (!teamName.trim()) {
            setError("Team name is required.");
            return;
        }
        if (users.length === 0) {
            setError("At least one user must be added.");
            return;
        }
        setError(""); // Clear any previous errors
        if (onCreateTeam) {
            onCreateTeam({ id: teamData.id, name: teamName, users, permission: permissions });
        }
        if (onClose) onClose();
    };

    const handleAddUser = (user) => {
        if (!users.some((u) => u.id === user.id)) {
            setUsers([...users, user]); // Add the full user object instead of just the name
        }
        setSearchQuery('');
        setShowDropdown(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handlePermissionChange = (permission) => {
        setPermissions(permission);
        setShowPermissionsDropdown(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-purple-50 rounded-lg w-full max-w-3xl shadow-lg">
                <div className="p-6 pb-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{teamData.id ? "Edit Team" : "Create Team"}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-700 hover:bg-purple-100 p-1 rounded-full mr-2"
                        >
                            <img src={CloseIcon} alt="Close" className="w-7 h-7" />
                        </button>
                    </div>

                    <div className="border-t-[2px] border-gray-300 pt-6">
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <label className="block text-gray-800 text-md font-bold mb-2">
                            Team Name
                        </label>
                        <div className="flex gap-4 items-center mb-6">
                            <input
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 w-full"
                                placeholder="Enter your team name"
                            />
                            <div className="relative">
                                <button
                                    onClick={() => setShowPermissionsDropdown(!showPermissionsDropdown)}
                                    className="text-purple-950 bg-purple-100 px-4 py-2 rounded-lg font-medium flex items-center whitespace-nowrap border-purple-950 border-2"
                                >
                                    {permissions} <ChevronDown size={16} className="ml-1 w-5 h-5 text-purple-950 font-bold" />
                                </button>
                                {showPermissionsDropdown && (
                                    <div className="absolute z-10 mt-2 bg-purple-100 border border-gray-300 rounded-lg shadow-lg w-full">
                                        <div
                                            onClick={() => handlePermissionChange("Can edit")}
                                            className="px-4 py-2 hover:bg-purple-100 cursor-pointer text-purple-950 font-medium"
                                        >
                                            Can edit
                                        </div>
                                        <div
                                            onClick={() => handlePermissionChange("Can view")}
                                            className="px-4 py-2 hover:bg-purple-100 cursor-pointer text-purple-950 font-medium"
                                        >
                                            Can view
                                        </div>
                                        <div
                                            onClick={() => handlePermissionChange("Admin")}
                                            className="px-4 py-2 hover:bg-purple-100 cursor-pointer text-purple-950 font-medium"
                                        >
                                             Admin
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <label className="block text-gray-800 text-md font-bold mb-2">
                            Users
                        </label>
                        <div className="relative mb-8" ref={searchRef}>
                            <div className="border border-gray-300 rounded-lg p-2 min-h-14 flex bg-white flex-wrap items-center gap-2">
                                {users.map((user, index) => (
                                    <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-950 px-3 py-1 rounded-lg border-2 border-purple-950">
                                        {user.name}
                                        <button onClick={() => handleRemoveUser(user)} className="ml-1 text-purple-950">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex items-center flex-grow min-w-32">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Select Users"
                                        className="outline-none w-full py-1 px-2"
                                        onFocus={() => searchQuery && setShowDropdown(true)}
                                    />
                                    {isSearching && <div className="loader w-4 h-4 border-2 border-t-2 border-gray-500 rounded-full animate-spin mr-2"></div>}
                                </div>
                            </div>

                            {showDropdown && searchResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {searchResults.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center p-3 hover:bg-purple-100 cursor-pointer gap-3"
                                            onClick={() => handleAddUser(user)}
                                        >
                                            {user.profilePicture ? (
                                                <img
                                                    src={user.profilePicture}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                    alt=""
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-purple-950 flex items-center justify-center text-white font-bold">
                                                    {user.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-800">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end p-4 rounded-b-lg">
                    <button
                        onClick={handleCreateTeam}
                        className="bg-purple-950 hover:bg-purple-900 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                    >
                        {teamData.id ? "Update" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}