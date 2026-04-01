// Imports used
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";

// Component for the lap times line chart for each driver with laps passed as a parameter
export default function StatFeature2({ laps }) {

  // Debugging
  console.log(laps);

  // Process the laps data in a format for the line chart
  const processedData = [];

  // State to keep track of drivers visible on the chart 
  const [visibleDrivers, setVisibleDrivers] = useState({});

  // When there are laps data passed as the parameter, set the visible state of all drivers to true
  useEffect(() => {
    if (laps.length > 0) {
      setVisibleDrivers(
        Object.fromEntries(laps.map((driver) => [driver.driver, true]))
      );
    }
  }, [laps]);

  // Custom tooltip for the line chart with the lap number as a parameter 'label' 
  function CustomTooltip({ payload, label }) {
    return (
      <div className="bg-[#14131a] p-2 rounded shadow-lg border-[2px] border-[white] w-40">

        {/* Display the lap number */}
        <p className="font-formula1bold text-sm">{`Lap ${label}`}</p>

        {/* Loop through the payload to display the driver name and their lap time for that lap */}
        {payload.map((entry) => (
          <p
            key={entry.dataKey}
            className="font-formula1bold text-sm pl-2"
            // Set the colour of the driver names and lap times
            style={{ color: entry.stroke }}
          >
            {/* Display the driver name and lap time in seconds */}
            {`${entry.dataKey} - ${entry.value}s`}
          </p>
        ))}
      </div>
    );
  }

  // Function to toggle the visibility of all drivers
  const toggleAll = (hide) => {

    // Create a new state object where all drivers are set to the value of 'hide' true or false 
    const newState = Object.fromEntries(
      laps.map((driver) => [driver.driver, hide]),
    );

    // Update the state with the visible drivers
    setVisibleDrivers(newState);
  };

  // Function to toggle the visibility of a single driver 
  const addDriver = (driver) => {

    // Update the previous state of visible drivers by adding the driver
    setVisibleDrivers((prev) => ({
      
      // Spreads the state of all the drivers and then update the drvier that has been added
      ...prev,
      [driver]: !prev[driver],
    }));
  };

  // Go through each driver and their laps to create an array of the driver and their lap times for the chart
  laps.forEach((driver) => {

    // Go through each lap of the driver and add the lap time to the processed data with the lap number 
    driver.laps.forEach((lap, i) => {
      
      // If the lap number does not exist in the data, then create a new lap number 
      if (!processedData[i]) {
        processedData[i] = { lap: i + 1 };
      }

      // Assign the lap time to the driver in the processed data for that lap number
      processedData[i][driver.driver] = lap.time;
    });
  });

  // Sort the processed data by lap number from the first to last lap
  processedData.sort((lap1, lap2) => lap1.lap - lap2.lap);

  // Debugging
  console.log(processedData);

  return (
    <div className="flex justify-center items-start pt-10 h-220">
      <div className="relative w-320 h-190 bg-[#14131a] brightness-125 shadow-[0_0_10px_#000000] rounded-[20px]">
        {/* Title of the chart*/}
        <div className="p-5 font-formula1bold text-[30px]">
          <p>Lap Times</p>
        </div>

        <ResponsiveContainer width="100%" height={600}>
          <LineChart
            // Set the data for the chart to the processed data
            data={processedData}
            margin={{ top: 20, right: 50, left: 50, bottom: 5 }}
          >
            {/* For the grid lines of the chart */}
            <CartesianGrid strokeDasharray="5 5" stroke="#333" />

            <XAxis dataKey="lap" stroke="grey" fontFamily="formula1bold" interval={1}/>
            <YAxis
              stroke="grey"
              // Set the range of the y axis
              domain={["dataMin", "dataMax+1"]}
              fontFamily="formula1bold"
            />

            {/* Custom tooltip for the line chart */}
            <Tooltip content={<CustomTooltip />} />

            {/* Loop through each driver and display a line for each driver */}
            {laps.map((driver) => (
              <Line
                // Set the key to the driver name, type of the line to monotone, data key to the driver name, stroke colour to the driver colour
                key={driver.driver}
                type="monotone"
                dataKey={driver.driver}
                stroke={driver.color}
                dot={false}
                strokeWidth={2}

                // Hides the line of the drivers that have their visible state set to false
                hide={visibleDrivers[driver.driver] == false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        <div className="flex flex-wrap gap-2 justify-center pt-2">
          {/* Loops through each driver and displays a button with the driver abbreviation */}
          {laps.map((driver) => (
            <span

              // Sets the key to the driver name and when the button is clicked, it inverts the visible state of the driver in the addDriver function 
              key={driver.driver}
              onClick={() => addDriver(driver.driver)}

              // Apply styling to the button to show if the driver is visible or not
              className={`border-[2px] rounded-[13px] p-1 font-formula1bold cursor-pointer select-none transition-colors bg-white 
                        ${visibleDrivers[driver.driver] ? "brightness-100" : " brightness-50"}
                    }`}
              style={{
                borderColor: driver.color,
                color: driver.color,
              }}
            >
              {driver.driver}
            </span>
          ))}
        </div>

        {/* Buttons to show or hide all drivers */}
        <div className="absolute top-12 right-5 flex gap-2">

          {/* When the show all button is clicked it sets the visible state of all drivers to true */}
          <button
            onClick={() => toggleAll(true)}
            className="border-[2px] rounded-[13px] p-1 font-formula1bold cursor-pointer select-none transition-colors "
>
            Show All
          </button>

          {/* When the hide all button is clicked it sets the visible state of all drivers to false */}
          <button
            onClick={() => toggleAll(false)}
            className="border-[2px] rounded-[13px] p-1 font-formula1bold cursor-pointer select-none transition-colors "
          >
            Hide All
          </button>
        </div>
      </div>
    </div>
  );
}
