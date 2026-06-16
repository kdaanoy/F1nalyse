// Imports used
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import Papa from "papaparse";

export default function Predict2026({ activatePredict, close }) {

    // State for the list of circuits, team colours and the prediction data for the selected GP
    const [circuitgps, setCircuitGPs] = useState([]);
    const [predictionData, setPredictionData] = useState([]);
    const [teamColours, setTeamColours] = useState({});

    // List of all the grand prix with their name, round and date
    const grandprixes = [{ name: "Australian Grand Prix", round: 1, date: "03/08/2026" },
    { name: "Chinese Grand Prix", round: 2, date: "03/14/2026" },
    { name: "Japanese Grand Prix", round: 3, date: "03/29/2026" },
    { name: "Miami Grand Prix", round: 4, date: "05/03/2026" },
    { name: "Grand Prix du Canada", round: 5, date: "05/24/2026" },
    { name: "Grand Prix de Monaco", round: 6, date: "06/07/2026" },
    { name: "Barcelona-Catalunya Grand Prix", round: 7, date: "06/14/2026" },
    { name: "Austrian Grand Prix", round: 8, date: "06/28/2026" },
    { name: "British Grand Prix", round: 9, date: "07/05/2026" },
    { name: "Belgian Grand Prix", round: 10, date: "07/19/2026" },
    { name: "Hungarian Grand Prix", round: 11, date: "07/26/2026" },
    { name: "Dutch Grand Prix", round: 12, date: "07/23/2026" },
    { name: "Gran Premio d'Italia", round: 13, date: "09/06/2026" },
    { name: "Azerbaijan Grand Prix", round: 14, date: "09/26/2026" },
    { name: "Singapore Grand Prix", round: 15, date: "10/11/2026" },
    { name: "United States Grand Prix", round: 16, date: "10/25/2026" },
    { name: "Gran Premio de la Cicudad de México", round: 17, date: "11/01/2026" },
    { name: "São Paulo Grand Prix", round: 18, date: "11/08/2026" },
    { name: "Las Vegas Grand Prix", round: 19, date: "11/21/2026" },
    { name: "Qatar Grand Prix", round: 20, date: "11/29/2026" },
    { name: "Abu Dhabi Grand Prix", round: 21, date: "12/06/2026" }
    ]

    // State for the predicted GP which is set to the last GP that has already happened calculated using the current date 
    const [gpprediction, setGPPrediction] = useState(() => {

        // Create a new variable for the current date and filter the grand prix list to find the last GP that has happened
        const today = new Date();

        // Filter the grand prix list to find the last GP by checking if its less than or equal to the current date 
        // and then pop to get the last element of the list
        const lastGP = grandprixes
            .filter(gp => new Date(gp.date) <= today)
            .pop();

        // Return the latest GP round or 1 if there is no GP that has happened
        return lastGP?.round ?? 1;
    });

    // useEffect to fetch the circuit data and filter it to only include the circuits that are in the grand prixes list 
    // and then sort it
    useEffect(() => {

        // Fetch the data from the Circuit csv file and parse it using PapaParse
        fetch("/data/Circuit.csv").then((response) => response.text())
            .then((data) => {

                // Create a list of the circuit names from the grand prix list using the map function
                const validcircuits = grandprixes.map(gp => gp.name);

                // Filter the circuits to only include the ones that are in the validcircuits list
                const circuits = Papa.parse(data, { header: true }).data;
                const sortedCircuits = circuits
                    .filter(circuit => {

                        // Check if the circuits official name includes any of the valid circuit names from the grand prix 
                        // list. The some function is used to check if any of the valid circuit names are included in the circuit 
                        // official name
                        return validcircuits.some(shortName =>
                            circuit.OfficialName?.includes(shortName)
                        );
                    })

                    // Sort the circuits based on the round of the grand prixes list by finding the circuit name in the grand 
                    // prix list and comparing the rounds
                    .sort((circuit1, circuit2) => {
                        const circuitcompare1 = validcircuits.find(shortName => circuit1.OfficialName.includes(shortName));
                        const circuitcompare2 = validcircuits.find(shortName => circuit2.OfficialName.includes(shortName));

                        // Return the difference between the rounds of the 2 circuits to sort them in the correct order
                        return grandprixes.find(gp => gp.name === circuitcompare1).round - grandprixes.find(gp => gp.name === circuitcompare2).round;
                    });

                // Set the circuitGPs to the sorted circuits
                setCircuitGPs(sortedCircuits);
            });
    }, []);

    // useEffect to fetch the data from the Team csv file and create a mapping of the team names to their colours
    useEffect(() => {

        // Fetch the data from the Team csv file and parse it using PapaParse
        fetch("/data/Team.csv")
            .then((response) => response.text())
            .then((data) => {
                const result = Papa.parse(data, { header: true, skipEmptyLines: true }).data;

                // Create a dictionary mapping of the team names to their colours by looping through the result and setting the 
                // team name as the key and the colour as the value
                const colourMap = {};
                result.forEach(row => {
                    colourMap[row.TeamName] = row.Color;
                });

                // Set the colour map
                setTeamColours(colourMap);
                console.log(colourMap);
            });
    }, []);

    // useEffect to fetch the prediction data for the selected GP  when the predicted GP changes 
    useEffect(() => {

        // Filter the grand prix list to find the latest GP that has happened using the current date 
        const today = new Date();
        const lastGPIndex = grandprixes
            // Map the grand prix list to include the index of each GP
            .map((gp, index) => ({ ...gp, index }))

            // Filter through the GP list to only include the GP that have a date less than or equal to the current date
            .filter(gp => new Date(gp.date) <= today)

            // Map the filtered GP list to only include the index of the GP 
            .map(gp => gp.index)

            // Pop to get the last element of the list
            .pop() ?? 0;

        // Set the predicted GP using the index of the last GP plus one
        setGPPrediction(lastGPIndex + 1);
    }, []);

    // useEffect to fetch the prediction data for the selected GP 
    useEffect(() => {

        // If there is no predicted GP selected, return nothing
        if (!gpprediction) 
            return;

        // Fetch the data from the prediction csv file
        fetch(`/data/race${gpprediction}_predictions.csv`).then((response) => response.text())
            .then((data) => {

                // Parse the data using PapaParse and set the prediction data
                const predictions = Papa.parse(data, { header: true }).data;
                setPredictionData(predictions);
                console.log(predictions);
            });
    }, [gpprediction]);

    // Create a new variable for the current date and a function to return true or false 
    // depending on if todays date is greater than the given date
    const today = new Date();
    const accessible = (date) => {
        return (today >= date);
    }

    return (

        // If the activatePredict is true then show the screen with the prediction data, otherwise just hide it
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/80 transition-all duration-300 ease-in-out
        ${activatePredict ? "opacity-100 visible" : "opacity-0 invisible"}`}
        >

            {/* Used for the transition of the screen */}   
            <div
                className={`p-8  w-[100%] h-[100%] transition-transform duration-300
        ${activatePredict ? "scale-100" : "scale-95"}`}
            >

                <div className="flex justify-between items-start w-full h-full ">

                    <div className="flex flex-col grid-cols-1 gap-5 pl-30 overflow-y-auto pr-5 custom-scrollbar h-full">

                        {/* Map through the circuitgps and show a button for each circuit for predicting */}
                        {circuitgps.map((circuit, index) => {

                            // Find the grand prix for each circuit by checkig if the circuit official name includes the grand prix name 
                            const gpData = grandprixes.find(gp => circuit.OfficialName?.includes(gp.name));

                            // Check if there is a value for gpData and then return true or false depending on whether the current date is greater 
                            // than the grand prix date used to see whether to show the button or not
                            const showButton = gpData ? accessible(new Date(gpData.date)) : false;

                            return (

                                // When the user clicks the button set the predicted GP to the index of the button plus one and only show 
                                // the button depending on the date
                                <button onClick={() => showButton && setGPPrediction(index + 1)} key={index} className={`relative w-[400px] h-[150px] border-[1px] rounded-[20px] bg-[#14131a] 
                        border-white/10 flex-shrink-0 ${showButton ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
                                    <div className="pb-4 pl-3">
                                        <div className="font-formula1bold border border-white/10 rounded-full bg-[#ff0800] text-white w-[120px]">
                                            ROUND {index + 1}
                                        </div>
                                    </div>

                                    <h2 className="text-white font-formula1bold text-2xl uppercase tracking-tighter leading-none">
                                        {circuit.Name}
                                    </h2>
                                    <p className="text-gray-500 font-titiliumreg text-sm mt-2">
                                        {circuit.OfficialName}
                                    </p>

                                    {/* If the button is not allowed to be shown then show a message saying that the prediction is locked */}
                                    {!showButton ? (
                                        <div>
                                            Locked Until After Qualifying
                                        </div>
                                    ) : (null)}
                                </button>
                            )
                        })
                        }
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                        <div>
                            <div className="text-white font-formula1bold text-[22px] mt-2 pb-10 flex items-center justify-center">
                                <p>Predicted Finishing Order for the {grandprixes[gpprediction - 1]?.name} Grand Prix 2026</p>
                            </div>
                            <h2 className="flex flex-row flex-wrap gap-3">

                                {/* Map through the prediction data and show the top 3 predictions in a larger card */}
                                {predictionData.map((prediction, index) => {

                                    // Set the team colour and last name of the driver for the image
                                    const teamColour = teamColours[prediction.Team]
                                    const lastName = prediction.Driver?.split(" ").at(-1).toLowerCase();

                                    // If statement to only show the top 3 predictions in a larger card
                                    if (index + 1 <= 3) {

                                        return (
                                            <div
                                                key={index}
                                                className="relative flex flex-row w-[350px] h-[110px] rounded-xl"
                                                style={{ backgroundColor: teamColour }}>

                                                <span className="absolute inset-0 flex items-center justify-center text-[90px] font-formula1bold text-white/50 italic">
                                                    {index + 1}
                                                </span>

                                                <div className="relative w-25 h-20 overflow-hidden rounded-full translate-y-2.5">
                                                    <img

                                                        // Retrieve the image of the driver using the lastName variable declared earlier on
                                                        src={`/photos/${lastName}.avif`}
                                                        alt={prediction.Driver}
                                                        className="w-full h-full object-cover object-top scale-150 translate-y-4"
                                                    />
                                                </div>


                                                <div className="flex flex-col justify-center">
                                                    <p className="text-white font-formula1bold text-[20px] uppercase">
                                                        {prediction.Driver}
                                                    </p>
                                                    <p className="font-formula1bold text-sm uppercase">
                                                        {prediction.Team}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }

                                })}
                            </h2>
                        </div>

                        <div className="flex flex-row flex-wrap w-[710px] gap-2 pt-2">

                            {/* Map through the predictiond data for the rest of the drivers and show them in a smaller card version */}
                            {predictionData.map((prediction, index) => {

                                // If statement used due to error showing an extra card
                                if (index < 3 || index == 22) return null;

                                // Set the team colour and the actual position of the driver
                                const teamColour = teamColours[prediction.Team] || "#1c1c24";
                                const actualPosition = index + 1;
                                return (
                                    <div
                                        key={actualPosition}
                                        className="flex justify-between w-[350px] h-[45px] rounded-xl bg-[#14131a] px-4 items-center border border-white/5"
                                    >
                                        <span className="text-gray-500 font-formula1bold text-lg">
                                            {actualPosition}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <p className="text-white font-formula1bold text-xs uppercase">
                                                {prediction.Driver}
                                                <span className="text-gray-500 p-1">-</span>
                                                <span style={{ color: teamColour }}>{prediction.Team}</span>
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Button to close the prediction screen which calls the close function */}
                    <button onClick={close}>
                        <FaArrowRight className="text-white hover:text-gray-300 cursor-pointer text-[22px]" />
                    </button>
                </div>

            </div>

        </div>
    );
}