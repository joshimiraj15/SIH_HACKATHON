import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecommendationCard from '../components/RecommendationCard';
import PricePredictionChart from '../components/PricePredictionChart';
import MarketComparisonTable from '../components/MarketComparisonTable';
import { Wheat } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function FarmerDashboard() {
  const [commodities] = useState(['Tomato', 'Wheat', 'Onion', 'Potato']);
  const [markets] = useState(['Rajkot Mandi', 'Gondal Mandi', 'Surat Mandi']);
  
  const [selectedCommodity, setSelectedCommodity] = useState('Tomato');
  const [selectedMarket, setSelectedMarket] = useState('Rajkot Mandi');

  const [predictionData, setPredictionData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const predRes = await axios.get(`${API_BASE}/predictions/3-day/${selectedCommodity}/${selectedMarket}`);
      setPredictionData(predRes.data.data);

      const compRes = await axios.get(`${API_BASE}/prices/comparison?commodity=${selectedCommodity}`);
      setComparisonData(compRes.data);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.response?.data?.message || 'Error communicating with backend service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedCommodity, selectedMarket]);

  return (
    <div className="space-y-8">
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md shadow-lg">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Wheat className="w-5 h-5 text-emerald-400" />
          <span>Select Commodity & Mandi</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Commodity / Crop
            </label>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-emerald-500 transition-all"
            >
              {commodities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Target Mandi / Market
            </label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-emerald-500 transition-all"
            >
              {markets.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium">Running XGBoost ML prediction engine...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {!loading && predictionData && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 font-medium">Today's Modal Price</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">₹{predictionData.current_price}</span>
            </div>

            {predictionData.predictions.map((p, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-emerald-500/30 p-4 rounded-xl text-center">
                <span className="text-xs text-emerald-400 font-medium">Day {idx + 1} ({p.date.split('-').slice(1).join('/')})</span>
                <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">₹{p.predicted_price}</span>
              </div>
            ))}
          </div>

          <RecommendationCard data={predictionData} />
          <PricePredictionChart data={predictionData} />
          {comparisonData && <MarketComparisonTable comparisonData={comparisonData} />}
        </>
      )}
    </div>
  );
}
