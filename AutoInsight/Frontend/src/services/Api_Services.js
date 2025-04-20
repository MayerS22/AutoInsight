/* eslint-disable no-useless-catch */
// Api_Services.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

/*{Choosing the Domain (E-commerce , HR)}*/
export const chooseDomain = async (domainType, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/datasets/choose-domain/`,
      { domainType },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/*{Choosing Clean only or Clean and Generate}*/
export const processOptions = async (processingOption, downloadAfterCreating, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/datasets/processing-options/`,
      {
        analysis_option: processingOption,
        download_after_creating: downloadAfterCreating // Match backend naming convention
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/user-data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const generateInsights = async (token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/datasets/generate-insights`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/* to search for users to give permissions */
export const searchUsers = async (username) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/search?username=${username}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/* for granting access to users */
export const grantAccessToUsers = async (users, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/datasets/grant-access/`,
      {
        userPermissions: users.map(user => ({
          userId: user._id,
          permission: user.access,
        })),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/* Uploading Dataset */
export const uploadDataset = async (file, token, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_BASE_URL}/datasets/upload/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      onUploadProgress,
    }
  );
  return response;
};

/* Sending a Chatbot Message */
export const sendChatbotMessage = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/chatbot/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUserProfile = async (token,authActions,dispatch) => {
  if (!token) return;
  try {
    const response = await axios.get(
      "http://localhost:3000/api/v1/users/user-data",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    dispatch(authActions.addProfilePicture(response.data.body.profile_picture));
    dispatch(authActions.addUsername(response.data.body.username));
    dispatch(authActions.addEmail(response.data.body.email));
    dispatch(authActions.addID(response.data.body._id));
    
    localStorage.setItem("userId", response.data.body._id);    
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};
