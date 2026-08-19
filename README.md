# F1nalyse

## Overview

F1nalyse is a Formula 1 analytics platform that combines data engineering, machine learning, and web development to provide interactive visualisations and race predictions. The platform allows users to explore historical Formula 1 data, analyse driver and team performance, and view machine learning predictions for upcoming races.

---

## Features

### Race Analytics

* Driver leaderboards
* Circuit information
* Fastest lap statistics
* Session summaries

### Interactive Visualisations

* Tyre stint analysis
* Lap time comparisons
* Driver performance trends
* Race strategy insights

### Machine Learning Predictions

* Predicts finishing positions for upcoming races
* Uses historical race data and engineered features
* Trained using XGBoost Regressor
* Evaluated using Mean Absolute Error (MAE)

### Automated Data Pipeline

* Automated workflows using GitHub Actions
* Data retrieval and processing without manual intervention
* Automated model training and prediction generation

---

## Technologies Used

### Data Collection

* FastF1 API
* OpenF1 API

### Data Processing

* Python
* Pandas
* NumPy

### Machine Learning

* XGBoost
* Scikit-learn

### Frontend

* React
* Vite
* Recharts

### Automation

* GitHub Actions
* YAML Workflows

### Data Storage

* CSV-based relational data model

---

## System Architecture

The platform follows a complete data pipeline:

1. Extract data from FastF1 and OpenF1 APIs
2. Clean and validate raw race data
3. Transform data into structured relational tables
4. Perform feature engineering
5. Train machine learning models
6. Generate race predictions
7. Update website visualisations

---

## Machine Learning Model

F1nalyse uses **XGBoost Regressor** to predict Formula 1 race finishing positions.

### Why XGBoost?

* Handles non-linear relationships effectively
* Performs well on structured tabular data
* Supports feature interactions
* Includes regularisation to reduce overfitting
* Produces strong predictive performance for sports analytics

### Model Evaluation

The model was evaluated using **Mean Absolute Error (MAE)**.

MAE measures the average difference between predicted and actual finishing positions.

Training MAE:

* 3.50 positions

Testing MAE:

* 3.30 positions

These results indicate that the model generalises well to unseen data while maintaining consistent predictive performance.

---

## Project Structure

```text
F1nalyse/
│
├── Data/
│   ├── Drivers.csv
│   ├── Results.csv
│   ├── Sessions.csv
│   ├── Laps.csv
│   └── Telemetry.csv
│
├── Models/
│   └── XGBoost Model
│
├── Frontend/
│   ├── Components
│   ├── Pages
│   └── Visualisations
│
├── Workflows/
│   └── GitHub Actions YAML Files
│
└── Scripts/
    ├── Data Collection
    ├── Data Processing
    └── Model Training
```

---

## Future Improvements

* Incorporate weather data into predictions
* Add driver and constructor championship forecasts
* Predict qualifying results
* Implement real-time race analytics
* Migrate from CSV storage to PostgreSQL
* Deploy machine learning inference through a dedicated API

---

## Author

**Kieran Daanoy**

---

## Disclaimer

This project is an independent academic project and is not affiliated with Formula 1, FIA, FastF1, OpenF1, or any Formula 1 team.
