import fastf1
from fastf1.ergast import Ergast
import csv

current_session = fastf1.get_session(2025, 'Mexico', 'R')
current_session.load(laps=True, telemetry=True)
drivers = current_session.drivers
laps = current_session.laps
print(f"Drivers in the session: {drivers}")
print(laps.LapNumber)
print(laps.pick_drivers('VER').pick_fastest().LapTime)

csv_file_path = "Circuit.csv"
with open(csv_file_path, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["ID", "Country", "City", "Name", "Turns", "Length", "Laps"])

    ergast = Ergast()

    startingYear = 2017

    for startingYear in range (2017, 2025):
        print(startingYear)
        
    currentYearRaces = ergast.get_circuits(season = 2017, result_type = 'raw')
    print(currentYearRaces)
    print(currentYearRaces[0]['circuitName'])
    print(currentYearRaces[0]['Location']['country'])
    print(currentYearRaces[0]['Location']['locality'])
    
    currentSession = fastf1.get_session(2025, 2, 'R')
    currentSession.load()
    print(len(currentSession.get_circuit_info().corners))
    print(currentSession.get_circuit_info)


    # currentYear = fastf1.get_event_schedule(2017)
    # print(currentYear.get_event_by_round(1).EventName)
    # print(currentYear.get_event_by_round(1).Country)
    # print(currentYear.get_event_by_round(1).Location)
    # print(currentYear.get_event_by_round(1).Corners)
    # print(currentYear.get_event_by_round(1).Length)
    # print(currentYear.get_event_by_round(1).Laps)

    
    
    # lastyear_session = fastf1.get_event_schedule(2024, 'Mexico', 'R)
    # lastyear_session.load(laps=True, telemetry=True)
    # lastyear_laps = lastyear_session.laps



    # print(lastyear_session.session_info)

    # for driver in drivers:
    #     driverAbr=current_session.get_driver(driver).Abbreviation
    #     try:
    #         fastest_lap_time = lastyear_laps.pick_drivers(driverAbr).pick_fastest().LapTime.total_seconds()
    #     except:
    #         fastest_lap_time = None
    #     writer.writerow([driverAbr, current_session.get_driver(driver).FullName, fastest_lap_time, current_session.name, current_session.event.Location, 2025])


# for driver in drivers:
#     driverAbr=current_session.get_driver(driver).Abbreviation
#     print(driverAbr)
#     print(laps.pick_drivers(driverAbr).pick_fastest().LapTime.total_seconds())
    

