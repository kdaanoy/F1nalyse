import fastf1

session = fastf1.get_session(2026, 6, "Q")
session.load()
results = session.results

print(results)