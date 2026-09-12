# 🌾 Kishan Setu — Agricultural Market Price Prediction & Price Discovery System

An end-to-end Machine Learning based Agricultural Price Forecasting & Price Discovery platform built for **“Strengthening Market Linkages and Price Discovery for Farmers”**.

---

## 🏗️ System Architecture

```
farmer-price-discovery/
├── data/
│   └── market_prices.csv           # Historical APMC price dataset
├── ml/                             # Python ML Forecasting Service (Port 5001)
│   ├── preprocessing.py            # Data cleaning & chronological sorting
│   ├── feature_engineering.py      # Lag (1-30), Rolling stats & Date breakdown
│   ├── train.py                    # XGBoost & Random Forest time-series training
│   ├── evaluate.py                 # MAE, RMSE, MAPE %, R2 evaluation metrics
│   ├── predict.py                  # Multi-step 3-day recursive forecasting engine
│   └── app.py                      # Flask REST API
├── backend/                        # Node.js & Express REST Backend (Port 5000)
│   ├── models/                     # MarketPrice, Prediction, Market schemas
│   ├── controllers/                # Price, Prediction, Mandi & Recommendation controllers
│   ├── services/mlService.js       # HTTP Client connecting Express to Flask ML API
│   └── server.js                   # Node Express server
└── frontend/                       # React.js SPA Dashboard (Port 3000)
    ├── src/components/             # PricePredictionChart, MarketComparisonTable, RecommendationCard
    └── src/pages/                  # FarmerDashboard, PriceDiscoveryPage, AdminMlDashboard
```

---

## ⚡ Quick Start & Run Instructions

### 1. Machine Learning Service (Python Flask - Port 5001)
```bash
# Install Python packages
pip install flask flask-cors pandas numpy scikit-learn xgboost joblib

# Train ML Models (Generates ml/model/price_model.pkl & model_meta.pkl)
python ml/train.py

# Start Flask ML REST API
python ml/app.py
```

### 2. Node.js Express Backend Service (Port 5000)
```bash
cd backend

# Install dependencies
npm install

# Seed MongoDB with 95 APMC market price records
node seed.js

# Start Express server
npm run dev
```

### 3. React Frontend Dashboard (Port 3000)
```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open your browser at **`http://localhost:3000`** to view the interactive farmer dashboard!
