import fastf1

session = fastf1.get_session(2026, "Shanghai", "Q")
session.load()
results = session.results

qualifying = {}
for _, row in results.iterrows():
    qualifying[row['FullName']] = int(row['Position'])
print(qualifying)
