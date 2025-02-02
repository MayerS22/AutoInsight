import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Home from "./Home.jsx";
import HowItWorks from "./HowWorks.jsx";
import AboutUs from "./AboutUs.jsx";

const HomePage = () => {
  const homeRef = useRef(null);
  const howItWorksRef = useRef(null);
  const aboutUsRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/home") {
      homeRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (location.pathname === "/how-it-works") {
      howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (location.pathname === "/about-us") {
      aboutUsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <div className="bg-purple-50 min-h-screen relative flex flex-col">
      <div ref={homeRef} className="min-h-screen">
        <Home />
      </div>
      <div ref={howItWorksRef} className="min-h-screen">
        <HowItWorks />
      </div>
      <div ref={aboutUsRef} className="min-h-screen">
        <AboutUs />
      </div>
    </div>
  );
};

export default HomePage;
