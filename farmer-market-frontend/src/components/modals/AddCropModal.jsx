// src/components/modals/AddCropModal.jsx
import React, { useState } from 'react';
import { X, Sprout, Check, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import '../../styles/Modals.css';

const AddCropModal = ({ isOpen, onClose, onCropCreated, showToast }) => {
  const [cropName, setCropName] = useState('Wheat');
  const [variety, setVariety] = useState('Sharbati Premium');
  const [category, setCategory] = useState('Grains');
  const [quantity, setQuantity] = useState(50);
  const [unit, setUnit] = useState('quintal');
  const [pricePerUnit, setPricePerUnit] = useState(2420);
  const [qualityGrade, setQualityGrade] = useState('Grade A');
  const [isOrganic, setIsOrganic] = useState(false);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const cropImages = {
    Wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
    Cotton: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80',
    Groundnut: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&auto=format&fit=crop&q=80',
    Tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    Onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    Potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.crops.create({
        cropName,
        variety,
        category,
        quantity: Number(quantity),
        unit,
        pricePerUnit: Number(pricePerUnit),
        qualityGrade,
        isOrganic,
        description: description || `Freshly harvested ${variety} ${cropName}. Verified quality.`,
        images: [cropImages[cropName] || cropImages.Wheat],
      });

      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (showToast) showToast(`🎉 ${cropName} produce listing created successfully!`);
        if (onCropCreated) onCropCreated(res.data);
        onClose();
      }
    } catch (err) {
      console.error('Failed to create crop listing:', err);
      if (showToast) showToast(err.message || 'Failed to list produce');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><Sprout size={18} color="#15803d" /> List Farm Produce on Marketplace</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group-row">
              <div className="form-group">
                <label>Crop / Commodity</label>
                <select 
                  value={cropName} 
                  onChange={(e) => {
                    setCropName(e.target.value);
                    if (e.target.value === 'Wheat') setCategory('Grains');
                    else if (e.target.value === 'Cotton') setCategory('Other');
                    else if (e.target.value === 'Tomato' || e.target.value === 'Onion' || e.target.value === 'Potato') setCategory('Vegetables');
                    else if (e.target.value === 'Groundnut') setCategory('Oilseeds');
                  }} 
                >
                  <option value="Wheat">Wheat (Ghau)</option>
                  <option value="Cotton">Cotton (Kapas)</option>
                  <option value="Groundnut">Groundnut (Magfali)</option>
                  <option value="Tomato">Tomato (Tameta)</option>
                  <option value="Onion">Onion (Dungri)</option>
                  <option value="Potato">Potato (Batata)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Variety / Strain</label>
                <input 
                  type="text" 
                  value={variety} 
                  onChange={(e) => setVariety(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>Available Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Unit of Measure</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="quintal">Quintal (100 kg)</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="ton">Metric Ton</option>
                  <option value="crate">Crate (25 kg)</option>
                </select>
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>Asking Price (₹ per {unit})</label>
                <input 
                  type="number" 
                  min="1" 
                  value={pricePerUnit} 
                  onChange={(e) => setPricePerUnit(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Quality Grade</label>
                <select value={qualityGrade} onChange={(e) => setQualityGrade(e.target.value)}>
                  <option value="Grade A">Grade A (Premium)</option>
                  <option value="Grade B">Grade B (Standard FAQ)</option>
                  <option value="Grade C">Grade C (Commercial)</option>
                </select>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={isOrganic} 
                  onChange={(e) => setIsOrganic(e.target.checked)} 
                />
                <span>Certified Organic Farming Practice (Cow dung compost / No chemicals)</span>
              </label>
            </div>

            <div className="form-group">
              <label>Description & Harvest Notes</label>
              <textarea 
                rows="2" 
                placeholder="Details on moisture content, harvest date, packaging..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-confirm-add" disabled={submitting}>
              <Check size={16} />
              <span>{submitting ? 'Publishing...' : 'Publish to Marketplace'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCropModal;
