// Imports used
import { useState, useEffect } from "react";
import Papa from "papaparse";
import React from "react";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Customized,
} from "recharts";

export default function Session({

  // State variables and functions passed from the App component
  activeYear,
  activeGP,
  activeSession,
  setLaps,
}) {

  // State variables using the useState to control the selected session, data, key, and fastest times
  const [newData, setData] = useState([]);
  const [newCircuitData, setCircuitData] = useState([]);
  const [fastestTimes, setFastestTimes] = useState({ s1: 0, s2: 0, s3: 0 });
  const [fastestDriverHeadshot, setFastestDriverHeadshot] = useState(null);
  const [loopCount, setLoopCount] = useState(0);

  // Preset values for the year, GP, and the session when the website is first loaded
  const safeYear = activeYear || "2026";
  const safeGP = activeGP || "Albert Park Grand Prix Circuit";
  const safeSession = activeSession || "Race";

  // Variables to hold the data for the session
  const displayData = newData;
  const displayCircuitData = newCircuitData;

  // useEffect to fetch the data from the CSV files and process the data when the year, GP and session is selected
  useEffect(() => {

    // Promise.all fetches all the CSV files needed for the session data and parses them using Papaparse
    Promise.all([
      fetch("/data/Circuit.csv").then((res) => res.text()),
      fetch("/data/Session.csv").then((res) => res.text()),
      fetch("/data/Results.csv?t=" + Date.now()).then((res) => res.text()),
      fetch("/data/Drivers.csv").then((res) => res.text()),
      fetch("/data/Laps.csv").then((res) => res.text()),
      fetch("/data/Team.csv").then((res) => res.text()),
    ]).then(
      async ([
        circuitCsv,
        sessionCsv,
        resultsCsv,
        driversCsv,
        lapsCsv,
        teamsCsv,
      ]) => {

        // CSV data  are stored as variables and parsed using Papaparse
        const circuits = Papa.parse(circuitCsv, { header: true }).data;
        const sessions = Papa.parse(sessionCsv, { header: true }).data;
        // Results data is parsed with skipEmptyLines and dynamicTyping to handle 
        // empty lines and convert to the right data types
        // Used for debugging
        const allResults = Papa.parse(resultsCsv, {
          header: true, skipEmptyLines: true,
          dynamicTyping: true,
        }).data;
        const allDrivers = Papa.parse(driversCsv, { header: true }).data;
        const allTeams = Papa.parse(teamsCsv, { header: true }).data;
        const allLaps = Papa.parse(lapsCsv, { header: true }).data;

        // Find the circuit that matches the selected GP and if not found, return nothing
        const circuit = circuits.find((c) => c.Name === safeGP);

        // Find the session that matches the selected GP, year, and session type, and if not 
        // found then return nothing
        const session = sessions.find(
          (s) =>
            s.CircuitID?.toString() === circuit.ID?.toString() &&
            s.DateOfSession.includes(safeYear) &&
            s.Type === safeSession,
        );

        // Debugging
        console.log(session);

        // Set the data for the session using the circuit and session information from the CSV file
        setCircuitData([
          {
            name: circuit.OfficialName,
            circuit: circuit.Name,
            country: circuit.Country,
            city: circuit.City,
            corners: circuit.Corners,
            length: circuit.Length,
            temperature: session.Temperature,
            date: session.DateOfSession,
            sector1: circuit.Sector1,
            sector2: circuit.Sector2,
            sector3: circuit.Sector3,
            filePath: circuit.FilePath
          },
        ]);

        // Filter the results data to get the results for the selected session and map the data to the correct driver with the given year
        // and the team information. Then return the position, the drivers abbreviation code, team name, colour, gap and true or false for 
        // the background colour 
        const filteredResults = allResults
          .filter((r) => r.SessionID?.toString() === session.ID?.toString())
          .map((r, i) => {
            const driverInfo = allDrivers.find(
              (d) => d.DriverName === r.Driver && safeYear === d.Year,
            );

            const teamInfo = driverInfo
              ? allTeams.find((t) => t.ID === driverInfo.TeamID)
              : null;

            return {
              pos: r.Position,
              driver: driverInfo ? driverInfo.DriverName
                .split(" ")
                .at(-1)
                .substring(0, 3)
                .toUpperCase()
                : "drivererror",
              team: teamInfo ? teamInfo.TeamName : "teamerror",
              color: teamInfo ? teamInfo.Color : "white",
              gap: r.TimeGap || "0",
              greyBackground: i % 2 === 0 ? false : true,
            };
          });

        // Function to parse the time from the CSV file and convert it to seconds for simpler comparison of times
        const parseTime = (timeStr) => {
          const match = timeStr.match(/(\d+):(\d+):(\d+\.\d+)/);
          if (!match) return 99;
          const hours = parseInt(match[1]);
          const minutes = parseInt(match[2]);
          const seconds = parseFloat(match[3]);
          return hours * 3600 + minutes * 60 + seconds;
        };

        // Debugging
        console.log("Filtered Results:", filteredResults);

        // Filter the laps data to get the laps for the selected session using the session ID 
        const sessionLaps = allLaps.filter(
          (l) => l.SessionID?.toString() === session.ID?.toString()
        );

        // Create a map of driver IDs and their corresponding information 
        const driverMap = Object.fromEntries(
          allDrivers.map((d) => [d.ID.toString(), d]),
        );

        // Store the data for the tyre stints for each driver
        const tyreData = {};

        // Create a map of each driver name, position and team colour for the session 
        const driverPositionMap = Object.fromEntries(
          filteredResults.map((r) => [r.driver, r.pos, r.color]),
        );

        // Loop through the laps for the session and for each lap
        sessionLaps.forEach((lap) => {

          // Get the driver information for the lap using the driver ID and if not found then return nothing
          const driver = driverMap[lap.DriverID];
          if (!driver)
            return;

          // Get the drivers abbreviation code 
          const driverName = driver.DriverName.split(" ")
            .at(-1)
            .substring(0, 3)
            .toUpperCase();

          // If the driver is not already in the tyreData map, add the driver and create an empty array for the laps
          if (!tyreData[driverName]) {
            tyreData[driverName] = [];
          }

          // Add each lap for the driver to the tyreData wiht the lap number, tyre compound and time 
          tyreData[driverName].push({
            lap: Number(lap.LapNumber),
            tyre: lap.TyreCompound,
            time: parseTime(lap.LapTime).toFixed(3),
          });
        });

        // Set the laps data with the lap numbers sorted, for the session by mapping through the 
        // tyreData and also sorting the positions of the drivers from 1st to last
        const chartData = Object.entries(tyreData)
          .map(([driver, laps]) => ({
            driver,
            laps: laps.sort((a, b) => a.lap - b.lap),
            color:
              filteredResults.find((r) => r.driver === driver)?.color ||
              "white",
          }))
          .sort((a, b) => {
            const pos1 = driverPositionMap[a.driver] || 99;
            const pos2 = driverPositionMap[b.driver] || 99;
            return pos1 - pos2;
          });

        // Set the laps data for the session to be used in both Stat Feature components
        setLaps(chartData);
        console.log(chartData);

        // Set data for default lap values
        const defaultLap = {
          Sector1Time: "0.0",
          Sector2Time: "0.0",
          Sector3Time: "0.0",
          Driver: "drivererror",
          LapNumber: 0,
          Team: "teamerror",
          Color: "white",
        };

        // Get the fastest sector 1 time
        const fastestS1Lap =
          // Check if the session laps data is not empty
          sessionLaps.length > 0
            // If data is not empty, then reduce the session laps to find the 
            // lap with the fastest sector 1 time 
            ? sessionLaps.reduce(
              (fastest, lap) =>
                parseTime(lap.Sector1Time) <
                  parseTime(fastest.Sector1Time)
                  // If the current lap has a faster sector 1 time compared to the fastest lap 
                  // found so far, then set the current lap as the fastest, otherwise keep the fastest laps as it is
                  ? lap
                  : fastest,

              // Start the reduction with the first lap as the initial fastest lap
              sessionLaps[0],
            )
            // Set the default lap if there is no lap data
            : defaultLap;

        // Similar to sector 2
        const fastestS2Lap =
          sessionLaps.length > 0
            ? sessionLaps.reduce(
              (fastest, lap) =>
                parseTime(lap.Sector2Time) <
                  parseTime(fastest.Sector2Time)
                  ? lap
                  : fastest,
              sessionLaps[0],
            )
            : defaultLap;

        // Similar to sector 3
        const fastestS3Lap =
          sessionLaps.length > 0
            ? sessionLaps.reduce(
              (fastest, lap) =>
                parseTime(lap.Sector3Time) <
                  parseTime(fastest.Sector3Time)
                  ? lap
                  : fastest,
              sessionLaps[0],
            )
            : defaultLap;

        // Get the fastest lap time using the same reduction method but comparing 
        // the total lap time instead of sector times
        const fastestLap =
          sessionLaps.length > 0
            ? sessionLaps.reduce(
              (fastest, lap) =>
                parseTime(lap.LapTime) <
                  parseTime(fastest.LapTime)
                  ? lap
                  : fastest,
              sessionLaps[0],
            )
            : defaultLap;

        // Function to get the driver information for a lap
        const getDriverInfo = (lap) => {
          if (!lap || !lap.DriverID)
            // Return default driver information if the lap data is not valid or does not 
            // have a certain driver ID
            return {
              driver: "drivererror",
              fullname: "driver error",
              team: "teamerror",
              color: "white",
            };

          // Set and initialise the driver ID from the lap data 
          const driverID = lap.DriverID.toString();
          console.log(driverID);

          // Find the driver information using the driver ID from the allDrivers data 
          const driver = allDrivers.find((d) => d.ID.toString() === driverID);
          console.log(driver);

          // Find the team information for the driver using the team ID from the driver information
          const team = driver
            ? allTeams.find((t) => t.ID.toString() === driver.TeamID.toString())
            : null;

          // Return the information about the driver
          return {
            driver: driver
              ? driver.DriverName.split(" ")
                .at(-1)
                .substring(0, 3)
                .toUpperCase()
              : "drivererror",
            fullname: driver ? driver.DriverName : "driver error",
            team: team ? team.TeamName : "teamerror",
            color: team ? team.Color : "white",
          };
        };

        // Get the driver information for each sector by passing the fastest 
        // sector lap data in the getDriverInfo function
        const s1Info = getDriverInfo(fastestS1Lap);
        console.log(s1Info);
        const s2Info = getDriverInfo(fastestS2Lap);
        console.log(s2Info);
        const s3Info = getDriverInfo(fastestS3Lap);
        console.log(s3Info);
        const fastestLapInfo = getDriverInfo(fastestLap);

        // Function to fetch the driver information and headshot for the driver using the OpenF1 API 
        const fetchOpenF1Drivers = async () => {

          // Used to handle countries with different names in the OpenF1 API
          if (circuit.Country === "UK") {
            circuit.Country = "United Kingdom";
          } else if (circuit.Country === "USA") {
            circuit.Country = "United States";
          } else if (circuit.Country === "UAE") {
            circuit.Country = "United Arab Emirates";
          }

          // Fetch the session information from the OpenF1 API using the circuit country, year and session 
          // type in a try catch block to handle any errors
          try {

            // Fetch the session data with the given parameters
            const response = await fetch(
              `https://api.openf1.org/v1/sessions?country_Name=${(circuit.Country)}&year=${safeYear}&session_name=${(safeSession)}`,
            );

            // Check the response and if it is null or empty, then return nothing
            const sessionsData = await response.json();
            if (!sessionsData || sessionsData.length === 0) {
              return;
            }

            // Get the session key from the session data which is needed to fetch the driver information 
            const sessionKey = sessionsData[0].session_key;
            console.log("Session key:", sessionKey);

            // Fetch the driver information for the fastest driver using the abbreviation and session key 
            const driverResponse = await fetch(
              `https://api.openf1.org/v1/drivers?name_acronym=${fastestLapInfo.driver}&session_key=${sessionKey}`,
            );

            // Store the driver information and set the the headshot URL 
            const driverData = await driverResponse.json();
            console.log("Fastest driver info:", driverData[0]);
            setFastestDriverHeadshot(driverData[0].headshot_url);

            // Catch errors 
          } catch (error) {
            // For debugging in console
            console.error("Error fetching from OpenF1 API:", error);

            // Return default driver information 
            return {
              driver: "drivererror",
              fullname: "driver error",
              team: "teamerror",
              color: "white",
            };
          }
        };

        // Fetch the fastest driver information using the fetchOpenF1Drivers function and store the information 
        const fastestDriverInfo = await fetchOpenF1Drivers();
        console.log(fastestDriverInfo);

        // Set colours for the fastest drivers in each sector and the lap as a whole
        let s1Color = s1Info.color;
        let s2Color = s2Info.color;
        let s3Color = s3Info.color;
        let fastestLapColor = fastestLapInfo.color;

        // Fade colour function used to fade colours when the drivers in the secotrs are from the same team to distinguish
        const fadeColor = (hex) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, 0.6)`;
        };

        // If the drivers in the sectors are from the same team but different drivers, then fade one of the 
        // colours to distinguish between the drivers
        if (s1Info.team === s2Info.team && s1Info.driver !== s2Info.driver) {
          s2Color = fadeColor(s2Color);
        }

        // Similar for comparing the fastest 1st and 3rd sector drivers
        if (s1Info.team === s3Info.team && s1Info.driver !== s3Info.driver) {
          s3Color = fadeColor(s3Color);
        }

        // Similar for comparing the fastest 2nd and 3rd sector drivers and checking if the 3rd sector driver 
        // is different from the 1st sector driver 
        if (s2Info.team === s3Info.team && s2Info.driver !== s3Info.driver && s3Info.driver !== s1Info.driver) {
          s3Color = fadeColor(s3Color);
        }

        // Set the fastest times and information for easy fetching
        setFastestTimes({

          // Set the fastest times in each sector and the overall lap by parsing times using the function
          s1: parseTime(fastestS1Lap.Sector1Time),
          s2: parseTime(fastestS2Lap.Sector2Time),
          s3: parseTime(fastestS3Lap.Sector3Time),
          fastestLap: parseTime(fastestLap.LapTime),

          // Set the driver for all sectors and the fastest lap
          s1Driver: s1Info.driver,
          s2Driver: s2Info.driver,
          s3Driver: s3Info.driver,
          fastestLapDriver: fastestLapInfo.fullname,

          // Set the lap number for each sector and the fastest lap
          s1Lap: fastestS1Lap.LapNumber,
          s2Lap: fastestS2Lap.LapNumber,
          s3Lap: fastestS3Lap.LapNumber,
          fastestLapNumber: fastestLap.LapNumber,

          // Set the team for each sector and the fastest lap
          s1Team: s1Info.team,
          s2Team: s2Info.team,
          s3Team: s3Info.team,
          fastestLapTeam: fastestLapInfo.team,

          // Set the colours for each sector and the fastest lap
          s1Color: s1Color,
          s2Color: s2Color,
          s3Color: s3Color,
          fastestLapColor: fastestLapColor,
        });

        // Finally, set the data for the session results to be displayed
        setData(filteredResults);
      },
    );
  }, [activeYear, activeGP, activeSession]);

  return (
    <div className="flex justify-center items-start h-auto py-3 gap-10 pt-8">
      <div className="w-full max-w-md space-y-1">
        {/* Main session results data displayed in a column order */}
        <div className="grid grid-cols-[53px_1fr_100px] items-center w-full px-4 pb-2">
          <p className="font-formula1 text-xs text-gray-400">POS</p>
          <p className="font-formula1 text-xs text-gray-400">DRIVER</p>
          <p className="font-formula1 text-xs text-right text-gray-400">GAP</p>
        </div>

        {/* Go through the display data for the session results and display the position, driver with the team colour and name, and the gap to the leader */}
        {(() => {
          let lapNumber = 1
          let lastGap;
          return displayData.map((row, i) => {
            const gap = Number(row.gap);
            const gapBehind = i > 0 ? Number(displayData[i - 1].gap) : 0;

            let gapNumber = "";
            if (i === 0) {
              gapNumber = "LEADER";
            } else if (gap === 0) {
              gapNumber = "DNF";
            } else if (gap < gapBehind && i != 1) {
              gapNumber = `+${lapNumber} LAPS`;
              lapNumber++;
            } else if (lapNumber > 1) {
              if (lapNumber > 2) {
                gapNumber = `+${lapNumber - 1} LAPS`;
              } else {
                gapNumber = `+1 LAP`;
              }
            }
              else {
              gapNumber = `+${gap.toFixed(3)}s`;
            }

            lastGap = gapNumber;
            
            return (
            <div
              // Check if the row is greyBackground or not to set the background colour for the row. If false, then set the background to transparent 
              // and if true, then set the background to grey 
              className={`grid grid-cols-[53px_1fr_100px] items-center w-full px-4 py-2 ${row.greyBackground ? "rounded-md bg-[#2d2d35]" : ""
                }`}
            >
              <div className="flex items-center gap-3">
                <p className="font-formula1bold text-sm min-w-[15px]">
                  {/* Access the position of the driver */}
                  {row.pos}
                </p>
                <div className="w-[2px] h-3 bg-white"></div>
              </div>

              <div className="flex items-center gap-3">
                <p className="font-formula1bold text-sm uppercase">
                  {/* Access the driver abbreviation */}
                  {row.driver}
                </p>
                <div className="flex items-center gap-1.5 opacity-80">
                  <div
                    className="w-[3px] h-3 rounded-full"
                    // Access the team colour for styling the background
                    style={{ backgroundColor: row.color }}
                  ></div>
                  <p className="font-formula1 text-[10px] text-gray-400">
                    {/* Access team name */}
                    {row.team}
                  </p>
                </div>
              </div>

              {/* If the gap is 0, then display DNF instead. Otherwise, display the gap to the leader with 3 decimal places */}
              <p className="font-formula1bold text-sm text-right font-formula1">
                {gapNumber}
              </p>
            </div>
          );
        })})()}
      </div>

      <div className="flex flex-col items-center gap-5">
        <div className="w-[800px] h-auto bg-[#14131a] brightness-125 shadow-xl shadow-black rounded-[22px] overflow-hidden flex flex-col border border-white/10">
          {/* Go through the circuit data for the session to display circuit information */}
          {displayCircuitData.map((row, i) => (
            <div key={i} className="flex flex-col h-full w-full">
              <div className="w-full flex justify-center py-6 gap-2">
                <img
                  className="w-13 h-11 rounded-2xl pl-2"
                  // Access the photo for the circuit using the country name in lowercase
                  src={`/photos/${row.country.toLowerCase()}.png`}
                ></img>
                <p className="font-formula1bold text-[28px] uppercase tracking-tighter">
                  {/* Access the name of the circuit */}
                  {row.name}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="rounded-full shadow-sm bg-[#2d2d35] px-3">
                  <p className="font-titiliumreg p-0.5">{row.circuit}</p>
                </div>
                <div className="flex gap-2">
                  <div className="rounded-full shadow-sm bg-[#2d2d35] px-3 gap-3 flex items-center">
                    <p className="font-titiliumbold p-0.5">{row.date}</p>
                  </div>
                  <div className="rounded-full shadow-sm bg-[#2d2d35] px-3 gap-3 flex items-center">
                    <p className="font-titiliumbold p-0.5">
                      {/* Access the temperature for the session */}
                      {row.temperature}°C
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center relative ">
                {/* Check if there is a file path for the circuit map to display the track layout */}
                {row.filePath ? (
                  <img
                    // If there is a file path then access the track layout using the file path 
                    src={`/photos/${row.filePath}.avif`}
                    // Set the size of the track image depending on how many drivers there are
                    className={`w-[500px] rounded-lg translate-x-6 pt-12 pb-12 ${displayData.length == 20 ? "pt-5 pb-5" : displayData.length == 21 ? "pt-16 pb-15" : displayData.length == 22 ? "pt-22 pb-21" : ""
                      }`}
                  />
                ) : (
                  // If there is no file path, then display the track layout using the sector coordinates from the CSV file and using SVG to draw it
                  <svg
                    viewBox="0 0 400 300"
                    className="w-[500px] translate-x-6"
                  >
                    <path
                      d={`${row.sector1}${row.sector2}${row.sector3}`}
                      stroke="white"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                )}


                <div className="flex gap-8 pb-2">
                  <div className="text-center">
                    <p
                      className="text-[10px] font-formula1"
                      // Style the driver name with the colour for the fastest sector 1 driver
                      style={{ color: fastestTimes.s1Color }}
                    >
                      {/* Display the abbreviation for the fastest sector 1 driver */}
                      {fastestTimes.s1Driver}
                    </p>
                    <p className="text-[#b624ff] font-formula1bold">
                      {/* Display the fastest sector 1 time */}
                      S1: {fastestTimes.s1}
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className="text-[10px] font-formula1"
                      // Style the driver name with the colour for the fastest sector 2 driver
                      style={{ color: fastestTimes.s2Color }}
                    >
                      {/* Display the abbreviation for the fastest sector 2 driver */}
                      {fastestTimes.s2Driver}
                    </p>
                    <p className="text-[#b624ff] font-formula1bold">
                      {/* Display the fastest sector 2 time */}
                      S2: {fastestTimes.s2}
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className="text-[10px] font-formula1"
                      // Style the driver name with the colour for the fastest sector 3 driver
                      style={{ color: fastestTimes.s3Color }}
                    >
                      {/* Display the abbreviation for the fastest sector 3 driver */}
                      {fastestTimes.s3Driver}
                    </p>
                    <p className="text-[#b624ff] font-formula1bold">
                      {/* Display the fastest sector 3 time */}
                      S3: {fastestTimes.s3}
                    </p>
                  </div>
                </div>
              </div>

              {/* Display the circuit information */}
              <div className="grid grid-cols-4 w-full py-6 px-10 border-t border-white/5">
                <div className="flex flex-col items-center border-r border-white/10">
                  <span className="text-[10px] text-gray-500 font-formula1">
                    COUNTRY
                  </span>
                  <span className="font-formula1bold text-sm uppercase">
                    {/* Display the country for the circuit */}
                    {row.country}
                  </span>
                </div>
                <div className="flex flex-col items-center border-r border-white/10">
                  <span className="text-[10px] text-gray-500 font-formula1">
                    CITY
                  </span>
                  <span className="font-formula1bold text-sm uppercase">
                    {/* Display the city for the circuit */}
                    {row.city}
                  </span>
                </div>
                <div className="flex flex-col items-center border-r border-white/10">
                  <span className="text-[10px] text-gray-500 font-formula1">
                    CORNERS
                  </span>
                  <span className="font-formula1bold text-sm">
                    {/* Display the number of corners for the circuit */}
                    {row.corners}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 font-formula1">
                    LENGTH
                  </span>
                  <span className="font-formula1bold text-sm">
                    {/* Display the length of the circuit in KM */}
                    {row.length} KM
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        
        <div
          className="relative w-[800px] h-auto shadow-lg rounded-[22px] overflow-hidden flex border border-white/10"
          style={{
            // Style the background colour for the fastest driver and set the default to black
            backgroundColor: fastestTimes.fastestLapColor || "#000000",
          }}
        >
          {/* Display the word FASTEST in the background */}
          <div className="absolute inset-0 flex items-center justify-center ">
            <p className="text-[140px] font-formula1bold italic text-white/30 tracking-widest select-none">
              FASTEST
            </p>
          </div>

          <div className="relative flex h-full w-full items-end p-1">
            {/* Display the headshot for the fastest driver */}
            <img
              src={fastestDriverHeadshot}
              className="absolute w-32 h-32 translate-x-12"
            />

            <div className="backdrop-blur-md bg-white/2 border border-white/20 rounded-xl px-3 py-1 shadow-lg">
              <p className="font-formula1bold text-[22px] uppercase tracking-tighter">
                {/* Display the name of the fastest driver for the lap or unknown for defalt */}
                {fastestTimes.fastestLapDriver || "Unknown Driver"}
              </p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1 pl-50">
              <p className="font-formula1bold text-[30px] text-white">
                {/* Display the lap number for the fastest lap or default to 0 */}
                Lap {Number(fastestTimes.fastestLapNumber) || "0"}
              </p>
              <p className="font-formula1bold text-[53px] text-white">
                {/* Check if there is a fastest lap time and if there is then display the lap to 3 decimal places, otherwise set to 0.000 */}
                {fastestTimes.fastestLap
                  ? fastestTimes.fastestLap.toFixed(3)
                  : "0.000"}
                s
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
