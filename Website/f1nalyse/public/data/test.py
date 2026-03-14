import pandas as pd

df = pd.read_csv("Website/f1nalyse/public/data/Session.csv")  # Read the CSV normally
df.to_csv("Session.csv", index=False, lineterminator="\n")  # Rewrite all lines with consistent LF