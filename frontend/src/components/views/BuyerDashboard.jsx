// src/components/views/BuyerDashboard.jsx
import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Filter, 
  DollarSign, 
  Truck, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Award,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import '../../styles/BuyerDashboard.css';

const BuyerDashboard = ({ 
  farmerCrops = [], 
  buyerOffers = [], 
  onOpenPlaceOrderModal, 
  onContactFarmer,
  setActiveTab,
  buyerUser
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabSub, setActiveTabSub] = useState('browse'); // 'browse' or 'my-orders'

  const categories = ['All', 'Wheat', 'Tomato', 'Onion', 'Potato', 'Cotton', 'Pulses'];

  // Default farmer produce fallback dataset if farmerCrops is empty
  const defaultFarmerProduce = [
    {
      id: 'fcrop-101',
      name: 'Wheat',
      variety: 'Sharbati Supreme',
      farmerName: 'Ramesh Patel',
      location: 'Gondal, Rajkot',
      district: 'Rajkot',
      qtyValue: 120,
      quantity: '120 Quintals',
      price: '2,450',
      unit: '/ Q',
      grade: 'GRADE_A',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
      harvestDate: 'Ready for Immediate Loading',
      mandiBenchmark: '₹2,480/Q',
      savingsTag: '1.2% Below Mandi Avg'
    },
    {
      id: 'fcrop-102',
      name: 'Tomato',
      variety: 'Desi Hybrid Red',
      farmerName: 'Kishor Bhai',
      location: 'Sanand, Ahmedabad',
      district: 'Ahmedabad',
      qtyValue: 80,
      quantity: '80 Quintals',
      price: '2,580',
      unit: '/ Q',
      grade: 'GRADE_A',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
      harvestDate: 'Fresh Picked 24h Ago',
      mandiBenchmark: '₹2,650/Q',
      savingsTag: '2.6% Below Mandi Avg'
    },
    {
      id: 'fcrop-103',
      name: 'Cotton',
      variety: 'Shankar-6 Long Staple',
      farmerName: 'Mansukh Vanani',
      location: 'Morbi, Gujarat',
      district: 'Morbi',
      qtyValue: 200,
      quantity: '200 Quintals',
      price: '7,150',
      unit: '/ Q',
      grade: 'GRADE_A+',
      image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&auto=format&fit=crop&q=80',
      harvestDate: 'Baled & Dry Storage',
      mandiBenchmark: '₹7,280/Q',
      savingsTag: 'Premium Quality'
    },
    {
      id: 'fcrop-104',
      name: 'Onion',
      variety: 'Nashik Dark Red',
      farmerName: 'Bharat Solanki',
      location: 'Mahuva, Bhavnagar',
      district: 'Bhavnagar',
      qtyValue: 150,
      quantity: '150 Quintals',
      price: '1,820',
      unit: '/ Q',
      grade: 'GRADE_A',
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80',
      harvestDate: 'Ventilated Storage',
      mandiBenchmark: '₹1,910/Q',
      savingsTag: '4.7% Savings'
    },
    {
      id: 'fcrop-105',
      name: 'Potato',
      variety: 'Kufri Pukhraj',
      farmerName: 'Pravin Choudhary',
      location: 'Deesa, Banaskantha',
      district: 'Banaskantha',
      qtyValue: 350,
      quantity: '350 Quintals',
      price: '1,210',
      unit: '/ Q',
      grade: 'GRADE_A',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80',
      harvestDate: 'Cold Store Lot A3',
      mandiBenchmark: '₹1,260/Q',
      savingsTag: 'Bulk Wholesale Offer'
    }
  ];

  const allCrops = farmerCrops.length > 0 ? farmerCrops : defaultFarmerProduce;

  const filteredCrops = allCrops.filter((crop) => {
    const matchesCat = selectedCategory === 'All' || crop.name?.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = (crop.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (crop.farmerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (crop.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const acceptedOffersCount = buyerOffers.filter(o => o.status === 'accepted').length;

  return (
    <div className="buyer-dashboard-container">
      {/* Top Buyer Hero Banner */}
      <div className="buyer-hero-card">
        <div className="buyer-hero-left">
          <div className="buyer-role-badge">
            <ShieldCheck size={15} /> Verified Buyer & Procurement Portal
          </div>
          <h1 className="buyer-hero-title">
            Direct Farm Procurement Hub 🌾
          </h1>
          <p className="buyer-hero-desc">
            Bypass middlemen, connect with verified local farmers in Gujarat, and source fresh crop lots at competitive mandi benchmark rates.
          </p>

          <div className="buyer-actions-group">
            <button 
              type="button" 
              className={`buyer-tab-btn ${activeTabSub === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveTabSub('browse')}
            >
              <ShoppingBag size={16} /> Browse Listed Crops ({filteredCrops.length})
            </button>
            <button 
              type="button" 
              className={`buyer-tab-btn ${activeTabSub === 'my-orders' ? 'active' : ''}`}
              onClick={() => setActiveTabSub('my-orders')}
            >
              <Clock size={16} /> My Placed Offers ({buyerOffers.length})
            </button>
          </div>
        </div>

        <div className="buyer-hero-stats">
          <div className="bstat-card">
            <div className="bstat-val">{filteredCrops.length}</div>
            <div className="bstat-lbl">Active Farmer Lots</div>
          </div>
          <div className="bstat-card">
            <div className="bstat-val">{buyerOffers.length}</div>
            <div className="bstat-lbl">Offers Submitted</div>
          </div>
          <div className="bstat-card">
            <div className="bstat-val text-green">{acceptedOffersCount}</div>
            <div className="bstat-lbl">Deals Closed</div>
          </div>
          <div className="bstat-card">
            <div className="bstat-val">₹2,480</div>
            <div className="bstat-lbl">Avg Benchmark / Q</div>
          </div>
        </div>
      </div>

      {activeTabSub === 'browse' ? (
        <>
          {/* Filter Bar */}
          <div className="buyer-filter-bar">
            <div className="buyer-cat-scroll">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`buyer-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="buyer-search-box">
              <Search size={16} color="#64748B" />
              <input
                type="text"
                placeholder="Search crop, farmer name, district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Available Farmer Crops Grid */}
          <div className="farmer-crops-grid">
            {filteredCrops.map((crop) => (
              <div key={crop.id} className="fcrop-card">
                <div className="fcrop-image-wrap">
                  <img src={crop.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80'} alt={crop.name} className="fcrop-img" />
                  <span className="fcrop-grade-pill">{crop.grade || 'GRADE A'}</span>
                  {crop.savingsTag && (
                    <span className="fcrop-savings-badge">
                      <Sparkles size={12} /> {crop.savingsTag}
                    </span>
                  )}
                </div>

                <div className="fcrop-content">
                  <div className="fcrop-top-row">
                    <div>
                      <h3 className="fcrop-title">{crop.name}</h3>
                      <div className="fcrop-variety">{crop.variety || 'Desi Prime'}</div>
                    </div>
                    <div className="fcrop-price-block">
                      <div className="fcrop-price-val">₹{crop.price}</div>
                      <div className="fcrop-unit">{crop.unit || '/ Q'}</div>
                    </div>
                  </div>

                  {/* Farmer Info */}
                  <div className="fcrop-farmer-meta">
                    <div className="fcrop-farmer-name">
                      👤 {crop.farmerName || 'Kisan Partner'}
                    </div>
                    <div className="fcrop-location">
                      <MapPin size={13} /> {crop.location || 'Rajkot, Gujarat'}
                    </div>
                  </div>

                  <div className="fcrop-qty-row">
                    <span>Available Vol: <strong>{crop.quantity || `${crop.qtyValue || 50} Qtl`}</strong></span>
                    <span className="mandi-ref">APMC Avg: {crop.mandiBenchmark || '₹2,480/Q'}</span>
                  </div>

                  {/* Action Row */}
                  <div className="fcrop-actions">
                    <button
                      type="button"
                      className="fcrop-contact-btn"
                      onClick={() => onContactFarmer && onContactFarmer(crop)}
                      title="Send message to farmer"
                    >
                      <MessageSquare size={15} /> Chat
                    </button>
                    <button
                      type="button"
                      className="fcrop-offer-btn"
                      onClick={() => onOpenPlaceOrderModal && onOpenPlaceOrderModal(crop)}
                    >
                      Place Purchase Offer →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* My Placed Offers / Orders View */
        <div className="buyer-orders-section">
          <div className="section-title-bar">
            <h2>My Active Contract Offers & Orders</h2>
            <p>Track status of direct purchase offers sent to local farmers.</p>
          </div>

          {buyerOffers.length === 0 ? (
            <div className="empty-offers-card">
              <ShoppingBag size={48} color="#94A3B8" />
              <h3>No Purchase Offers Placed Yet</h3>
              <p>Browse farmer listings and place your first contract offer to start procuring produce!</p>
              <button 
                type="button" 
                className="buyer-cat-btn active"
                onClick={() => setActiveTabSub('browse')}
              >
                Browse Listed Crops Now →
              </button>
            </div>
          ) : (
            <div className="offers-table-wrap">
              <table className="offers-table">
                <thead>
                  <tr>
                    <th>Crop / Produce</th>
                    <th>Farmer Partner</th>
                    <th>Offered Rate</th>
                    <th>Quantity</th>
                    <th>Total Contract</th>
                    <th>Delivery Terms</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {buyerOffers.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <strong className="crop-name-txt">{o.cropName}</strong>
                      </td>
                      <td>
                        <div>{o.farmerName}</div>
                        <div className="small-sub-txt">📍 {o.farmerLocation}</div>
                      </td>
                      <td>
                        <span className="price-bold">₹{o.offeredPrice.toLocaleString()} / Q</span>
                      </td>
                      <td>{o.quantity} Quintal</td>
                      <td>
                        <strong className="total-val-txt">₹{o.totalValue.toLocaleString()}</strong>
                      </td>
                      <td>
                        <div className="small-sub-txt">{o.paymentTerm}</div>
                        <div className="small-sub-txt" style={{ color: '#059669' }}>{o.logistics}</div>
                      </td>
                      <td>
                        {o.status === 'accepted' ? (
                          <span className="status-badge status-accepted">
                            <CheckCircle2 size={13} /> Accepted
                          </span>
                        ) : o.status === 'rejected' ? (
                          <span className="status-badge status-rejected">
                            <XCircle size={13} /> Declined
                          </span>
                        ) : (
                          <span className="status-badge status-pending">
                            <Clock size={13} /> Offer Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
