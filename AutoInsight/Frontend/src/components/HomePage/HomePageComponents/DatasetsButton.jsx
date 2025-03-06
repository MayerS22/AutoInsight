/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const DatasetsButton = ({ children, isLoggedIn, setShowUploadingDashboard, setShowCleaningDashboard, actionType, ...props }) => {
    const navigate = useNavigate();

    const handleAction = () => {
        if (!isLoggedIn) {
            Swal.fire({
                title: "You must be logged in to proceed",
                text: "Redirecting to login page...",
                icon: "warning",
                confirmButtonText: "OK",
            }).then(() => navigate("/login"));
            return;
        }
    
        if (actionType === "upload") {
            setShowUploadingDashboard(true);
            setShowCleaningDashboard(false); // Ensure cleaning mode is OFF
        } else if (actionType === "clean") {
            setShowUploadingDashboard(true);
            setShowCleaningDashboard(true);  // Activate cleaning mode
        }
    };
    
    return (
        <button onClick={handleAction} {...props} >
            {children}
        </button>
    );
};

export default DatasetsButton;
