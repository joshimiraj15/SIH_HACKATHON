// src/components/views/MarketMapView.jsx
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Store, 
  Navigation, 
  TrendingUp, 
  ArrowRight,
  Info,
  DollarSign
} from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/MarketMap.css';

const MarketMapView = ({ setActiveTab }) => {
  const [mandis, setMandis] = useState([]);
  const [selectedMandi, setSelectedMandi] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('Wheat');

  // Realistic Mandi geo-coordinates mapped across visual SVG canvas
  const mandiCanvasPins = [
    { name: 'Gondal Mandi', district: 'Rajkot', x: 260, y: 320, price: 2450, change: '+1.8%', best: true },
    { name: 'Rajkot APMC', district: 'Rajkot', x: 280, y: 280, price: 2420, change: '+1.2%', best: false },
    { name: 'Junagadh APMC', district: 'Junagadh', x: 240, y: 380, price: 2410, change: '+0.9%', best: false },
    { name: 'Unjha Mandi', district: 'Mehsana', x: 390, y: 160, price: 2475, change: '+2.2%', best: true },
    { name: 'Ahmedabad APMC', district: 'Ahmedabad', x: 420, y: 230, price: 2390, change: '-0.4%', best: false },
    { name: 'Surat APMC', district: 'Surat', x: 460, y: 360, price: 2410, change: '+0.6%', best: false },
    { name: 'Mahuva Mandi', district: 'Bhavnagar', x: 330, y: 390, price: 2430, change: '+1.1%', best: false },
    { name: 'Deesa APMC', district: 'Banaskantha', x: 380, y: 110, price: 2380, change: '+0.5%', best: false },
  ];

  useEffect(() => {
    setSelectedMandi(mandiCanvasPins[0]);
  }, []);

  return (
    <div className="market-map-view-container">
      <div className="view-header-strip">
        <div>
          <h2>Interactive APMC Mandi Geospatial Map</h2>
          <p>Explore real-time commodity prices and distance spreads across regional APMC trading hubs</p>
        </div>
        <div className="map-crop-selector">
          <label>Commodity:</label>
          <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
            <option value="Wheat">Wheat (Ghau)</option>
            <option value="Cotton">Cotton (Kapas)</option>
            <option value="Groundnut">Groundnut (Magfali)</option>
            <option value="Tomato">Tomato</option>
            <option value="Onion">Onion</option>
          </select>
        </div>
      </div>

      <div className="map-content-grid">
        {/* Visual Map Canvas Card */}
        <div className="map-canvas-card">
          <div className="canvas-header">
            <span>Western Region Mandi Cluster (Gujarat & Maharashtra)</span>
            <div className="legend-pills">
              <span className="legend-pin green-pin">High Net Margin</span>
              <span className="legend-pin blue-pin">Standard APMC</span>
              <span className="legend-pin orange-pin">Farmer Location</span>
            </div>
          </div>

          <div className="svg-map-wrapper">
            <svg viewBox="0 0 650 480" className="mandi-svg-map">
              {/* Background grid representing geographical land contours */}
              <rect width="650" height="480" fill="#f1f8f4" rx="16" />
              
              {/* Regional stylized state contours */}
              <path
                d="M120 180 Q 220 140 380 90 T 520 160 T 480 380 T 310 440 T 160 390 Z"
                fill="#e2f3e8"
                stroke="#bbf0cf"
                strokeWidth="2"
              />

              {/* Farmer Home Location Radar Pin */}
              <g transform="translate(250, 300)">
                <circle r="22" fill="#f97316" fillOpacity="0.2" className="pulse-circle" />
                <circle r="12" fill="#f97316" fillOpacity="0.4" />
                <circle r="6" fill="#ea580c" />
                <text x="14" y="5" fontSize="12" fontWeight="700" fill="#c2410c">You (Kotda Sangani)</text>
              </g>

              {/* Connecting routes to top mandis */}
              <line x1="250" y1="300" x2="260" y2="320" stroke="#16a34a" strokeWidth="2.5" strokeDasharray="4" />
              <line x1="250" y1="300" x2="280" y2="280" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="250" y1="300" x2="390" y2="160" stroke="#64748b" strokeWidth="1" strokeDasharray="4" />

              {/* Interactive Mandi Pins */}
              {mandiCanvasPins.map((pin) => {
                const isSelected = selectedMandi?.name === pin.name;
                return (
                  <g 
                    key={pin.name} 
                    transform={`translate(${pin.x}, ${pin.y})`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedMandi(pin)}
                  >
                    <circle 
                      r={isSelected ? 16 : 10} 
                      fill={pin.best ? '#16a34a' : '#0284c7'} 
                      fillOpacity={isSelected ? 0.35 : 0.2}
                    />
                    <circle 
                      r={isSelected ? 9 : 6} 
                      fill={pin.best ? '#16a34a' : '#0284c7'} 
                    />
                    <text 
                      x="10" 
                      y="-10" 
                      fontSize={isSelected ? "13" : "11"} 
                      fontWeight={isSelected ? "800" : "600"}
                      fill="#1e293b"
                    >
                      {pin.name} (₹{pin.price})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Mandi Detail & Route Inspector Card */}
        <div className="map-detail-sidebar">
          {selectedMandi ? (
            <div className="selected-mandi-card">
              <div className="detail-top-badge">
                <Store size={18} />
                <span>APMC Detailed Insight</span>
              </div>

              <h3>{selectedMandi.name}</h3>
              <p className="detail-dist">
                <MapPin size={15} />
                District: <strong>{selectedMandi.district}, Gujarat</strong>
              </p>

              <div className="mandi-price-stat-box">
                <span className="stat-label">{selectedCrop} Modal Price</span>
                <div className="stat-price">
                  ₹ {selectedMandi.price}
                  <span className="stat-unit">/ qtl</span>
                </div>
                <div className="stat-change text-emerald">
                  <TrendingUp size={14} /> {selectedMandi.change} Weekly Gain
                </div>
              </div>

              <div className="distance-breakdown">
                <div className="dist-row">
                  <span>Estimated Distance:</span>
                  <strong>{Math.round(Math.abs(selectedMandi.x - 250) * 0.4 + 18)} km</strong>
                </div>
                <div className="dist-row">
                  <span>Round-Trip Fuel (Tractor):</span>
                  <strong>₹ {Math.round((Math.abs(selectedMandi.x - 250) * 0.4 + 18) * 36)}</strong>
                </div>
                <div className="dist-row">
                  <span>Net Estimated Profit (50 qtl):</span>
                  <strong className="text-emerald">₹ {(selectedMandi.price * 50 - 1800).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {selectedMandi.best && (
                <div className="top-mandi-banner">
                  ⭐ <strong>Top Recommended Mandi</strong> for highest net in-hand profit today!
                </div>
              )}

              <button 
                className="btn-where-sell-link"
                onClick={() => setActiveTab('where-should-i-sell')}
              >
                <span>Full Net Profit Analysis</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="select-prompt">
              <Info size={32} />
              <p>Click on any Mandi pin on the map to inspect live rates and transport expenses.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketMapView;
