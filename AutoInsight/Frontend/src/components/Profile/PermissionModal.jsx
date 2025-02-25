/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { toast } from 'react-toastify';

const PermissionModal = ({ onClose, datasetId }) => {
  const [userEmail, setUserEmail] = useState(""); // State to hold user email
  const [loading, setLoading] = useState(false); // State to track loading status
  const [errorMessage, setError] = useState(""); // State to track error messages
  const [actionType, setActionType] = useState("grant"); // Track the action type (grant or revoke)
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState("");

  const fetchUserProfile = async () => {
    if (!token || !userEmail) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/users/user-id?email=${userEmail}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserId(response.data.body);
      setError(""); // Clear any previous errors
      return response.data.body;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      setError(error.response?.data?.message || "Failed to fetch user ID");
      return null;
    }
  };

  const handleGivePermission = async () => {
    setLoading(true);
    setError(""); // Reset error state before request

    if (!userEmail) {
      setError("Please provide a valid email.");
      setLoading(false);
      return;
    }

    const fetchedUserId = await fetchUserProfile();
    if (!fetchedUserId) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/datasets/${datasetId}/share/`,
        { user_id: fetchedUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Permission granted:", response.data);
      toast.success("Permission granted successfully!");
      setActionType("revoke");
    } catch (error) {
      console.log(error.response?.data);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message.includes("User already has access")
      ) {
        setError("This user already has access to the dataset.");
      } else {
        console.error("Error granting permission:", error);
        setError(error.response.data.message);
      }
    }
    setLoading(false);
  };

  const handleRevokePermission = async () => {
    setLoading(true);
    setError(""); // Reset error state before request
    console.log("user id "+userId);
    

    if (!userEmail) {
      setError("Please provide a valid email.");
      setLoading(false);
      return;
    }
    const fetchedUserId = await fetchUserProfile();
    console.log(token);
    

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/datasets/${datasetId}/share/`,
        {
          data: { user_id: fetchedUserId }, 
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      console.log("Permission revoked:", response.data);
      toast.success("Permission revoked successfully!");
      setActionType("grant");
    } catch (error) {
      console.log(error.response?.data);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message.includes("User does not have access")
      ) {
        setError("This user already does not have access.");
      } else {
        console.error("Error revoking permission:", error);
        setError("Failed to revoke permission. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-bold">Manage User Permissions</h2>
          <button className="text-gray-500 hover:text-gray-800" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

        {/* Search Input */}
        <div className="mt-4">
          <input
            type="email"
            placeholder="Enter user's email"
            value={userEmail}
            onChange={(e) => {
              setError("")
              setUserEmail(e.target.value)}}
            className="w-full px-4 py-2 border rounded-md text-gray-700"
            disabled={loading} // Disable input when loading
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-between">
          <button
            className={`bg-purple-900 text-white px-3 py-2 rounded-md hover:bg-green-500 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleGivePermission}
            disabled={loading || !userEmail.trim()} // Disable button while loading or empty input
          >
            {loading && actionType === "grant" ? "Granting..." : "Give Permission"}
          </button>

          <button
            className={`bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-500 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleRevokePermission}
            disabled={loading || !userEmail.trim()} // Disable button while loading or empty input
          >
            {loading && actionType === "revoke" ? "Revoking..." : "Revoke Permission"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;