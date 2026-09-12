// src/components/modals/BuyerOfferModal.jsx
import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, DollarSign, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import '../../styles/Modals.css';

const BuyerOfferModal = ({ crop, buyer, onClose, onOfferCreated, showToast }) => {
  const item = crop || buyer;
  if (!item) return null;

  const defaultPrice = item.pricePerUnit || item.priceValue || 2400;
  const [offeredPrice, setOfferedPrice] = useState(defaultPrice);
  const [quantity, setQuantity] = useState(Math.min(20, item.quantity || 20));
  const [deliveryTerms, setDeliveryTerms] = useState('Buyer Arranged Logistics');
  const [paymentTerms, setPaymentTerms] = useState('KisanSetu Escrow (Verified)');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dealSubmitted, setDealSubmitted] = useState(false);

  const totalAmount = Number(offeredPrice) * Number(quantity);

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.offers.create({
        cropId: item._id || item.id,
        offeredPrice: Number(offeredPrice),
        quantity: Number(quantity),
        deliveryTerms,
        paymentTerms,
        message: message || `Offer of ₹${offeredPrice}/${item.unit || 'qtl'} for ${quantity} ${item.unit || 'quintals'}.`,
      });

      if (res.success) {
        setDealSubmitted(true);
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (showToast) showToast('🎉 Offer submitted to farmer successfully!');
        if (onOfferCreated) onOfferCreated(res.data);
      }
    } catch (err) {
      console.error('Failed to submit offer:', err);
      if (showToast) showToast(err.message || 'Failed to submit offer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <span>🌾</span> Make Offer on {item.cropName || item.name}
          </h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          {dealSubmitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <CheckCircle2 size={38} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#14281d', marginBottom: '8px' }}>Offer Dispatched to Farmer!</h3>
              <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: '1.4', marginBottom: '16px' }}>
                The farmer will review your offer in their dashboard. Once accepted, an order will be automatically created.
              </p>
              <div style={{ background: '#f8faf8', padding: '12px 18px', borderRadius: '8px', border: '1px solid #e5ede7', display: 'inline-block', fontSize: '0.9rem', color: '#15803d', fontWeight: '700' }}>
                Total Offer Value: ₹ {totalAmount.toLocaleString('en-IN')}
              </div>
              <div style={{ marginTop: '20px' }}>
                <button className="btn-primary" onClick={onClose}>
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitOffer}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8faf8', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Produce Item</div>
                  <div style={{ fontWeight: '700', fontSize: '1rem', color: '#14281d' }}>{item.cropName || item.name}</div>
                  <small style={{ color: '#6b7280' }}>Variety: {item.variety || 'Grade A'}</small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Farmer Asking Price</div>
                  <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#15803d' }}>
                    ₹ {item.pricePerUnit || item.priceValue} <span style={{ fontSize: '0.8rem' }}>/ {item.unit || 'qtl'}</span>
                  </div>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Your Offered Price (₹ per {item.unit || 'qtl'})</label>
                  <input 
                    type="number" 
                    min="100" 
                    value={offeredPrice} 
                    onChange={(e) => setOfferedPrice(Number(e.target.value))} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Quantity Desired ({item.unit || 'quintals'})</label>
                  <input 
                    type="number" 
                    min="1" 
                    max={item.quantity || 1000} 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Logistics & Delivery</label>
                  <select value={deliveryTerms} onChange={(e) => setDeliveryTerms(e.target.value)}>
                    <option value="Buyer Arranged Logistics">Buyer Arranged Logistics (Self Pickup)</option>
                    <option value="Farmer Delivery to Mandi">Farmer Delivery to Mandi Hub</option>
                    <option value="KisanSetu Partner Truck">KisanSetu Partner Truck Fleet</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Settlement Method</label>
                  <select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
                    <option value="KisanSetu Escrow (Verified)">KisanSetu Digital Escrow</option>
                    <option value="Immediate RTGS on Quality Inspection">Direct RTGS on Inspection</option>
                    <option value="UPI Farm Gate Cashless">UPI Farm Gate Cashless</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Message / Note to Farmer</label>
                <textarea 
                  rows="2" 
                  placeholder="Specify pickup timeline, quality check requirements..." 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                />
              </div>

              <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '8px', border: '1px solid #a7f3d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: '#065f46', fontWeight: '600' }}>Calculated Total Offer Value:</span>
                <strong style={{ fontSize: '1.15rem', color: '#047857' }}>₹ {totalAmount.toLocaleString('en-IN')}</strong>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={onClose} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-confirm-add" disabled={submitting}>
                  {submitting ? 'Submitting Offer...' : 'Send Offer to Farmer'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerOfferModal;
