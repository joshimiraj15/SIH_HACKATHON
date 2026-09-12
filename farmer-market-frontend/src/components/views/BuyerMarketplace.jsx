// src/components/views/BuyerMarketplace.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  Plus, 
  Store, 
  Tag, 
  RefreshCw,
  DollarSign,
  Package,
  Sprout,
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/BuyerMarketplace.css';

const BuyerMarketplace = ({ setSelectedCropForOffer, setSelectedBuyerForOffer, setActiveTab, currentUser, showToast }) => {
  const [activeSubTab, setActiveSubTab] = useState('produce'); // 'produce' or 'buyers'
  const [crops, setCrops] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Grains', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds', 'Other'];

  const fetchProduce = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const [cropRes, userRes] = await Promise.all([
        api.crops.getAll(params).catch(() => ({ data: [] })),
        api.auth.getDemoUsers().catch(() => ({ buyers: [] })),
      ]);

      if (cropRes?.data) setCrops(cropRes.data);
      if (userRes?.buyers) setBuyers(userRes.buyers);
    } catch (err) {
      console.error('Failed to load marketplace:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduce();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProduce();
  };

  const handleDirectBuy = async (crop) => {
    try {
      const quantity = Math.min(10, crop.quantity);
      const res = await api.orders.createDirect({
        cropId: crop._id,
        quantity,
      });

      if (res.success) {
        if (showToast) showToast(`🎉 Direct purchase order created for ${quantity} ${crop.unit} of ${crop.cropName}!`);
        setActiveTab('orders');
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Direct buy failed');
    }
  };

  return (
    <div className="buyer-marketplace-container">
      {/* Header */}
      <div className="marketplace-header">
        <div>
          <h1>Agricultural Produce & Buyer Marketplace</h1>
          <p>Direct farm gate connections: Browse certified crops or connect with verified institutional buyers</p>
        </div>
        <div className="marketplace-toggle-pills">
          <button 
            className={`toggle-pill ${activeSubTab === 'produce' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('produce')}
          >
            <Sprout size={16} />
            <span>Farm Produce for Sale ({crops.length})</span>
          </button>
          <button 
            className={`toggle-pill ${activeSubTab === 'buyers' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('buyers')}
          >
            <Store size={16} />
            <span>Verified Buyers Directory ({buyers.length})</span>
          </button>
        </div>
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

        <form onSubmit={handleSearchSubmit} className="buyer-search-input-wrap">
          <Search size={16} color="#9ca3af" />
          <input 
            type="text" 
            placeholder="Search crop, variety, or farmer..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {loading ? (
        <div className="loading-state">
          <RefreshCw size={28} className="spin-anim" />
          <p>Loading marketplace listings...</p>
        </div>
      ) : activeSubTab === 'produce' ? (
        /* Produce Grid */
        crops.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <h3>No produce matching this filter</h3>
            <p>Try selecting 'All' categories or searching another commodity.</p>
          </div>
        ) : (
          <div className="produce-cards-grid">
            {crops.map((crop) => (
              <div key={crop._id} className="produce-market-card">
                <div className="produce-card-image-wrap">
                  <img 
                    src={crop.images?.[0] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80'} 
                    alt={crop.cropName} 
                    className="produce-card-img"
                  />
                  <span className="category-tag-badge">{crop.category}</span>
                  {crop.isOrganic && <span className="organic-badge">🌱 100% Organic</span>}
                </div>

                <div className="produce-card-content">
                  <div className="produce-title-row">
                    <h3>{crop.cropName}</h3>
                    <span className="quality-grade-pill">{crop.qualityGrade || 'Grade A'}</span>
                  </div>

                  <p className="variety-text">{crop.variety || 'Standard FAQ Variety'}</p>

                  <div className="farmer-attribution">
                    <div className="farmer-avatar-circle">
                      {crop.farmer?.name ? crop.farmer.name.charAt(0) : 'F'}
                    </div>
                    <div className="farmer-name-info">
                      <span className="farmer-name">
                        {crop.farmer?.name || 'Verified Farmer'}
                        {crop.farmer?.isVerified && <ShieldCheck size={14} className="text-emerald" />}
                      </span>
                      <span className="farmer-loc">
                        <MapPin size={12} /> {crop.location?.district || 'Rajkot'}, {crop.location?.state || 'Gujarat'}
                      </span>
                    </div>
                  </div>

                  <div className="produce-pricing-row">
                    <div>
                      <span className="rate-label">Listed Farm Gate Price</span>
                      <div className="produce-price-num">
                        ₹ {crop.pricePerUnit?.toLocaleString('en-IN')}
                        <span className="rate-unit"> / {crop.unit}</span>
                      </div>
                    </div>
                    <div className="stock-info">
                      <span className="rate-label">Available Stock</span>
                      <strong>{crop.quantity} {crop.unit}</strong>
                    </div>
                  </div>

                  <div className="produce-card-buttons">
                    <button 
                      className="btn-make-offer"
                      onClick={() => {
                        if (setSelectedCropForOffer) setSelectedCropForOffer(crop);
                        if (setSelectedBuyerForOffer) setSelectedBuyerForOffer(crop);
                      }}
                    >
                      <span>Make an Offer</span>
                      <ArrowRight size={14} />
                    </button>
                    <button 
                      className="btn-direct-buy"
                      onClick={() => handleDirectBuy(crop)}
                    >
                      Instant Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Buyers Directory Grid */
        <div className="buyers-cards-grid">
          {buyers.map((b) => (
            <div key={b._id} className="buyer-directory-card">
              <div className="buyer-dir-header">
                <div className="buyer-dir-avatar">
                  {b.name.charAt(0)}
                </div>
                <div>
                  <h4>{b.name} <ShieldCheck size={14} className="text-emerald" /></h4>
                  <span className="biz-tag">{b.businessName || 'Procurement Partner'}</span>
                </div>
              </div>

              <div className="buyer-dir-meta">
                <p><MapPin size={14} /> {b.location?.district || 'Surat'}, {b.location?.state || 'Gujarat'}</p>
                <p><Star size={14} fill="#eab308" color="#eab308" /> 4.9 Rating (110+ Completed Mandi Deals)</p>
              </div>

              <div className="buyer-dir-actions">
                <button 
                  className="btn-message-buyer"
                  onClick={() => setActiveTab('messages')}
                >
                  <MessageSquare size={14} />
                  <span>Start Chat</span>
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    if (showToast) showToast(`Connected with ${b.name}!`);
                    setActiveTab('messages');
                  }}
                >
                  Connect Buyer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerMarketplace;
