/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';

const SocialButton = ({ icon, text, type }) => {
  const [error, setError] = useState(null); // To store any error message

  const handleLogin = () => {
    setError(null); // Reset error on new login attempt

    let url = '';

    if (type === "google") {
      url = "http://localhost:3000/api/v1/auth/google";
    } else if (type === "github") {
      url = "http://localhost:3000/api/v1/auth/github";
    } else if (type === "facebook") {
      url = "http://localhost:3000/api/v1/auth/facebook";
    }

    window.location.href = url;
  };

  return (
    <>
      <div className="flex justify-center">
        <button
          onClick={handleLogin}
          className="w-2/3 flex items-center justify-center border-purple-900 border p-2 rounded-lg hover:bg-gray-100"
        >
          <img src={icon} alt="" className={`mr-2 ${type === "github" ? "w-6 h-6 ml-1" : ""}`} /> {/* Logo aligned to the left with margin */}
          <span className="flex-grow text-center font-bold text-purple-900">{text}</span> {/* Text centered */}
        </button>
      </div>
      {error && <div className="text-red-500 mb-2 flex justify-center">{error}</div>} {/* Display error message if any */}
    </>
  );
};

export default SocialButton;
