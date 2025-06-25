import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  const theme = useSelector((state) => state.theme.mode);
  
  return (
    <div className="mt-4 w-full overflow-x-auto">
      <div className="inline-flex rounded-lg shadow-sm overflow-hidden min-w-full sm:min-w-0">
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-2 sm:px-4 py-2 border text-sm sm:text-base whitespace-nowrap ${
              theme === "light" 
                ? "border-purple-600" 
                : "border-purple-400"
            } focus:outline-none ${
              activeTab === tab.key
                ? theme === "light" 
                  ? "bg-purple-900 text-white" 
                  : "bg-purple-800 text-purple-200"
                : theme === "light"
                  ? "bg-white text-purple-600 hover:bg-purple-100"
                  : "bg-dark-background text-white hover:bg-purple-950"
            } ${index === 0 ? "rounded-l-lg border-r-0" : ""} ${
              index === tabs.length - 1 ? "rounded-r-lg border-l-0" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

TabNavigation.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default TabNavigation;