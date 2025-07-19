/* eslint-disable no-unused-vars */
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import axios from "axios";

// Determine if a dataset is a cleaned dataset (no insights)
export const isCleanedDataset = (dataset) => {
  const insights = dataset.insights_urls;
  if (!insights) return true;
  for (const key in insights) {
    if (Array.isArray(insights[key]) && insights[key].length > 0) {
      return false;
    }
  }
  return true;
};

// Download insights as a zip file
export const downloadInsightsByFolder = async (insights) => {
  const zip = new JSZip();
  const chartTypes = Object.keys(insights);
  
  for (const chartType of chartTypes) {
    const urls = insights[chartType];
    if (Array.isArray(urls) && urls.length > 0) {
      const folder = zip.folder(chartType);
      for (let i = 0; i < urls.length; i++) {
        try {
          const res = await fetch(urls[i]);
          const blob = await res.blob();
          folder.file(`${chartType}_${i + 1}.jpg`, blob);
        } catch (error) {
          console.error(`Error fetching image from ${chartType}:`, urls[i], error);
        }
      }
    }
  }
  
  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, "insights_images.zip");
  });
};

// Download cleaned dataset as CSV
export const downloadCleanedDataset = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, "cleaned_dataset.csv");
    return true;
  } catch (error) {
    console.error("Error downloading CSV:", error);
    Swal.fire({
      icon: "error",
      title: "Download Error",
      text: "Could not download cleaned dataset.",
      confirmButtonColor: "#E53E3E",
    });
    return false;
  }
};

// Handle dashboard download options
export const handleDownloadModule = (dataset, downloadCleanedDataset, downloadInsightsByFolder) => {
  Swal.fire({
    title: "Download Options",
    html: `
      <div style="text-align: left;">
        <label style="display: block; margin-bottom: 10px;">
          <input type="radio" name="downloadType" value="cleaned" checked />
          Cleaned Dataset (CSV)
        </label>
        <label style="display: block;">
          <input type="radio" name="downloadType" value="insights" />
          Insights Images (ZIP)
        </label>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Download",
    preConfirm: () => {
      const selected = Swal.getPopup().querySelector(
        'input[name="downloadType"]:checked'
      ).value;
      return selected;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const selectedOption = result.value;
      if (selectedOption === "cleaned") {
        if (dataset.cleaned_dataset_url) {
          downloadCleanedDataset(dataset.cleaned_dataset_url);
        } else {
          Swal.fire({
            icon: "error",
            title: "No Cleaned Dataset",
            text: "No cleaned dataset URL available.",
            confirmButtonColor: "#E53E3E",
          });
        }
      } else if (selectedOption === "insights") {
        const insights = dataset.insights_urls;
        let hasInsights = false;
        if (insights && typeof insights === "object") {
          for (const key in insights) {
            if (Array.isArray(insights[key]) && insights[key].length > 0) {
              hasInsights = true;
              break;
            }
          }
        }
        if (hasInsights) {
          downloadInsightsByFolder(insights);
        } else {
          Swal.fire({
            icon: "error",
            title: "No Insights",
            text: "No insights images available.",
            confirmButtonColor: "#E53E3E",
          });
        }
      }
    }
  });
};

// Delete a dataset
export const deleteDataset = async (dataset, activeTab, token, setDashboardList, onDashboardDeleted) => {
  const itemType = activeTab === "cleaned" ? "Dataset" : "Dashboard";
  
  const result = await Swal.fire({
    title: `Delete ${itemType}!`,
    text: `Are you sure you want to delete this ${itemType}? This action cannot be undone!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#E53E3E",
    cancelButtonColor: "#4A266A",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
  });
  
  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:3000/api/v1/datasets/${dataset._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setDashboardList((prev) => prev.filter((d) => d._id !== dataset._id));
      
      if (typeof onDashboardDeleted === "function") {
        onDashboardDeleted(dataset._id);
      }
      
      Swal.fire({
        icon: "success",
        title: `${itemType} Deleted!`,
        text: `The ${itemType} has been removed successfully.`,
        confirmButtonColor: "#4A266A",
      });
      
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Deletion failed",
        text: "Unable to delete the dataset.",
        confirmButtonColor: "#E53E3E",
      });
      return false;
    }
  }
  
  return false;
};

// Rename a dashboard/dataset
export const renameDashboard = async (dashboard, itemType, token, fetchDatasets) => {
  const result = await Swal.fire({
    title: `Rename ${itemType}`,
    input: "text",
    inputLabel: `New ${itemType} name`,
    inputValue: dashboard.dataset_name,
    showCancelButton: true,
    confirmButtonText: "Save",
    confirmButtonColor: "#4A266A",
    preConfirm: (newName) => {
      if (!newName || newName.trim() === "") {
        Swal.showValidationMessage("Dashboard name cannot be empty.");
      }
      return newName;
    },
  });
  
  if (result.isConfirmed) {
    const newName = result.value;
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/datasets/${dashboard._id}`,
        { dataset_name: newName, user_id: dashboard.user_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchDatasets();
      
      Swal.fire({
        icon: "success",
        title: `${itemType} Renamed!`,
        text: `The ${itemType} name has been updated successfully.`,
        confirmButtonColor: "#4A266A",
      });
      
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Rename Failed",
        text: `The ${itemType} could not be renamed.`,
        confirmButtonColor: "#E53E3E",
      });
      return false;
    }
  }
  
  return false;
}; 