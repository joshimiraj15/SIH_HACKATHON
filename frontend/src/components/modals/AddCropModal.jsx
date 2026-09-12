// src/components/modals/AddCropModal.jsx
import React, { useState } from 'react';
import { X, Sprout, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import '../../styles/Modals.css';

const AddCropModal = ({ isOpen, onClose, onAddCrop }) => {
  const [cropName, setCropName] = useState('Cotton');
  const [quantity, setQuantity] = useState('450');
  const [unit, setUnit] = useState('kg');
  const [price, setPrice] = useState('6,800');

  const [grade, setGrade] = useState('GRADE_A');
  const [harvestDate, setHarvestDate] = useState(() => new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCrop = {
      id: `lot-${Date.now()}`,
      name: cropName,
      variety: 'Desi Supreme',
      quantity: `${quantity} ${unit}`,
      qtyValue: Number(quantity),
      price: price,
      grade: grade,
      harvestDate: harvestDate,
      unit: '/ Q',
      change: '+5.5%',
      trend: 'up',
      status: 'LISTED',
      image: cropName === 'Cotton' 
        ? 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
      health: 'Good Health',
      nextAction: 'Market rates are favorable. Produce lot is listed for buyer bids.'
    };

    onAddCrop(newCrop);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {}
    onClose();
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><Sprout size={18} color="#15803d" /> Create Produce Lot (AgriConnect)</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Crop Type</label>
                <select 
                  value={cropName} 
                  onChange={(e) => setCropName(e.target.value)} 
                  className="form-control"
                >
                  <option value="Cotton">🌱 Cotton (કપાસ)</option>
                  <option value="Groundnut">🥜 Groundnut (મગફળી)</option>
                  <option value="Wheat">🌾 Wheat (ઘઉં)</option>
                  <option value="Tomato">🍅 Tomato (ટામેટા)</option>
                  <option value="Onion">🧅 Onion (ડુંગળી)</option>
                  <option value="Potato">🥔 Potato (બટાકા)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quality Grade</label>
                <select 
                  value={grade} 
                  onChange={(e) => setGrade(e.target.value)} 
                  className="form-control"
                  style={{ fontWeight: '600', color: '#2d6a4f' }}
                >
                  <option value="GRADE_A">🌟 Grade A (Premium)</option>
                  <option value="GRADE_B">Standard Grade B</option>
                  <option value="GRADE_C">Bulk Grade C</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Harvest Quantity</label>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} 
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="form-control">
                  <option value="kg">kg</option>
                  <option value="Quintal">Quintal</option>
                  <option value="Tonne">Tonne</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Base Price (₹ / Quintal)</label>
                <input 
                  type="text" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Harvest Date</label>
                <input 
                  type="date" 
                  value={harvestDate} 
                  onChange={(e) => setHarvestDate(e.target.value)} 
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Crop & List</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCropModal;
