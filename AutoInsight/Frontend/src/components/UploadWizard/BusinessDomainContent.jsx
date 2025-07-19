/* eslint-disable react/prop-types */
import { chooseDomain } from "../../services/Api_Services";
import { useSelector } from "react-redux";

const BusinessDomainContent = ({ businessDomain, onDomainChange, onNext }) => {
  const theme = useSelector((state) => state.theme.mode);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      // Call the API service function
      const response = await chooseDomain(businessDomain, token);
      console.log("Response Session: ", response.data.body.sessionId);
      localStorage.setItem("sessionId", response.data.body.sessionId);
      onNext();
    } catch (error) {
      console.error("An error occurred:", error);
      if (error.response) {
        console.error("Full error response:", error.response.data);
      } else {
        console.error("No response received, possible network error or CORS issue.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className={`text-2xl font-bold mb-2 ${theme === "light" ? "text-purple-950" : "text-purple-200"}`}>
        Choose Business Domain
      </h2>
      <p className={`text-sm mb-6 ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
        Begin your dashboard creation by choosing the business domain that best represents your organization.
        This selection helps tailor your dashboard to industry-specific metrics and insights.
      </p>

      <div className="space-y-2 mb-8">
        <label className={`flex items-center space-x-2 font-bold ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
          <input 
            type="radio" 
            name="domain" 
            value="ecommerce"
            checked={businessDomain === 'ecommerce'}
            onChange={() => onDomainChange('ecommerce')}
            className="accent-purple-500"
          />
          <span>Ecommerce</span>
        </label>
        <label className={`flex items-center space-x-2 font-bold ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
          <input 
            type="radio" 
            name="domain" 
            value="education"
            checked={businessDomain === 'education'}
            onChange={() => onDomainChange('education')}
            className="accent-purple-500"
          />
          <span>Education</span>
        </label>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit"
          className={`px-6 py-2 rounded-md ${theme === "light" ? "bg-purple-700 text-white hover:bg-purple-800" : "bg-purple-500 text-white hover:bg-purple-600"}`}
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default BusinessDomainContent;
