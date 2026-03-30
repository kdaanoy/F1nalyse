import Navbar from "./components/Navbar"
import Session from "./components/Session"
import StatFeature1 from "./components/StatFeature1"
import StatFeature2 from "./components/StatFeature2"
import Predict2026 from "./components/Predict2026"
import { useState, useEffect } from "react";

function App() {

  // State variables to control the key variables of the webpage
  const [activeYear, setActiveYear] = useState(null);
  const [activeGP, setActiveGP] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [laps, setLaps] = useState([]);
  const [activatePredict, setActivatePredict] = useState(false);

  return (
    <div className = "min-h-screen bg-[#14131a] text-white overflow-hidden">
      <Navbar 

        // Pass in state variables and functions for setting and accessing them
        activeYear={activeYear} setActiveYear={setActiveYear}
        activeGP={activeGP} setActiveGP={setActiveGP}
        activeSession={activeSession} setActiveSession={setActiveSession}
        setActivatePredict={setActivatePredict}
      />  
      
      <Session
       
        // Pass in state variables to access and display content 
        activeYear={activeYear}
        activeGP={activeGP}
        activeSession={activeSession}
        setLaps={setLaps}
      />
      <StatFeature1 

        // Pass in the laps data and active year to display stints for all drivers
        laps={laps}
        activeYear={activeYear}
      />
      <StatFeature2 

        // Pass in the laps data to display the lap times for each driver
        laps={laps}
      />
      <Predict2026 

        // Pass in the state variable of the predict component to control visibility
        activatePredict={activatePredict}
        close={() => setActivatePredict(false)}
      />
    </div>
  )
}

export default App
