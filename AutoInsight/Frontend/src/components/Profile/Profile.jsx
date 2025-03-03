 
 
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { marginActions, authActions } from "../../store/index";
import { NotLoggedIn } from "../NotLoggedIn";
import axios from "axios";
import ProfilePictureComponent from "./ProfilePicture";
import UploadDatasetComponent from "./UploadDataset";
import DashboardListComponent from "./DashboardList";
import { Allignment } from "./Allignment";

const DatasetPage = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const profilePicture = useSelector((state) => state.auth.profilePicture);
  const token = localStorage.getItem("token");
  const [refreshDashboardTrigger, setRefreshDashboardTrigger] = useState(0);
  

  // Layout effects
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

  // User profile data fetch
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const fetchUserProfile = async () => {
    if (!token) return;
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/users/user-data",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(authActions.addProfilePicture(response.data.body.profile_picture));
      dispatch(authActions.addUsername(response.data.body.username));
      dispatch(authActions.addID(response.data.body.id));
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const triggerDashboardRefresh = () => {
    setRefreshDashboardTrigger(prev => prev + 1);
  };

  if (!isLoggedIn) return <NotLoggedIn />;

  return (
   <Allignment>
      {/* Profile Section */}
      <ProfilePictureComponent 
      
        profilePicture={profilePicture} 
        onProfileUpdate={fetchUserProfile} 
        
      />
      
      {/* Upload Dataset Section */}
      <UploadDatasetComponent 
        onUploadSuccess={triggerDashboardRefresh} 
      />
      
      {/* Dashboard List Section */}
      <DashboardListComponent 
      isStandAlone={false}  
      refreshTrigger={refreshDashboardTrigger}
      />
   </Allignment>
    
   
  );
};

export default DatasetPage;