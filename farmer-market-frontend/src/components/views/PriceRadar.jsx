// src/components/views/PriceRadar.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Sparkles, 
  DollarSign, 
  ChevronRight,
  RefreshCw,
  Navigation
} from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/PriceRadar.css';

const PriceRadar = ({ setActiveTab }) => {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [radarData, setRadarData] = useState(null);
  const [activeMandi, setActiveMandi] = useState(null);
  const [loading, setLoading] = useState(true);

  const crops = [
    { name: 'Wheat', label: '🌾 Wheat' },
    { name: 'Cotton', label: '☁️ Cotton' },
    { name: 'Groundnut', label: '🥜 Groundnut' },
    { name: 'Tomato', label: '🍅 Tomato' },
    { name: 'Onion', label: '🧅 Onion' },
    { name: 'Potato', label: '🥔 Potato' },
  ];

  const fetchRadar = async () => {
    try {
      setLoading(true);
      const res = await api.prices.getRadar(selectedCrop);
      if (res?.success) {
        setRadarData(res);
        if (res.markets?.length > 0) {
          setActiveMandi(res.markets[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load radar data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadar();
  }, [selectedCrop]);

  const metrics = radarData?.metrics;
  const markets = radarData?.markets || [];

  return (
    <div className="price-radar-container">
      {/* Header */}
      <div className="radar-header">
        <div>
          <h1>Mandi Price Radar & Spread Analyzer</h1>
          <p>Scan price differences and arbitrage spreads across surrounding agricultural markets</p>
        </div>
        <button className="btn-refresh" onClick={fetchRadar}>
          <RefreshCw size={15} />
          <span>Rescan Radar</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="radar-filter-card">
        <div className="radar-filters-group">
          <div className="radar-filter-item">
            <label>Selected Commodity</label>
            <select 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="radar-select"
            >
              {crops.map((c) => (
                <option key={c.name} value={c.name}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Metrics Pill Row */}
        {metrics && (
          <div className="radar-spread-metrics">
            <div className="spread-metric-item">
              <span>Highest Mandi</span>
              <strong className="text-emerald">₹ {metrics.highestPrice}</strong>
            </div>
            <div className="spread-metric-item">
              <span>Lowest Mandi</span>
              <strong className="text-red">₹ {metrics.lowestPrice}</strong>
            </div>
            <div className="spread-metric-item">
              <span>Regional Average</span>
              <strong>₹ {metrics.averagePrice}</strong>
            </div>
            <div className="spread-metric-item highlight">
              <span>Max Price Spread</span>
              <strong className="text-emerald">+ ₹ {metrics.spread} / qtl</strong>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-state">
          <RefreshCw size={28} className="spin-anim" />
          <p>Analyzing price spreads across APMC Mandis...</p>
        </div>
      ) : (
        <div className="radar-main-content">
          {/* Visual Radar Circles Container */}
          <div className="radar-visual-card">
            <div className="radar-visual-header">
              <span>Mandi Distance & Price Spread Radar</span>
              <span className="live-tag">LIVE AGMARKNET</span>
            </div>

            <div className="radar-circle-display">
              {/* Concentric rings */}
              <div className="radar-ring ring-3" />
              <div className="radar-ring ring-2" />
              <div className="radar-ring ring-1" />
              <div className="radar-center-blip">
                <span>You</span>
              </div>

              {/* Plotted Mandi Nodes */}
              {markets.map((m, idx) => {
                const angle = (idx / markets.length) * 2 * Math.PI - Math.PI / 2;
                const distanceFactor = 45 + (idx % 3) * 35; // % distance from center
                const x = 50 + distanceFactor * 0.42 * Math.cos(angle);
                const y = 50 + distanceFactor * 0.42 * Math.sin(angle);
                const isHighest = m.modalPrice === metrics?.highestPrice;
                const isSelected = activeMandi?.id === m.id;

                return (
                  <div 
                    key={m.id || idx}
                    className={`radar-mandi-node ${isHighest ? 'highest-node' : ''} ${isSelected ? 'active-node' : ''}`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    onClick={() => setActiveMandi(m)}
                  >
                    <div className="node-dot" />
                    <div className="node-tooltip">
                      <strong>{m.market}</strong>
                      <span>₹{m.modalPrice}/qtl</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mandi Cards List */}
          <div className="radar-mandis-list">
            <div className="list-title">Ranked Mandi Price Comparison</div>

            {markets.map((m) => {
              const isSelected = activeMandi?.id === m.id;
              const isHighest = m.modalPrice === metrics?.highestPrice;

              return (
                <div 
                  key={m.id} 
                  className={`radar-mandi-card ${isSelected ? 'selected' : ''} ${isHighest ? 'is-highest' : ''}`}
                  onClick={() => setActiveMandi(m)}
                >
                  <div className="mandi-card-left">
                    <div className="mandi-name-row">
                      <h4>{m.market}</h4>
                      {isHighest && <span className="highest-tag">Highest Price ⭐</span>}
                    </div>
                    <p className="mandi-district-text">
                      <MapPin size={13} /> {m.district}, {m.state}
                    </p>
                  </div>

                  <div className="mandi-card-right">
                    <div className="card-price-num">
                      ₹ {m.modalPrice}
                      <small>/ qtl</small>
                    </div>
                    <div className={`card-spread-diff ${m.spreadDifference >= 0 ? 'text-emerald' : 'text-red'}`}>
                      {m.spreadDifference >= 0 ? `+₹${m.spreadDifference}` : `-₹${Math.abs(m.spreadDifference)}`} vs Avg
                    </div>
                  </div>
                </div>
              );
            })}

            <button 
              className="btn-where-sell-cta"
              onClick={() => setActiveTab('where-should-i-sell')}
              style={{ marginTop: '12px' }}
            >
              <span>Calculate Net Profit Including Fuel →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceRadar;
