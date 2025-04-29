import axios from "axios";

const API_URL = "http://localhost:3000";

// Get token from localStorage or sessionStorage
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Create axios config with Authorization header
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

// Fetch total number of cleaned datasets
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

// Fetch total number of generated dashboards
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

// Fetch recent users (updated)
export const fetchRecentUsers = async () => {
  try {
    const config = createAuthConfig();
    const response = await axios.get(`${API_URL}/api/v1/users/recent-4-users`, config);
    //console.log("API Response:", response.data);  // still good for debug

    let users = [];
    if (response.data?.body && Array.isArray(response.data.body)) {
      users = response.data.body;  // Correct: get users from body
    }

    return users;
  } catch (error) {
    console.error("Error fetching recent users:", error.response?.data || error.message);
    return [];
  }
};




// Fetch domain counts
export const fetchDomainCount = async () => {
  try {
    const config = createAuthConfig();
    const response = await axios.get(
      `${API_URL}/api/v1/datasets/domains-count`,
      config
    );
    return response.data?.body ?? { ecommerce: 0, education: 0 };
  } catch (error) {
    console.error("Error fetching domain counts:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch top job titles
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

export const fetchUserGrowthData = async () => {
  try {
    const config = createAuthConfig();
    const response = await axios.get(`${API_URL}/api/v1/users/users-months`, config);
    //console.log("API Response:", response.data);  // Log the response
    return response.data?.body ?? [];
  } catch (error) {
    console.error("Error fetching user growth data:", error);
    throw error;
  }
};


// Fetch the review counts
export const fetchReviewsCounts = async () => {
  try {
    // If you need authentication headers, add them here. For simplicity, they are omitted.
    const response = await axios.get(`${API_URL}/api/v1/reviews/reviews_stats`);
    // Assuming the API returns the counts in the response.data.body
    return response.data?.body;
  } catch (error) {
    console.error("Error fetching review counts:", error);
    throw error;
  }
};


export const fetchAllReviews = async (page = 1, limit = 10) => {
  try {
    const config = createAuthConfig();
    const response = await axios.get(
      `${API_URL}/api/v1/reviews?page=${page}&limit=${limit}`,
      config
    );
    // Assuming the API returns reviews in response.data.body
    return response.data?.body || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};