/* eslint-disable react/prop-types */
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { memo } from "react";
import CountryFlag from "./CountryFlag";
import countryNameToCode from "../../../services/countryCode";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// DUMMY ARRAY OF TOP COUNTRIES
const topCountries = [
  { id: "EGY", name: "Egypt", flagCode: "EG" },
  { id: "ARE", name: "United Arab Emirates", flagCode: "AE" },
  { id: "USA", name: "USA", flagCode: "US" },
  { id: "CAN", name: "Canada", flagCode: "CA" },
  { id: "RUS", name: "Russia", flagCode: "RU" },
  { id: "ATA", name: "Antarctica", flagCode: "AQ" }, // Added Antarctica
];

const AudienceLocation = ({ setTooltipContent }) => {
  return (
    <div className="md:col-span-7 bg-white rounded-lg">
      {/* Heading */}
      <h2 className="text-lg font-bold mb-4">Audience Location</h2>

      <div className="flex flex-col md:flex-row">
        {/* Map container */}
        <div className="flex-grow">
          <ComposableMap
            projectionConfig={{ scale: 160 }}
            style={{ height: "500px" }}
            className="w-full h-auto"
            projection="geoNaturalEarth1"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryCode = countryNameToCode[geo.properties.name]; // ex: "USA"
                  const isHighlighted = topCountries.some(
                    (c) => c.id === countryCode
                  ); // is it one of our top?
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      data-tooltip-id="map-tooltip" // associate with Tooltip
                      data-tooltip-content={geo.properties.name} // show name
                      onMouseEnter={() => setTooltipContent(geo.properties.name)}
                      onMouseLeave={() => setTooltipContent("")}
                      style={{
                        default: {
                          fill: isHighlighted ? "#4A266A" : "#d9d9d9",
                          stroke: "#FFFFFF",
                          strokeWidth: 1.5,
                          outline: "none",
                        },
                        hover: {
                          fill: isHighlighted ? "#2e1541" : "#c4c4c4",
                          outline: "none",
                        },
                        pressed: {
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        {/* Top Countries container */}
        <div className="w-full md:w-52 mt-28 ml-4">
          <h3 className="text-purple-800 font-bold mb-3">Top Countries</h3>
          <div className="space-y-3">
            {topCountries.map((country) => (
              <div key={country.id} className="flex items-center">
                <CountryFlag countryCode={country.flagCode} />
                <span className="ml-2">{country.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AudienceLocation);