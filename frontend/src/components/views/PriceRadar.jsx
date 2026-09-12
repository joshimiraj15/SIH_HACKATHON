// src/components/views/PriceRadar.jsx
import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Sparkles, 
  DollarSign, 
  ChevronRight,
  Filter,
  Navigation,
  Globe2,
  Truck,
  Package,
  Layers
} from 'lucide-react';
import { STATE_MAPS } from '../../data/stateMapsData';
import '../../styles/PriceRadar.css';

const PriceRadar = ({ setActiveTab }) => {
  const [selectedStateKey, setSelectedStateKey] = useState('Gujarat');
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [quantity, setQuantity] = useState('50 Quintals');
  
  const currentState = STATE_MAPS[selectedStateKey] || STATE_MAPS.Gujarat;
  const [activeMandi, setActiveMandi] = useState(currentState.mandis[0]);

  // Adjust prices dynamically based on selected crop
  const cropMultipliers = {
    Wheat: 1.0,
    Cotton: 2.85,
    Groundnut: 2.35,
    Tomato: 0.85,
    Onion: 0.92,
    Potato: 0.74,
    Soybean: 1.95,
    Mustard: 2.15,
    Cumin: 8.5
  };

  const multiplier = cropMultipliers[selectedCrop] || 1.0;

  // Recalculate mandi prices for active state
  const currentMandis = currentState.mandis.map((m) => {
    const adjPrice = Math.round(m.basePrice * multiplier);
    return {
      ...m,
      displayPrice: adjPrice,
      displayFormatted: `₹${adjPrice.toLocaleString()}`
    };
  });

  // Keep active mandi synced when state changes
  const handleStateChange = (stateKey) => {
    setSelectedStateKey(stateKey);
    const newState = STATE_MAPS[stateKey] || STATE_MAPS.Gujarat;
    setActiveMandi(newState.mandis[0]);
  };

  const currentActiveMandi = currentMandis.find(m => m.id === activeMandi?.id) || currentMandis[0];
  const topMandi = currentMandis.find(m => m.isTop) || currentMandis[0];

  return (
    <div className="price-radar-container">
      {/* Header */}
      <div className="radar-header">
        <div>
          <h1>APMC Mandi Price Radar</h1>
          <p>Real-time geographic price discovery across Gujarat districts and major agricultural market yards</p>
        </div>
      </div>

      {/* Filter & Crop Selection Card */}
      <div className="radar-filter-card">
        <div className="radar-filters-group">
          {/* Crop Selector */}
          <div className="radar-filter-item">
            <label>Commodity</label>
            <select 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="radar-select"
            >
              <option value="Wheat">🌾 Wheat (ઘઉં)</option>
              <option value="Cotton">🌱 Cotton (કપાસ)</option>
              <option value="Groundnut">🥜 Groundnut (મગફળી)</option>
              <option value="Tomato">🍅 Tomato (ટામેટા)</option>
              <option value="Onion">🧅 Onion (ડુંગળી)</option>
              <option value="Potato">🥔 Potato (બટાકા)</option>
              <option value="Cumin">🌿 Cumin (જીરું)</option>
              <option value="Soybean">🌱 Soybean (સોયાબીન)</option>
              <option value="Mustard">🌼 Mustard (રાયડો)</option>
            </select>
          </div>

          {/* Quantity */}
          <div className="radar-filter-item">
            <label>Lot Quantity</label>
            <input 
              type="text" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)}
              className="radar-input"
            />
          </div>

          {/* Active State Dropdown */}
          <div className="radar-filter-item">
            <label>Active State</label>
            <select
              value={selectedStateKey}
              onChange={(e) => handleStateChange(e.target.value)}
              className="radar-select font-bold"
            >
              {Object.keys(STATE_MAPS).map((key) => (
                <option key={key} value={key}>
                  📍 {STATE_MAPS[key].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="radar-header-metric">
          <span className="metric-tag">Top Mandi Rate</span>
          <span className="metric-val">{topMandi.displayFormatted} / Qtl</span>
        </div>
      </div>

      {/* Main Grid: Official District Map + Side Details */}
      <div className="radar-grid">
        {/* Interactive State Map Card */}
        <div className="radar-map-card">
          {/* State Switcher Tabs on Map */}
          <div className="map-state-tabs">
            {Object.keys(STATE_MAPS).map((key) => {
              const state = STATE_MAPS[key];
              const isActive = selectedStateKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={`state-tab-pill ${isActive ? 'active' : ''}`}
                  onClick={() => handleStateChange(key)}
                >
                  <span className="state-dot" />
                  <span>{state.name}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Geographic Map Viewport */}
          <div className="map-viewport">
            {/* If state has an official detailed district map image (e.g. Gujarat) */}
            {currentState.mapImage ? (
              <div className="official-district-map-wrap">
                <img 
                  src={currentState.mapImage} 
                  alt="Official Gujarat District Administrative Map" 
                  className="official-district-map-img" 
                />

                {/* Interactive Mandi Pins overlaying the official district map */}
                {currentMandis.map((m) => {
                  const isSelected = currentActiveMandi.id === m.id;
                  let badgeType = 'medium';
                  if (m.isTop) badgeType = 'top';
                  else if (m.trend === 'down') badgeType = 'low';

                  return (
                    <div
                      key={m.id}
                      className={`map-pin-container ${isSelected ? 'selected' : ''}`}
                      style={{ top: `${m.coords.y}%`, left: `${m.coords.x}%` }}
                      onClick={() => setActiveMandi(m)}
                      title={`Click to view ${m.name} APMC rates`}
                    >
                      <div className={`map-pin-badge ${badgeType}`}>
                        <span className="pin-dot-circle" />
                        <span className="pin-city">{m.city}</span>
                        <span className="pin-price">{m.displayFormatted}</span>
                      </div>
                      {m.isTop && <div className="pin-pulse-ring" />}
                      {isSelected && <div className="pin-active-indicator" />}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* High-Fidelity SVG Map Fallback for other states */
              <div className="svg-map-wrap">
                <div className="map-grid-bg" aria-hidden="true" />
                <svg 
                  className="geographic-state-svg" 
                  viewBox={currentState.viewBox} 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d={currentState.svgPath}
                    fill="#DCFCE7"
                    fillOpacity="0.5"
                    stroke="#22C55E"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    className="state-boundary-path"
                  />
                  <circle cx="260" cy="200" r="70" stroke="#15803D" strokeWidth="1" strokeDasharray="5 5" fill="none" opacity="0.25" />
                  <circle cx="260" cy="200" r="140" stroke="#15803D" strokeWidth="1" strokeDasharray="5 5" fill="none" opacity="0.15" />
                  <text 
                    x="50%" 
                    y="52%" 
                    textAnchor="middle" 
                    fill="#15803D" 
                    fontSize="28" 
                    fontWeight="900" 
                    letterSpacing="6" 
                    opacity="0.14"
                  >
                    {currentState.name.toUpperCase()}
                  </text>
                </svg>

                {currentMandis.map((m) => {
                  const isSelected = currentActiveMandi.id === m.id;
                  let badgeType = 'medium';
                  if (m.isTop) badgeType = 'top';
                  else if (m.trend === 'down') badgeType = 'low';

                  return (
                    <div
                      key={m.id}
                      className={`map-pin-container ${isSelected ? 'selected' : ''}`}
                      style={{ top: `${m.coords.y}%`, left: `${m.coords.x}%` }}
                      onClick={() => setActiveMandi(m)}
                    >
                      <div className={`map-pin-badge ${badgeType}`}>
                        <MapPin size={12} className="pin-icon" />
                        <span className="pin-city">{m.city}</span>
                        <span className="pin-price">{m.displayFormatted}</span>
                      </div>
                      {m.isTop && <div className="pin-pulse-ring" />}
                      {isSelected && <div className="pin-active-indicator" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Alert Banner tailored to selected state & crop */}
          <div className="map-earnings-banner">
            <div className="map-earnings-icon">
              <Sparkles size={18} />
            </div>
            <div className="map-earnings-text">
              Selling <strong>{quantity} of {selectedCrop}</strong> at <strong>{topMandi.name} ({topMandi.city})</strong> nets you the highest return in <strong>{currentState.name}</strong> at <strong>{topMandi.displayFormatted}/Qtl</strong> ({topMandi.change}).
            </div>
          </div>
        </div>

        {/* Right Side Panels: Selected Mandi Details & Top Markets */}
        <div className="radar-side-panel">
          {/* Selected Mandi Live Card */}
          <div className="active-mandi-card">
            <div className="active-mandi-header">
              <span className={`status-badge ${currentActiveMandi.isTop ? 'top-badge' : 'standard-badge'}`}>
                {currentActiveMandi.isTop ? '★ Top Mandi in State' : 'Live APMC Market'}
              </span>
              <span className="arrival-badge">
                <Package size={12} /> {currentActiveMandi.arrivalVol}
              </span>
            </div>

            <h3 className="mandi-card-title">{currentActiveMandi.name}</h3>
            <div className="mandi-district-text">
              <MapPin size={13} /> {currentActiveMandi.city}, {currentState.name}
            </div>

            <div className="mandi-price-display">
              <div className="price-big">{currentActiveMandi.displayFormatted}</div>
              <div className="price-unit">/ Quintal</div>
              <div className={`price-change-pill ${currentActiveMandi.trend === 'up' ? 'up' : 'down'}`}>
                {currentActiveMandi.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{currentActiveMandi.change} Today</span>
              </div>
            </div>

            <div className="mandi-specs-grid">
              <div className="spec-item">
                <span className="spec-lbl">Primary Trade</span>
                <span className="spec-val">{currentActiveMandi.specialty}</span>
              </div>
              <div className="spec-item">
                <span className="spec-lbl">Est. Distance</span>
                <span className="spec-val">{currentActiveMandi.distance}</span>
              </div>
            </div>

            <button 
              type="button"
              className="mandi-direct-route-btn"
              onClick={() => setActiveTab('where-to-sell')}
            >
              <span>View Route & Direct Trade</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* State Market Ranking List */}
          <div className="state-ranking-card">
            <div className="ranking-card-header">
              <h4>All {currentState.name} APMC Yards</h4>
              <span className="crop-tag">{selectedCrop}</span>
            </div>

            <div className="ranking-list">
              {currentMandis.map((m, idx) => (
                <div 
                  key={m.id} 
                  className={`ranking-row ${currentActiveMandi.id === m.id ? 'active' : ''}`}
                  onClick={() => setActiveMandi(m)}
                >
                  <div className="ranking-num">{idx + 1}</div>
                  <div className="ranking-info">
                    <div className="ranking-name">{m.city} APMC</div>
                    <div className="ranking-sub">{m.arrivalVol} • {m.distance}</div>
                  </div>
                  <div className="ranking-rate">
                    <div className="rate-val">{m.displayFormatted}</div>
                    <div className={`rate-change ${m.trend === 'up' ? 'pos' : 'neg'}`}>
                      {m.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRadar;
