import axios from "axios";

const API_URL = "http://localhost:3000";

// Get authentication token
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Create axios config with auth headers
const createAuthConfig = () => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    withCredentials: true
  };
};

// Fetch total cleaned datasets count
export const fetchTotalCleanedDatasets = async () => {
  try {
    const config = createAuthConfig();
    const response = await axios.get(
      `${API_URL}/api/v1/datasets/cleaned-datasets-count`,
      config
    );
    return response.data?.body ?? 0;
  } catch (error) {
    console.error("Error fetching cleaned datasets:", error);
    throw error;
  }
};

// Fetch total generated dashboards count
export const fetchTotalGeneratedDashboards = async () => {
  try {
    const config = createAuthConfig();
    const response = await axios.get(
      `${API_URL}/api/v1/datasets/generated_dashboards_no`,
      config
    );
    return response.data?.body ?? 0;
  } catch (error) {
    console.error("Error fetching generated dashboards:", error);
    throw error;
  }
};

// Fetch total number of users  
export const fetchNumberOfUsers = async () => {
  try {
    const config = createAuthConfig();
    const response = await axios.get(
      `${API_URL}/api/v1/users/users-no`,
      config
    );
    return response.data?.body ?? 0;
  } catch (error) {
    console.error("Error fetching number of users:", error);
    throw error;
  }
};


// Updated fetchRecentUsers function - replace your current implementation with this

export const fetchRecentUsers = async () => {
  try {
    const config = createAuthConfig();
    const response = await axios.get(
      `${API_URL}/api/v1/users/recent-4-users`,
      config
    );
    
    console.log("Full API response:", response);
    
    // Handle different API response structures
    let userData;
    
    if (response.data && response.data.body) {
      // If response has a body property (common pattern in Express APIs)
      userData = response.data.body;
    } else if (response.data && Array.isArray(response.data)) {
      // If response data is directly an array
      userData = response.data;
    } else if (response.data) {
      // If response data is something else
      userData = response.data;
    } else {
      console.error("Unexpected API response structure:", response);
      return [];
    }
    
    console.log("Extracted user data:", userData);
    return userData;
  } catch (error) {
    console.error("Error fetching recent users:", error);
    throw error;
  }
};

// Fetch domain counts for business domains from API
export const fetchDomainCount = async () => {
  try {
    const config = createAuthConfig();
    const response = await axios.get(
      `${API_URL}/api/v1/datasets/domains-count`,
      config
    );
    return response.data?.body ?? { ecommerce: 0, education: 0 };
  } catch (error) {
    console.error(
      "Error fetching domain counts:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch top job titles from API
export const fetchTopJobTitles = async () => {
  try {
    const config = createAuthConfig();
    const response = await axios.get(
      `${API_URL}/api/v1/users/jobs-count`,
      config
    );
    return response.data?.body ?? [];
  } catch (error) {
    console.error("Error fetching top job titles:", error);
    throw error;
  }
};