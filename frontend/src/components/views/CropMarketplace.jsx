import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Sprout, 
  DollarSign
} from 'lucide-react';
import '../../styles/BuyerMarketplace.css'; // Reuse existing styles for grid
import { myCropsData } from '../../data/mockData';
import { translations } from '../../data/translations';

const CropMarketplace = ({ setActiveTab, showToast, language }) => {
  const t = translations[language] || translations.en;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  
  const cropsList = ['All', 'Wheat', 'Tomato', 'Onion', 'Potato', 'Cotton', 'Groundnut'];

  const handlePlaceOffer = (crop) => {
    if (showToast) showToast(`🤝 Offer initiated for ${crop.name} (${crop.quantity}). Connecting to buyer desk...`);
    if (setActiveTab) setActiveTab('messages');
  };

  return (
    <div className="buyer-marketplace-container">
      {/* Header */}
      <div className="marketplace-header">
        <div>
          <span className="section-micro-tag">{t.farmerProduceNet}</span>
          <h1>{t.browseCropsTitle}</h1>
          <p>{t.browseCropsDesc}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="marketplace-filters-panel">
        <div className="filters-grid-row">
          <div className="filter-field-item search-grow">
            <label>{t.searchCropFarmerLbl}</label>
            <div className="search-input-pill">
              <Search size={15} className="text-gray-400" />
              <input 
                type="text" 
                placeholder={t.searchCropFarmerPH || "Search wheat, tomato, farmer name..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-field-item">
            <label>{t.cropTypeLbl}</label>
            <select 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="filter-select"
            >
              {cropsList.map((c) => (
                <option key={c} value={c}>{c === "All" ? t.allCrops || "All Crops" : c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Crops Grid */}
      <div className="buyers-grid-row">
        {myCropsData.map((crop, idx) => (
          <div key={idx} className="buyer-card-v2">
            <div className="buyer-card-top">
              <div className="buyer-logo-box" style={{ background: '#ecfdf5' }}>
                <Sprout size={28} color="#047857" />
              </div>
              <div className="buyer-title-wrap">
                <h3>{crop.name} - {crop.variety || 'Premium Grade'}</h3>
                <span className="buyer-type-tag">
                  <ShieldCheck size={14} /> {t.verifiedHarvestBadge}
                </span>
              </div>
            </div>

            <div className="buyer-stats-row" style={{ marginTop: '16px' }}>
              <div className="stat-chunk">
                <span className="stat-label">{t.quantityLbl}</span>
                <span className="stat-val">{crop.quantity}</span>
              </div>
              <div className="stat-chunk">
                <span className="stat-label">{t.expectedPriceLbl}</span>
                <span className="stat-val text-emerald-600 font-bold">₹{crop.price}</span>
              </div>
            </div>

            <div className="buyer-req-box" style={{ marginTop: '16px' }}>
              <div className="req-header">
                <MapPin size={15} /> <span>{t.locationLbl || "Location"}</span>
              </div>
              <p>Rajkot APMC Mega Yard, Gujarat</p>
            </div>

            <div className="buyer-card-actions" style={{ marginTop: '20px' }}>
              <button 
                className="btn-buyer-action primary" 
                style={{ width: '100%' }}
                onClick={() => handlePlaceOffer(crop)}
              >
                <DollarSign size={16} />
                <span>{t.placeOfferBtn}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropMarketplace;
