/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import EditLogo from "../../assets/EditLogo.svg";
import axios from "axios";

const TeamItem = ({ team, onPermissionChange, onEditTeam,memberPermissions }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const dropdownRef = useRef(null);

    
  

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const permissions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Can edit', value: 'edit' },
        { label: 'Can view', value: 'view' },
    ];

    const renderPermissionButton = () => {
        let label = "";

        switch (team.memberPermission) {
            case 'edit':
                label = "Can edit";
                break;
            case 'view':
                label = "Can view";
                break;
            case 'admin':
                label = "Admin";
                break;
            default:
                label = "Select";
        }

        return (
            <button
            className={`flex items-center gap-1 text-purple-950 font-medium px-3 py-1 border-2 rounded-md text-sm bg-purple-100 border-purple-950 ${memberPermissions[team._id]!== "owner" ? ' cursor-not-allowed' : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={memberPermissions[team._id] !== "owner"}
          >
                {isUpdating ? (
                    <div className="flex justify-center items-center ">
                        <svg className="animate-spin h-6 w-6 text-purple-600" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                    </div>
                ) : label}
                {isUpdating ? "" : <ChevronDown size={14} className="ml-1" />}
            </button>
        );
    };

    const handlePermissionSelect = async (permValue) => {
        if (team.memberPermission === permValue) {
            setIsDropdownOpen(false);
            return; // Exit early if the same permission is selected
        }
        setIsUpdating(true);
        try {
            await onPermissionChange(team._id, permValue);
            setIsDropdownOpen(false);
        } catch (error) {
            console.error("Failed to update permission:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2">
            <div className="flex items-center gap-3 flex-wrap">
                <div className="w-8 h-8 rounded-full bg-purple-950 text-white flex items-center justify-center text-sm">
                    {getInitials(team.name)}
                </div>
                <span className="font-medium truncate max-w-[150px] sm:max-w-none">{team.name}</span>
                <button
                    className={`p-1 bg-purple-200  rounded-full ${memberPermissions[team._id]!== "owner" ? ' cursor-not-allowed' : ''}`}
                    onClick={() => onEditTeam(team)}
                    disabled={memberPermissions[team._id] !== "owner" } // Access the permission for the current team
                    >
                    <img src={EditLogo} alt="Edit" className="h-3 w-3" />
                </button>
            </div>

            {/* Permission dropdown */}
            <div className="relative self-start sm:self-auto" ref={dropdownRef}>
                {renderPermissionButton()}

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-40 bg-purple-100 rounded-md shadow-lg z-10 border text-purple-950 font-medium border-gray-200">
                        <div className="py-1">
                            {permissions.map((perm) => (
                                <button
                                    key={perm.value}
                                    onClick={() => handlePermissionSelect(perm.value)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left hover:bg-purple-200"
                                    disabled={isUpdating}
                                >
                                    {perm.label}
                                    {team.memberPermission === perm.value && (
                                        <span className="ml-auto text-purple-950 font-medium">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const TeamsList = ({ teams, setTeams, onEditTeam, loading,memberPermissions }) => {

    const handlePermissionChange = async (teamId, newPermission) => {
        try {

            // Make the API call using axios
            const response = await axios.patch(
                `http://localhost:3000/api/v1/teams/${teamId}/permission`,
                { memberPermission: newPermission },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );


            setTeams(prev =>
                prev.map(team =>
                    team._id === teamId ? { ...team, memberPermission: newPermission } : team
                )
            );

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update permission';
            console.error('Error updating team permission:', error);
            throw error;
        }
    };


    

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mx-2 sm:mx-4">
            <div className="space-y-3">
                {loading ? (
                    <div className="flex justify-center items-center ">
                        <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                    </div>
                ) : teams.length > 0 ? (
                    teams.map((team) => (
                        <TeamItem
                            key={team._id}
                            team={team}
                            onPermissionChange={handlePermissionChange}
                            onEditTeam={onEditTeam}
                            memberPermissions={memberPermissions}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No teams available</p>
                )}
            </div>
        </div>
    );
};

export default TeamsList;