/* eslint-disable no-unused-vars */
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:3000/api/v1";

// Fetch user profile data
export const fetchUserProfile = async (token) => {
  if (!token) return null;
  
  try {
    const response = await axios.get(`${API_BASE_URL}/users/user-data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data.body;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Fetch all datasets (owned and shared)
export const fetchAllDatasets = async (token) => {
  if (!token) return { ownedDatasets: [], sharedDatasets: [] };
  
  try {
    const [datasetsResponse, sharedDatasetsResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/datasets`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_BASE_URL}/datasets/shared`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
    
    // Mark main datasets as owned by the user
    const mainDatasets = datasetsResponse.data?.body?.datasets || [];
    const updatedMainDatasets = mainDatasets.map((dataset) => ({
      ...dataset,
      permission: "owner",
      canRename: true,
      canManagePermissions: true,
      canDelete: true,
    }));
    
    // Process shared datasets and assign permission flags
    const sharedDatasetEntries = sharedDatasetsResponse.data?.body || [];
    const sharedPermissionsMap = {};
    sharedDatasetEntries.forEach((entry) => {
      sharedPermissionsMap[entry.dataset_id] = entry.permission;
    });
    
    const sharedDatasetIds = sharedDatasetEntries.map((entry) => entry.dataset_id);
    const sharedDatasetDetailsPromises = sharedDatasetIds.map((id) =>
      axios.get(`${API_BASE_URL}/datasets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
    
    const sharedDatasetDetailsResponses = await Promise.allSettled(
      sharedDatasetDetailsPromises
    );
    
    const sharedDatasets = sharedDatasetDetailsResponses
      .filter((response) => response.status === "fulfilled")
      .map((response) => {
        const dataset = response.value.data.body.dataset;
        const permission = sharedPermissionsMap[dataset._id] || "view";
        return {
          ...dataset,
          shared_permission: permission,
          canRename: permission === "admin" || permission === "edit",
          canManagePermissions: permission === "admin" || permission === "edit",
          canDelete: false,
          shared: true,
        };
      });
    
    return {
      ownedDatasets: updatedMainDatasets,
      sharedDatasets,
      ownerId: datasetsResponse.data.body.user._id,
    };
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while fetching the datasets.",
      confirmButtonColor: "#E53E3E",
    });
    
    return { ownedDatasets: [], sharedDatasets: [] };
  }
}; 