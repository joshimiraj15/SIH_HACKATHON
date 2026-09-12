// src/components/modals/PlaceOrderModal.jsx
import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Truck, DollarSign, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import '../../styles/Modals.css';

const PlaceOrderModal = ({ isOpen, crop, buyerUser, onClose, onSubmitOffer }) => {
  if (!isOpen || !crop) return null;

  const [quantity, setQuantity] = useState(crop.qtyValue || 50);
  const [offeredPrice, setOfferedPrice] = useState(() => {
    const rawNum = Number(String(crop.price || '2500').replace(/[^0-9.]/g, ''));
    return rawNum || 2500;
  });
  const [paymentTerm, setPaymentTerm] = useState('Instant Digital Transfer (UPI/RTGS)');
  const [logistics, setLogistics] = useState('Farm Gate Pickup (Buyer Arranged)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotal = () => {
    return (Number(quantity) || 0) * (Number(offeredPrice) || 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const offerData = {
      id: `offer-${Date.now()}`,
      cropId: crop.id,
      cropName: crop.name || 'Produce',
      farmerName: crop.farmerName || 'Farmer Partner',
      farmerLocation: crop.location || crop.district || 'Rajkot, Gujarat',
      buyerName: buyerUser?.name || 'AgroFresh Procurement',
      offeredPrice: Number(offeredPrice),
      quantity: Number(quantity),
      unit: crop.unit || '/ Q',
      totalValue: calculateTotal(),
      paymentTerm,
      logistics,
      notes,
      status: 'pending',
      timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setTimeout(() => {
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      onSubmitOffer(offerData);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="modal-backdrop-blur">
      <div className="modal-card-center" style={{ maxWidth: '540px' }}>
        <div className="modal-top-header">
          <div className="modal-header-title-block">
            <div className="modal-icon-badge" style={{ background: '#DCFCE7', color: '#15803D' }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="modal-title">Place Purchase Offer / Order</h2>
              <p className="modal-subtitle">Direct contract with farmer listing: <strong>{crop.name}</strong></p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Farmer & Crop Summary Banner */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '14px 18px',
          marginBottom: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>FARMER PRODUCER</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0F172A' }}>{crop.farmerName || 'Kisan Partner'}</div>
            <div style={{ fontSize: '0.82rem', color: '#475569' }}>📍 {crop.location || 'Rajkot, Gujarat'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>EXPECTED RATE</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#166534' }}>₹{crop.price} {crop.unit || '/ Q'}</div>
            <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: '600' }}>{crop.grade || 'GRADE A'}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-grid">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-field-group">
              <label className="form-label">Offered Price (₹ / Qtl)</label>
              <input
                type="number"
                className="form-input-text"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                required
                min="1"
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">Quantity Required (Quintal)</label>
              <input
                type="number"
                className="form-input-text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="1"
              />
            </div>
          </div>

          <div className="form-field-group">
            <label className="form-label">Payment Terms</label>
            <select
              className="form-input-text"
              value={paymentTerm}
              onChange={(e) => setPaymentTerm(e.target.value)}
            >
              <option value="Instant Digital Transfer (UPI/RTGS)">Instant Digital Transfer (UPI / RTGS)</option>
              <option value="100% Cash on Weighing at Farm Gate">100% Cash on Weighing at Farm Gate</option>
              <option value="50% Advance + 50% Post Dispatch">50% Advance + 50% Post Dispatch</option>
            </select>
          </div>

          <div className="form-field-group">
            <label className="form-label">Logistics & Delivery</label>
            <select
              className="form-input-text"
              value={logistics}
              onChange={(e) => setLogistics(e.target.value)}
            >
              <option value="Farm Gate Pickup (Buyer Arranged)">Farm Gate Pickup (Buyer Truck Pickup)</option>
              <option value="Mandi Delivery (Farmer Delivers to APMC)">Mandi Delivery (Farmer Delivers to APMC)</option>
              <option value="Cold Storage Warehouse Dropoff">Cold Storage Warehouse Dropoff</option>
            </select>
          </div>

          <div className="form-field-group">
            <label className="form-label">Notes / Instructions to Farmer</label>
            <textarea
              className="form-input-text"
              rows={2}
              placeholder="Specify quality grading, packaging preferences, or pickup timeline..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Calculated Total Box */}
          <div style={{
            background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
            color: '#FFFFFF',
            padding: '14px 18px',
            borderRadius: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '6px'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', opacity: 0.88, fontWeight: '600' }}>TOTAL CONTRACT VALUE</div>
              <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>{quantity} Quintal @ ₹{offeredPrice}/Q</div>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>
              ₹{calculateTotal().toLocaleString()}
            </div>
          </div>

          <div className="modal-actions-footer" style={{ marginTop: '16px' }}>
            <button type="button" onClick={onClose} className="modal-cancel-btn">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="modal-submit-btn"
              style={{ background: '#166534' }}
            >
              {isSubmitting ? 'Submitting Offer...' : 'Send Order Offer to Farmer →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrderModal;
