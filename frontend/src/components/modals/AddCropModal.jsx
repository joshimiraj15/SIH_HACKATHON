// src/components/modals/AddCropModal.jsx
import React, { useState } from 'react';
import { X, Sprout, Image, MapPin, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';
import '../../styles/Modals.css';

import { translations } from '../../data/translations';

const AddCropModal = ({ isOpen, onClose, onAddCrop, language }) => {
  const t = translations[language] || translations.en;
  const [cropName, setCropName] = useState('Cotton');
  const [variety, setVariety] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Quintals');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [location, setLocation] = useState('');
  const [grade, setGrade] = useState('GRADE_A');
  const [description, setDescription] = useState('');
  const [cropImage, setCropImage] = useState('');

  if (!isOpen) return null;

  const defaultCropImages = {
    Cotton: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&auto=format&fit=crop&q=80',
    Wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
    Tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
    Onion: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80',
    Potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80',
    Groundnut: 'https://images.unsplash.com/photo-1568290740643-98fa20325b5a?w=400&auto=format&fit=crop&q=80'
  };

  const handleCropChange = (val) => {
    setCropName(val);
    if (defaultCropImages[val]) {
      setCropImage(defaultCropImages[val]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanQty = quantity ? `${quantity} ${unit}` : '10 Quintals';
    const cleanPrice = expectedPrice ? Number(expectedPrice).toLocaleString('en-IN') : '2,500';
    const finalImage = cropImage || defaultCropImages[cropName] || defaultCropImages.Cotton;

    const newCrop = {
      id: `lot-${Date.now()}`,
      name: cropName,
      variety: variety.trim() || 'Desi Premium',
      quantity: cleanQty,
      qtyValue: Number(quantity) || 10,
      unit: `/ ${unit === 'Quintals' ? 'Q' : unit}`,
      price: cleanPrice,
      grade: grade,
      harvestDate: harvestDate || new Date().toISOString().split('T')[0],
      location: location || 'Rajkot, Gujarat',
      description: description,
      image: finalImage,
      change: '+5.0%',
      trend: 'up',
      status: 'Ready for Mandi'
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
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <h3><Sprout size={18} color="#10B981" />{t.addCropTitle}</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            {/* Crop Name & Variety */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>{t.cropNameLbl}</label>
                <select 
                  value={cropName} 
                  onChange={(e) => handleCropChange(e.target.value)} 
                  className="form-control"
                >
                  {t.cropOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t.varietyLbl}</label>
                <input 
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder={t.enterCropVarietyPH || "Enter crop variety"}
                  className="form-control"
                  required
                />
              </div>
            </div>

            {/* Quantity & Unit */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>{t.quantityLbl}</label>
                <input 
                  type="number" 
                  min="1"
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} 
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>{t.unitLbl}</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="form-control">
                  <option value="Quintals">{t.unitQuintals}</option>
                  <option value="Kilograms">{t.unitKg}</option>
                  <option value="Tonnes">{t.unitTonnes}</option>
                  <option value="Crates">{t.unitCrates}</option>
                </select>
              </div>
            </div>

            {/* Expected Price & Harvest Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>{t.expectedPriceRsLbl}</label>
                <input 
                  type="text" 
                  value={expectedPrice} 
                  onChange={(e) => setExpectedPrice(e.target.value)} 
                  className="form-control"
                  placeholder={t.enterExpectedPricePH || "Enter expected price"}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t.harvestDateLbl}</label>
                <input 
                  type="date" 
                  value={harvestDate} 
                  onChange={(e) => setHarvestDate(e.target.value)} 
                  className="form-control"
                  required
                />
              </div>
            </div>

            {/* Location & Grade */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>{t.farmLocationLbl}</label>
                <input 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t.enterFarmLocationPH || "Enter farm location"}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>{t.qualityGradeLbl}</label>
                <select 
                  value={grade} 
                  onChange={(e) => setGrade(e.target.value)} 
                  className="form-control"
                  style={{ fontWeight: '600', color: '#047857' }}
                >
                  <option value="GRADE_A">{t.gradeA}</option>
                  <option value="GRADE_B">{t.gradeB}</option>
                  <option value="GRADE_C">{t.gradeC}</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label>{t.descriptionLbl}</label>
              <textarea 
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.enterDescriptionPH || "Enter description..."}
                className="form-control"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Crop Image URL */}
            <div className="form-group">
              <label>{t.cropImageURLLbl}</label>
              <input 
                type="url"
                value={cropImage}
                onChange={(e) => setCropImage(e.target.value)}
                placeholder={t.enterImageURLPH || "Enter image URL"}
                className="form-control"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>{t.cancelBtn || "Cancel"}</button>
            <button type="submit" className="btn-primary" style={{ background: '#10B981', borderColor: '#10B981' }}>
              {t.addCropBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCropModal;
