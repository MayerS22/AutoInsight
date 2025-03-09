import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  
  const navigate = useNavigate();
  
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendEmail = async () => {
    // Reset error state
    setErrors("");
    setNotification({ show: false, type: "", message: "" });

    // Validate email
    if (!email.trim()) {
      setErrors("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setErrors("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/forgot-password",
        { email }
      );
      
      setNotification({
        show: true,
        type: "success",
        message: "Password reset instructions have been sent to your email"
      });
      
      // Clear email field after successful submission
      setEmail("");
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.message || 
                          "Something went wrong. Please try again.";
      
      setNotification({
        show: true,
        type: "error",
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value) => {
    setEmail(value);
    if (errors) setErrors("");
    if (notification.show) setNotification({ show: false, type: "", message: "" });
  };

  // Close notification
  const closeNotification = () => {
    setNotification({ show: false, type: "", message: "" });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      {notification.show && (
        <div className={`fixed top-4 right-4 left-4 md:w-96 md:right-4 md:left-auto p-4 rounded-lg shadow-md ${
          notification.type === "success" ? "bg-green-100 border-l-4 border-green-500" : "bg-red-100 border-l-4 border-red-500"
        }`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {notification.type === "success" ? (
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
              )}
              <span className={notification.type === "success" ? "text-green-800" : "text-red-800"}>
                {notification.message}
              </span>
            </div>
            <button onClick={closeNotification} className="text-gray-500 hover:text-gray-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-900">
          Forgot Password
        </h2>
        <p className="text-purple-850 mb-6 text-center">
          Enter your email address and we&rsquo;ll send you instructions to reset your password.
        </p>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-purple-950 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="your@email.com"
            value={email}
            onChange={(event) => handleInputChange(event.target.value)}
            disabled={isLoading}
          />
          {errors && <p className="mt-1 text-sm text-red-600">{errors}</p>}
        </div>
        
        <button
          onClick={handleSendEmail}
          disabled={isLoading}
          className="w-full bg-purple-800 hover:bg-purple-900 text-white font-medium py-2 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:bg-purple-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send Email"}
        </button>
        
        <div className="mt-6 text-center">
          <button onClick={() => navigate("/login")} className="text-sm text-purple-950 hover:text-purple-800 underline">
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;