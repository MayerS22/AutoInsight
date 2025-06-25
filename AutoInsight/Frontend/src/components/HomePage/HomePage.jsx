import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Home from "./Home.jsx";
import HowItWorks from "./HowWorks.jsx";
import AboutUs from "./AboutUs.jsx";
import Reviews from "./Reviews.jsx";
import Contact from "./Contact.jsx";
import FAQ from "./FAQ.jsx";
import ScrollFadeIn from "./HomePageComponents/ScrollFadeIn.jsx";
import { useSelector } from "react-redux";

const HomePage = () => {
  const homeRef = useRef(null);
  const howItWorksRef = useRef(null);
  const aboutUsRef = useRef(null);
  const reviewsRef = useRef(null);
  const contactRef = useRef(null);
  const faqRef = useRef(null);
  const location = useLocation();
  const theme = useSelector((state) => state.theme.mode);
  useEffect(() => {
    if (location.pathname === "/home") {
      homeRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (location.pathname === "/how-it-works") {
      howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (location.pathname === "/about-us") {
      aboutUsRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (location.pathname === "/reviews") {
      reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (location.pathname === "/contact") {
      contactRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (location.pathname === "/faq") {
      faqRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <div className=" min-h-screen relative flex flex-col">
      <div
        ref={homeRef}
        className={`${
          theme === "light" ? "bg-purple-50" : "bg-dark-background"
        } min-h-screen`}
      >    
          <Home />
      </div>
      <div ref={howItWorksRef} className="min-h-screen">
        <ScrollFadeIn>
          <HowItWorks />
        </ScrollFadeIn>
      </div>
      <div ref={aboutUsRef} className="min-h-screen">
        <ScrollFadeIn>
          <AboutUs />
        </ScrollFadeIn>
      </div>
      <div
        ref={reviewsRef}
        className={`min-h-screen scroll-mt-24 ${
          theme === "light" ? "bg-purple-50" : "bg-dark-text-secondary"
        }`}
      >
        <ScrollFadeIn>
          <Reviews />
        </ScrollFadeIn>
      </div>
      <div
        ref={faqRef}
        className={`min-h-screen scroll-mt-36 ${
          theme === "light" ? "bg-purple-50" : "bg-dark-text-secondary"
        }`}
      >
        <ScrollFadeIn>
          <FAQ />
        </ScrollFadeIn>
      </div>
      <div ref={contactRef} className="h-auto">
        <ScrollFadeIn>
          <Contact />
        </ScrollFadeIn>
      </div>
    </div>
  );
};

export default HomePage;
