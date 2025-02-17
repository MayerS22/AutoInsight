import React from "react";
import DatasetItem from "./DatasetItem";

const DashboardSection = ({
  dashboardList,
  handleDownload,
  handleDelete,
  handlePermissionClick,
  clickedDashboardId,
  hoveredDashboardId,
  setHoveredDashboardId,
}) => {
  return (
    <div className="w-full max-w-[1700px] mt-8">
      <h2 className="text-2xl font-bold text-purple-900">My Dashboards</h2>
      <h3 className="text-sm text-gray-600 mt-2">Recent dashboards</h3>
      <ul className="space-y-4">
        {dashboardList.map((dataset, idx) => (
          <DatasetItem
            key={dataset._id || dataset.id || idx}
            dataset={dataset}
            handleDownload={handleDownload}
            handleDelete={handleDelete}
            handlePermissionClick={handlePermissionClick}
            clickedDashboardId={clickedDashboardId}
            hoveredDashboardId={hoveredDashboardId}
            setHoveredDashboardId={setHoveredDashboardId}
          />
        ))}
      </ul>
    </div>
  );
};

export default DashboardSection;