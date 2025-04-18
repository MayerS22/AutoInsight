/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import EditLogo from "../../assets/EditLogo.svg";

const TeamItem = ({ team, onPermissionChange, onEditTeam }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

    const renderPermissionButton = () => {
        let label = "";

        switch (team.permission) {
            case 'Can edit':
                label = "Can edit";
                break;
            case 'Can view':
                label = "Can view";
                break;
            case 'Admin':
                label = "Admin";
                break;
            default:
                label = "Select";
        }

        return (
            <button 
                className="flex items-center gap-1 bg-purple-100 text-purple-950 font-medium px-3 py-1 border-2 border-purple-950 rounded-md text-sm"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                {label}
                <ChevronDown size={14} className="ml-1" />
            </button>
        );
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2">
            <div className="flex items-center gap-3 flex-wrap">
                <div className="w-8 h-8 rounded-full bg-purple-950 text-white flex items-center justify-center text-sm">
                    {getInitials(team.name)}
                </div>
                <span className="font-medium truncate max-w-[150px] sm:max-w-none">{team.name}</span>
                <button 
                    className="p-[5px] bg-purple-200 hover:bg-purple-100 rounded-full"
                    onClick={() => onEditTeam(team)}
                >
                    <img src={EditLogo} alt="Edit" className="h-2 w-2" />
                </button>
            </div>

            {/* Permission dropdown */}
            <div className="relative self-start sm:self-auto" ref={dropdownRef}>
                {renderPermissionButton()}

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-40 bg-purple-100 rounded-md shadow-lg z-10 border text-purple-950 font-medium border-gray-200">
                        <div className="py-1">
                            {['Admin', 'Can edit', 'Can view'].map((perm) => (
                                <button
                                    key={perm}
                                    onClick={() => {
                                        onPermissionChange(team.id, perm);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left"
                                >
                                    {perm === 'Admin' ? 'Admin' : perm === 'Can edit' ? 'Can edit' : 'Can view'}
                                    {team.permission === perm && (
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

const TeamsList = ({ teams, setTeams, onEditTeam }) => {
    const handlePermissionChange = (teamId, newPermission) => {
        setTeams((prev) =>
            prev.map((team) =>
                team.id === teamId ? { ...team, permission: newPermission } : team
            )
        );
    };

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mx-2 sm:mx-4">
            <div className="space-y-3">
                {teams.map((team) => (
                    <TeamItem
                        key={team.id}
                        team={team}
                        onPermissionChange={handlePermissionChange}
                        onEditTeam={onEditTeam}
                    />
                ))}
            </div>
        </div>
    );
};

export default TeamsList;
