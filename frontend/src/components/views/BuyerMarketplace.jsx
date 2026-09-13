// src/components/views/BuyerMarketplace.jsx
import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  Plus, 
  Filter,
  CheckCircle2,
  DollarSign, 
  Truck,
  MessageSquare,
  Sparkles,
  Building2,
  Check
} from 'lucide-react';
import { buyersList } from '../../data/mockData';
import { translations } from '../../data/translations';
import '../../styles/BuyerMarketplace.css';

const BuyerMarketplace = ({ setSelectedBuyerForOffer, setIsListingProduceModalOpen, setActiveTab, showToast, language }) => {
  const t = translations[language] || translations.en;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedBuyerType, setSelectedBuyerType] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [priceSort, setPriceSort] = useState('default');

  // Filter options
  const cropsList = ['All', 'Wheat', 'Tomato', 'Onion', 'Potato', 'Cotton', 'Groundnut'];
  const locationsList = ['All', 'Rajkot', 'Ahmedabad', 'Surat', 'Gondal', 'Junagadh'];
  const buyerTypesList = ['All', 'Food Processor', 'Wholesaler', 'Exporter', 'FPO'];

  const filteredBuyers = buyersList.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.cropSpecialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = selectedCrop === 'All' || b.cropSpecialty.toLowerCase().includes(selectedCrop.toLowerCase());
    const matchesLocation = selectedLocation === 'All' || (b.location || b.city || '').toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesBuyerType = selectedBuyerType === 'All' || (b.buyerType || 'Wholesaler') === selectedBuyerType;
    const matchesVerified = !verifiedOnly || b.isVerified;

    return matchesSearch && matchesCrop && matchesLocation && matchesBuyerType && matchesVerified;
  });

  return (
    <div className="buyer-marketplace-container">
      {/* Header */}
      <div className="marketplace-header">
        <div>
          <span className="section-micro-tag">{t.instProcureNet}</span>
          <h1>{t.buyerMarketplaceTitle}</h1>
          <p>{t.buyerMarketplaceDesc}</p>
        </div>

        <button 
          type="button"
          className="btn-list-produce-top"
          onClick={setIsListingProduceModalOpen}
        >
          <Plus size={16} />
          <span>{t.listProduceBids}</span>
        </button>
      </div>

      {/* Comprehensive Filters Bar */}
      <div className="marketplace-filters-panel">
        <div className="filters-grid-row">
          {/* Search Input */}
          <div className="filter-field-item search-grow">
            <label>{t.searchBuyerCropLbl}</label>
            <div className="search-input-pill">
              <Search size={15} className="text-gray-400" />
              <input 
                type="text" 
                placeholder={t.searchCompanyCropPH || "Search company, wheat, tomato..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Crop Filter */}
          <div className="filter-field-item">
            <label>{t.requiredCropLbl}</label>
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

          {/* Location Filter */}
          <div className="filter-field-item">
            <label>{t.locationLbl}</label>
            <select 
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="filter-select"
            >
              {locationsList.map((l) => (
                <option key={l} value={l}>{l === "All" ? t.allLocations || "All Locations" : l}</option>
              ))}
            </select>
          </div>

          {/* Buyer Type */}
          <div className="filter-field-item">
            <label>{t.buyerTypeLbl}</label>
            <select 
              value={selectedBuyerType} 
              onChange={(e) => setSelectedBuyerType(e.target.value)}
              className="filter-select"
            >
              {buyerTypesList.map((bt) => (
                <option key={bt} value={bt}>{bt === "All" ? t.allBuyerTypes || "All Buyer Types" : bt}</option>
              ))}
            </select>
          </div>

          {/* Verified Only Toggle */}
          <div className="filter-field-item checkbox-align">
            <label className="checkbox-toggle-lbl">
              <input 
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
              />
              <span className="checkbox-custom-box">
                {verifiedOnly && <Check size={12} strokeWidth={3} />}
              </span>
              <span className="toggle-text">{t.verifiedOnlyToggle}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="buyers-results-header">
        <span className="results-count-text">
          <span dangerouslySetInnerHTML={{ __html: t.showingVerifiedBuyers ? t.showingVerifiedBuyers.replace("{count}", `<strong>${filteredBuyers.length}</strong>`) : `Showing <strong>${filteredBuyers.length}</strong> verified institutional buyers` }} />
        </span>
      </div>

      {/* Buyers Grid */}
      <div className="buyers-grid">
        {filteredBuyers.map((b) => (
          <div key={b.id} className="buyer-card">
            {/* Top Row: Company Name & Verification Badge */}
            <div className="buyer-top-row">
              <div className="buyer-identity">
                <div className="buyer-avatar-circle">
                  {b.produceEmoji || '🏢'}
                </div>
                <div>
                  <div className="buyer-name-title-row">
                    <h3 className="buyer-company-name">{b.name}</h3>
                    {b.isVerified && (
                      <span className="buyer-verified-badge" title="Verified Institutional Partner">
                        <ShieldCheck size={14} />
                        <span>{t.verifiedBadge}</span>
                      </span>
                    )}
                  </div>
                  <div className="buyer-location-text">
                    <MapPin size={12} />
                    <span>{b.location || 'Rajkot, Gujarat'} • {b.distance} {t.awayTxt || "away"}</span>
                  </div>
                </div>
              </div>

              <div className="buyer-offered-price-box">
                <div className="buyer-price-val">{b.offeredPrice}</div>
                <div className="buyer-price-label">{t.offeredRateLbl || "Offered Rate"}</div>
              </div>
            </div>

            {/* Requirement Details Grid */}
            <div className="buyer-specs-grid">
              <div className="spec-row-item">
                <span className="spec-label">{t.requiredCropLbl}:</span>
                <strong className="spec-value">{b.cropSpecialty}</strong>
              </div>
              <div className="spec-row-item">
                <span className="spec-label">{t.requiredQtyLbl}</span>
                <strong className="spec-value">{b.requiredQty || '400 Quintals'}</strong>
              </div>
              <div className="spec-row-item">
                <span className="spec-label">{t.buyerTypeLblAlt}</span>
                <span className="spec-value">{b.buyerType || 'Wholesale Trader'}</span>
              </div>
              <div className="spec-row-item">
                <span className="spec-label">{t.payoutTermsLbl}</span>
                <span className="spec-value text-emerald-700 font-bold">{b.paymentTerms || 'Same-Day RTGS'}</span>
              </div>
            </div>

            {/* Meta Row: Rating and Transactions */}
            <div className="buyer-meta-row">
              <div className="buyer-rating-wrap">
                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                <strong>{b.rating}</strong>
                <span className="deals-count">({t.previousTransactions ? t.previousTransactions.replace("{deals}", b.dealsCount || 42) : `${b.dealsCount || 42} previous transactions`})</span>
              </div>
              <span className={`demand-pill ${b.demandTag === 'High Demand' ? 'high' : 'med'}`}>
                {b.demandTag || "High Demand"}
              </span>
            </div>

            {/* Actions: Contact / Connect & Make Offer */}
            <div className="buyer-card-actions-row">
              <button 
                type="button" 
                className="btn-connect-buyer"
                onClick={() => {
                  if (showToast) showToast(`💬 Opening chat conversation with ${b.name}...`);
                  if (setActiveTab) setActiveTab('messages');
                }}
                title="Direct message this buyer"
              >
                <MessageSquare size={15} />
                <span>{t.contactConnectBtn}</span>
              </button>

              <button 
                type="button" 
                className="btn-make-offer"
                onClick={() => setSelectedBuyerForOffer(b)}
              >
                <span>{t.makeOfferBtn}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Listing CTA Banner */}
      <div className="produce-listing-banner">
        <div className="produce-banner-left">
          <div className="produce-basket-icon">
            🌾
          </div>
          <div>
            <div className="produce-banner-title">{t.cropsReadyForHarvest}</div>
            <div className="produce-banner-sub">{t.listProduceReceiveBids}</div>
          </div>
        </div>

        <button 
          className="become-seller-btn"
          onClick={setIsListingProduceModalOpen}
        >
          <span>{t.listProduceLotNow}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default BuyerMarketplace;
