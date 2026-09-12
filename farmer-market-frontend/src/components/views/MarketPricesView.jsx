// src/components/views/MarketPricesView.jsx
import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Navigation, 
  ArrowRight,
  MapPin,
  RefreshCw,
  Clock
} from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/MarketPrices.css';

const MarketPricesView = ({ setActiveTab }) => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const cropsList = ['All', 'Wheat', 'Cotton', 'Groundnut', 'Tomato', 'Onion', 'Potato', 'Cumin'];
  const statesList = ['All', 'Gujarat', 'Maharashtra', 'Punjab'];

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCrop !== 'All') params.cropName = selectedCrop;
      if (selectedState !== 'All') params.state = selectedState;
      if (searchQuery) params.search = searchQuery;

      const res = await api.prices.getAll(params);
      if (res?.data) {
        setPrices(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch market prices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [selectedCrop, selectedState]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPrices();
  };

  return (
    <div className="market-prices-container">
      {/* Header Banner */}
      <div className="view-header-strip">
        <div>
          <h2>Mandi Live Market Prices & Arrivals</h2>
          <p>Real-time AGMARKNET APMC benchmarks across Gujarat, Maharashtra & Punjab</p>
        </div>
        <div className="view-header-actions">
          <button className="btn-refresh" onClick={fetchPrices}>
            <RefreshCw size={15} />
            <span>Refresh Rates</span>
          </button>
          <button className="btn-radar-cta" onClick={() => setActiveTab('price-radar')}>
            <Navigation size={16} />
            <span>Open Price Radar</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mandi-filter-bar">
        <form onSubmit={handleSearchSubmit} className="search-box-wrap">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search Mandi or commodity (e.g., Gondal, Wheat, Onion)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="filter-dropdowns">
          <div className="filter-item">
            <label>Crop:</label>
            <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
              {cropsList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>State:</label>
            <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
              {statesList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mandi Cards Grid */}
      {loading ? (
        <div className="loading-state">
          <RefreshCw size={28} className="spin-anim" />
          <p>Loading live Mandi prices...</p>
        </div>
      ) : prices.length === 0 ? (
        <div className="empty-state">
          <Store size={48} />
          <h3>No Mandi records found</h3>
          <p>Try resetting filters or searching for another commodity.</p>
        </div>
      ) : (
        <div className="mandi-grid">
          {prices.map((p) => (
            <div key={p._id} className="mandi-price-card">
              <div className="card-top-row">
                <div className="crop-info">
                  <span className="crop-title">{p.cropName}</span>
                  <span className="variety-subtitle">{p.variety || 'Standard Quality'}</span>
                </div>
                <span className={`trend-badge ${p.trend === 'rising' ? 'badge-rising' : p.trend === 'falling' ? 'badge-falling' : 'badge-stable'}`}>
                  {p.trend === 'rising' ? <TrendingUp size={14} /> : p.trend === 'falling' ? <TrendingDown size={14} /> : null}
                  {p.priceChangePercent ? `${p.priceChangePercent > 0 ? '+' : ''}${p.priceChangePercent}%` : 'Stable'}
                </span>
              </div>

              <div className="mandi-location">
                <MapPin size={15} />
                <span><strong>{p.market}</strong>, {p.district} ({p.state})</span>
              </div>

              <div className="price-metrics-box">
                <div className="modal-price-display">
                  <span className="price-label">Modal Price</span>
                  <div className="modal-num">
                    ₹ {p.modalPrice?.toLocaleString('en-IN')}
                    <span className="unit-label">/ qtl</span>
                  </div>
                </div>

                <div className="range-box">
                  <div className="range-item">
                    <span>Min</span>
                    <strong>₹{p.minPrice}</strong>
                  </div>
                  <div className="range-item">
                    <span>Max</span>
                    <strong>₹{p.maxPrice}</strong>
                  </div>
                  <div className="range-item">
                    <span>Arrival</span>
                    <strong>{p.arrivalQuantity} {p.arrivalUnit || 'T'}</strong>
                  </div>
                </div>
              </div>

              <div className="card-actions-row">
                <button 
                  className="btn-card-calc"
                  onClick={() => setActiveTab('where-should-i-sell')}
                >
                  <span>Net Profit Calc</span>
                  <ArrowRight size={14} />
                </button>
                <button 
                  className="btn-card-alert"
                  onClick={() => setActiveTab('price-alerts')}
                >
                  Set Alert
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketPricesView;
