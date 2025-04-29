/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { marginActions, authActions } from "../../store/index";
import { NotLoggedIn } from "../NotLoggedIn";
import ProfilePictureComponent from "./ProfilePicture";
import UploadDatasetComponent from "./UploadDataset";
import { Allignment } from "./Allignment";
import InfoField from "./InfoField";
import { fetchUserProfile, getUserTeams } from "../../services/Api_Services";
import PasswordIcon from "../../assets/PasswordIcon.svg";
import EmailIcon from "../../assets/EmailIcon.svg";
import DateIcon from "../../assets/DateIcon.svg";
import TeamsIcon from "../../assets/TeamsIcon.svg";
import EditPasswordIcon from "../../assets/EditPasswordIcon.svg";
import JobIcon from "../../assets/Job.svg";
import CreateTeamIcon from "../../assets/CreateTeamIcon.svg";
import CreateTeamModal from "./CreateTeamModal";
import Teams from "./Teams";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../Authentication/ChangePasswordModal.jsx";


const DatasetPage = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const profilePicture = useSelector((state) => state.auth.profilePicture);
  const createdAt = useSelector((state) => state.auth.dateCreated);
  const dateCreated = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
    const email = useSelector((state) => state.auth.email);
  const country = useSelector((state) => state.auth.country);
  const jobTitle = useSelector((state) => state.auth.jobTitle);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const loggedInUserEmail = useSelector((state) => state.auth.email);
  const [memberPermissions, setMemberPermissions] = useState({});

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);


  useEffect(() => {
    dispatch(marginActions.setColor("bg-white"));
    dispatch(marginActions.removeUserName());
    dispatch(marginActions.addLogoutIcon());

    return () => {
      dispatch(marginActions.setMargin(""));
      dispatch(marginActions.setColor("bg-purple-50"));
      dispatch(marginActions.addUserName());
      dispatch(marginActions.removeLogoutIcon());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile(token, authActions, dispatch);
    }
  }, [isLoggedIn, dispatch, token]);


  useEffect(() => {
    const fetchDatasets = async () => {
      setLoading(true);  // Set loading to true when fetch starts

      try {
        const response = await getUserTeams(token);
        const teamsData = response.data.body;
        console.log("Fetched teams data:", teamsData);

        const permissionsRef = {};  // Use useRef to store permissions

        const teams = teamsData.map((team) => {
          const ownerEmail = team.owner.email;

          // Filter out the logged-in user and owner from the team members
          const filteredMembers = team.members.filter(
            (member) => member.email !== ownerEmail && member.email !== loggedInUserEmail
          );

          // Set permissions for the logged-in user
          if (team.owner.email === loggedInUserEmail) {
            permissionsRef[team._id] = "owner";
          } else {
            const userMember = team.members.find((member) => member.email === loggedInUserEmail);
            if (userMember) {
              permissionsRef[team._id] = team.memberPermission;
            }
          }

          return {
            ...team,
            members: filteredMembers, // Include only relevant members
          };
        });

        // Update the teams state
        setTeams(teams);

        // Directly update the permissions without waiting for re-renders
        setMemberPermissions(permissionsRef);

      } catch (error) {
        console.error("Error fetching datasets:", error);
      } finally {
        setLoading(false);  // Set loading to false when fetch finishes
      }
    };

    fetchDatasets();
  }, [token, loggedInUserEmail]);  // Dependency on token and logged-in user email





  const handleCreateTeam = () => {
    setShowCreateTeamModal(true);
  };

  const handleCreateTeamSubmit = (teamData) => {
    setTeams((prev) => {
      if (teamData.id) {
        // Update existing team
        return prev.map((team) =>
          team.id === teamData.id ? { ...team, ...teamData } : team
        );
      } else {
        // Add new team
        const newTeam = {
          ...teamData,
          id: prev.length + 1, // Generate a new ID
        };
        return [...prev, newTeam];
      }
    });
    setSelectedTeam(null);
  };

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
  };

  const handleViewTeam = (teamId) => console.log("View team clicked:", teamId);

  const handleViewPhoto = () => {
    if (profilePicture) window.open(profilePicture, "_blank");
    setShowProfileModal(false);
  };

  const openChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const closeChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  if (!isLoggedIn) return <NotLoggedIn />;

  const accountCreatedDate = "March 01, 2025";

  return (
    <Allignment>
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="w-full lg:w-1/4 flex flex-col gap-4 sm:gap-6">
            <div className="cursor-pointer relative mx-auto lg:mx-0 w-32 sm:w-40 lg:w-full max-w-xs">
              <ProfilePictureComponent
                profilePicture={profilePicture}
                onProfileUpdate={fetchUserProfile}
              />
            </div>
            <UploadDatasetComponent />
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-3/4 flex flex-col gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 flex flex-col gap-4 rounded-lg">
              <InfoField icon={EmailIcon} label="Email" value={email} />
              <InfoField icon={JobIcon} label="Job title" value={jobTitle} />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <InfoField
                  icon={PasswordIcon}
                  label="Password"
                  value="••••••••••••••"
                />
                <button
                  onClick={openChangePasswordModal}
                  className="mt-2 sm:mt-0 bg-purple-950 hover:bg-purple-700 text-white text-xs px-3 py-2 rounded flex items-center self-start sm:self-auto"
                >
                  <img src={EditPasswordIcon} alt="Edit" className="h-3 w-3 mr-2" />
                  Change Password
                </button>
              </div>

              <InfoField
                icon={DateIcon}
                label="Account Created"
                value={dateCreated}
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <InfoField
                  icon={TeamsIcon}
                  label="Teams"
                  value="•••••••••••••••••"
                />
                <button
                  onClick={handleCreateTeam}
                  className="mt-2 sm:mt-0 bg-purple-950 hover:bg-purple-700 text-white text-xs px-4 py-2 rounded flex items-center self-start sm:self-auto"
                >
                  <img src={CreateTeamIcon} alt="Create" className="h-4 w-4 mr-2" />
                  Create Team
                </button>
              </div>
            </div>

            {/* Teams Section with Proper Margin */}
            <div className="mt-[-12px]">
              <Teams
                teams={teams}
                setTeams={setTeams} // Pass setTeams to allow updating permissions
                onEditTeam={handleEditTeam}
                loading={loading} // Pass loading state to Teams component
                memberPermissions={memberPermissions} // Pass memberPermissions to Teams component
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateTeamModal && (
        <CreateTeamModal
          onClose={() => setShowCreateTeamModal(false)}
          setTeams={setTeams}
        />
      )}
      {selectedTeam && (
        <CreateTeamModal
          onClose={() => setSelectedTeam(null)}
          onCreateTeam={handleCreateTeamSubmit}
          teamData={selectedTeam}
          setTeams={setTeams}
          disableDashboardInput={true}
        />
      )}
      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={closeChangePasswordModal}
      />
    </Allignment>
  );
};

export default DatasetPage;
