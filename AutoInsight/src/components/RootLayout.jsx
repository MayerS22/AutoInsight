import React from "react";
import Header from "./HomePage/HomePageComponents/Header";
import { Outlet } from "react-router-dom";

const RootLayout = ({ isLoggedIn, setIsLoggedIn }) => {
  console.log("RootLayout isLoggedIn:", isLoggedIn); // Debugging

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Outlet />
    </div>
  );
};

export default RootLayout;