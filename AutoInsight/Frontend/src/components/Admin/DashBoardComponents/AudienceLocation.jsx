/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { memo, useEffect, useState } from "react";
import CountryFlag from "./CountryFlag";
import { fetchTopCountries } from "../Services/Admin_API";
import countries from "world-countries";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const AudienceLocation = ({ setTooltipContent }) => {
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [errorLoadingCountries, setErrorLoadingCountries] = useState(false);
  const [topCountries, setTopCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const data = await fetchTopCountries();
        const formattedCountries = countries.map((country) => ({
          value: country.cca2,
          label: country.name.common,
          code: country.cca2.toLowerCase(),
        }));

        const cleaned = data
          .filter((c) => c.country && c.country !== "not provided")
          .map((c) => {
            const matchedCountry = formattedCountries.find(
              (fc) => fc.value === c.country.toUpperCase()
            );
            return {
              code: c.country.toUpperCase(),
              name: matchedCountry ? matchedCountry.label : c.country,
              flagCode: c.country.toLowerCase(),
              count: c.count,
            };
          });
          console.log(cleaned);
          

        setTopCountries(cleaned);
      } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Unknown error";
        console.error("Error fetching top countries:", message);
        setErrorLoadingCountries(true);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="md:col-span-7 bg-white rounded-lg">
      <h2 className="text-lg font-bold mb-4">Audience Location</h2>

      <div className="flex flex-col md:flex-row">
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
                  const isoCode = geo.properties.name;                      
                  const isHighlighted = topCountries.some(
                    (c) => c.name === isoCode
                  );
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      data-tooltip-id="map-tooltip"
                      data-tooltip-content={geo.properties.name}
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

        <div className="w-full md:w-52 mt-28 ml-4">
          <h3 className="text-purple-800 font-bold mb-3">Top Countries</h3>
          <div className="space-y-3">
            {topCountries.map((country) => (
              <div key={country.code} className="flex items-center">
                <CountryFlag countryCode={country.flagCode} />
                <span className="ml-2">{country.name} </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AudienceLocation);
