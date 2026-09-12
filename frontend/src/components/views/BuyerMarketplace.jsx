// src/components/views/BuyerMarketplace.jsx
import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  Plus, 
  Store, 
  Tag, 
  SlidersHorizontal,
  DollarSign,
  Truck
} from 'lucide-react';
import { buyersList } from '../../data/mockData';
import '../../styles/BuyerMarketplace.css';

const BuyerMarketplace = ({ setSelectedBuyerForOffer, setIsListingProduceModalOpen }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Others'];

  const filteredBuyers = buyersList.filter((buyer) => {
    const matchesCat = selectedCategory === 'All' || buyer.category === selectedCategory;
    const matchesSearch = buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          buyer.cropSpecialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="buyer-marketplace-container">
      {/* Header */}
      <div className="marketplace-header">
        <h1>Buyer Marketplace</h1>
        <p>Connect with verified buyers and get the best deals.</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="marketplace-filter-bar">
        <div className="category-tabs-group">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="buyer-search-input-wrap">
          <Search size={16} color="#9ca3af" />
          <input 
            type="text" 
            placeholder="Search buyer, produce..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 2x2 Buyer Grid */}
      <div className="buyers-grid">
        {filteredBuyers.map((b) => (
          <div key={b.id} className="buyer-card">
            <div>
              <div className="buyer-top-row">
                <div className="buyer-identity">
                  <div className="buyer-avatar-circle">
                    {b.produceEmoji}
                  </div>
                  <div>
                    <div className="buyer-name">{b.name}</div>
                    <div className="buyer-specialty">
                      <span>{b.cropSpecialty}</span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                        <MapPin size={12} /> {b.distance}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="buyer-price-tag">
                  <div className="buyer-price-val">{b.offeredPrice}</div>
                  <div className="buyer-price-label">Offered Rate</div>
                </div>
              </div>

              {/* Meta: Rating and Deals */}
              <div className="buyer-meta-row" style={{ marginTop: '12px' }}>
                <span className="buyer-rating">
                  <Star size={14} fill="#F59E0B" color="#F59E0B" /> {b.rating}
                </span>
                <span>({b.dealsCount} deals)</span>
                <span>•</span>
                <span>{b.paymentTerms.split(' ')[0]} Payout</span>
              </div>
            </div>

            {/* Badges & View Offer Action */}
            <div className="buyer-footer-row">
              <div className="buyer-badges-wrap">
                <span className={b.demandTag === 'High Demand' ? 'badge-demand-high' : 'badge-demand-med'}>
                  {b.demandTag}
                </span>
                <span style={{
                  background: '#e0e7ff',
                  color: '#3730a3',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: '700'
                }}>
                  Grade A & B Wanted
                </span>
                {b.isVerified && (
                  <span className="badge-verified">
                    <ShieldCheck size={12} /> Verified
                  </span>
                )}
              </div>

              <button 
                className="view-offer-btn"
                onClick={() => setSelectedBuyerForOffer(b)}
              >
                View Offer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Listing Banner */}
      <div className="produce-listing-banner">
        <div className="produce-banner-left">
          <div className="produce-basket-icon">
            🧺
          </div>
          <div>
            <div className="produce-banner-title">List Your Produce</div>
            <div className="produce-banner-sub">Reach thousands of verified buyers instantly with zero commission fees.</div>
          </div>
        </div>

        <button 
          className="become-seller-btn"
          onClick={() => setIsListingProduceModalOpen(true)}
        >
          Become a Seller →
        </button>
      </div>
    </div>
  );
};

export default BuyerMarketplace;
