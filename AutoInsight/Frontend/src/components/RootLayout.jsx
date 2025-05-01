import Header from "./HomePage/HomePageComponents/Header";

import { Outlet } from "react-router-dom";
import { fetchUserProfile } from "../services/Api_Services";
import { useEffect } from "react";
import { authActions } from "../store";
import { useDispatch } from "react-redux";

// eslint-disable-next-line react/prop-types
const RootLayout = () => {
  const dispatch=useDispatch();
  const token = localStorage.getItem("token");
  useEffect(()=>{
   
    fetchUserProfile(token,authActions,dispatch);

  }, [dispatch, token])

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default RootLayout;