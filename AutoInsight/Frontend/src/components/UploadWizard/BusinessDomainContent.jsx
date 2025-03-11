/* eslint-disable react/prop-types */
import { chooseDomain } from "../../services/Api_Services";

const BusinessDomainContent = ({ businessDomain, onDomainChange, onNext }) => {
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
      <h2 className="text-2xl font-bold text-purple/500 mb-2">
        Choose Business Domain
      </h2>
      <p className="text-sm text-orig/600 mb-6">
        Begin your dashboard creation by choosing the business domain that best represents your organization.
        This selection helps tailor your dashboard to industry-specific metrics and insights.
      </p>

      <div className="space-y-2 mb-8">
        <label className="flex items-center space-x-2 font-bold text-orig/600">
          <input 
            type="radio" 
            name="domain" 
            value="ecommerce"
            checked={businessDomain === 'ecommerce'}
            onChange={() => onDomainChange('ecommerce')}
            className="accent-purple/500"
          />
          <span>Ecommerce</span>
        </label>
        <label className="flex items-center space-x-2 font-bold text-orig/600">
          <input 
            type="radio" 
            name="domain" 
            value="HR"
            checked={businessDomain === 'HR'}
            onChange={() => onDomainChange('HR')}
            className="accent-purple/500"
          />
          <span>Education</span>
        </label>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit"
          className="bg-purple/500 text-white px-6 py-2 rounded-md hover:bg-purple-900"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default BusinessDomainContent;
