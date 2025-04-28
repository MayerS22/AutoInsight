import axios from "axios";

const API_URL = "http://localhost:3000";

// Get authentication token
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Fetch total cleaned datasets count
export const fetchTotalCleanedDatasets = async () => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };

  const response = await axios.get(
    `${API_URL}/api/v1/datasets/cleaned-datasets-count`,
    config
  );

  return response.data?.body ?? 0;
};

// Fetch total generated dashboards count
export const fetchTotalGeneratedDashboards = async () => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };

  const response = await axios.get(
    `${API_URL}/api/v1/datasets/generated_dashboards_no`,
    config
  );

  return response.data?.body ?? 0;
};

// Fetch total number of users  
// Updated endpoint to match the app.js mounting: /api/v1/users/users-no
export const fetchNumberOfUsers = async () => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };

  const response = await axios.get(
    `${API_URL}/api/v1/users/users-no`,
    config
  );

  return response.data?.body ?? 0;
};
