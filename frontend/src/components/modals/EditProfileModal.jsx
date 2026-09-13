// src/components/modals/EditProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { X, User, Check, Camera, Sprout, MapPin, Phone, Mail, Award } from 'lucide-react';
import '../../styles/Modals.css';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
];

import { translations } from '../../data/translations';

const EditProfileModal = ({ isOpen, onClose, farmerData = {}, onSave, language }) => {
  const t = translations[language] || translations.en;
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [landSize, setLandSize] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [soilType, setSoilType] = useState('');
  const [irrigation, setIrrigation] = useState('');
  const [primaryCrops, setPrimaryCrops] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (farmerData) {
      setName(farmerData.name || '');
      setLocation(farmerData.location || '');
      setLandSize(farmerData.landSize || '');
      setPhone(farmerData.phone || '');
      setEmail(farmerData.email || '');
      setSoilType(farmerData.soilType || '');
      setIrrigation(farmerData.irrigation || '');
      setPrimaryCrops(
        Array.isArray(farmerData.primaryCrops)
          ? farmerData.primaryCrops.join(', ')
          : (farmerData.primaryCrops || '')
      );
      setAvatar(farmerData.avatar || '');
    }
  }, [farmerData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cropsArray = primaryCrops
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    onSave({
      ...farmerData,
      name,
      location,
      landSize,
      phone,
      email,
      soilType,
      irrigation,
      primaryCrops: cropsArray,
      avatar
    });
    onClose();
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <User size={18} color="#15803d" />
            {t.editFarmerProfileTitle}
          </h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            
            {/* Avatar Selector */}
            <div className="form-group">
              <label>{t.farmerProfilePhotoLbl}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
                <img 
                  src={avatar} 
                  alt={name} 
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #10b981' }} 
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  {SAMPLE_AVATARS.map((imgUrl, idx) => (
                    <img 
                      key={idx}
                      src={imgUrl}
                      alt="Choice"
                      onClick={() => setAvatar(imgUrl)}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: avatar === imgUrl ? '2px solid #15803d' : '1px solid #e2e8f0',
                        transform: avatar === imgUrl ? 'scale(1.08)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>{t.farmerFullNameLbl}</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder={t.enterNamePH || "Enter your name"}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>{t.locationVillageDistrictLbl}</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder={t.enterLocationPH || "Enter location"}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>{t.phoneNumberLbl}</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder={t.enterPhonePH || "Enter phone number"}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>{t.emailAddressLbl}</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder={t.enterEmailPH || "Enter email"}
                  className="form-control"
                  required
                />
              </div>
            </div>

            {/* Farm Information */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '14px', marginTop: '6px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#15803d', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sprout size={16} /> {t.farmLandInfoTitle}
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>{t.totalLandHoldingLbl}</label>
                  <input 
                    type="text" 
                    placeholder={t.enterLandSizePH || "Enter land size"}
                    value={landSize} 
                    onChange={(e) => setLandSize(e.target.value)} 
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t.soilTypeLbl}</label>
                  <input 
                    type="text" 
                    placeholder={t.enterSoilTypePH || "Enter soil type"}
                    value={soilType} 
                    onChange={(e) => setSoilType(e.target.value)} 
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t.irrigationFacilitiesLbl}</label>
                <input 
                  type="text" 
                  placeholder={t.enterIrrigationPH || "Enter irrigation facilities"}
                  value={irrigation} 
                  onChange={(e) => setIrrigation(e.target.value)} 
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>{t.mainCropsGrownLbl}</label>
                <input 
                  type="text" 
                  placeholder={t.enterMainCropsPH || "Enter main crops grown"}
                  value={primaryCrops} 
                  onChange={(e) => setPrimaryCrops(e.target.value)} 
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>{t.cancelBtn || "Cancel"}</button>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} />
              <span>
              {t.saveProfileBtn}
            </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
