/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import DashboardLogo from "../../assets/Dashboard.svg";
import DownloadLogo from "../../assets/Download.svg";
import TrashLogo from "../../assets/Trash.svg";
import OpenLogo from "../../assets/Open.svg";
import { useDispatch, useSelector } from "react-redux";
import { marginActions } from "../../store/index";
import { NotLoggedIn } from "../NotLoggedIn";
import Swal from 'sweetalert2'; // Import SweetAlert
import {dashboards} from "../../util/dashboard"


const DatasetPage = ({ userName = "User 1" }) => {
  const [clickedDashboardId, setClickedDashboardId] = useState(null);
  const [hoveredDashboardId, setHoveredDashboardId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dashboardList, setDashboardList] = useState(() => [...dashboards]);
  const allowedTypes = ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const fileInputRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    dispatch(marginActions.setColor("bg-white"));
    dispatch(marginActions.removeUserName());
    dispatch(marginActions.addLogoutIcon());
    return () => {
      dispatch(marginActions.setMargin(""));
      dispatch(marginActions.setColor("bg-purple-50"));
      dispatch(marginActions.addUserName());
      dispatch(marginActions.removeLogoutIcon());
    };
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setClickedDashboardId(null); // Hide the popup
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handlePermissionClick = (datasetId) => {
    setClickedDashboardId(datasetId === clickedDashboardId ? null : datasetId);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "Upload Successful!",
            text: `Your file "${file.name}" has been uploaded successfully.`,
            confirmButtonColor: "#6B46C1",
          });
        }, 500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid File Format",
          text: "Please upload a CSV, Excel (.xlsx), or JSON file.",
          confirmButtonColor: "#E53E3E",
        });
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E53E3E",
      cancelButtonColor: "#6B46C1",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setDashboardList((prevDashboards) => prevDashboards.filter((dashboard) => dashboard.id !== id));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The dashboard has been removed.",
          confirmButtonColor: "#6B46C1",
        });
      }
    });
  };
  return (
    <div className="flex flex-col min-h-screen items-center pt-16 mt-[50px] px-4">
      {/* Profile Section */}
      <div className="flex flex-col items-center mt-8 w-full max-w-md">
        <div className="w-24 h-24 md:w-40 md:h-40 bg-purple-600 text-white rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold">
          {getInitials(userName)}
        </div>
        <h2 className="text-xl font-bold mt-3 text-purple-900 text-center">{userName}</h2>
        <button onClick={handleUploadClick} className="mt-3 bg-purple-900 h-[50px] text-white px-5 font-bold py-2 rounded-md hover:bg-purple-700 w-full md:w-auto">
          Upload Dataset
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".csv, .xlsx"
        />
      </div>

      {/* Dashboard Section */}
      <div className="w-full max-w-[1700px] mt-8">
        <h2 className="text-2xl font-bold text-purple-900">My Dashboards</h2>
        <h3 className="text-sm text-gray-600 mt-2">Recent dashboards</h3>
        <ul className="space-y-4">
          {dashboardList.map((dataset) => (
            <li
              key={dataset.id}
              className="flex flex-col md:flex-row items-center p-4 bg-white rounded-lg hover:bg-slate-50 transition-all duration-200 w-full group"
              onMouseEnter={() => setHoveredDashboardId(dataset.id)}
              onMouseLeave={() => setHoveredDashboardId(null)}
              style={{ zIndex: hoveredDashboardId === dataset.id || clickedDashboardId === dataset.id ? 10 : 1 }}
            >
              {/* Left Side (Dataset Logo & Name) */}
              <div className="flex items-center gap-4 flex-1 w-full">
                <div className="bg-purple-200 p-3 rounded-md flex items-center justify-center w-12 h-12">
                  <img src={DashboardLogo} alt="Dataset logo" className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium">{dataset.name}</h4>
                  <p className="text-xs text-gray-500">{dataset.time}</p>
                </div>
              </div>

              {/* Middle Section (Dataset Name & Permissions) */}
              {/* Middle Section (Dataset Name & Permissions) */}
              <div className="flex flex-col md:flex-row flex-1 justify-center md:justify-start mt-4 md:mt-0 text-center md:text-left w-full items-center">
                {/* Fixed Width for Dataset Name */}
                <div className="text-purple-900 font-medium min-w-[150px] max-w-[150px] text-center truncate">
                  {dataset.datasetName}
                </div>

                {/* Users with Permission Button */}
                <button
                  className="text-purple-800 underline relative mt-2 md:mt-0 md:ml-48" // Adjust ml-10 for spacing
                  onClick={() => handlePermissionClick(dataset.id)}
                >
                 {dataset.usersWithPermission.length} users have permission
                  {clickedDashboardId === dataset.id && (
                    <div ref={popupRef} className="absolute top-full left-0 bg-purple-100 p-4 rounded-lg shadow-md z-50 w-full md:w-[173px]">
                      <ul>
                        {dataset.usersWithPermission.map((user, index) => (
                          <li key={index} className="text-purple-900 font-medium py-1 mt-3">
                            {user}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </button>
              </div>


              {/* Right Side (Buttons with Hover Popup) */}
              <div className="flex justify-center md:justify-end flex-1 mt-4 md:mt-0 w-full">
                <div className="relative group">
                  <button className="p-2 rounded-lg hover:bg-gray-200 transition">
                    <img src={DownloadLogo} alt="Download" className="w-6 h-6" />
                  </button>
                </div>
                <div className="relative group">
                  <button className="p-2 rounded-lg hover:bg-gray-200 transition">
                    <img src={OpenLogo} alt="Open" className="w-6 h-6" />
                  </button>
                </div>
                <div className="relative group">
                  <button onClick={()=>handleDelete(dataset.id)} className="p-2 rounded-lg hover:bg-red-200 transition">
                    <img src={TrashLogo} alt="Trash" className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DatasetPage;