/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import CloseIcon from "../../assets/Close.svg";
import { searchUsers, getUserDatasets } from "../../services/Api_Services";
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';

// eslint-disable-next-line react/prop-types
export default function CreateTeamModal({ onClose, onCreateTeam, teamData = {}, setTeams, disableDashboardInput }) {

    const [teamName, setTeamName] = useState(teamData.name || "");
    const [users, setUsers] = useState(teamData.members || []);
    const [selectedDashboards, setSelectedDashboards] = useState(teamData.dashboard || []);
    const [datasets, setDatasets] = useState([]);
    const [permissions, setPermissions] = useState(teamData.permission || "Can edit");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPermissionsDropdown, setShowPermissionsDropdown] = useState(false);
    const [dashboardSearchQuery, setDashboardSearchQuery] = useState("");
    const [filteredDashboards, setFilteredDashboards] = useState([]);
    const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);
    const [isEditing, setIsEditing] = useState(!!teamData._id);



    // Form validation states
    const [errors, setErrors] = useState({
        teamName: "",
        users: "",
        dashboards: ""
    });
    const [touched, setTouched] = useState({
        teamName: false,
        users: false,
        dashboards: false
    });

    const loggedInUserID = useSelector((state) => state.auth.id);
    const loggedInUserEmail = useSelector((state) => state.auth.email);
    const token = localStorage.getItem("token");

    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const dashboardSearchRef = useRef(null);
    const dashboardInputRef = useRef(null);

    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const response = await getUserDatasets(token);
                setDatasets(response.data.body.datasets || []);  // Store datasets in state

            } catch (error) {
                console.error("Error fetching datasets:", error);
            }
        };

        if (token) {
            fetchDatasets();
        }
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (dashboardSearchRef.current && !dashboardSearchRef.current.contains(event.target)) {
                setShowDashboardDropdown(false);
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

                // Filter out users that are already in the team (based on their ID)
                const results = response.data.data
                    .filter((user) => user._id !== loggedInUserID && !users.some((u) => u.id === user._id))
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

        const delaySearch = setTimeout(fetchUsers, 10);
        return () => clearTimeout(delaySearch);
    }, [searchQuery, users]); // Added `users` as dependency to re-filter search results on changes

    useEffect(() => {
        if (disableDashboardInput || dashboardSearchQuery.trim() === "") {
            setFilteredDashboards([]);
            setShowDashboardDropdown(false);
            return;
        }

        // Filter out dashboards that are already selected
        const filtered = datasets.filter(dashboard =>
            dashboard && dashboard.dataset_name &&
            dashboard.dataset_name.toLowerCase().includes(dashboardSearchQuery.toLowerCase()) &&
            !selectedDashboards.some((d) => d.id === dashboard._id)
        );

        setFilteredDashboards(filtered);
        setShowDashboardDropdown(true);
    }, [dashboardSearchQuery, datasets, selectedDashboards, disableDashboardInput]); // Added `disableDashboardInput` as dependency

    useEffect(() => {
        if (teamData && teamData._id) {
            setIsEditing(true);
            setTeamName(teamData.name || "");
            setUsers(
                teamData.members.map((member) => ({
                    id: member._id,
                    name: member.username,
                    profilePicture: member.profile_picture,
                    email: member.email,
                })) || []
            );
            setSelectedDashboards(
                teamData.datasets?.map((dataset) => ({
                    id: dataset._id,
                    name: dataset.dataset_name,
                })) || []
            );
            setPermissions(
                teamData.memberPermission === "edit"
                    ? "Can edit"
                    : teamData.memberPermission === "view"
                        ? "Can view"
                        : "Admin"
            );
        } else {
            setIsEditing(false);
        }
    }, [teamData]);

    // Validation logic
    useEffect(() => {
        validateField('teamName', teamName);
    }, [teamName]);

    useEffect(() => {
        validateField('users', users);
    }, [users]);

    useEffect(() => {
        validateField('dashboards', selectedDashboards);
    }, [selectedDashboards]);

    const validateField = (field, value) => {
        let errorMessage = "";

        switch (field) {
            case 'teamName':
                if (!value.trim()) {
                    errorMessage = "Team name is required";
                }
                break;
            case 'users':
                if (users.filter(user => user.email !== loggedInUserEmail).length === 0) {
                    errorMessage = "At least one user must be added";
                }
                break;
            case 'dashboards':
                if (value.length === 0 && !disableDashboardInput) {
                    errorMessage = "At least one dashboard must be added";
                }
                break;
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [field]: errorMessage }));
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    // Clear error when typing in fields
    const handleTeamNameChange = (e) => {
        setTeamName(e.target.value);
        setErrors(prev => ({ ...prev, teamName: "" })); // Clear error immediately
    };

    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
        setErrors(prev => ({ ...prev, users: "" })); // Clear error immediately
    };

    const handleDashboardSearchQueryChange = (e) => {
        if (disableDashboardInput) return;

        setDashboardSearchQuery(e.target.value);
        setErrors(prev => ({ ...prev, dashboards: "" })); // Clear error immediately
    };

    const handleRemoveUser = (userToRemove) => {
        console.log(users);

        const updatedUsers = users.filter((user) => user !== userToRemove);
        setUsers(updatedUsers);
        console.log(updatedUsers);


        // Update validation state
        if (updatedUsers.length === 0 && touched.users) {
            setErrors(prev => ({ ...prev, users: "At least one user must be added" }));
        }
    };

    const handleRemoveDashboard = (dashboardToRemove) => {
        if (disableDashboardInput) return;

        const updatedDashboards = selectedDashboards.filter((dashboard) => dashboard.id !== dashboardToRemove.id);
        setSelectedDashboards(updatedDashboards);

        // Update validation state
        if (updatedDashboards.length === 0 && touched.dashboards) {
            setErrors(prev => ({ ...prev, dashboards: "At least one dashboard must be added" }));
        }
    };

    const handleCreateTeam = async () => {
        // Mark all fields as touched to show all validation errors
        setTouched({
            teamName: true,
            users: true,
            dashboards: true
        });

        // Validate all fields
        validateField('teamName', teamName);
        validateField('users', users);
        validateField('dashboards', selectedDashboards);

        // Check if there are any errors
        if (!teamName.trim() ||
            users.filter(user => user.email !== loggedInUserEmail).length === 0 ||
            (!disableDashboardInput && selectedDashboards.length === 0)) {
            return; // Stop form submission if there are errors
        }

        const permission = permissions === "Can edit" ? "edit" : permissions === "Can view" ? "view" : "admin";

        try {
            if (isEditing) {
                // Update team name separately if needed
                // Fetch full user info for each user in the users array
                const usersToUpdate = await Promise.all(
                    users.map(async (user) => {
                        const foundUsers = await searchUsers(user.name); // assuming searchUsers takes (username, token)
                        console.log(foundUsers.data.data);
                        return foundUsers.data.data[0]; // take the first match (or handle carefully if needed)
                    })
                );
                console.log(usersToUpdate);

                // Now patch using the real ids
                await axios.patch(`http://localhost:3000/api/v1/teams/${teamData._id}/members`, {
                    members: usersToUpdate.map(user => user._id) // or user.id if returned that way
                }, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });

                // Update team datasets
                await axios.patch(`http://localhost:3000/api/v1/teams/${teamData._id}/datasets`, {
                    datasets: selectedDashboards.map(dashboard => dashboard.id)
                }, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });

                // Update team permission
                await axios.patch(`http://localhost:3000/api/v1/teams/${teamData._id}/permission`, {
                    memberPermission: permission
                }, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });

                Swal.fire({
                    icon: "success",
                    title: `${teamName} Team Updated!`,
                    text: `${teamName} team has been updated successfully.`,
                    confirmButtonColor: "#4A266A",
                });

                // Update the teams state in parent component
                console.log(users);

                setTeams(prev =>
                    prev.map(team =>
                        team._id === teamData._id
                            ? {
                                ...team, // Retain other properties
                                members: users.map((user) => ({
                                    id: user.id, // Ensure only the necessary properties are included
                                    username: user.name,
                                    email: user.email,
                                })),
                                memberPermission: permission
                            }
                            : team
                    )
                );
            } else {
                // Create new team
                const teamDataToSubmit = {
                    name: teamName,
                    members: users.map(user => user.id), // Send only user IDs
                    datasets: selectedDashboards.map(dashboard => dashboard.id), // Send only dashboard IDs
                    memberPermission: permission
                };

                const response = await axios.post("http://localhost:3000/api/v1/teams/", teamDataToSubmit, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });

                Swal.fire({
                    icon: "success",
                    title: `${teamName} Team Created!`,
                    text: `${teamName} team has been created successfully.`,
                    confirmButtonColor: "#4A266A",
                });

                // Add the new team to the teams state
                setTeams(prev => [...prev, {
                    ...teamDataToSubmit,
                    _id: response.data.id || response.data._id || Date.now().toString()
                }]);
            }

            onClose();
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} team:`, error);

            const errorMessage = error.response?.data?.message || "An error occurred";

            if (errorMessage.includes("Access denied") || errorMessage.includes("Permission")) {
                setErrors(prev => ({ ...prev, general: errorMessage }));
            } else if (errorMessage.includes("already taken") || errorMessage.includes("name exists")) {
                setErrors(prev => ({ ...prev, teamName: errorMessage }));
            } else {
                setErrors(prev => ({ ...prev, general: errorMessage })); // fallback general error
            }
        }
    };

    const handleAddUser = (user) => {
        if (!users.some((u) => u.id === user.id)) {
            const updatedUsers = [...users, user];
            setUsers(updatedUsers);

            // Clear error if adding a user resolves the validation issue
            if (updatedUsers.length > 0) {
                setErrors(prev => ({ ...prev, users: "" }));
            }
        }
        setSearchQuery('');
        setShowDropdown(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleAddDashboard = (dashboard) => {
        if (disableDashboardInput) return;

        if (!dashboard || !dashboard._id || !dashboard.dataset_name) {
            console.error("Invalid dashboard data:", dashboard);
            return;
        }

        if (!selectedDashboards.some((d) => d.id === dashboard._id)) {
            const updatedDashboards = [...selectedDashboards, {
                id: dashboard._id,
                name: dashboard.dataset_name
            }];
            setSelectedDashboards(updatedDashboards);

            // Clear error if adding a dashboard resolves the validation issue
            if (updatedDashboards.length > 0) {
                setErrors(prev => ({ ...prev, dashboards: "" }));
            }
        }

        setDashboardSearchQuery(''); // Clear search query
        setShowDashboardDropdown(false); // Hide dropdown after adding a dashboard
        if (dashboardInputRef.current) {
            dashboardInputRef.current.focus();
        }
    };

    const handlePermissionChange = (permission) => {
        setPermissions(permission);
        setShowPermissionsDropdown(false);
    };

    // Helper function to safely get initial for dashboard
    const getInitial = (name) => {
        return name && typeof name === 'string' ? name.charAt(0).toUpperCase() : "D";
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-purple-50 rounded-lg w-full max-w-3xl shadow-lg">
                <div className="p-6 pb-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{isEditing ? "Edit Team" : "Create Team"}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-700 hover:bg-purple-100 p-1 rounded-full mr-2"
                        >
                            <img src={CloseIcon} alt="Close" className="w-7 h-7" />
                        </button>
                    </div>

                    <div className="border-t-[2px] border-gray-300 pt-6">
                        {errors.general && (
                            <p className="text-red-500 text-sm mb-4">{errors.general}</p>
                        )}

                        <div className="mb-6">
                            <label className="block text-gray-800 text-md font-bold mb-2">
                                Team Name
                            </label>
                            <div className="flex gap-4 items-start">
                                <div className="flex-grow">
                                    <input
                                        type="text"
                                        value={teamName}
                                        onChange={handleTeamNameChange}
                                        onBlur={() => handleBlur('teamName')}
                                        className={`border ${touched.teamName && errors.teamName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full`}
                                        placeholder="Enter your team name"
                                    />
                                    {touched.teamName && errors.teamName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.teamName}</p>
                                    )}
                                </div>
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
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-800 text-md font-bold mb-2">
                                Users
                            </label>
                            <div className="relative" ref={searchRef}>
                                <div
                                    className={`border ${touched.users && errors.users ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 min-h-14 flex bg-white flex-wrap items-center gap-2`}
                                    onClick={() => inputRef.current && inputRef.current.focus()}
                                >
                                    {users.map((user, index) => (
                                        loggedInUserEmail === user.email ? null : (
                                            <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-950 px-3 py-1 rounded-lg border-2 border-purple-950">
                                                {user.name}
                                                {user._id}
                                                <button onClick={() => handleRemoveUser(user)} className="ml-1 text-purple-950">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )
                                    ))}

                                    <div className="flex items-center flex-grow min-w-32">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchQueryChange}
                                            onBlur={() => handleBlur('users')}
                                            placeholder={`${users.filter(user => user.email !== loggedInUserEmail).length === 0 ? "Select Users" : ""}`}
                                            className="outline-none w-full py-1 px-2"
                                            onFocus={() => searchQuery && setShowDropdown(true)}
                                        />
                                    </div>
                                </div>
                                {touched.users && errors.users && (
                                    <p className="text-red-500 text-sm mt-1">{errors.users}</p>
                                )}

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

                        {/* Dashboard Selection Field with Validation */}
                        <div className="mb-8">
                            <label className="block text-gray-800 text-md font-bold mb-2">
                                Dashboards
                            </label>
                            <div className="relative" ref={dashboardSearchRef}>
                                <div
                                    className={`border ${touched.dashboards && errors.dashboards ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 min-h-14 flex ${disableDashboardInput ? 'bg-gray-100' : 'bg-white'} flex-wrap items-center gap-2`}
                                    onClick={() => !disableDashboardInput && dashboardInputRef.current && dashboardInputRef.current.focus()}
                                >
                                    {selectedDashboards.map((dashboard, index) => (
                                        <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-950 px-3 py-1 rounded-lg border-2 border-purple-950">
                                            {dashboard.name}
                                            {!disableDashboardInput && (
                                                <button onClick={() => handleRemoveDashboard(dashboard)} className="ml-1 text-purple-950">
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <div className="flex items-center flex-grow min-w-32">
                                        <input
                                            ref={dashboardInputRef}
                                            type="text"
                                            value={dashboardSearchQuery}
                                            onChange={handleDashboardSearchQueryChange}
                                            onBlur={() => handleBlur('dashboards')}
                                            placeholder={selectedDashboards.length > 0 ? "" : "Select Dashboards"}
                                            className={`outline-none w-full py-1 px-2 ${disableDashboardInput ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
                                            onFocus={() => !disableDashboardInput && dashboardSearchQuery.trim() && setShowDashboardDropdown(true)}
                                            disabled={disableDashboardInput}
                                        />
                                    </div>
                                </div>
                                {touched.dashboards && errors.dashboards && (
                                    <p className="text-red-500 text-sm mt-1">{errors.dashboards}</p>
                                )}

                                {!disableDashboardInput && showDashboardDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {(dashboardSearchQuery.trim() === "" ? datasets : filteredDashboards)
                                            .filter(dashboard => dashboard && dashboard.dataset_name)
                                            .map((dashboard) => (
                                                <div
                                                    key={dashboard._id}
                                                    className="flex items-center p-3 hover:bg-purple-100 cursor-pointer gap-3"
                                                    onClick={() => handleAddDashboard(dashboard)}
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-950 font-bold">
                                                        {getInitial(dashboard.dataset_name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{dashboard.dataset_name}</p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end p-4 rounded-b-lg">
                    <button onClick={handleCreateTeam} className="px-6 py-2 text-white bg-purple-950 rounded-lg font-semibold">
                        {isEditing ? "Save Changes" : "Create Team"}
                    </button>
                </div>
            </div>
        </div>
    );
}