/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../../store/index";
import RobotImg from "../../../assets/Robot.svg";
import LogoutLogo from "../../../assets/Logout.svg";
import ProfileLogo from "../../../assets/Profile.svg";
import axios from "axios";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const profilePicture = useSelector((state) => state.auth.profilePicture);
  const [username, setUserName] = useState("");
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState(null); // New state for user photo
  const margin = useSelector((state) => state.margin.margin);
  const color = useSelector((state) => state.margin.color);
  const isRemoved = useSelector((state) => state.margin.isRemoved);
  const isAdded = useSelector((state) => state.margin.isAdded);
  const id= useSelector((state) => state.auth.id);

 
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    setIsProfileLoading(true); // Set loading to true when fetching starts
    try {
      const response = await axios.get("http://localhost:3000/api/v1/users/user-data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(authActions.addProfilePicture(response.data.body.profile_picture));
      setUserName(response.data.body.username);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    } finally {
      setIsProfileLoading(false); // Set loading to false when fetching is done
    }
  };
  
  // Call fetchUserProfile inside useEffect when the component mounts or user logs in
  useEffect(() => {
    fetchUser();
  }, [profilePicture]);


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
    const token = localStorage.getItem('token');
    console.log(token);
    navigate("/login");
  }

  function handleNavigation(path) {
    setIsMobileMenuOpen(false);
    navigate(path);
  }

  return (
    <header
      className={`w-full py-4 px-4 md:px-8 flex justify-between items-center fixed top-0 left-0 ${color} z-50`}
    >
      {/* Logo and Title */}
      <div className={`flex items-center space-x-2 ${margin}`}>
        <div className="w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center mt-5">
          <img
            src={RobotImg}
            alt="Robot Icon"
            className="w-full h-full object-cover mb-4"
          />
        </div>
        <h1 className="px-2 font-bold text-purple-900 text-xl md:text-2xl">
          AutoInsight
        </h1>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden text-purple-900 p-2"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          {isMobileMenuOpen ? (
            <div className="relative w-6 h-6">
              <span className="absolute w-6 h-0.5 bg-purple-900 transform rotate-45"></span>
              <span className="absolute w-6 h-0.5 bg-purple-900 transform -rotate-45"></span>
            </div>
          ) : (
            <>
              <span className="w-6 h-0.5 bg-purple-900 mb-1"></span>
              <span className="w-6 h-0.5 bg-purple-900 mb-1"></span>
              <span className="w-6 h-0.5 bg-purple-900"></span>
            </>
          )}
        </div>
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        <button
          onClick={() => handleNavigation("/home")}
          className="text-purple-900 hover:text-purple-700 hover:underline"
        >
          Home
        </button>
        <button
          onClick={() => handleNavigation("/dashboards")}
          className="text-purple-900 hover:text-purple-700 hover:underline"
        >
          Dashboards
        </button>
        <button
          onClick={() => handleNavigation("/about-us")}
          className="text-purple-900 hover:text-purple-700 hover:underline"
        >
          About Us
        </button>
        <button
          onClick={() => handleNavigation("/reviews")}
          className="text-purple-900 hover:text-purple-700 hover:underline"
        >
          Reviews
        </button>
        <button
          onClick={() => handleNavigation("/contact")}
          className="text-purple-900 hover:text-purple-700 hover:underline"
        >
          Contact
        </button>
        
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center">
              <button
                onClick={() => {
                  handleNavigation("/profile");
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
                  <span className="ml-2 text-purple-900 font-bold text-md">
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
              className="text-white border-2 border-purple-900 bg-purple-900 rounded-lg px-6 py-2 hover:bg-transparent hover:text-purple-900 transition duration-300"
            >
              Login
            </button>
            <button
              onClick={handleSignUpClick}
              className="text-purple-900 border-2 border-purple-900 rounded-lg px-6 py-2 hover:bg-purple-900 hover:text-white transition duration-300"
            >
              SignUp
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-purple-50 shadow-lg md:hidden">
          <div className="flex flex-col p-4 space-y-4">
            <button
              onClick={() => handleNavigation("/home")}
              className="text-purple-900 hover:text-purple-700 text-left"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("/dashboards")}
              className="text-purple-900 hover:text-purple-700 text-left"
            >
              Dashboards
            </button>
            <button
              onClick={() => handleNavigation("/about-us")}
              className="text-purple-900 hover:text-purple-700 text-left"
            >
              About Us
            </button>
            <button
              onClick={() => handleNavigation("/reviews")}
              className="text-purple-900 hover:text-purple-700 text-left"
            >
              Reviews
            </button>
            <button
              onClick={() => handleNavigation("/contact")}
              className="text-purple-900 hover:text-purple-700 text-left"
            >
              Contact
            </button>

            {isLoggedIn ? (
              <div>
                <div className="relative group flex items-center space-x-2">
                  <button 
                    onClick={() => handleNavigation("/profile")}
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
                    {isHovering && (
                      <span className="ml-2 text-purple-900 font-bold text-md">
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
                  <span className="text-purple-900 font-bold text-xs">
                    Logout
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleLoginClick}
                  className="text-white border-2 border-purple-900 bg-purple-900 rounded-lg px-6 py-2 hover:bg-transparent hover:text-purple-900 transition duration-300 w-full"
                >
                  Login
                </button>
                <button
                  onClick={handleSignUpClick}
                  className="text-purple-900 border-2 border-purple-900 rounded-lg px-6 py-2 hover:bg-purple-900 hover:text-white transition duration-300 w-full"
                >
                  SignUp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}