// src/components/views/PriceRadar.jsx
import React, { useState } from 'react';
import { translations } from '../../data/translations';
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Sparkles, 
  ChevronRight,
  Package,
  Layers,
  Flame,
  Activity
} from 'lucide-react';
import { STATE_MAPS } from '../../data/stateMapsData';
import '../../styles/PriceRadar.css';

const PriceRadar = ({ setActiveTab, language }) => {
  const t = translations[language] || translations.en;
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
      displayFormatted: `₹${adjPrice.toLocaleString()}`,
      crop: selectedCrop
    };
  });

  const currentActiveMandi = currentMandis.find(m => m.id === activeMandi?.id) || currentMandis[0];
  const topMandi = currentMandis.find(m => m.isTop) || currentMandis[0];

  return (
    <div className="price-radar-container">
      {/* Header */}
      <div className="radar-header">
        <div>
          <span className="section-micro-tag">{t.geoMandiIntel}</span>
          <h1>{t.priceRadarTitleAlt}</h1>
          <p>{t.priceRadarDesc}</p>
        </div>
      </div>

      {/* Filter & Crop Selection Card */}
      <div className="radar-filter-card">
        <div className="radar-filters-group">
          {/* Crop Selector */}
          <div className="radar-filter-item">
            <label>{t.cropCommodityLbl || "Crop / Commodity"}</label>
            <select 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="radar-select"
            >
              {t.cropOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="radar-filter-item">
            <label>{t.harvestLotQty}</label>
            <input 
              type="text" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)}
              className="radar-input"
            />
          </div>

          {/* Map Color Legend */}
          <div className="radar-legend-bar">
            <span className="legend-title">{t.priceLevelsLbl}</span>
            <div className="legend-item"><span className="legend-dot dot-high" /> {t.levelHigh}</div>
            <div className="legend-item"><span className="legend-dot dot-med" /> {t.levelMed}</div>
            <div className="legend-item"><span className="legend-dot dot-low" /> {t.levelLow}</div>
          </div>
        </div>

        <div className="radar-header-metric">
          <span className="metric-tag">{t.peakMandiRate}</span>
          <span className="metric-val">{topMandi.displayFormatted} / Qtl</span>
          <span className="metric-city">{t.atCityAPMC ? t.atCityAPMC.replace("{city}", topMandi.city) : `at ${topMandi.city} APMC`}</span>
        </div>
      </div>

      {/* Main Grid: Gujarat Map + Side Mandi Intelligence */}
      <div className="radar-grid">
        {/* Interactive Gujarat Map Card */}
        <div className="radar-map-card">
          <div className="map-card-top-bar">
            <div className="map-title-row">
              <MapPin size={16} className="text-emerald-600" />
              <strong>{t.gujaratAPMCMap}</strong>
            </div>
            <span className="map-tag-live">{t.liveAPMCFeeds}</span>
          </div>

          {/* Interactive Geographic Map Viewport */}
          <div className="map-viewport">
            <div className="official-district-map-wrap">
              <img 
                src={currentState.mapImage} 
                alt="Gujarat District Administrative Map" 
                className="official-district-map-img" 
              />

              {/* Interactive Mandi Pins with Colored Markers (High=Green, Med=Yellow, Low=Red) */}
              {currentMandis.map((m) => {
                const isSelected = currentActiveMandi.id === m.id;
                const markerLevel = m.priceLevel || (m.isTop ? 'high' : m.trend === 'down' ? 'low' : 'medium');

                return (
                  <div
                    key={m.id}
                    className={`map-pin-container ${isSelected ? 'selected' : ''}`}
                    style={{ top: `${m.coords.y}%`, left: `${m.coords.x}%` }}
                    onClick={() => setActiveMandi(m)}
                    title={`${m.name} - ${m.displayFormatted}/Qtl (${m.demand || "High"} Demand)`}
                  >
                    <div className={`map-pin-badge marker-${markerLevel}`}>
                      <span className="pin-dot-circle" />
                      <span className="pin-city">{m.city}</span>
                      <span className="pin-price">{m.displayFormatted}</span>
                    </div>
                    {markerLevel === 'high' && <div className="pin-pulse-ring" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Alert Banner tailored to selected crop */}
          <div className="map-earnings-banner">
            <div className="map-earnings-icon">
              <Sparkles size={18} />
            </div>
            <div className="map-earnings-text">
              {t.sellingNetsHighest ? t.sellingNetsHighest.replace("{qty}", quantity).replace("{crop}", selectedCrop).replace("{mandi}", `${topMandi.name} (${topMandi.city})`).replace("{price}", topMandi.displayFormatted).replace("{change}", topMandi.change) : `Selling ${quantity} of ${selectedCrop} at ${topMandi.name} (${topMandi.city}) nets you the highest return in Gujarat at ${topMandi.displayFormatted}/Qtl (${topMandi.change} price diff).`}
            </div>
          </div>
        </div>

        {/* Right Side Panels: Selected Mandi Details & Top Markets */}
        <div className="radar-side-panel">
          {/* Selected Mandi Live Card */}
          <div className="active-mandi-card">
            <div className="active-mandi-header">
              <span className={`status-badge ${currentActiveMandi.isTop ? 'top-badge' : 'standard-badge'}`}>
                {currentActiveMandi.isTop ? t.topMandiGujarat : t.apmcMarketYard}
              </span>
              <span className={`demand-badge demand-${(currentActiveMandi.demand || 'High').toLowerCase()}`}>
                <Flame size={12} /> {currentActiveMandi.demand || "High"} {t.demandLbl || "Demand"}
              </span>
            </div>

            <h3 className="mandi-card-title">{currentActiveMandi.name}</h3>
            <div className="mandi-district-text">
              <MapPin size={13} /> {currentActiveMandi.city}, Gujarat • {currentActiveMandi.distance} {t.awayTxt}
            </div>

            <div className="mandi-price-display">
              <div className="price-big">{currentActiveMandi.displayFormatted}</div>
              <div className="price-unit">{t.perQuintal || "/ Quintal"}</div>
              <div className={`price-change-pill ${currentActiveMandi.trend === 'up' ? 'up' : 'down'}`}>
                {currentActiveMandi.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{currentActiveMandi.change} {t.diffTxt}</span>
              </div>
            </div>

            <div className="mandi-specs-grid">
              <div className="spec-item">
                <span className="spec-lbl">{t.selectedCropLbl}</span>
                <span className="spec-val font-bold">{selectedCrop}</span>
              </div>
              <div className="spec-item">
                <span className="spec-lbl">{t.marketDemandLbl}</span>
                <span className="spec-val text-emerald-700 font-bold">{currentActiveMandi.demand || 'High'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-lbl">{t.distanceLbl}</span>
                <span className="spec-val">{currentActiveMandi.distance}</span>
              </div>
              <div className="spec-item">
                <span className="spec-lbl">{t.dailyArrivalsLbl}</span>
                <span className="spec-val">{currentActiveMandi.arrivalVol}</span>
              </div>
            </div>

            <button 
              type="button"
              className="mandi-direct-route-btn"
              onClick={() => setActiveTab('where-to-sell')}
            >
              <span>{t.calcNetProfitMandi}</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* All Gujarat APMC Markets Table */}
          <div className="state-ranking-card">
            <div className="ranking-card-header">
              <h4>{t.gujaratAPMCLocations}</h4>
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
                    <div className="ranking-name-row">
                      <span className="ranking-name">{m.city} APMC</span>
                      <span className={`ranking-demand-tag demand-${(m.demand || 'High').toLowerCase()}`}>
                        {m.demand || "High"}
                      </span>
                    </div>
                    <div className="ranking-sub">{selectedCrop} • {m.distance} {t.awayTxt}</div>
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
