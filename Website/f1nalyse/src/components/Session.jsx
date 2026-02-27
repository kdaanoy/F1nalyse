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

const trackPath = `
M 321.64977 89.166026 

L 141.927761 89.423461 
L 141.670326 87.058274 
L 141.026738 84.258666 
L 140.286611 82.038286 
L 139.192511 79.463934 
L 137.792707 76.93785 
L 135.958481 74.073882 
L 134.574766 72.271835 
L 132.837078 70.453699 
L 130.391442 68.345947 
L 128.589395 67.026591 
L 127.012604 66.01294 
L 125.114019 64.967109 
L 121.316849 63.406408 
L 117.197884 62.457115 
L 114.929236 62.408846 
L 114.028212 62.521474 
L 112.338793 63.004165 
L 111.40559 63.422497 
L 110.118414 64.3557 
L 109.426556 65.256724 
L 108.927776 66.366913 
L 108.622071 67.380565 
L 108.058931 68.860818 
L 107.077459 70.180174 
L 104.615735 71.547798 
L 103.473365 71.676516 
L 102.073561 71.515619 
L 100.142796 70.823762 
L 97.77761 69.552675 
L 94.672297 67.814987 
L 92.773711 67.026591 
L 91.920957 66.801335 
L 90.553332 66.608259 
L 88.976541 66.656528 
L 87.335391 67.058771 
L 86.080394 67.750628 
L 85.452895 68.362037 
L 84.921935 69.230881 
L 84.68059 69.922738 
L 84.471423 71.885682 
L 84.567962 75.81157 
L 84.873666 91.161149 
L 85.018473 97.629211 
L 84.938025 118.465379 
L 84.825397 120.766207 
L 84.455334 124.225494 
L 83.747387 128.26401 
L 83.02335 131.304964 
L 81.92925 134.587264 
L 80.159382 138.722318 
L 78.984834 140.910518 
L 77.456312 143.195256 
L 76.217405 144.772048 
L 73.385616 147.652105 
L 71.615749 149.116268 
L 69.314921 150.757418 
L 67.142811 152.092863 
L 65.356853 153.058246 
L 60.417314 155.375163 
L 51.117464 159.687204 
L 49.218879 160.652587 
L 46.467539 162.245468 
L 44.713761 163.452195 
L 40.884412 166.782764 
L 36.942434 171.336151 
L 35.896603 172.816404 
L 34.207184 175.632102 
L 32.131612 180.265938 
L 31.11796 183.499968 
L 29.138927 192.622831 
L 28.447069 196.886603 
L 28.463159 197.980703 
L 28.849312 199.364418 
L 29.187196 199.911468 
L 30.780077 201.4239 
L 32.485585 202.244475 
L 37.618201 203.6121 
L 41.093578 205.156712 
L 45.9044 207.45754 
L 50.940477 209.822726 
L 55.767389 212.397079 
L 68.027745 219.315652 


  `;

export default function Session({ activeYear, activeGP, activeSession }) {
  const [newData, setData] = useState([]);
  const [new_mapdata, set_mapData] = useState([]);
  const [fastestTimes, setFastestTimes] = useState({ s1: 0, s2: 0, s3: 0 });

  const data =
    newData.length > 0
      ? newData
      : [
          {
            pos: "1",
            driver: "VER",
            team: "Red Bull",
            color: "#0600ef",
            gap: "5167.469",
          },
          {
            pos: "2",
            driver: "PIA",
            team: "McLaren",
            color: "#FF8000",
            gap: "+12.594",
            active: true,
          },
          {
            pos: "3",
            driver: "NOR",
            team: "McLaren",
            color: "#FF8000",
            gap: "+16.572",
          },
          {
            pos: "4",
            driver: "LEC",
            team: "Ferrari",
            color: "#e80020",
            gap: "+23.279",
            active: true,
          },
          {
            pos: "5",
            driver: "RUS",
            team: "Mercedes",
            color: "#27f4d2",
            gap: "+48.563",
          },
          {
            pos: "6",
            driver: "ALO",
            team: "Aston Martin",
            color: "#00665f",
            gap: "+67.562",
            active: true,
          },
          {
            pos: "7",
            driver: "OCO",
            team: "Haas F1 Team",
            color: "#b6babd",
            gap: "+69.876",
          },
          {
            pos: "8",
            driver: "HAM",
            team: "Ferrari",
            color: "#e80020",
            gap: "+72.67",
            active: true,
          },
          {
            pos: "9",
            driver: "HUL",
            team: "Sauber",
            color: "#00e700",
            gap: "+79.014",
          },
          {
            pos: "10",
            driver: "STR",
            team: "Aston Martin",
            color: "#00665f",
            gap: "+79.523",
            active: true,
          },
          {
            pos: "11",
            driver: "BOR",
            team: "Sauber",
            color: "#00e700",
            gap: "+81.043",
          },
          {
            pos: "12",
            driver: "BEA",
            team: "Haas F1 Team",
            color: "#b6babd",
            gap: "+81.166",
            active: true,
          },
          {
            pos: "13",
            driver: "SAI",
            team: "Williams",
            color: "#00a0dd",
            gap: "+82.158",
          },
          {
            pos: "14",
            driver: "TSU",
            team: "Red Bull",
            color: "#364aa9",
            gap: "+83.794",
            active: true,
          },
          {
            pos: "15",
            driver: "ANT",
            team: "Mercedes",
            color: "#27F4D2",
            gap: "+84.399",
          },
          {
            pos: "16",
            driver: "ALB",
            team: "Williams",
            color: "#00a0dd",
            gap: "+1L",
            active: true,
          },
          {
            pos: "17",
            driver: "HAD",
            team: "RB F1 Team",
            color: "#364aa9",
            gap: "+1L",
          },
          {
            pos: "18",
            driver: "LAW",
            team: "Red Bull",
            color: "#0600ef",
            gap: "+1L",
            active: true,
          },
          {
            pos: "19",
            driver: "GAS",
            team: "Alpine F1 Team",
            color: "#ff87bc",
            gap: "+1L",
          },
          {
            pos: "20",
            driver: "COL",
            team: "Alpine F1 Team",
            color: "#ff87bc",
            gap: "+1L",
            active: true,
          },
        ];

  const map_data =
    new_mapdata.length > 0
      ? new_mapdata
      : [
          {
            name: "Formula 1 Abu Dhabi Grand Prix",
            circuit: "Yas Marina Circuit",
            country: "UAE",
            city: "Abu Dhabi",
            corners: "16",
            length: "5.281",
            temperature: "25.3",
            date: "07/12/2025 13:00",
          },
        ];

  const displayData = newData.length > 0 ? newData : data;
  const display_mapData = new_mapdata.length > 0 ? new_mapdata : map_data;

  useEffect(() => {
    if (!activeSession || !activeGP || !activeYear) return;

    Promise.all([
      fetch("/data/Circuit.csv").then((res) => res.text()),
      fetch("/data/Session.csv").then((res) => res.text()),
      fetch("/data/Results.csv").then((res) => res.text()),
      fetch("/data/Drivers.csv").then((res) => res.text()),
      fetch("/data/Laps.csv").then((res) => res.text()),
      fetch("/data/Team.csv").then((res) => res.text()),
    ]).then(
      ([circuitCsv, sessionCsv, resultsCsv, driversCsv, lapsCsv, teamsCsv]) => {
        const circuits = Papa.parse(circuitCsv, { header: true }).data;
        const sessions = Papa.parse(sessionCsv, { header: true }).data;
        const allResults = Papa.parse(resultsCsv, { header: true }).data;
        const allDrivers = Papa.parse(driversCsv, { header: true }).data;
        const allTeams = Papa.parse(teamsCsv, { header: true }).data;
        const allLaps = Papa.parse(lapsCsv, { header: true }).data;

        const circuit = circuits.find((c) => c.Name === activeGP);
        if (!circuit) return;

        const session = sessions.find(
          (s) =>
            s.CircuitID === circuit.ID &&
            s.DateOfSession.includes(activeYear) &&
            s.Type === activeSession,
        );
        if (!session) return;

        set_mapData([
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
          },
        ]);

        const filteredResults = allResults
          .filter((r) => r.SessionID === session.ID)
          .map((r, i) => {
            const driverInfo = allDrivers.find(
              (d) => d.DriverName === r.Driver && activeYear === d.Year,
            );
            const teamInfo = driverInfo
              ? allTeams.find((t) => t.ID === driverInfo.TeamID)
              : null;

            return {
              pos: r.Position,
              driver: driverInfo
                ? driverInfo.DriverName.trim()
                    .split(" ")
                    .at(-1)
                    .substring(0, 3)
                    .toUpperCase()
                : "UNK",
              team: teamInfo ? teamInfo.TeamName : "TEAM",
              color: teamInfo ? teamInfo.Color : "#FFFFFF",
              gap: r.TimeGap || "0",
              active: i % 2 === 0 ? false : true,
            };
          });

        const parseF1Time = (timeStr) => {
          if (
            !timeStr ||
            typeof timeStr !== "string" ||
            timeStr === "0" ||
            timeStr.includes("NaT")
          )
            return Infinity;
          const match = timeStr.match(/(\d+):(\d+):(\d+\.\d+)/);
          if (!match) return Infinity;
          const hours = parseInt(match[1]);
          const minutes = parseInt(match[2]);
          const seconds = parseFloat(match[3]);
          return hours * 3600 + minutes * 60 + seconds;
        };

        const sessionLaps = allLaps.filter((l) => l.SessionID === session.ID);

        // Default lap to prevent crashes if no laps exist
        const defaultLap = {
          Sector1Time: "0:0:0.0",
          Sector2Time: "0:0:0.0",
          Sector3Time: "0:0:0.0",
          Driver: "UNK",
          LapNumber: 0,
          Team: "TEAM",
          Color: "#FFFFFF",
        };

        const fastestS1Lap =
          sessionLaps.length > 0
            ? sessionLaps.reduce(
                (fastest, lap) =>
                  parseF1Time(lap.Sector1Time) <
                  parseF1Time(fastest.Sector1Time)
                    ? lap
                    : fastest,
                sessionLaps[0],
              )
            : defaultLap;

        const fastestS2Lap =
          sessionLaps.length > 0
            ? sessionLaps.reduce(
                (fastest, lap) =>
                  parseF1Time(lap.Sector2Time) <
                  parseF1Time(fastest.Sector2Time)
                    ? lap
                    : fastest,
                sessionLaps[0],
              )
            : defaultLap;

        const fastestS3Lap =
          sessionLaps.length > 0
            ? sessionLaps.reduce(
                (fastest, lap) =>
                  parseF1Time(lap.Sector3Time) <
                  parseF1Time(fastest.Sector3Time)
                    ? lap
                    : fastest,
                sessionLaps[0],
              )
            : defaultLap;

        const fastestLap =
          sessionLaps.length > 0
            ? sessionLaps.reduce(
                (fastest, lap) =>
                  parseF1Time(lap.LapTimeSeconds) <
                  parseF1Time(fastest.LapTimeSeconds)
                    ? lap
                    : fastest,
                sessionLaps[0],
              )
            : defaultLap;

        // After calculating fastestS1Lap
        const getDriverInfo = (lap) => {
          if (!lap || !lap.DriverID)
            return { driver: "UNK", fullname: "Unknown Driver", team: "TEAM", color: "#FFFFFF" };

          // Convert types to string to be safe
          const driverID = lap.DriverID.toString().trim(); // ensure string & trim spaces
          console.log(driverID);
          const driver = allDrivers.find((d) => d.ID.toString() === driverID);
          console.log(driver);
          const team = driver
            ? allTeams.find((t) => t.ID.toString() === driver.TeamID.toString())
            : null;

          return {
            driver: driver
              ? driver.DriverName.split(" ")
                  .at(-1)
                  .substring(0, 3)
                  .toUpperCase()
              : "UNK",
            fullname: driver ? driver.DriverName : "Unknown Driver",
            team: team ? team.TeamName : "TEAM",
            color: team ? team.Color : "#FFFFFF",
          };
        };

        const s1Info = getDriverInfo(fastestS1Lap);
        console.log(s1Info);
        const s2Info = getDriverInfo(fastestS2Lap);
        console.log(s2Info);
        const s3Info = getDriverInfo(fastestS3Lap);
        console.log(s3Info);
        const fastestLapInfo = getDriverInfo(fastestLap);

        let s1Color = s1Info.color;
        let s2Color = s2Info.color;
        let s3Color = s3Info.color;
        let fastestLapColor = fastestLapInfo.color;

        // Helper to fade
        const fadeColor = (hex) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, 0.6)`;
        };

        // If two drivers from same team (but different drivers)
        if (s1Info.team === s2Info.team && s1Info.driver !== s2Info.driver) {
          s2Color = fadeColor(s2Color);
        }

        if (s1Info.team === s3Info.team && s1Info.driver !== s3Info.driver) {
          s3Color = fadeColor(s3Color);
        }

        if (s2Info.team === s3Info.team && s2Info.driver !== s3Info.driver) {
          s3Color = fadeColor(s3Color);
        }

        // Update state
        setFastestTimes({
          s1: parseF1Time(fastestS1Lap.Sector1Time),
          s2: parseF1Time(fastestS2Lap.Sector2Time),
          s3: parseF1Time(fastestS3Lap.Sector3Time),
          fastestLap: parseF1Time(fastestLap.LapTimeSeconds),

          s1Driver: s1Info.driver,
          s2Driver: s2Info.driver,
          s3Driver: s3Info.driver,
          fastestLapDriver: fastestLapInfo.fullname,

          s1Lap: fastestS1Lap.LapNumber,
          s2Lap: fastestS2Lap.LapNumber,
          s3Lap: fastestS3Lap.LapNumber,
          fastestLapLap: fastestLap.LapNumber,

          s1Team: s1Info.team,
          s2Team: s2Info.team,
          s3Team: s3Info.team,
          fastestLapTeam: fastestLapInfo.team,

          s1Color: s1Color,
          s2Color: s2Color,
          s3Color: s3Color,
          fastestLapColor: fastestLapColor,
        });

        setData(filteredResults);
      },
    );
  }, [activeYear, activeGP, activeSession]);

  return (
    <div className="flex justify-center items-start h-auto py-3 gap-10">
      <div className="w-full max-w-md space-y-1">
        <div className="grid grid-cols-[3.5rem_1fr_4rem] items-center w-full px-4 pb-2">
          <p className="font-formula1 text-xs text-gray-400">POS</p>
          <p className="font-formula1 text-xs text-gray-400">DRIVER</p>
          <p className="font-formula1 text-xs text-right text-gray-400">GAP</p>
        </div>

        {displayData.map((row, i) => (
          <div
            key={i}
            className={`grid grid-cols-[3.5rem_1fr_4rem] items-center w-full px-4 py-2 ${
              row.active ? "rounded-md bg-[#2d2d35]" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <p className="font-formula1bold text-sm min-w-[15px]">
                {row.pos}
              </p>
              <div className="w-[2px] h-3 bg-white"></div>
            </div>

            <div className="flex items-center gap-3">
              <p className="font-formula1bold text-sm uppercase">
                {row.driver}
              </p>
              <div className="flex items-center gap-1.5 opacity-80">
                <div
                  className="w-[3px] h-3 rounded-full"
                  style={{ backgroundColor: row.color }}
                ></div>
                <p className="font-formula1 text-[10px] text-gray-400">
                  {row.team}
                </p>
              </div>
            </div>

            <p className="font-formula1 text-sm text-right font-formula1">
              {row.gap}
            </p>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col items-center gap-5">
        <div className="w-[800px] h-auto bg-[#14131a] brightness-125 shadow-lg rounded-[22px] overflow-hidden flex flex-col border border-white/10">
          {display_mapData.map((row, i) => (
            <div key={i} className="flex flex-col h-full w-full">
              {/* 1. Centered Header Section */}
              <div className="w-full flex justify-center py-6 gap-2">
                <img
                  className="w-13 h-11 rounded-2xl pl-2"
                  src={`/${row.country.toLowerCase()}.png`}
                ></img>
                <p className="font-formula1bold text-[28px] uppercase tracking-tighter">
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
                    <p className="font-titiliumbold p-0.5">{row.temperature}°C</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center relative py-1 pb-10">
                <svg
                  viewBox="0 0 400 300"
                  className="w-[500px] translate-x-6"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter
                      id="whiteGlow"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      {/* 1. Create a white glow base */}
                      <feFlood
                        flood-color="white"
                        flood-opacity="0.8"
                        result="white_flood"
                      />
                      <feGaussianBlur
                        stdDeviation="6"
                        in="SourceGraphic"
                        result="blur_white"
                      />
                      <feComposite
                        in="white_flood"
                        in2="blur_white"
                        operator="in"
                        result="strong_white_glow"
                      />

                      {/* 2. Layer the original line (optional, for sharp inner edge) */}
                      <feMerge>
                        <feMergeNode in="strong_white_glow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <path
                    d={`${row.sector1}${row.sector2}${row.sector3}`} // Uses the function defined in step 1
                    stroke="white"
                    strokeWidth="12" // Slightly narrower than sectors to create outline effect
                    fill="none"
                    filter="url(#whiteGlow)"
                    strokeLinecap="round"
                  />

                  <path
                    d={row.sector1}
                    stroke={fastestTimes.s1Color || "#d400ff"}
                    strokeWidth="3"
                    fill="none"
                    filter="url(#glow)"
                    strokeLinecap="round"
                  />

                  <path
                    d={row.sector2 ? `M ${row.sector2.slice(1)}` : ""}
                    stroke={fastestTimes.s2Color || "#00ffbf"}
                    strokeWidth="3"
                    fill="none"
                    filter="url(#glow)"
                    strokeLinecap="round"
                  />

                  <path
                    d={row.sector3 ? `M ${row.sector3.slice(1)}` : ""}
                    stroke={fastestTimes.s3Color || "#ffee00"}
                    strokeWidth="3"
                    fill="none"
                    filter="url(#glow)"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute bottom-5 flex gap-8">
                  <div className="text-center">
                    <p
                      className="text-[10px] font-formula1"
                      style={{ color: fastestTimes.s1Color }}
                    >
                      {fastestTimes.s1Driver}
                    </p>
                    <p className="text-[#b624ff] font-formula1bold">
                      {fastestTimes.s1.toFixed(3)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className="text-[10px] font-formula1"
                      style={{ color: fastestTimes.s2Color }}
                    >
                      {fastestTimes.s2Driver}
                    </p>
                    <p className="text-[#b624ff] font-formula1bold">
                      {fastestTimes.s2.toFixed(3)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className="text-[10px] font-formula1"
                      style={{ color: fastestTimes.s3Color }}
                    >
                      {fastestTimes.s3Driver}
                    </p>
                    <p className="text-[#b624ff] font-formula1bold">
                      {fastestTimes.s3.toFixed(3)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 w-full py-6 px-10 border-t border-white/5">
                <div className="flex flex-col items-center border-r border-white/10">
                  <span className="text-[10px] text-gray-500 font-formula1">
                    COUNTRY
                  </span>
                  <span className="font-formula1bold text-sm uppercase">
                    {row.country}
                  </span>
                </div>
                <div className="flex flex-col items-center border-r border-white/10">
                  <span className="text-[10px] text-gray-500 font-formula1">
                    CITY
                  </span>
                  <span className="font-formula1bold text-sm uppercase">
                    {row.city}
                  </span>
                </div>
                <div className="flex flex-col items-center border-r border-white/10">
                  <span className="text-[10px] text-gray-500 font-formula1">
                    CORNERS
                  </span>
                  <span className="font-formula1bold text-sm">{row.corners}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 font-formula1">
                    LENGTH
                  </span>
                  <span className="font-formula1bold text-sm">
                    {row.length} KM
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {display_mapData.map((row, i) => (
  <div
    key={`fastest-${i}`}
    className="relative w-[800px] h-auto shadow-lg rounded-[22px] overflow-hidden flex border border-white/10"
    style={{ backgroundColor: fastestTimes.fastestLapColor || "#14131a" }}
  >
    {/* 🔥 Background Italic Watermark */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <p className="text-[140px] font-formula1bold italic text-white/30 tracking-widest select-none">
        FASTEST
      </p>
    </div>

    {/* Content Layer */}
  <div className="relative flex h-full w-full items-end p-1">
      <div className="backdrop-blur-md bg-white/2 border border-white/20 rounded-xl px-3 py-1 shadow-lg">
        <p className="font-formula1bold text-[22px] uppercase tracking-tighter">
          {fastestTimes.fastestLapDriver || "Unknown Driver"}
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 pb-17">
        <div className="rounded-full shadow-sm bg-[#2d2d35] px-3">
          <p className="font-titiliumreg p-0.5">
            {fastestTimes.fastestLapDriver || "—"} -{" "}
            {fastestTimes.fastestLapTeam || "—"}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="rounded-full shadow-sm bg-[#2d2d35] px-3 flex items-center">
            <p className="font-titiliumbold p-0.5">
              Lap {fastestTimes.fastestLapLap || "-"}
            </p>
          </div>

          <div className="rounded-full shadow-sm bg-[#2d2d35] px-3 flex items-center">
            <p className="font-titiliumbold p-0.5">
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
))}
      </div>    
    </div>
  );
}
