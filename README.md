# 🚜 KisanSetu — Strengthening Market Linkages & Price Discovery for Farmers

An AI-powered agricultural market intelligence platform designed for Indian farmers. KisanSetu integrates **Real-time Mandi Wholesale Prices**, **Gemini AI RAG Assistant with Multilingual Voice (Gujarati, Hindi, English)**, **3-Day ML Price Forecasting (XGBoost & Random Forest)**, **Buyer Marketplace**, and **Admin Portal**.

---

## 🌟 Main Project Features

1. **🎤 Multilingual Voice AI Assistant (`/assistant`)**:
   - Web Speech API for voice speech-to-text in Gujarati (`gu-IN`), Hindi (`hi-IN`), and English (`en-US`).
   - Text-to-Speech (`window.speechSynthesis`) audio output with 🔊 Speak, ⏹ Stop, 🔇 Mute controls.
   - Large interactive microphone button with voice UI state indicators (🎤 Tap to Speak, 🔴 Listening..., 📝 Processing..., 🤖 AI Response, 🔊 Playing Answer...).
   - Backend Gemini 1.5 Flash RAG service with live MongoDB market context.

2. **📈 3-Day Machine Learning Price Forecast (`/prediction`)**:
   - Time-series price regression models (XGBoost Regressor & Random Forest Regressor).
   - 3-day future price trajectories (Day 1, Day 2, Day 3) with 95% confidence bands.
   - Evaluated metrics: **MAE**, **RMSE**, and **R² Validation Score**.
   - Smart selling recommendation badges:
     - 🟢 **Good time to sell**
     - 🟡 **Consider waiting**
     - 🔴 **Price may decrease**

3. **📊 Live APMC Mandi Rates (`/markets`)**:
   - Integrated with keyless Mandi API (`https://mandi-api.vercel.app/v1/prices`).
   - State filtering (Maharashtra, Gujarat, Punjab, UP, MP, Karnataka).
   - Commodity filtering (Onion, Tomato, Wheat, Potato, Cotton, Groundnut, Soyabean, Mustard, etc.).
   - Background MongoDB sync for data persistence.

4. **🤝 Buyer Marketplace (`/buyers`)**:
   - Direct connection between farmers and verified institutional buyers, food processors, and exporters.
   - Filters by crop, location, quantity required, and offered rate per quintal.
   - Offer submission and direct communication.

5. **⚙️ Admin Portal (`/admin`)**:
   - Manage crops, mandis, daily price entries, buyer listings, CSV dataset uploads, and ML system statistics.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, HTML5, CSS3, Tailwind CSS, Axios, Lucide React Icons.
- **Backend API**: Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, BcryptJS.
- **AI & RAG**: Google Gemini API (`@google/generative-ai` / REST API), Web Speech API, SpeechSynthesis API.
- **ML Engine**: Python, Flask, Scikit-Learn, XGBoost, Pandas, NumPy, Joblib.

---

## 📂 Project Architecture & Folder Structure

```
SIH_HACKATHON/
│
├── frontend/                     # React + Vite Frontend UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/             # AIChatbot (Voice & Text Assistant)
│   │   │   ├── views/            # MarketPrices, PriceForecast, BuyerMarketplace, AdminPanel
│   │   │   ├── modals/           # AddCropModal, BuyerOfferModal, EditProfileModal
│   │   │   └── layout/           # Header, Sidebar, Footer
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT & fallback handlers
│   │   └── App.jsx
│   └── package.json
│
├── farmer-market-backend/        # Express Node.js REST API Server
│   ├── controllers/              # auth, price, prediction, chat, buyer, admin controllers
│   ├── models/                   # User, Crop, MarketPrice, Prediction, Buyer, ChatHistory
│   ├── routes/                   # auth, price, prediction, chat, buyer, admin routes
│   ├── services/                 # geminiService, mandiApiService, mlService
│   ├── middleware/               # authMiddleware, roleMiddleware, errorMiddleware
│   ├── tests/                    # Jest/Node API test suite
│   ├── server.js                 # Entry point (Port 5000)
│   └── package.json
│
└── farmer-price-discovery/       # Python Machine Learning Service
    ├── data/                     # market_prices.csv historical dataset
    ├── ml/
    │   ├── model/                # price_model.pkl & model_meta.pkl
    │   ├── train.py              # XGBoost/RandomForest model training pipeline
    │   ├── predict.py            # 3-day recursive forecasting engine
    │   ├── app.py                # Flask API server (Port 5001)
    │   ├── tests/                # Pytest ML test suite
    │   └── requirements.txt
    └── README.md
```

---

## 🔑 Environment Variables Setup (`.env`)

Create a `.env` file in `farmer-market-backend/`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/kishansetu
JWT_SECRET=kishansetu_super_secret_jwt_key_2026
GEMINI_API_KEY=your_google_gemini_api_key_here
ML_API_URL=http://localhost:5001
```

Create a `.env` file in `farmer-price-discovery/`:

```env
PORT=5001
FLASK_ENV=development
```

---

## 🚀 How to Run the Complete System

### 1. Start Python ML Price Forecasting API (Port 5001)
```bash
cd farmer-price-discovery/ml
pip install -r requirements.txt
python app.py
```
*(Runs Flask service on `http://localhost:5001`)*

### 2. Start Node.js Express Backend Server (Port 5000)
```bash
cd farmer-market-backend
npm install
npm run dev
```
*(Runs Express server on `http://localhost:5000`)*

### 3. Start React Frontend UI (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
*(Opens web app on `http://localhost:5173`)*

---

## 🧪 Running Automated Test Suites

### Run Backend API Unit Tests:
```bash
cd farmer-market-backend
node tests/api.test.js
```

### Run Python ML Model Tests:
```bash
cd farmer-price-discovery/ml/tests
python test_ml.py
```

---

## 📄 License & Attribution

Sourced agricultural data powered by Ministry of Agriculture and Farmers Welfare (data.gov.in) & Mandi Price API. Built for farmer empowerment and price discovery in India.