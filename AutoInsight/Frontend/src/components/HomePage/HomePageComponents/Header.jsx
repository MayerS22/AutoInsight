/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions, marginActions, themeActions } from "../../../store/index";
import { fetchUserProfile } from "../../../services/Api_Services";
import RobotImg from "../../../assets/Robot.svg";
import DarkRobotImg from "../../../assets/DarkRobot.svg";
import LogoutLogo from "../../../assets/Logout.svg";
import ProfileLogo from "../../../assets/Profile.svg";
import notificationLogo from "../../../assets/notification.svg";
import MobileNotification from "../MobileNotification";
import ToggleSwitch from "./ToggleSwitch";
import "@theme-toggles/react/css/Classic.css"
import { Classic } from "@theme-toggles/react"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const profilePicture = useSelector((state) => state.auth.profilePicture);
  const username = useSelector((state) => state.auth.username);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null); // New state for user photo
  const margin = useSelector((state) => state.margin.margin);
  const color = useSelector((state) => state.margin.color);
  const isAdded = useSelector((state) => state.margin.isAdded);
  const id = useSelector((state) => state.auth.id);
  const [activeOption, setActiveOption] = useState("");
  const theme = useSelector((state) => state.theme.mode);
  // Initialize isToggled based on the current theme
  const [isToggled, setToggle] = useState(theme === "dark");
  const token = localStorage.getItem("token");
  

  // Sync isToggled with theme changes
  useEffect(() => {
    setToggle(theme === "dark");
  }, [theme]);

  // Call fetchUserProfile inside useEffect when the component mounts or user logs in
  useEffect(() => {
    fetchUserProfile(token, authActions, dispatch);
  }, [profilePicture]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (isNotificationOpen && !event.target.closest(".notification-dropdown")) {
        setIsNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  function handleLoginClick() {
    setIsMobileMenuOpen(false);
    navigate("/login", { state: { isSignUp: false } });
  }

  function handleSignUpClick() {
    setIsMobileMenuOpen(false);
    navigate("/signup", { state: { isSignUp: true } });
  }

  function handleLogout() {
    setIsMobileMenuOpen(false);
    dispatch(authActions.logout());
    dispatch(authActions.isAdmin(false));
    const token = localStorage.getItem("token");
    console.log(token);
    navigate("/login");
  }

  function handleNavigation(path) {
    setIsMobileMenuOpen(false);
    navigate(path);
  }

  function handleThemeToggle() {
    const newTheme = theme === "light" ? "dark" : "light";
    dispatch(themeActions.toggleTheme(newTheme));
  }

  return (
    <header
      className={`w-full py-5 px-4 md:px-24 flex justify-between items-center fixed top-0 left-0 ${theme === "light" ? color : "bg-dark-background"} z-50`}
    >
      <button onClick={() => {
        navigate("/home")
        setActiveOption("")
      }}>
        {/* Logo and Title */}
        <div className={`flex items-center space-x-2 ${margin}`}>
          <div className="w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center mt-5">
            <img
              src={theme === "light" ? RobotImg : DarkRobotImg}
              alt="Robot Icon"
              className="w-full h-full object-cover mb-4"
            />
          </div>
          <h1 className={`px-2 font-bold ${theme === "light" ? "text-purple-900" : "text-purple-300"} text-xl md:text-2xl`}>
            AutoInsight
          </h1>
        </div>
      </button>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`md:hidden ${theme === "light" ? "text-purple-900" : "text-light-text"} p-2`}
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          {isMobileMenuOpen ? (
            <>
              <span className={`absolute w-6 h-0.5 ${theme === "light" ? "bg-purple-900" : "bg-dark-text"} transform rotate-45`}></span>
              <span className={`absolute w-6 h-0.5 ${theme === "light" ? "bg-purple-900" : "bg-dark-text"} transform -rotate-45`}></span>
            </>
          ) : (
            <>
              <span className={`w-6 h-1 ${theme === "light" ? "bg-purple-900" : "bg-dark-text"} mb-1`}></span>
              <span className={`w-6 h-1 ${theme === "light" ? "bg-purple-900" : "bg-dark-text"} mb-1`}></span>
              <span className={`w-6 h-1 ${theme === "light" ? "bg-purple-900" : "bg-dark-text"}`}></span>
            </>
          )}
        </div>
      </button>

      {isAdmin ? <button
        onClick={handleLogout}
        className="flex items-center space-x-2 mt-3"
      >
        <img src={LogoutLogo} alt="Logout Icon" className="w-8 h-8" />

      </button> : <>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => {
              handleNavigation("/home");
              setActiveOption("home");
            }}
            className={`${theme === "light" ? "text-purple-900 hover:text-purple-700" : "text-purple-400 hover:text-accent"} ${activeOption === 'home' ? "underline" : ""}`}
          >
            Home
          </button>
          {isLoggedIn && <button
            onClick={() => {
              handleNavigation("/dashboards");
              setActiveOption("dashboards");
            }}
            className={`${theme === "light" ? "text-purple-900 hover:text-purple-700" : "text-purple-400 hover:text-accent"} ${activeOption === 'dashboards' ? "underline" : ""}`}
          >
            Dashboards
          </button>}
          <button
            onClick={() => {
              handleNavigation("/about-us");
              setActiveOption("about-us");
            }}
            className={`${theme === "light" ? "text-purple-900 hover:text-purple-700" : "text-purple-400 hover:text-accent"} ${activeOption === 'about-us' ? "underline" : ""}`}
          >
            About Us
          </button>
          <button
            onClick={() => {
              handleNavigation("/faq");
              setActiveOption("faq");
            }}
            className={`${theme === "light" ? "text-purple-900 hover:text-purple-700" : "text-purple-400 hover:text-accent"} ${activeOption === 'faq' ? "underline" : ""}`}
          >
            FAQ
          </button>
          <button
            onClick={() => {
              handleNavigation("/contact");
              setActiveOption("contact");
            }}
            className={`${theme === "light" ? "text-purple-900 hover:text-purple-700" : "text-purple-400 hover:text-accent"} ${activeOption === 'contact' ? "underline" : ""}`}
          >
            Contact
          </button>

          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="relative flex items-center justify-center mr-3">
                <Classic
                  style={{
                    color: theme === "light" ? "#693696" : "#CEB4E4",
                    transform: "scale(2.2)",

                  }}
                  toggled={isToggled}
                  toggle={() => handleThemeToggle()}
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => {
                    if (location.pathname === "/notification") {
                      handleNavigation('/');
                      setIsNotificationOpen(prev => !prev);
                      dispatch(marginActions.isMobile(false));
                    }
                    else {
                      setIsNotificationOpen(prev => !prev);
                      dispatch(marginActions.isMobile(false));
                    }
                    setActiveOption("")

                  }}
                  className="flex items-center"
                >
                  <img src={notificationLogo} alt="notification-logo" className="w-8 h-8" />
                </button>
                <div className="notification-dropdown">
                  <MobileNotification
                    isOpen={isNotificationOpen}
                    onClose={() => setIsNotificationOpen(false)}
                  />
                </div>
              </div>
              <div className="relative flex items-center">
                <button
                  onClick={() => {
                    handleNavigation("/profile");
                    setActiveOption("");
                  }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="flex items-center"
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="User Photo"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={ProfileLogo}
                      alt="Profile Icon"
                      className="w-8 h-8 cursor-pointer"
                    />
                  )}

                  {/* Username appears when hovering */}
                  {isHovering && (
                    <span className={`ml-2 ${theme === "light" ? "text-purple-900" : "text-dark-text"} font-bold text-md`}>
                      {username}
                    </span>
                  )}
                </button>
              </div>

              {isAdded && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <img src={LogoutLogo} alt="Logout Icon" className="w-8 h-8" />
                </button>
              )}
              {!isAdded && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <img src={LogoutLogo} alt="Logout Icon" className="w-8 h-8" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLoginClick}
                className={`text-white border-2 border-purple-900 bg-purple-900 hover:bg-transparent hover:text-purple-900
                  rounded-lg px-6 py-2 transition duration-300`}
              >
                Login
              </button>
              <button
                onClick={handleSignUpClick}
                className={`${theme === "light" 
                  ? "text-purple-900 border-2 border-purple-900 hover:bg-purple-900 hover:text-white" 
                  : "text-purple-400 border-2 border-purple-400 hover:bg-purple-400 hover:text-dark-background"} 
                  rounded-lg px-6 py-2 transition duration-300`}
              >
                SignUp
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`absolute top-full left-0 right-0 ${theme === "light" ? "bg-purple-50" : "bg-dark-background"} shadow-lg md:hidden`}>

            <div className="flex flex-col p-4 space-y-4">

              <button
                onClick={() => {
                  handleNavigation("/home");
                  setActiveOption("home");
                }}
                className={`${theme === "light" ? "text-purple-900 hover:text-purple-700" : "text-purple-400 hover:text-accent"} text-left ${activeOption === 'home' ? "underline" : ""}`}
              >
                Home
              </button>
              {isLoggedIn && <button
                onClick={() => {
                  handleNavigation("/dashboards");
                  setActiveOption("dashboards");
                }}
                className={`${theme === "light" ? "text-purple-900 hover:text-purple-700" : "text-purple-400 hover:text-accent"} text-left ${activeOption === 'dashboards' ? "underline" : ""}`}
              >
                Dashboards
              </button>}
              <button
                onClick={() => {
                  handleNavigation("/about-us");
                  setActiveOption("about-us");
                }}
                className={`${theme === "light" ? "text-purple-900 hover:text-purple-700" : "text-purple-400 hover:text-accent"} text-left ${activeOption === 'about-us' ? "underline" : ""}`}
              >
                About Us
              </button>
              
              <button
                onClick={() => {
                  handleNavigation("/faq");
                  setActiveOption("faq");
                }}
                className={`${theme === "light" ? "text-purple-900 hover:text-purple-700" : "text-purple-400 hover:text-accent"} text-left ${activeOption === 'faq' ? "underline" : ""}`}
              >
                FAQ
              </button>
              <button
                onClick={() => {
                  handleNavigation("/contact");
                  setActiveOption("contact");
                }}
                className={`${theme === "light" ? "text-purple-900 hover:text-purple-700" : "text-purple-400 hover:text-accent"} text-left ${activeOption === 'contact' ? "underline" : ""}`}
              >
                
                Contact
              </button>

              {isLoggedIn && (
                <>
                  <div className="relative">

                    <button
                      onClick={() => {
                        dispatch(marginActions.isMobile(true))
                        handleNavigation("/notification")
                        setIsNotificationOpen(prev => !prev);
                        setActiveOption("");
                      }}
                      className="flex items-center space-x-2"
                    >
                      <img src={notificationLogo} alt="notification-logo" className="w-8 h-8" />
                      <span className={`${theme === "light" ? "text-purple-900" : "text-purple-400"} font-bold text-sm`}>
                        Notifications
                      </span>
                    </button>
                  </div>
                  <div className="relative group flex items-center space-x-2">

                    <button
                      onClick={() => {
                        handleNavigation("/profile");
                        setActiveOption("");
                      }}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="flex items-center"
                    >
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt="User Photo"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <img
                          src={ProfileLogo}
                          alt="Profile Icon"
                          className="w-8 h-8 cursor-pointer"
                        />
                      )}

                      {/* Username appears when hovering (mobile) */}
                      {(
                        <span className={`ml-2 ${theme === "light" ? "text-purple-900" : "text-purple-400"} font-bold text-md`}>
                          {username}
                        </span>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 mt-3"
                  >
                    <img src={LogoutLogo} alt="Logout Icon" className="w-8 h-8" />
                    <span className={`${theme === "light" ? "text-purple-900" : "text-purple-400"} font-bold text-xs`}>
                      Logout
                    </span>
                  </button>
                </>
              )}
              {!isLoggedIn && (
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={handleLoginClick}
                    className={`${theme === "light" 
                      ? "text-white border-2 border-purple-900 bg-purple-900 hover:bg-transparent hover:text-purple-900" 
                      : "text-dark-background border-2 border-purple-400 bg-purple-400 hover:bg-transparent hover:text-purple-300"} 
                      rounded-lg px-6 py-2 transition duration-300 w-full`}
                  >
                    Login
                  </button>
                  <button
                    onClick={handleSignUpClick}
                    className={`${theme === "light" 
                      ? "text-purple-900 border-2 border-purple-900 hover:bg-purple-900 hover:text-white" 
                      : "text-purple-400 border-2 border-purple-400 hover:bg-purple-400 hover:text-dark-background"} 
                      rounded-lg px-6 py-2 transition duration-300 w-full`}
                  >
                    SignUp
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </>}
    </header>
  );
}