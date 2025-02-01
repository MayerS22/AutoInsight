import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/HomePage/HomePageComponents/Header";
import Home from "./components/HomePage/Home";
import HowItWorks from "./components/HomePage/HowWorks.jsx";
import AboutUs from "./components/HomePage/AboutUs";

function MainPage() {
  // Create refs for each section
  const homeRef = useRef(null);
  const howItWorksRef = useRef(null);
  const aboutUsRef = useRef(null);
  const location = useLocation();

  // Scroll when route changes
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
    <>
      <Header />
      <div ref={homeRef} className="min-h-screen">
        <Home />
      </div>
      <div ref={howItWorksRef} className="min-h-screen">
        <HowItWorks />
      </div>
      <div ref={aboutUsRef} className="min-h-screen">
        <AboutUs />
      </div>
    </>
  );
}

export default MainPage;