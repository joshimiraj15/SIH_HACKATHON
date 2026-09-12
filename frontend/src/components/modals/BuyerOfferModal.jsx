// src/components/modals/BuyerOfferModal.jsx
import React, { useState } from 'react';
import { X, ShieldCheck, Star, MapPin, Truck, CheckCircle2, Phone, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { offersAPI } from '../../services/api';
import '../../styles/Modals.css';

const BuyerOfferModal = ({ buyer, onClose }) => {
  const [dealAccepted, setDealAccepted] = useState(false);
  const [dealQuantity, setDealQuantity] = useState('300');

  if (!buyer) return null;

  const handleAcceptDeal = async () => {
    setDealAccepted(true);
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
      // Try pushing offer record to backend
      await offersAPI.makeOffer({
        buyerName: buyer.name,
        offeredPrice: buyer.priceValue || 25,
        quantity: Number(dealQuantity) || 300,
        notes: `Accepted direct offer from ${buyer.name}`
      });
    } catch (e) {}
  };

  const calculatedTotal = (Number(dealQuantity) || 0) * (buyer.priceValue || 25);

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <span>{buyer.produceEmoji}</span> {buyer.name} - Direct Offer
          </h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          {dealAccepted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#14281d', marginBottom: '6px' }}>Deal Successfully Reserved!</h3>
              <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: '1.4', marginBottom: '16px' }}>
                <strong>{buyer.name}</strong> logistics manager has been notified. Pickup scheduled for your farm in Rajkot.
              </p>
              <div style={{ background: '#f8faf8', padding: '12px', borderRadius: '8px', border: '1px solid #e5ede7', display: 'inline-block', fontSize: '0.86rem', color: '#15803d', fontWeight: '700' }}>
                Estimated Direct Settlement: ₹{calculatedTotal.toLocaleString()}
              </div>
            </div>
          ) : (
            <>
              {/* Buyer Header Meta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8faf8', padding: '12px 16px', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Buying Specialty</div>
                  <div style={{ fontWeight: '700', fontSize: '1rem', color: '#14281d' }}>{buyer.cropSpecialty}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Locked Rate</div>
                  <div style={{ fontWeight: '800', fontSize: '1.35rem', color: '#15803d' }}>{buyer.offeredPrice}</div>
                </div>
              </div>

              {/* Details & Terms */}
              <p style={{ fontSize: '0.86rem', color: '#4b5563', lineHeight: '1.45' }}>
                {buyer.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
                <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '8px', border: '1px solid #dcfce7' }}>
                  <div style={{ color: '#166534', fontWeight: '700' }}>Payment Terms</div>
                  <div style={{ color: '#14532d' }}>{buyer.paymentTerms}</div>
                </div>
                <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '8px', border: '1px solid #dcfce7' }}>
                  <div style={{ color: '#166534', fontWeight: '700' }}>Farmgate Pickup</div>
                  <div style={{ color: '#14532d' }}>{buyer.pickupAvailable ? 'Free Tractor Pickup' : 'Self Mandi Delivery'}</div>
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="form-group">
                <label>Enter Quantity to Commit (kg)</label>
                <input 
                  type="number" 
                  value={dealQuantity} 
                  onChange={(e) => setDealQuantity(e.target.value)} 
                  className="form-control" 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#fefce8', borderRadius: '8px', border: '1px solid #fde047' }}>
                <span style={{ fontSize: '0.84rem', color: '#854d0e', fontWeight: '600' }}>Total Expected Payout:</span>
                <strong style={{ fontSize: '1.2rem', color: '#713f12' }}>₹{calculatedTotal.toLocaleString()}</strong>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          {dealAccepted ? (
            <button className="btn-primary" onClick={onClose}>Done</button>
          ) : (
            <>
              <button className="btn-secondary" onClick={onClose}>Close</button>
              <button className="btn-primary" onClick={handleAcceptDeal}>
                Accept & Reserve Deal
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerOfferModal;
