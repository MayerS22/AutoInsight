/* eslint-disable react/prop-types */
/* eslint-disable no-useless-escape */
import { useState } from "react";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import CloseIcon from "../../assets/Close.svg";


const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({ show: false, type: "", message: "" });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Reset form when modal closes
    const handleClose = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
        setNotification({ show: false, type: "", message: "" });
        onClose();
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate current password
        if (!currentPassword.trim()) {
            newErrors.currentPassword = "Current password is required";
        }

        // Enhanced password validation for new password
        if (!newPassword.trim()) {
            newErrors.newPassword = "New password is required";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters long";
        } else if (!/[A-Z]/.test(newPassword)) {
            newErrors.newPassword = "Password must contain at least one capital letter";
        } else if (!/[0-9]/.test(newPassword)) {
            newErrors.newPassword = "Password must contain at least one number";
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
            newErrors.newPassword = "Password must contain at least one special character";
        }

        // Validate new password doesn't match current password
        if (newPassword === currentPassword && newPassword.trim()) {
            newErrors.newPassword = "New password must be different from current password";
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (confirmPassword !== newPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChangePassword = async () => {
        setNotification({ show: false, type: "", message: "" });

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            // Get auth token from localStorage or context
            const token = localStorage.getItem("token");

            if (!token) {
                setNotification({
                    show: true,
                    type: "error",
                    message: "You must be logged in to change your password"
                });
                setIsLoading(false);
                return;
            }

            // eslint-disable-next-line no-unused-vars
            const response = await axios.patch(
                `http://localhost:3000/api/v1/auth/change-password`,
                {
                    oldPassword: currentPassword,
                    newPassword,

                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(response);
            

            setNotification({
                show: true,
                type: "success",
                message: "Your password has been successfully changed"
            });

            // Clear form
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // Auto close modal after successful password change (optional)
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.message ||
                "Password change failed. Please verify your current password and try again.";

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

    // Toggle password visibility functions
    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // If modal is not open, don't render anything
    if (!isOpen) return null;

    return (
        <>
            {/* Modal backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                {/* Modal container */}
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 z-50 relative">
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        aria-label="Close"
                    >
                        <img src={CloseIcon} alt="Close" className="w-7 h-7" />
                    </button>

                    {/* Modal content */}
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-center mb-6 text-purple-900">
                            Change Password
                        </h2>

                        {notification.show && (
                            <div className={`mb-6 p-4 rounded-lg ${notification.type === "success" ? "bg-green-100 border-l-4 border-green-500" : "bg-red-100 border-l-4 border-red-500"}`}>
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
                                    <button onClick={closeNotification} className="ml-auto text-gray-500 hover:text-gray-700">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-purple-950 mb-1">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.currentPassword ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter current password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    onClick={toggleCurrentPasswordVisibility}
                                >
                                    {showCurrentPassword ? (
                                        <AiOutlineEye className="h-5 w-5" />
                                    ) : (
                                        <AiOutlineEyeInvisible className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-purple-950 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.newPassword ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    onClick={toggleNewPasswordVisibility}
                                >
                                    {showNewPassword ? (
                                        <AiOutlineEye className="h-5 w-5" />
                                    ) : (
                                        <AiOutlineEyeInvisible className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                            <p className="mt-1 text-xs text-gray-500">
                                Use 8+ characters with at least one capital letter, number, and special character
                            </p>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-950 mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
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

                        <div className="flex space-x-3">
                            <button
                                onClick={handleClose}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-purple-900 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleChangePassword}
                                disabled={isLoading}
                                className="flex-1 bg-purple-800 hover:bg-purple-900 text-white font-medium py-2 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:bg-purple-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Updating..." : "Change Password"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangePasswordModal;