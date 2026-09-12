// src/components/views/WhereShouldISell.jsx
import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  ArrowUpRight, 
  Compass, 
  Truck, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { whereToSellComparison } from '../../data/mockData';
import '../../styles/WhereShouldISell.css';

const WhereShouldISell = ({ setActiveTab }) => {
  const [crop, setCrop] = useState('Wheat');
  const [quantity, setQuantity] = useState('500 kg');
  const [location, setLocation] = useState('Rajkot');

  return (
    <div className="where-to-sell-container">
      {/* Header */}
      <div className="where-header">
        <h1>Where Should I Sell?</h1>
        <p>Get the best market, price and profit for your crop.</p>
      </div>

      {/* Filter Options */}
      <div className="where-filter-card">
        <div className="where-filters-row">
          <div className="where-filter-box">
            <label>Crop</label>
            <select 
              value={crop} 
              onChange={(e) => setCrop(e.target.value)}
              className="radar-select"
            >
              <option value="Wheat">🌾 Wheat</option>
              <option value="Tomato">🍅 Tomato</option>
              <option value="Onion">🧅 Onion</option>
              <option value="Potato">🥔 Potato</option>
            </select>
          </div>

          <div className="where-filter-box">
            <label>Quantity</label>
            <input 
              type="text" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)}
              className="radar-input"
            />
          </div>

          <div className="where-filter-box">
            <label>Location</label>
            <select 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              className="radar-select"
            >
              <option value="Rajkot">Rajkot, Gujarat</option>
              <option value="Ahmedabad">Ahmedabad, Gujarat</option>
              <option value="Surat">Surat, Gujarat</option>
            </select>
          </div>
        </div>

        <button className="where-find-btn">
          <Compass size={16} />
          <span>Find Best Option</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="where-main-grid">
        {/* Left Column: Best Option Card + Why Badges + Comparison Table */}
        <div className="where-left-column">
          {/* Best Option Gold Card */}
          <div className="best-option-card">
            <div className="best-option-info">
              <div className="best-option-badge-tag">
                <Award size={14} /> Best Option
              </div>
              <div className="best-mandi-title">Rajkot APMC</div>
              <div className="best-mandi-rate">
                ₹2,610 <span>/ Q</span>
              </div>
              <div className="best-mandi-extra">
                <ArrowUpRight size={14} /> + ₹1,920 more than nearby mandi
              </div>
            </div>

            <div className="best-option-calc">
              <div className="calc-line">
                <span>Expected Revenue</span>
                <strong>₹12,400</strong>
              </div>
              <div className="calc-line expense">
                <span>Transport</span>
                <strong>- ₹850</strong>
              </div>
              <div className="calc-line net">
                <span>Net Earnings</span>
                <span className="net-amount">₹11,550</span>
              </div>
            </div>
          </div>

          {/* Why this is the best option? */}
          <div className="why-best-section">
            <h4>Why this is the best option?</h4>
            <div className="why-badges-row">
              <div className="why-badge-pill">
                <DollarSign size={16} />
                <span>Highest Price</span>
              </div>
              <div className="why-badge-pill">
                <MapPin size={16} />
                <span>Short Distance (12.4 km)</span>
              </div>
              <div className="why-badge-pill">
                <ShieldCheck size={16} />
                <span>Trusted Buyers</span>
              </div>
            </div>
          </div>

          {/* Nearby Markets Comparison */}
          <div className="nearby-table-card">
            <h4>Nearby Markets Comparison</h4>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Mandi</th>
                  <th>Price / Q</th>
                  <th>Distance</th>
                  <th>Net Earnings</th>
                </tr>
              </thead>
              <tbody>
                {whereToSellComparison.map((row, idx) => (
                  <tr key={idx} className={row.isBest ? 'highlight-best' : ''}>
                    <td>
                      {row.mandi}
                      {row.highlight && <span className="table-best-tag">{row.highlight}</span>}
                    </td>
                    <td><strong>{row.priceStr}</strong></td>
                    <td>{row.distance}</td>
                    <td>
                      <span style={{ color: row.isBest ? '#15803d' : '#1f2937', fontWeight: row.isBest ? '700' : '500' }}>
                        {row.netEarnings}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Promotional & Farmer Story */}
        <div className="where-right-promo-card">
          <img 
            src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=500&auto=format&fit=crop&q=80" 
            alt="Farmer in Field" 
            className="promo-farmer-bg"
          />
          <div className="promo-quote-box">
            <div className="promo-quote-title">
              "Right market.<br />Right price.<br />Better future."
            </div>
            <div className="promo-quote-sub">
              Direct APMC intelligence eliminates middlemen fees and guarantees instant bank payouts within 24 hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhereShouldISell;
