import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RobotImg from "../../../assets/Robot.svg"; // Update your path if necessary

export default function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  function handleLoginClick() {
    navigate("/login", { state: { isSignUp: false } });
  }

  function handleSignUpClick() {
    navigate("/signup", { state: { isSignUp: true } });
  }

  return (
    <header className="w-full py-4 px-8 flex justify-between items-center fixed top-0 left-0 bg-purple-50 shadow-md z-50">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center">
          <img src={RobotImg} alt="Robot Icon" className="w-full h-full object-cover" />
        </div>
        <h1 className="px-2 font-bold text-purple-900 text-2xl">Auto Insight</h1>
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-6">
        <button
          onClick={() => navigate("/home")}
          className="text-purple-900 hover:text-purple-700 hover:underline"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/how-it-works")}
          className="text-purple-900 hover:text-purple-700 hover:underline"
        >
          How It Works
        </button>
        <button
          onClick={() => navigate("/about-us")}
          className="text-purple-900 hover:text-purple-700 hover:underline"
        >
          About Us
        </button>

        {/* Sign In and Sign Up buttons with specific styles */}
        {!isLoggedIn && (
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
    </header>
  );
}