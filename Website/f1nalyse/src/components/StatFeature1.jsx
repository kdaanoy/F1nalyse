// Imports used
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";

// Tyre colour mappings for compounds used in 2020 and later
const tyreColours = {
  SOFT: "#ff2e2e",
  MEDIUM: "#ffd800",
  HARD: "#ffffff",
  INTERMEDIATE: "#00ff00",
  WET: "#0066ff",
};

// Tyre colour mappings for compounds used in 2018 and 2019
const tyreColours2 = {
  HYPERSOFT: "#ffb4c4",
  ULTRASOFT: "#b34aa8",
  SUPERSOFT: "#ff2928",
  SOFT: "#fed311",
  MEDIUM: "#ffffff",
  HARD: "#00a3f3",
  SUPERHARD: "#ff803c",
  INTERMEDIATE: "#3ecc2e",
  WET: "#018dd2",
};

// Image mappings for tyre compounds used in 2020 and later
const tyreImages = {
  SOFT: `/photos/soft_tyres.png`,
  MEDIUM: `/photos/medium_tyres.png`,
  HARD: "/photos/hard_tyres.png",
  INTERMEDIATE: "/photos/intermediate_tyres.png",
  WET: "/photos/wet_tyres.png",
};

// Image mappings for tyre compounds used in 2018 and 2019
const tyreImages2 = {
  HYPERSOFT: "/photos/hypersoft_tyres.png",
  ULTRASOFT: "/photos/ultrasoft_tyres.png",
  SUPERSOFT: "/photos/supersoft_tyres.png",
  SOFT: "/photos/soft2_tyres.png",
  MEDIUM: "/photos/medium2_tyres.png",
  HARD: "/photos/hard2_tyres.png",
  SUPERHARD: "/photos/superhard_tyres.png",
  INTERMEDIATE: "/photos/intermediate_tyres.png",
  WET: "/photos/wet_tyres.png",
};

// Custom tooltip component for the bar chart
function CustomTooltip({ payload, label, active, activeYear }) {
  // If the tooltip is not active or there is no payload, return null
  if (!active || !payload?.length) 
    return null;

  // Filter through the tyre compounds and only display only if there is usage for that compounds greater than 0 laps
  const filterTyreUsage = payload.filter((entry) => entry.value > 0);
  // Otherwise return nothing
  if (!filterTyreUsage.length) 
    return null;

  // Set the mapping for the tyre compounds based on the year of the session
  const imageMap = Number(activeYear) > 2019 || activeYear == null ? tyreImages : tyreImages2;

  return (
    <div
      style={{
        backgroundColor: "#14131a",
        padding: 7,
        borderRadius: 10,
        color: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        zIndex: 999,
      }}
    >
      <p
        style={{ fontWeight: "bold", marginBottom: 5, fontFamily: "formula1" }}
      >
        {label}
      </p>

      {/* Go through the filtered tyre usage and display the tyre image, compound name and number of laps for the compound */}
      {filterTyreUsage.map((entry) => (
        <div
          key={entry.dataKey}
          style={{ display: "flex", alignItems: "center", marginBottom: 5 }}
        >
          <img
            src={imageMap[entry.dataKey] || "/soft_tyres.png"}
            alt={entry.dataKey}
            style={{ width: 40, height: 40, marginRight: 8 }}
          />
          <span className="font-titiliumbold">
            {entry.dataKey}: {entry.value} Laps
          </span>
        </div>
      ))}
    </div>
  );
}

// Style the custom label renderer for the bars in the bar chart
const renderCustomLabel = (data) => {
  const { value, x, y, width, height } = data;

  if (!value || width <= 0) 
    return null;

  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      fill="#000"
      fontSize={12}
      fontFamily="formula1bold"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {value}
    </text>
  );
};

// Pass in parameters for the laps and active year of the session to determine the tyre compounds used and the colour scheme for the chart
export default function StatFeature1({ laps, activeYear }) {

  // Debugging
  console.log(activeYear);
  
  // State to check if the user is hovering over the info icon
  const [hovered, setHovered] = useState(false);

  // Set the mapping for the tyre compounds based on the year of the session
  const compoundColours =
    Number(activeYear) > 2019 || activeYear == null
      ? tyreColours
      : tyreColours2;

  // Get all the distinct tyre compounds 
  const allCompounds = Object.keys(compoundColours);

  // Process the data to get the number of laps for each compouund for each driver 
  const processedData = laps.map((driver) => {

    // Count the number of laps for each compound 
    const counts = {};

    // Loop through all compounds
    allCompounds.forEach((compound) => {

      // Assign the number of laps for the compound
      counts[compound] = driver.laps.filter(
        (lap) => lap.tyre === compound,
      ).length;
    });

    // Return the driver name with the count of each compound
    return {
      driver: driver.driver,
      ...counts,
    };
  });

  // Debugging
  console.log(processedData);

  return (
    <div className="flex justify-center items-start pt-10 h-205">
      <div className="relative w-320 h-190 bg-[#14131a] brightness-125 shadow-[0_0_10px_#000000] rounded-[20px]">
        <div className="p-5 font-formula1bold text-[30px]">
          <p>Tyre Stints</p>
        </div>

        <div class="absolute top-5 right-5 flex flex-col items-end">

          {/* Display the info icon and check if the user is hovering over it, if the user is hovering over it then call the function setHovered to true
           otherwise, set to false*/}
          <button onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} >
            <FaCircleInfo
              className={`text-[20px] transition-all duration-200 cursor-pointer`}
            />
          </button>

          <div
            // Display the tooltip with the tyre information if the user is hovering over the info icon, otherwise hide it
            className={`mt-2 w-70 bg-[#14131a] brightness-125 text-black text-sm p-3 rounded-xl shadow-lg transition-all duration-500 origin-top-right border-[2px] border-white
            ${hovered
              // Z index is set to 50 to make sure the tooltip is above the bar chart and the opacity is set to make it visible or not
                ? "opacity-100 z-50"
                : "opacity-0 z-50"
              }`}
          >
            <p className="font-formula1bold text-white">Tyre Info</p>
            {/* Display the tyre compounds and their descriptions based on the year of the session, null is for when no year is selected and its the default */}
            {activeYear > 2019 || activeYear == null ?
              <p className="text-sm mt-3 text-white">
                <ul className="pl-5 gap-3 flex flex-col">
                  <li><span className="font-formula1bold">SOFT</span>: Highest grip, but but least durable.</li>
                  <li><span className="font-formula1bold">MEDIUM</span>: Balanced offering a mix of performance and durability.</li>
                  <li><span className="font-formula1bold">HARD</span>: Lowest grip but most durable.</li>
                  <li><span className="font-formula1bold">INTERMEDIATE</span>: For light damp wet conditions.</li>
                  <li><span className="font-formula1bold">WET</span>: Used in heavy rain, has deeper grooves for more water dispersion.</li>
                </ul>
              </p>
              : <p className="text-sm mt-3 text-white">
                <ul className="pl-5 gap-3 flex flex-col">
                  <li><span className="font-formula1bold">HYPERSOFT</span>: Highest grip, but least durable.</li>
                  <li><span className="font-formula1bold">ULTRASOFT</span>: High grip, but more durable than HYPERSOFT.</li>
                  <li><span className="font-formula1bold">SUPERSOFT</span>: Good grip and is perfect for qualifying.</li>
                  <li><span className="font-formula1bold">SOFT</span>: Balanced durability and performance.</li>
                  <li><span className="font-formula1bold">MEDIUM</span>: Complete balance of grip and durability.</li>
                  <li><span className="font-formula1bold">HARD</span>: Less grip than MEDIUM but more durable.</li>
                  <li><span className="font-formula1bold">SUPERHARD</span>: Lowest grip but most durable.</li>
                  <li><span className="font-formula1bold">INTERMEDIATE</span>: For light damp wet conditions.</li>
                  <li><span className="font-formula1bold">WET</span>: Used in heavy rain, has deeper grooves for more water dispersion.</li>
                </ul>
              </p>}
          </div>
        </div>

        <div>
          {/* The bar chart itself */}
          <ResponsiveContainer width="98%" height={650}>
            <BarChart
              layout="vertical"
              data={processedData}
              margin={{ top: 10, right: 40, left: 40, bottom: 10 }}
            >
              <XAxis type="number" fontFamily="formula1bold" />
              <YAxis
                interval={0}
                dataKey="driver"
                type="category"
                fontFamily="formula1bold"

                // Set the colour of the driver names on the y axis 
                tick={({ x, y, payload }) => {
                  const driverEntry = laps.find(
                    (d) => d.driver === payload.value,
                  );
                  const color = driverEntry?.color || "#FFFFFF";

                  // Return the chart with customised styling for the x and y axis
                  return (
                    <text
                      x={x - 10}
                      y={y + 5}
                      textAnchor="end"
                      fill={color}
                      fontFamily="formula1bold"
                      fontSize={12}
                    >
                      {payload.value}
                    </text>
                  );
                }}
              />

              {/* Custom tooltip for the bar chart with the year of the session as a parameter */}
              <Tooltip content={<CustomTooltip activeYear={activeYear} />} />

              {/* Loop through all the compounds and display each bar into segmnts based on the number of laps for each compound */}
              {allCompounds.map((compound) => (
                <Bar
                  key={compound}
                  dataKey={compound}
                  stackId="a"
                  fill={compoundColours[compound]}
                  label={renderCustomLabel}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
