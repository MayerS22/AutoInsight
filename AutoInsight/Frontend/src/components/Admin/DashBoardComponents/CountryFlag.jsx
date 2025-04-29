/* eslint-disable react/prop-types */
const CountryFlag = ({ countryCode }) => {
    // Use the countryCode to create a URL to a flag image from a flag API
    const flagUrl = `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
    
    
    return (
      <div className="flex items-center">
        <img 
          src={flagUrl}
          alt={`${countryCode} flag`}
          className="w-6 h-4 object-cover border border-gray-300"
        />
      </div>
    );
  };
  
  export default CountryFlag;