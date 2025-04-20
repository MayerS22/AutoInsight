/* eslint-disable react/prop-types */
import Select from "react-select";
import countries from "world-countries";

// Job Titles
const jobTitles = [
  { value: "business_analyst", label: "Business Analyst" },
  { value: "data_analyst", label: "Data Analyst" },
  { value: "data_engineer", label: "Data Engineer" },
  { value: "data_scientist", label: "Data Scientist" },
  { value: "product_analyst", label: "Product Analyst" },
  { value: "manager", label: "Manager" },
  { value: "others", label: "Others" },
];

// Format countries for react-select
const formattedCountries = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  code: country.cca2.toLowerCase(),
}));

// Custom styles for react-select
const customStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.selectProps.error ? "#f87171" : "#d1d5db",
    backgroundColor: state.selectProps.error ? "#fee2e2" : "#ffffff",
    padding: "2px",
    boxShadow: "none",
    "&:hover": {
      borderColor: state.selectProps.error ? "#f87171" : "#a78bfa",
    },
  }),
};

const OptionsSelector = ({ value, onChange, error, type = "country" }) => {
  const options = type === "country" ? formattedCountries : jobTitles;
  const labelText = type === "country" ? "Country" : "Job Title";

  const selectedOption = options.find((option) => option.value === value) || null;

  return (
    <div className="mb-8">
      <label className={`block font-bold mb-1 ${error ? "text-red-500" : "text-purple-800"}`}>
        {labelText}
      </label>

      <Select
        options={options}
        value={selectedOption}
        onChange={(selected) => onChange(selected?.value || "")}
        placeholder={`Select your ${labelText.toLowerCase()}`}
        styles={customStyles}
        error={!!error}
        className="text-left"
        getOptionLabel={(e) => (
          <div className="flex items-center gap-2">
            {type === "country" && (
              <img
                src={`https://flagcdn.com/w40/${e.code}.png`}
                alt={`${e.label} flag`}
                className="w-5 h-4 object-cover rounded-sm"
                loading="lazy"
              />
            )}
            <span>{e.label}</span>
          </div>
        )}
      />

      <p className={`text-red-500 text-sm mt-1 transition-opacity duration-200 ${error ? "opacity-100" : "opacity-0"}`}>
        {error}
      </p>
    </div>
  );
};

export default OptionsSelector;
