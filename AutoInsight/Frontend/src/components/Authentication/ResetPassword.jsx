/* eslint-disable no-useless-escape */
import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({ show: false, type: "", message: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { token } = useParams();

    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        // Enhanced password validation
        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        } else if (!/[A-Z]/.test(password)) {
            newErrors.password = "Password must contain at least one capital letter";
        } else if (!/[0-9]/.test(password)) {
            newErrors.password = "Password must contain at least one number";
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            newErrors.password = "Password must contain at least one special character";
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleResetPassword = async () => {
        setNotification({ show: false, type: "", message: "" });

        // Validate form
        if (!validateForm()) {
            return;
        }

        if (!token) {
            setNotification({
                show: true,
                type: "error",
                message: "Invalid reset token. Please request a new password reset link."
            });
            return;
        }

        setIsLoading(true);
        try {
            // eslint-disable-next-line no-unused-vars
            const response = await axios.post(
                `http://localhost:3000/api/v1/auth/reset-password/`,
                {
                    token,
                    newPassword: password,
                }
            );

            setNotification({
                show: true,
                type: "success",
                message: "Your password has been successfully reset"
            });

            // Clear form
            setPassword("");
            setConfirmPassword("");

            // After successful reset, navigate to login
            setTimeout(() => {
                navigate("/login");
            }, 3000);

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

    // Close notification
    const closeNotification = () => {
        setNotification({ show: false, type: "", message: "" });
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Toggle confirm password visibility
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            {notification.show && (
                <div className={`fixed top-4 right-4 left-4 md:w-96 md:right-4 md:left-auto p-4 rounded-lg shadow-md ${notification.type === "success" ? "bg-green-100 border-l-4 border-green-500" : "bg-red-100 border-l-4 border-red-500"
                    }`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            {notification.type === "success" ? (
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                            <span className={notification.type === "success" ? "text-green-800" : "text-red-800"}>
                                {notification.message}
                            </span>
                        </div>
                        <button onClick={closeNotification} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-purple-900">
                    Reset Password
                </h2>
                <p className="text-purple-850 mb-6 text-center">
                    Please enter your new password below.
                </p>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-purple-950 mb-1">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.password ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <AiOutlineEye className="h-5 w-5" />

                            ) : (<AiOutlineEyeInvisible className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    <p className="mt-1 text-xs text-gray-500">
                        Use 8 or more characters with at least one capital letter, a number, and a special character
                    </p>
                </div>

                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-950 mb-1">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            onClick={toggleConfirmPasswordVisibility}
                        >
                            {showConfirmPassword ? (
                               <AiOutlineEye className="h-5 w-5" />
                            ) : (
                                 <AiOutlineEyeInvisible className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                <button
                    onClick={handleResetPassword}
                    disabled={isLoading || !token}
                    className="w-full bg-purple-800 hover:bg-purple-900 text-white font-medium py-2 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:bg-purple-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Resetting..." : "Reset Password"}
                </button>

                <div className="mt-6 text-center">
                    <button onClick={() => navigate("/login")} className="text-sm text-purple-950 hover:text-purple-800 underline">
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;