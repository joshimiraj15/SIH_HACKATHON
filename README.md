# 🌾 Kishan Setu — Strengthening Market Linkages & Price Discovery for Farmers

An end-to-end AI/ML-driven Agricultural Price Forecasting & Digital Marketplace platform built for **Smart India Hackathon (SIH)**.

---

## 📌 Overview

**Kishan Setu** empowers farmers with:
1. **Intelligent Price Forecasting**: Accurate 3-day multi-step APMC price predictions using Machine Learning (Random Forest & XGBoost time-series models) with confidence intervals.
2. **Transparent Price Discovery**: Real-time cross-mandi price comparison across districts and states to identify the best selling opportunities and maximize profits.
3. **Smart Selling Recommendations**: Data-driven recommendations indicating whether farmers should sell now or hold, along with market reliability indicators.
4. **Farmer Marketplace Backend**: Robust APIs for farmer crop listings, buyer offers, and order fulfillment.

---

## 🏗️ System Architecture & Directory Structure

```
SIH_HACKATHON/
│
├── farmer-price-discovery/             # Complete ML, Node backend & React Frontend Platform
│   ├── data/
│   │   └── market_prices.csv           # Historical APMC price dataset
│   ├── ml/                             # Python ML Microservice (Port 5001)
│   │   ├── preprocessing.py            # Data cleaning & chronological sorting
│   │   ├── feature_engineering.py      # Lag & rolling window stats
│   │   ├── train.py                    # Random Forest & XGBoost time-series training
│   │   ├── evaluate.py                 # Evaluation metrics (MAE, RMSE, MAPE %, R²)
│   │   ├── predict.py                  # Recursive 3-day forecasting engine
│   │   ├── app.py                      # Flask REST API
│   │   └── model/                      # Pre-trained models (price_model.pkl, model_meta.pkl)
│   ├── backend/                        # Node.js Express REST Backend (Port 5000)
│   │   ├── config/                     # MongoDB connection
│   │   ├── controllers/                # Price, Prediction, Mandi & Recommendation logic
│   │   ├── models/                     # MarketPrice, Prediction schemas
│   │   ├── routes/                     # API route declarations
│   │   ├── services/                   # ML microservice HTTP bridge
│   │   ├── seed.js                     # APMC historical market prices database seeder
│   │   └── server.js                   # Express server entry point
│   └── frontend/                       # Interactive React 18 SPA (Port 3000)
│       ├── src/components/             # Modern UI cards, charts & comparison tables
│       ├── src/pages/                  # Farmer Dashboard, Price Discovery & Admin ML Dashboard
│       └── vite.config.js              # Vite configuration
│
└── farmer-market-backend/              # Farmer & Buyer Marketplace Service
    ├── config/                         # Database connection
    ├── controllers/                    # Auth, Crops, Offers, Orders, Admin controllers
    ├── middleware/                     # JWT authentication & Role-based access control
    ├── models/                         # User, Crop, Offer, Order schemas
    ├── routes/                         # REST API routes
    └── server.js                       # Express marketplace server
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: 3.9+
- **MongoDB**: Installed & running locally on `mongodb://localhost:27017`

---

### Step 1: Start Machine Learning Forecasting Service (Port 5001)
```bash
cd farmer-price-discovery/ml
pip install flask flask-cors pandas numpy scikit-learn xgboost joblib
python app.py
```

### Step 2: Seed Database & Start Backend API Service (Port 5000)
```bash
cd farmer-price-discovery/backend
npm install
node seed.js
npm run dev # or node server.js
```

### Step 3: Start Frontend Interactive Dashboard (Port 3000)
```bash
cd farmer-price-discovery/frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, Axios
- **Backend**: Node.js, Express.js, Mongoose, JWT, CORS
- **ML / AI**: Python 3, Flask, Scikit-Learn, XGBoost, Pandas, NumPy, Joblib
- **Database**: MongoDB

---

## 👥 Contributors
- **SIH Hackathon Team**