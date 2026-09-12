// src/components/views/PriceForecast.jsx
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  ArrowUpRight, 
  TrendingUp, 
  Calendar,
  RefreshCw,
  Clock
} from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/PriceForecast.css';

const PriceForecast = () => {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  const cropEmojis = {
    Wheat: '🌾',
    Cotton: '☁️',
    Groundnut: '🥜',
    Tomato: '🍅',
    Onion: '🧅',
    Potato: '🥔',
  };

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const res = await api.prices.getForecast(selectedCrop);
      if (res?.success) {
        setForecastData(res);
      }
    } catch (err) {
      console.error('Failed to load forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [selectedCrop]);

  const trajectory = forecastData?.forecastTrajectory || [];
  const currentPrice = forecastData?.currentModalPrice || 2450;

  // Chart coordinate calculation
  const svgWidth = 650;
  const svgHeight = 180;
  const paddingX = 50;
  const paddingY = 25;

  const prices = trajectory.map(t => t.price);
  const minP = Math.min(...(prices.length ? prices : [2300])) * 0.98;
  const maxP = Math.max(...(prices.length ? prices : [2600])) * 1.02;

  const points = trajectory.map((item, index) => {
    const x = paddingX + (index / (Math.max(1, trajectory.length - 1))) * (svgWidth - 2 * paddingX);
    const y = svgHeight - paddingY - ((item.price - minP) / (maxP - minP)) * (svgHeight - 2 * paddingY);
    return { ...item, x, y };
  });

  const linePath = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`, '');

  return (
    <div className="price-forecast-container">
      {/* Header */}
      <div className="view-header-strip">
        <div>
          <h1>AI Agricultural Price Forecast & Decision Intelligence</h1>
          <p>Machine-learning price projection factoring historical Mandi arrivals, festival demand, and MSP floors</p>
        </div>

        <div className="forecast-crop-select">
          <label>Forecast Crop:</label>
          <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
            <option value="Wheat">🌾 Wheat (Ghau)</option>
            <option value="Cotton">☁️ Cotton (Kapas)</option>
            <option value="Groundnut">🥜 Groundnut (Magfali)</option>
            <option value="Tomato">🍅 Tomato</option>
            <option value="Onion">🧅 Onion</option>
            <option value="Potato">🥔 Potato</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <RefreshCw size={28} className="spin-anim" />
          <p>Running neural price forecast model for {selectedCrop}...</p>
        </div>
      ) : (
        <>
          {/* Top Row: Current Price + Prediction Pills */}
          <div className="forecast-top-row">
            <div className="current-price-card">
              <div className="current-crop-avatar">{cropEmojis[selectedCrop] || '🌾'}</div>
              <div className="current-crop-info">
                <h3>{selectedCrop}</h3>
                <div className="current-crop-price-label">Current APMC Benchmark</div>
                <div className="current-crop-price-val">₹ {currentPrice} <small>/ qtl</small></div>
              </div>
            </div>

            <div className="forecast-cards-group">
              {trajectory.slice(0, 3).map((item, i) => (
                <div key={i} className="projection-card">
                  <div className="proj-card-time">{item.label}</div>
                  <div className="proj-card-price">₹ {item.price}</div>
                  <div className="proj-card-conf text-emerald">
                    <ArrowUpRight size={13} /> {item.confidence}% Confidence
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forecast Chart Card */}
          <div className="forecast-chart-card">
            <div className="chart-header-row">
              <div className="chart-title">
                <Sparkles size={18} className="text-emerald" />
                <span>30-Day Predictive Trajectory Curve</span>
              </div>
              <span className="market-sentiment-tag">{forecastData?.sentiment}</span>
            </div>

            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="forecast-svg-chart">
              {/* Reference Grid lines */}
              <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#f1f5f9" strokeDasharray="3" />
              <line x1={paddingX} y1={svgHeight / 2} x2={svgWidth - paddingX} y2={svgHeight / 2} stroke="#f1f5f9" strokeDasharray="3" />
              <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#e2e8f0" />

              {/* Line path */}
              <path d={linePath} fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />

              {/* Dots */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                  <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">
                    ₹{p.price}
                  </text>
                  <text x={p.x} y={svgHeight - 8} textAnchor="middle" fontSize="10" fill="#64748b">
                    {p.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* AI Selling Recommendation Callout */}
          <div className="forecast-insight-banner">
            <div className="insight-icon-box">
              <Lightbulb size={24} />
            </div>
            <div className="insight-text-box">
              <h4>KisanSetu Best Time to Sell Advice</h4>
              <p>
                <strong>Optimal Window:</strong> {forecastData?.bestTimeToSell}.
                <br />
                <strong>Arrival Influx Analysis:</strong> {forecastData?.arrivalTrend}. Holding your Grade A batch until day 10 can yield up to +4.5% higher farm gate realizations.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PriceForecast;
