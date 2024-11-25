import React from "react";
import HowItWorks from "./HowWorks.jsx";
import AboutUs from "./AboutUs.jsx";
import Home from "./Home.jsx";

const HomePage = () => {
  return (
    <div className="bg-purple-50 min-h-screen relative flex flex-col">
      <Home/>
      <HowItWorks />
      <AboutUs />
    </div>
  );
};

export default HomePage;
