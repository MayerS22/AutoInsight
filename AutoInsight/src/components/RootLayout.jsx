import React from "react";
import Header from "./HomePage/HomePageComponents/Header";
import { Outlet } from "react-router-dom";

const RootLayout = ({ isLoggedIn, setIsLoggedIn }) => {

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Outlet context={{ isLoggedIn, setIsLoggedIn }}/>
    </div>
  );
};

export default RootLayout;