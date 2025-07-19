import Header from "./HomePage/HomePageComponents/Header";

import { Outlet } from "react-router-dom";
import { fetchUserProfile } from "../services/Api_Services";
import { useEffect } from "react";
import { authActions } from "../store";
import { useDispatch, useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
const RootLayout = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    fetchUserProfile(token, authActions, dispatch);
  }, [dispatch, token]);

  // Apply theme to html element for global styling
  useEffect(() => {
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${theme}`);
    
    // Set background color for body and html
    document.body.style.backgroundColor = theme === 'light' ? '#F3F6F9' : '#0D0713';
    document.documentElement.style.backgroundColor = theme === 'light' ? '#F3F6F9' : '#13082B';
  }, [theme]);

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-white" : "bg-dark-background"}`}>
      <Header />
      <Outlet />
    </div>
  );
};

export default RootLayout;