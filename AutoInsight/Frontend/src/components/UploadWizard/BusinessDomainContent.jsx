/* eslint-disable react/prop-types */

const BusinessDomainContent = ({ businessDomain, onDomainChange, onNext }) => {
  return (
    <>
      <h2 className="text-2xl font-medium text-purple-700 mb-2">Choose Business Domain</h2>
      <p className="text-sm text-gray-600 mb-6">
        Begin your dashboard creation by choosing the business domain that best represents your organization.
        This selection helps tailor your dashboard to industry-specific metrics and insights.
      </p>

      <div className="space-y-2 mb-8">
        <label className="flex items-center space-x-2">
          <input 
            type="radio" 
            name="domain" 
            value="ecommerce"
            checked={businessDomain === 'ecommerce'}
            onChange={() => onDomainChange('ecommerce')}
            className="text-purple-700"
          />
          <span>Ecommerce</span>
        </label>
        <label className="flex items-center space-x-2">
          <input 
            type="radio" 
            name="domain" 
            value="hr"
            checked={businessDomain === 'hr'}
            onChange={() => onDomainChange('hr')}
            className="text-purple-700"
          />
          <span>HR</span>
        </label>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={onNext}
          className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default BusinessDomainContent;
