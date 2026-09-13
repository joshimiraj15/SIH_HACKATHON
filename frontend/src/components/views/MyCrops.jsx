// src/components/views/MyCrops.jsx

import React from 'react';
import { Plus, FileText, Trash2, Sprout } from 'lucide-react';
import { translations } from '../../data/translations';
import '../../styles/MyCrops.css';

const MyCrops = ({ crops = [], setCrops, setIsAddCropOpen, setActiveTab, language }) => {
  const t = translations[language] || translations.en;

  const handleDeleteCrop = (cropId) => {
    if (setCrops) {
      const updated = crops.filter(c => c.id !== cropId);
      setCrops(updated);
      try {
        localStorage.setItem('kisansetu_crops', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  return (
    <div className="my-crops-container">
      {/* Header */}
      <div className="my-crops-header">
        <div>
          <h1 className="mc-title">{t.myProduceAndCropInventory}</h1>
          <p className="mc-subtitle">{t.manageCropLotsSubtitle}</p>
        </div>

        <button 
          type="button"
          className="mc-add-btn"
          onClick={() => setIsAddCropOpen(true)}
        >
          <Plus size={16} />
          <span>{t.addCropLot}</span>
        </button>
      </div>

      {/* Grid or Empty State */}
      {crops.length === 0 ? (
        <div className="mc-empty-state">
          <Sprout size={36} className="mc-empty-icon" />
          <h3>{language === 'gu' ? 'હજુ સુધી કોઈ પાક ઉમેરેલ નથી' : language === 'hi' ? 'अभी तक कोई फसल नहीं जोड़ी गई' : 'No Produce Lots Listed Yet'}</h3>
          <p>{language === 'gu' ? 'તમારો પાક, વજન અને અંદાજિત ભાવ ઉમેરવા માટે "+ પાક લોટ ઉમેરો" પર ક્લિક કરો.' : language === 'hi' ? 'अपनी फसल, मात्रा और अपेक्षित भाव जोड़ने के लिए "+ फसल लॉट जोड़ें" पर क्लिक करें।' : 'Add your crop, harvest quantity, and expected price to start receiving direct buyer offers.'}</p>
          <button 
            type="button"
            className="mc-add-btn"
            onClick={() => setIsAddCropOpen(true)}
          >
            <Plus size={16} />
            <span>{t.addCropLot}</span>
          </button>
        </div>
      ) : (
        <div className="mc-grid">
          {crops.map((crop, idx) => {
            const isDown = crop.trend === 'down';
            const displayPrice = crop.price && String(crop.price) !== 'NaN' ? crop.price : '2,480';
            const displayQuantity = crop.quantity || (crop.qtyValue ? `${crop.qtyValue} Quintals` : '500 kg');
            const displayStatus = crop.status || t.readyForMandi;
            const displayName = crop.name || crop.cropName || 'Crop Lot';

            return (
              <div key={crop.id || idx} className="mc-card">
                <div className="mc-card-img-wrap">
                  <img src={crop.image} alt={displayName} className="mc-card-img" />
                  <button
                    type="button"
                    className="mc-delete-crop-btn"
                    title={language === 'gu' ? 'પાક દૂર કરો' : 'Remove crop lot'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCrop(crop.id);
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="mc-card-body">
                  <div className="mc-card-row-top">
                    <div>
                      <h3 className="mc-crop-title">{displayName}</h3>
                      {crop.variety && <div className="mc-crop-variety-sub">{crop.variety}</div>}
                    </div>
                    <span className="mc-grade-tag">{crop.grade || 'GRADE_A'}</span>
                  </div>
                  <div className="mc-card-meta">
                    <strong>{displayQuantity}</strong> • {t.lotStatusPrefix} <span className={isDown ? "mc-status-normal" : "mc-status-highlight"}>{displayStatus}</span>
                  </div>
                  <div className="mc-price-row">
                    <div className="mc-price-val">₹{displayPrice} <span>{crop.unit || '/ Q'}</span></div>
                    <div className={`mc-trend-pill ${isDown ? 'down' : 'up'}`}>
                      {isDown ? '↘ -4.1%' : `↗ ${crop.change || '+5.0%'}`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Incoming Offers */}
      <div className="mc-offers-section">
        <div className="mc-offers-header">
          <div className="mc-offers-header-left">
            <div className="mc-offers-title">
              <div className="mc-icon-blue-wrap">
                <FileText size={18} className="mc-icon-blue" />
              </div>
              <h2>{t.incomingBuyerOffers} (1)</h2>
            </div>
            <p className="mc-offers-sub">{t.directProcurementOffers}</p>
          </div>
          <button className="mc-view-messages-btn" onClick={() => setActiveTab('messages')}>{t.viewMessagesArrow}</button>
        </div>

        <div className="mc-offer-list">
          <div className="mc-offer-card">
            <div className="mc-offer-top">
              <span className="mc-offer-crop">Wheat (Sharbati Gold)</span>
              <span className="mc-offer-badge pending">{t.offerPending}</span>
            </div>
            <h3 className="mc-offer-buyer">AgroFresh Foods</h3>
            <div className="mc-offer-rate-row">
              <span className="mc-rate-lbl">{t.offeredRateLbl}</span>
              <span className="mc-rate-val">₹2,520 / Q</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCrops;