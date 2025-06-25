/* eslint-disable react/prop-types */
// components/shared/InfoField.jsx
import { useSelector } from 'react-redux';
const InfoField = ({ icon, label, value, button, children }) => {
  const theme = useSelector((state) => state.theme.mode);
  return (
    <div className="flex items-center mb-4">
      <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-3">
        <img src={icon} alt={`${label} Icon`} className="h-4 w-4" />
      </div>
      <div className="flex flex-row flex-wrap items-center">
        <span className={`text-sm ${theme === "light" ? "text-purple-950" : " text-white"} font-bold mr-4`}>{label}:</span>
        <span className={`text-sm ${theme === "light" ? "text-purple-950 " : "text-white"}`}>{label === "Teams" ? "" : value}</span>
        {button && <div className="ml-auto">{button}</div>}
        {children}
      </div>
    </div>
  );
};

export default InfoField;
