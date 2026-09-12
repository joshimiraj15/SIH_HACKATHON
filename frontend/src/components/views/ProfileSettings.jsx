// src/components/views/ProfileSettings.jsx
import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Globe, 
  Shield, 
  HelpCircle, 
  Edit3, 
  FileCheck, 
  Headphones, 
  LogOut,
  MapPin,
  Phone,
  Mail,
  Sprout,
  CheckCircle2
} from 'lucide-react';
import { farmerProfile } from '../../data/mockData';
import '../../styles/ProfileSettings.css';

const ProfileSettings = ({ farmerData, setIsEditProfileOpen, setActiveTab }) => {
  const [activeSubnav, setActiveSubnav] = useState('profile');

  const subnavItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  return (
    <div className="profile-settings-container">
      {/* Header */}
      <div className="profile-header">
        <h1>Profile & Settings</h1>
        <p>Manage your account, preferences and notifications.</p>
      </div>

      {/* Main Layout: Sub-Nav + Body */}
      <div className="profile-main-layout">
        {/* Left Sub-nav */}
        <div className="profile-subnav-card">
          {subnavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubnav === item.id;
            return (
              <div
                key={item.id}
                className={`subnav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveSubnav(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Right Settings Body */}
        <div className="profile-body-column">
          {activeSubnav === 'profile' && (
            <>
              {/* Farmer Profile Card */}
              <div className="farmer-main-profile-card">
                <div className="profile-card-top-row">
                  <div className="profile-avatar-info">
                    <img 
                      src={farmerData.avatar || farmerProfile.avatar} 
                      alt={farmerData.name || farmerProfile.name} 
                      className="large-farmer-avatar"
                    />
                    <div>
                      <h2 className="profile-name-title">{farmerData.name || farmerProfile.name}</h2>
                      <span className="farmer-id-tag">Farmer ID: {farmerData.id || farmerProfile.id}</span>
                    </div>
                  </div>

                  <button 
                    className="edit-profile-btn"
                    onClick={() => setIsEditProfileOpen(true)}
                  >
                    <Edit3 size={15} />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Details Grid */}
                <div className="profile-details-grid">
                  <div className="detail-block">
                    <div className="detail-block-label">Location</div>
                    <div className="detail-block-val">{farmerData.location || farmerProfile.location}</div>
                  </div>

                  <div className="detail-block">
                    <div className="detail-block-label">Land Size</div>
                    <div className="detail-block-val">{farmerData.landSize || farmerProfile.landSize}</div>
                  </div>

                  <div className="detail-block">
                    <div className="detail-block-label">Primary Crop</div>
                    <div className="detail-block-val">
                      {Array.isArray(farmerData.primaryCrops) 
                        ? farmerData.primaryCrops.join(', ') 
                        : farmerProfile.primaryCrops.join(', ')}
                    </div>
                  </div>

                  <div className="detail-block">
                    <div className="detail-block-label">Phone</div>
                    <div className="detail-block-val">{farmerData.phone || farmerProfile.phone}</div>
                  </div>

                  <div className="detail-block" style={{ gridColumn: 'span 2' }}>
                    <div className="detail-block-label">Email</div>
                    <div className="detail-block-val">{farmerData.email || farmerProfile.email}</div>
                  </div>
                </div>
              </div>

              {/* Bottom 3 Action Cards */}
              <div className="profile-actions-row">
                <div 
                  className="profile-action-card"
                  onClick={() => setActiveTab('schemes')}
                >
                  <div className="action-icon-circle">
                    <FileCheck size={20} />
                  </div>
                  <div className="action-card-text">
                    <h4>Government Schemes</h4>
                    <p>Check eligibility & subsidies</p>
                  </div>
                </div>

                <div 
                  className="profile-action-card"
                  onClick={() => alert('Support helpline: 1800-180-1551 (Toll Free Kisan Call Centre). Live chat is active!')}
                >
                  <div className="action-icon-circle">
                    <Headphones size={20} />
                  </div>
                  <div className="action-card-text">
                    <h4>Support</h4>
                    <p>Get help & 24/7 guidance</p>
                  </div>
                </div>

                <div 
                  className="profile-action-card logout"
                  onClick={() => alert('Signing out of KisanSetu secure session.')}
                >
                  <div className="action-icon-circle">
                    <LogOut size={20} />
                  </div>
                  <div className="action-card-text">
                    <h4>Logout</h4>
                    <p>Sign out from account</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSubnav === 'notifications' && (
            <div className="farmer-main-profile-card">
              <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Notification Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked /> SMS Alerts for Mandi Price Surges (&gt; 5%)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked /> WhatsApp Direct Buyer Inquiries
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked /> Daily Crop Weather & Pest Advisory
                </label>
              </div>
            </div>
          )}

          {activeSubnav === 'language' && (
            <div className="farmer-main-profile-card">
              <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Select Language / ભાષા પસંદ કરો</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {['English (Default)', 'ગુજરાતી (Gujarati)', 'हिंदी (Hindi)', 'मराठी (Marathi)', 'ਪੰਜਾਬੀ (Punjabi)', 'తెలుగు (Telugu)'].map((lang, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: idx === 0 ? '2px solid #16a34a' : '1px solid #e2e8f0',
                    background: idx === 0 ? '#f0fdf4' : '#ffffff',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}>
                    {lang}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubnav === 'privacy' && (
            <div className="farmer-main-profile-card">
              <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Privacy & Security</h3>
              <p style={{ fontSize: '0.86rem', color: '#4b5563', lineHeight: '1.5', marginBottom: '16px' }}>
                Your Aadhaar and Land Survey Number are encrypted with 256-bit AES protection. Direct buyers can only view verified produce quantity and mandi ratings.
              </p>
              <button className="edit-profile-btn">
                <span>Manage Linked Bank Account</span>
              </button>
            </div>
          )}

          {activeSubnav === 'help' && (
            <div className="farmer-main-profile-card">
              <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Help & Agricultural Support</h3>
              <p style={{ fontSize: '0.86rem', color: '#4b5563', lineHeight: '1.5', marginBottom: '16px' }}>
                Contact your nearest Krishi Vigyan Kendra (KVK) or reach our 24x7 farmer advisor helpline.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="edit-profile-btn" style={{ background: '#15803d', color: '#ffffff' }}>
                  Call 1800-180-1551
                </button>
                <button className="edit-profile-btn">
                  WhatsApp Support
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
