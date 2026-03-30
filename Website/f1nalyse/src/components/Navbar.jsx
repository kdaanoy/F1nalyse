// Imports used
import { MdDateRange } from "react-icons/md";
import { IoIosArrowUp } from "react-icons/io";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { FaRoad } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FaQuestion } from "react-icons/fa";
import { useState, useEffect } from "react";
import MenuYear from "./MenuYear";
import MenuGP from "./MenuGP";
import MenuSession from "./MenuSession";
import Papa from "papaparse";
import PropagateLoader from "react-spinners/PropagateLoader";

// A list of all years that will be displayed in the year dropdown menu
const yearInfo = [
    "2026",
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
];

// A mapping of session types to their order number
const sessionOrder = {
    "Practice 1": 1,
    "Practice 2": 2,
    "Practice 3": 3,
    "Sprint Shootout": 4,
    "Sprint Qualifying": 5,
    Sprint: 6,
    Qualifying: 7,
    Race: 8,
};

// A mapping of GP names to their rough order number in the calendar, used for sorting the GP dropdown menu
const circuitOrder = {
    "Australian Grand Prix": 1,
    "United States Grand Prix": 18,
    "Bahrain Grand Prix": 4,
    "Azerbaijan Grand Prix": 16,
    "Barcelona-Catalunya Grand Prix": 9,
    "German Grand Prix": 24,
    "Hungarian Grand Prix": 13,
    "São Paulo Grand Prix": 20,
    "Singapore Grand Prix": 17,
    "Grand Prix de Monaco": 8,
    "Gran Premio d'Italia": 15,
    "Austrian Grand Prix": 10,
    "Grand Prix de France": 25,
    "Gran Premio de la Cicudad de México": 19,
    "Chinese Grand Prix": 2,
    "British Grand Prix": 11,
    "Russian Grand Prix": 26,
    "Belgian Grand Prix": 12,
    "Japanese Grand Prix": 3,
    "Grand Prix du Canada": 7,
    "Abu Dhabi Grand Prix": 23,
    "Emilia Romagna Grand Prix": 28,
    "Turkish Grand Prix": 27,
    "Tuscan Grand Prix": 29,
    "Nürburgring GP-Strecke": 30,
    "Grande Premio de Portugal": 31,
    "Saudi Arabian Grand Prix": 5,
    "Qatar Grand Prix": 22,
    "Miami Grand Prix": 6,
    "Dutch Grand Prix": 14,
    "Las Vegas Grand Prix": 21,
};

// Pass the active year, GP, and session along with the functions to set them and also a function for predicting races
export default function Navbar({
    activeYear,
    setActiveYear,
    activeGP,
    setActiveGP,
    activeSession,
    setActiveSession,
    setActivatePredict,
}) {
    // State variables using the useState to control the menus and the loading state for fetching data
    const [activeYearMenu, setActiveYearMenu] = useState(false);
    const [activeGPMenu, setActiveGPMenu] = useState(false);
    const [activeSessionMenu, setActiveSessionMenu] = useState(false);
    const [gps, setGPS] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);

    // A function used to parse the year from the date in the Session.csv which can be in either 2 formats
    function parseYear(dateStr) {
        // If the string is empty then return a null value
        if (!dateStr) 
            return null;

        // If the date contains a / then it is in the format DD/MM/YYYY which is used when fetching data from 2018-2025
        if (dateStr.includes("/")) {
            const [day, month, y] = dateStr.split(" ")[0].split("/");
            return parseInt(y);
        }

        // If the date contains a - then it is in the format YYYY-MM-DD which is used when fetching data from 2026
        if (dateStr.includes("-")) {
            return parseInt(dateStr.split(" ")[0].split("-")[0]);
        }

        return null;
    }

    // useEffect for checking if there is a given year and if there is then check all circuits for that year
    useEffect(() => {
        // Return nothing if there is no active year
        if (!activeYear) 
            return;

        // Functions used to set the activeGP to null, set the list of GPs to an empty list, set the GP menu to false and set the loading state to true
        // while fetching
        setActiveGP(null);
        setGPS([]);
        setActiveGPMenu(false);
        setLoading(true);

        // fetch(`/data/Session.csv`)
        //   .then((res) => res.text())
        //   .then((csv) => {
        //     const cleanCsv = csv
        //       .replace(/\r\n/g, "\n")
        //       .replace(/\r/g, "\n")
        //       .replace(/\uFEFF/g, "");
        //     const parsed = Papa.parse(cleanCsv, { header: true });
        //     console.log(parsed.data);
        //   });

        // Fetch the Session csv file and parse the data to filter out the sessions for the active year
        fetch(`/data/Session.csv`)
            .then((res) => res.text())
            .then((csv) => {
                // Using the PapaParse library to parse the csv data
                const parsed = Papa.parse(csv, { header: true });
                console.log(parsed.data);

                // Filter the sessions for the active year using the parseYear function to retrieve the year from the date
                const gpYears = parsed.data.filter((row) => {
                    if (!row.DateOfSession) 
                        return false;
                    console.log(row.DateOfSession);

                    const year = parseYear(row.DateOfSession);
                    console.log(year);
                    return parseInt(year) === parseInt(activeYear);
                });

                // Get the distinct circuits from the sessions for the current year
                const distinctGps = [...new Set(gpYears.map((r) => r.CircuitID))];

                // Fetch each individual circuit from the Circuit csv file and retrieve the circuits for the current year
                fetch(`/data/Circuit.csv`)
                    .then((res) => res.text())
                    .then((csv) => {
                        // Using the PapaParse library to parse the csv data
                        const circuitParsed = Papa.parse(csv, { header: true });
                        console.log(circuitParsed);

                        // Map the circuit IDs to their names
                        const gpName = circuitParsed.data
                            .filter((row) => distinctGps.includes(row.ID))
                            .map((row) => row.Name);
                        console.log(gpName);

                        // Sort the GP names based on their order number in the circuitOrder mapping and if their number is not in the mapping then
                        // give it a default number of 100 which means they are at the end of the list
                        const sortedGps = gpName.sort((a, b) => {
                            return (circuitOrder[a] || 100) - (circuitOrder[b] || 100);
                        });

                        // Set the list of GPs to the sorted liist and set the loading state to false
                        setGPS(sortedGps);
                        setLoading(false);
                    });
            });
    }, [activeYear]);

    // useEffect for checking if there is a given year and GP
    useEffect(() => {
        // If there is no active GP or year then return nothing
        if (!activeGP || !activeYear) 
            return;

        // Functions used to set the sessions to an empty list and the session menu to false
        setSessions([]);
        setActiveSessionMenu(false);

        // Fetch the Circuit csv file to retrieve the circuit ID for the active GP
        fetch(`/data/Circuit.csv`)
            .then((res) => res.text())
            .then((csv) => {
                // Using the PapaParse library to parse the csv data
                const parsed = Papa.parse(csv, { header: true });
                console.log(parsed.data);

                // Find the circuit ID for the active GP by matching the name of the GP to the Name column in the csv file
                const gpCircuitID = parsed.data.find((row) => row.Name == activeGP).ID;
                console.log(gpCircuitID);

                // Fetch the Session csv file and filter the sessions to retrieve the sessions for the active GP and year using the CircuitID
                fetch(`/data/Session.csv`)
                    .then((res) => res.text())
                    .then((csv) => {
                        // Using the PapaParse library to parse the csv data
                        const sessionParsed = Papa.parse(csv, { header: true });
                        console.log(sessionParsed.data);

                        // Filter the sessions for the active GP and year using the CircuitID and the date of the session
                        const gpSessions = sessionParsed.data.filter((row) => {
                            return (
                                // Return the sessions where the circuit ID matches the active GP and also if the date includes the active year
                                row.CircuitID === gpCircuitID &&
                                row.DateOfSession.includes(activeYear)
                            );
                        });
                        console.log(gpSessions);

                        // Ge the distinct sessions for the active GP
                        const distinctSessions = [
                            ...new Set(gpSessions.map((r) => r.Type)),
                        ];

                        // Sort the sessions based on their order number in the sessionOrder mapping and if their number is not in the mapping then
                        // give it a default number of 10 which means they are at the end of the list
                        const sortedSessions = distinctSessions.sort((a, b) => {
                            return (sessionOrder[a] || 10) - (sessionOrder[b] || 10);
                        });
                        console.log(sortedSessions);

                        // Set the list of sorted sessions
                        setSessions(sortedSessions);
                    });
            });
    }, [activeYear, activeGP]);

    return (
        // The navbar which contains the dropdown menus for the year, GP and the session
        <nav className="relative top-0 w-full z-50 transition-all duration-300 bg-[#14131a] backdrop-blur-sm">

            {/* A container for the navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* A flex container to center the dropdown menus */}
                <div className="flex justify-center items-center h-14 sm:h-16 md:h-20 gap-2">
                    {/* <div className="pr-4">
                    <img src="/kd.png" className="w-8 h-6 sm:w-8 sm:h-8"></img>
                </div> */}

                    {/* The dropdown menu for the year selection */}
                    <div className="relative w-full max-w-[200px]">

                        {/* The button that opens the menu */}
                        <button

                            /* When the button is clicked, it sets the activeYearMenu state to the opposite depending on its current value */
                            onClick={() => {
                                setActiveYearMenu(!activeYearMenu);
                            }}

                            /* Styling for the button changes depending on whether the menu is active or not */
                            className={`${activeYearMenu
                                ? "rounded-br-none rounded-bl-none"
                                : "rounded-br-md rounded-bl-md"
                                } rounded-tl-md rounded-tr-md bg-[#2d2d35] p-1.5 w-full rounded-md text-black hover:bg-[#44444b] duration-200 
                                flex items-center gap-1 cursor-pointer hover:outline-2 hover:outline-white ease-in`}
                        >

                            {/* Checks if the activeYear is null and therefore sets the text of the button to "Select Year" or the active year */}
                            {activeYear === null ? (

                                // If there is no active year then set the text to "Select Year"
                                <div className="flex items-center w-full text-white">
                                    <MdDateRange />
                                    <p className="font-formula1bold pl-1">Select Year</p>
                                    <IoIosArrowDown className="ml-auto" />
                                </div>
                            ) : (

                                // If there is an active year then show the active year as the text of the button
                                <div className="flex items-center w-full text-white">
                                    <MdDateRange />
                                    <p className="font-formula1bold pl-1">{activeYear}</p>
                                    <IoIosArrowDown className="ml-auto" />
                                </div>
                            )}
                        </button>

                        {/* The dropdown menu itself with the list of years which is shown or hidden depending on the activeYearMenu state */}
                        <div
                            className={`${activeYearMenu
                                ? "top-full"
                                : "top-1/2 opacity-0 pointer-events-none"
                                } w-full bg-[#2d2d35] absolute left-0 duration-200 rounded-bl-md rounded-br-md`}
                        >

                            {/* The list of years which maps through the yearInfo list and creates a MenuYear component which is basically a
                            list item elements for each year and passes the year and the functions to set the active year and the menu state */}
                            <ul>
                                {yearInfo.map((item, index) => {
                                    return (
                                        <MenuYear
                                            item={item}
                                            key={index}
                                            setActiveYear={setActiveYear}
                                            setActiveYearMenu={setActiveYearMenu}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* The dropdown menu for the GP selection similar to the year dropdown menu */}
                    <div className="relative w-full max-w-[350px]">

                        {/* The button that opens the menu */}
                        <button

                            /* When the button is clicked, it sets the activeGPMenu state to the opposite depending on its current value */
                            onClick={() => {
                                setActiveGPMenu(!activeGPMenu);
                            }}

                            /* Styling for the button changes depending on whether the menu is active or not */
                            className={`${activeGPMenu
                                ? "rounded-br-none rounded-bl-none"
                                : "rounded-br-md rounded-bl-md"
                                } rounded-tl-md rounded-tr-md bg-[#2d2d35] p-1.5 w-full rounded text-black hover:bg-[#44444b] duration-200 flex items-center gap-1 cursor-pointer hover:outline-2 hover:outline-white ease-in`}
                        >

                            {/* Checks if the activeGP is null and therefore sets the text of the button to "Select GP" or the active GP */}
                            {activeGP === null ? (

                                // If there is no active GP then set the text to "Select GP"
                                <div className="flex items-center w-full text-white">
                                    <FaRoad />
                                    <p className="font-formula1bold pl-1">Select GP</p>
                                    <IoIosArrowDown className="ml-auto" />
                                </div>
                            ) : (

                                // If there is an active GP then show the active GP as the text of the button
                                <div className="flex items-center w-full text-white">
                                    <FaRoad />
                                    <p className="font-formula1bold pl-1.5 flex-1 text-left truncate">
                                        {activeGP}
                                    </p>
                                    <IoIosArrowDown className="ml-auto" />
                                </div>
                            )}
                        </button>

                        {/* The dropdown menu itself with the list of GPs which is shown or hidden depending on the activeGPMenu state */}
                        <div
                            className={`${activeGPMenu
                                ? "top-full"
                                : "top-1/2 opacity-0 pointer-events-none"
                                } w-full left-0 bg-[#2d2d35] absolute duration-200 rounded-bl-md rounded-br-md overflow-hidden text-white`}
                        >
                            {/* The list of GPs which maps through the gps list and creates a MenuGP component which is basically a
                            list item elements for each GP and passes the GP and the functions to set the active GP and the menu state */}
                            <ul className="max-h-90 overflow-y-auto">
                                {gps.map((item, index) => {
                                    return (
                                        <MenuGP
                                            item={item}
                                            key={index}
                                            setActiveGP={setActiveGP}
                                            setActiveGPMenu={setActiveGPMenu}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* The dropdown menu for the session selection similar to the year and GP dropdown menu */}
                    <div className="relative w-full max-w-[350px]">

                        {/* The button that opens the menu */}
                        <button

                            /* When the button is clicked, it sets the activeSessionMenu state to the opposite depending on its current value */
                            onClick={() => {
                                setActiveSessionMenu(!activeSessionMenu);
                            }}

                            /* Styling for the button changes depending on whether the menu is active or not */
                            className={`${activeSessionMenu
                                ? "rounded-br-none rounded-bl-none"
                                : "rounded-br-md rounded-bl-md"
                                } rounded-tl-md rounded-tr-md bg-[#2d2d35] p-1.5 w-full rounded text-black hover:bg-[#44444b] duration-200 flex items-center gap-1 cursor-pointer hover:outline-2 hover:outline-white ease-in`}
                        >

                            {/* Checks if the activeSession is null and therefore sets the text of the button to "Select Session" or the active session */}
                            {activeSession === null ? (

                                // If there is no active session then set the text to "Select Session"
                                <div className="flex items-center w-full text-white">
                                    <GiFullMotorcycleHelmet />
                                    <p className="font-formula1bold pl-1">Select Session</p>
                                    <IoIosArrowDown className="ml-auto" />
                                </div>
                            ) : (

                                // If there is an active session then show the active session as the text of the button
                                <div className="flex items-center w-full text-white">
                                    <GiFullMotorcycleHelmet />
                                    <p className="font-formula1bold pl-1.5 flex-1 text-left truncate">
                                        {activeSession}
                                    </p>
                                    <IoIosArrowDown className="ml-auto" />
                                </div>
                            )}
                        </button>

                        {/* The dropdown menu itself with the list of sessions which is shown or hidden depending on the activeSessionMenu state */}
                        <div
                            className={`${activeSessionMenu
                                ? "top-full"
                                : "top-1/2 opacity-0 pointer-events-none"
                                } w-full left-0 bg-[#2d2d35] absolute duration-200 rounded-bl-md rounded-br-md overflow-hidden text-white`}
                        >

                            {/* The list of sessions which maps through the sessions list and creates a MenuSession component which is basically a
                            list item elements for each session and passes the session and the functions to set the active session and the menu state */}
                            <ul className="max-h-90 overflow-y-auto">
                                {sessions.map((item, index) => {
                                    return (
                                        <MenuSession
                                            item={item}
                                            key={index}
                                            setActiveSession={setActiveSession}
                                            setActiveSessionMenu={setActiveSessionMenu}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* A button for predicting future 2026 races */}
                    <div className="relative w-full max-w-[170px]">

                        {/* When the button is clicked, it sets the activatePredict state to true which will show the predict screen */}
                        <button
                            onClick={() => {
                                setActivatePredict(true);
                            }}
                            className={`text-white rounded-md bg-[#e10600] p-1.5 w-full rounded hover:bg-[#e10600]/90 duration-70 flex items-center gap-1 cursor-pointer hover:outline-2 hover:outline-white ease-in`}
                        >
                            <FaQuestion />
                            <p className="font-formula1bold pl-1.5 flex-1 text-left truncate">
                                Predict 2026
                            </p>
                        </button>
                    </div>
                </div>

                {/* A loading spinner that shows when the loading state is true while fetching data for the dropdown menus */}
                <div className="flex justify-center items-center">
                    {loading ? <PropagateLoader color="#ffffff" size={8} /> : null}
                </div>
            </div>
        </nav>
    );
}
