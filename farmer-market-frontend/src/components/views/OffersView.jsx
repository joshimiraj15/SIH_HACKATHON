// src/components/views/OffersView.jsx
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  DollarSign, 
  ArrowRight,
  User,
  MapPin,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import '../../styles/OffersView.css';

const OffersView = ({ setActiveTab, currentUser, showToast }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counterValues, setCounterValues] = useState({});
  const [showCounterInput, setShowCounterInput] = useState({});

  const role = currentUser?.role || 'farmer';

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await api.offers.getMyOffers();
      if (res?.data) {
        setOffers(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [currentUser]);

  const handleUpdateStatus = async (offerId, status) => {
    try {
      const counterPrice = counterValues[offerId] ? Number(counterValues[offerId]) : null;
      const res = await api.offers.updateStatus(offerId, status, counterPrice);
      
      if (res.success) {
        if (status === 'accepted') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          if (showToast) showToast('🎉 Offer accepted! An official order has been created in Escrow.');
        } else if (status === 'countered') {
          if (showToast) showToast(`Counter-offer of ₹${counterPrice}/qtl sent to buyer.`);
        } else {
          if (showToast) showToast(`Offer marked as ${status}.`);
        }
        fetchOffers();
      }
    } catch (err) {
      console.error('Error updating offer:', err);
      if (showToast) showToast(err.message || 'Failed to update offer');
    }
  };

  return (
    <div className="offers-view-container">
      <div className="view-header-strip">
        <div>
          <h2>Offers & Deal Negotiations</h2>
          <p>
            {role === 'farmer'
              ? 'Review bids placed on your produce listings, accept deals, or submit counter-offers'
              : 'Track bids you sent to farmers and manage deal confirmations'}
          </p>
        </div>
        <button className="btn-refresh" onClick={fetchOffers}>
          <RefreshCw size={15} />
          <span>Refresh Offers</span>
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <RefreshCw size={28} className="spin-anim" />
          <p>Loading offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="empty-state">
          <Clock size={48} />
          <h3>No active offers yet</h3>
          <p>
            {role === 'farmer'
              ? 'When buyers bid on your crops, their offers will appear here.'
              : 'Browse the marketplace and make an offer on any available crop listing.'}
          </p>
          <button 
            className="btn-primary" 
            onClick={() => setActiveTab(role === 'farmer' ? 'my-crops' : 'buyers')}
            style={{ marginTop: '16px' }}
          >
            {role === 'farmer' ? 'View My Produce Listings' : 'Explore Produce Marketplace'}
          </button>
        </div>
      ) : (
        <div className="offers-grid">
          {offers.map((offer) => {
            const isFarmer = role === 'farmer';
            const otherParty = isFarmer ? offer.buyer : offer.farmer;

            return (
              <div key={offer._id} className="offer-card">
                <div className="offer-card-top">
                  <div>
                    <span className="crop-tag-pill">{offer.crop?.cropName || 'Crop Produce'}</span>
                    <h3 className="offer-crop-name">{offer.crop?.category || 'Grains'} Batch</h3>
                  </div>
                  <span className={`status-pill status-${offer.status}`}>
                    {offer.status.toUpperCase()}
                  </span>
                </div>

                <div className="offer-party-info">
                  <User size={16} />
                  <span>
                    <strong>{otherParty?.name || 'Verified Trader'}</strong> ({otherParty?.businessName || (isFarmer ? 'Buyer' : 'Farmer')})
                  </span>
                </div>

                <div className="offer-bid-details">
                  <div className="bid-detail-box">
                    <span className="label">Offered Price</span>
                    <strong className="val text-emerald">₹ {offer.offeredPrice?.toLocaleString('en-IN')} / qtl</strong>
                  </div>
                  <div className="bid-detail-box">
                    <span className="label">Desired Quantity</span>
                    <strong className="val">{offer.quantity} quintals</strong>
                  </div>
                  <div className="bid-detail-box highlight">
                    <span className="label">Total Deal Value</span>
                    <strong className="val text-emerald">₹ {offer.totalAmount?.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                {offer.message && (
                  <div className="offer-message-quote">
                    <MessageSquare size={14} />
                    <span>"{offer.message}"</span>
                  </div>
                )}

                <div className="offer-logistics-info">
                  <span>Logistics: <strong>{offer.deliveryTerms || 'Buyer Arranged Logistics'}</strong></span>
                  <span>Payment: <strong>{offer.paymentTerms || 'KisanSetu Escrow'}</strong></span>
                </div>

                {/* Farmer Action Buttons */}
                {isFarmer && offer.status === 'pending' && (
                  <div className="offer-actions-footer">
                    {showCounterInput[offer._id] ? (
                      <div className="counter-input-row">
                        <input 
                          type="number" 
                          placeholder="Your counter price (₹)"
                          value={counterValues[offer._id] || ''}
                          onChange={(e) => setCounterValues({ ...counterValues, [offer._id]: e.target.value })}
                        />
                        <button 
                          className="btn-send-counter"
                          onClick={() => handleUpdateStatus(offer._id, 'countered')}
                        >
                          Send Counter
                        </button>
                        <button 
                          className="btn-cancel"
                          onClick={() => setShowCounterInput({ ...showCounterInput, [offer._id]: false })}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="actions-button-row">
                        <button 
                          className="btn-accept"
                          onClick={() => handleUpdateStatus(offer._id, 'accepted')}
                        >
                          <CheckCircle size={16} />
                          <span>Accept & Create Order</span>
                        </button>
                        <button 
                          className="btn-counter"
                          onClick={() => setShowCounterInput({ ...showCounterInput, [offer._id]: true })}
                        >
                          Counter Offer
                        </button>
                        <button 
                          className="btn-reject"
                          onClick={() => handleUpdateStatus(offer._id, 'rejected')}
                        >
                          <XCircle size={16} />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {offer.status === 'accepted' && (
                  <div className="offer-accepted-banner">
                    <CheckCircle size={16} className="text-emerald" />
                    <span>Deal Finalized! Order created in Escrow.</span>
                    <button className="btn-link-order" onClick={() => setActiveTab('orders')}>
                      View Order →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OffersView;
