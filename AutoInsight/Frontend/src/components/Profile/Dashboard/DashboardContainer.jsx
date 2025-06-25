import PropTypes from 'prop-types';
import TabNavigation from './TabNavigation';
import { useSelector } from 'react-redux';

const DashboardContainer = ({ children, tabs, activeTab, setActiveTab }) => {
  const theme = useSelector((state) => state.theme.mode);
  return (
    <div className="w-full max-w-[2000px] mt-8 " >
      <h2 className={`text-2xl font-bold ${theme === "light" ? "text-purple-900" : "text-dark-text"}`}>Dashboards</h2>
      <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {children}
    </div>
  );
};

DashboardContainer.propTypes = {
  children: PropTypes.node.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default DashboardContainer; 