// src/components/modals/EditProfileModal.jsx
import React, { useState } from 'react';
import { X, User, Check } from 'lucide-react';
import '../../styles/Modals.css';

const EditProfileModal = ({ isOpen, onClose, farmerData, onSave }) => {
  const [name, setName] = useState(farmerData.name || 'Meet Maniya');
  const [location, setLocation] = useState(farmerData.location || 'Rajkot, Gujarat');
  const [landSize, setLandSize] = useState(farmerData.landSize || '3.5 Acres');
  const [phone, setPhone] = useState(farmerData.phone || '+91 98765 43210');
  const [email, setEmail] = useState(farmerData.email || 'meetmaniya@gmail.com');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...farmerData,
      name,
      location,
      landSize,
      phone,
      email
    });
    onClose();
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><User size={18} color="#15803d" /> Edit Farmer Profile</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Farmer Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Farm Location / APMC Area</label>
              <input 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                className="form-control"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Land Size</label>
                <input 
                  type="text" 
                  value={landSize} 
                  onChange={(e) => setLandSize(e.target.value)} 
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
