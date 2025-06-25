import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import DashboardItem from './DashboardItem';

const DashboardContent = ({
  isDashboardLoading,
  filteredDashboards,
  activeTab,
  username,
  handleEditDashboardName,
  handlePermissionClick,
  clickedDashboardId,
  popupRef,
  downloadCleanedDataset,
  handleDownloadModule,
  handleDeleteDataset,
  setHoveredDashboardId,
}) => {
  if (isDashboardLoading) {
    return <LoadingSpinner type="dashboardList" message="Loading dashboards..." />;
  }

  if (filteredDashboards.length === 0) {
    return <EmptyState activeTab={activeTab} />;
  }

  return (
    <ul className="space-y-4 mt-4">
      {filteredDashboards.map((dataset) => (
        <DashboardItem
          key={dataset._id}
          dataset={dataset}
          username={username}
          activeTab={activeTab}
          handleEditDashboardName={handleEditDashboardName}
          handlePermissionClick={handlePermissionClick}
          clickedDashboardId={clickedDashboardId}
          popupRef={popupRef}
          downloadCleanedDataset={downloadCleanedDataset}
          handleDownloadModule={handleDownloadModule}
          handleDeleteDataset={handleDeleteDataset}
          setHoveredDashboardId={setHoveredDashboardId}
        />
      ))}
    </ul>
  );
};

DashboardContent.propTypes = {
  isDashboardLoading: PropTypes.bool.isRequired,
  filteredDashboards: PropTypes.array.isRequired,
  activeTab: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  handleEditDashboardName: PropTypes.func.isRequired,
  handlePermissionClick: PropTypes.func.isRequired,
  clickedDashboardId: PropTypes.string,
  popupRef: PropTypes.object,
  downloadCleanedDataset: PropTypes.func.isRequired,
  handleDownloadModule: PropTypes.func.isRequired,
  handleDeleteDataset: PropTypes.func.isRequired,
  setHoveredDashboardId: PropTypes.func.isRequired,
};

export default DashboardContent;