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
  CheckCircle2,
  Layers,
  Droplets,
  Calendar
} from 'lucide-react';
import { farmerProfile } from '../../data/mockData';
import '../../styles/ProfileSettings.css';

const ProfileSettings = ({ 
  farmerData = farmerProfile, 
  setIsEditProfileOpen, 
  setActiveTab, 
  showToast,
  language = 'en', 
  setLanguage,
  onLogout 
}) => {
  const [activeSubnav, setActiveSubnav] = useState('profile');
  const [notifications, setNotifications] = useState({
    priceSurgeSMS: true,
    whatsappBuyer: true,
    weatherAdvisory: true,
    govSchemeAlerts: false
  });

  const subnavItems = [
    { id: 'profile', label: 'Farmer Profile', icon: User },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'help', label: 'Krishi Helpline', icon: HelpCircle }
  ];

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cropsList = Array.isArray(farmerData.primaryCrops) 
    ? farmerData.primaryCrops 
    : (farmerData.primaryCrops ? farmerData.primaryCrops.split(',') : ['Sharbati Wheat', 'Shankar-6 Cotton', 'Hybrid Tomato', 'GG-20 Groundnut']);

  return (
    <div className="profile-settings-container">
      {/* Header */}
      <div className="profile-header">
        <h1>Farmer Profile & Settings</h1>
        <p>Manage your farming credentials, verified produce identity, and communication preferences.</p>
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

          <div 
            className="subnav-item" 
            style={{ marginTop: 'auto', color: '#dc2626', borderTop: '1px solid #fee2e2' }}
            onClick={() => {
              if (onLogout) onLogout();
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </div>
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
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                        <span className="farmer-id-tag">Kisan ID: {farmerData.id || farmerProfile.id || 'KGP-82910'}</span>
                        <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.74rem', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> Aadhaar Verified
                        </span>
                      </div>
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
                    <div className="detail-block-label">
                      <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      Location
                    </div>
                    <div className="detail-block-val">{farmerData.location || farmerProfile.location}</div>
                  </div>

                  <div className="detail-block">
                    <div className="detail-block-label">
                      <Layers size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      Total Land Holding
                    </div>
                    <div className="detail-block-val">{farmerData.landSize || '8.5 Acres (21 Bighas)'}</div>
                  </div>

                  <div className="detail-block">
                    <div className="detail-block-label">
                      <Phone size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      Phone Number
                    </div>
                    <div className="detail-block-val">{farmerData.phone || farmerProfile.phone}</div>
                  </div>

                  <div className="detail-block">
                    <div className="detail-block-label">
                      <Mail size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      Email Address
                    </div>
                    <div className="detail-block-val">{farmerData.email || farmerProfile.email}</div>
                  </div>

                  <div className="detail-block">
                    <div className="detail-block-label">Soil Classification</div>
                    <div className="detail-block-val">{farmerData.soilType || 'Medium Black Saurashtra Clay'}</div>
                  </div>

                  <div className="detail-block">
                    <div className="detail-block-label">
                      <Droplets size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      Irrigation Type
                    </div>
                    <div className="detail-block-val">{farmerData.irrigation || 'Drip Irrigation & Solar Pump'}</div>
                  </div>
                </div>

                {/* Main Crops Display */}
                <div style={{ marginTop: '20px', borderTop: '1px solid #f0f4f1', paddingTop: '16px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#15803d', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sprout size={16} /> Main Crops Produced
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {cropsList.map((crop, idx) => (
                      <span 
                        key={idx} 
                        style={{ 
                          background: '#ecfdf5', 
                          border: '1px solid #a7f3d0', 
                          color: '#047857', 
                          padding: '5px 12px', 
                          borderRadius: '8px', 
                          fontSize: '0.82rem', 
                          fontWeight: '700' 
                        }}
                      >
                        🌾 {crop.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom 3 Quick Actions */}
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
                    <p>Check PM-KISAN, PMFBY & Subsidies</p>
                  </div>
                </div>

                <div 
                  className="profile-action-card"
                  onClick={() => {
                    if (showToast) showToast('📞 Krishi Vigyan Kendra helpline: 1800-180-1551 (Toll-Free Kisan Call Centre)');
                  }}
                >
                  <div className="action-icon-circle">
                    <Headphones size={20} />
                  </div>
                  <div className="action-card-text">
                    <h4>Kisan Call Centre</h4>
                    <p>Free Agronomist Expert Support</p>
                  </div>
                </div>

                <div 
                  className="profile-action-card logout"
                  onClick={() => {
                    if (onLogout) onLogout();
                  }}
                >
                  <div className="action-icon-circle">
                    <LogOut size={20} />
                  </div>
                  <div className="action-card-text">
                    <h4>Logout</h4>
                    <p>Sign out from session</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSubnav === 'language' && (
            <div className="farmer-main-profile-card">
              <h3 style={{ marginBottom: '8px', fontSize: '1.15rem', color: '#17251c', fontWeight: '800' }}>
                Select App Language
              </h3>
              <p style={{ color: '#647067', fontSize: '0.88rem', marginBottom: '20px' }}>
                All mandi rates, forecasts, schemes, and recommendations will be presented in your chosen language.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                {[
                  { code: 'en', name: 'English', native: 'English', desc: 'Standard business & mandi terms' },
                  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', desc: 'સૌરાષ્ટ્ર અને ગુજરાતના ખેડૂતો માટે' },
                  { code: 'hi', name: 'Hindi', native: 'हिंदी', desc: 'भारत भर की मंडियों के लिए' }
                ].map((item) => {
                  const isSelected = language === item.code;
                  return (
                    <div 
                      key={item.code}
                      onClick={() => {
                        if (setLanguage) setLanguage(item.code);
                      }}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #10b981' : '1px solid #e5e7eb',
                        background: isSelected ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 4px 12px -2px rgba(16, 185, 129, 0.15)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: '800', fontSize: '1rem', color: isSelected ? '#047857' : '#17251c' }}>
                          {item.native}
                        </span>
                        {isSelected && <CheckCircle2 size={18} color="#10b981" />}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#647067' }}>{item.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSubnav === 'notifications' && (
            <div className="farmer-main-profile-card">
              <h3 style={{ marginBottom: '8px', fontSize: '1.15rem', color: '#17251c', fontWeight: '800' }}>
                Notification Preferences
              </h3>
              <p style={{ color: '#647067', fontSize: '0.88rem', marginBottom: '20px' }}>
                Configure how and when you receive critical mandi price updates and buyer offers.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#fafbfa', borderRadius: '10px', border: '1px solid #e5e7eb', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#17251c' }}>SMS Mandi Price Surges</div>
                    <div style={{ fontSize: '0.78rem', color: '#647067' }}>Receive immediate SMS when Rajkot/Gondal rate jumps by &gt; 5%</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.priceSurgeSMS}
                    onChange={() => toggleNotification('priceSurgeSMS')}
                    style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
                  />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#fafbfa', borderRadius: '10px', border: '1px solid #e5e7eb', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#17251c' }}>WhatsApp Direct Buyer Offers</div>
                    <div style={{ fontSize: '0.78rem', color: '#647067' }}>Direct inquiry alerts from corporate verified food processors</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.whatsappBuyer}
                    onChange={() => toggleNotification('whatsappBuyer')}
                    style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
                  />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#fafbfa', borderRadius: '10px', border: '1px solid #e5e7eb', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#17251c' }}>Daily Weather & Pest Warning Advisory</div>
                    <div style={{ fontSize: '0.78rem', color: '#647067' }}>Rain forecasts and localized crop protection guidelines</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.weatherAdvisory}
                    onChange={() => toggleNotification('weatherAdvisory')}
                    style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
                  />
                </label>
              </div>
            </div>
          )}

          {activeSubnav === 'privacy' && (
            <div className="farmer-main-profile-card">
              <h3 style={{ marginBottom: '8px', fontSize: '1.15rem', color: '#17251c', fontWeight: '800' }}>
                Privacy & Data Protection
              </h3>
              <p style={{ color: '#647067', fontSize: '0.88rem', marginBottom: '20px' }}>
                Your farm credentials, 7/12 land records, and Aadhaar identity are safeguarded with government-grade encryption.
              </p>

              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                <div style={{ fontWeight: '800', color: '#047857', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={16} /> 256-Bit Encrypted Farmer Vault Active
                </div>
                <div style={{ fontSize: '0.82rem', color: '#065f46', lineHeight: '1.5' }}>
                  Buyers only receive your verified crop quantity, mandi grade, and general taluka location. Exact farm survey coordinates are only disclosed after formal digital contract sign-off.
                </div>
              </div>

              <button 
                className="edit-profile-btn"
                onClick={() => {
                  if (showToast) showToast('🏦 Direct Bank Account (DBT Linked): State Bank of India •••• 4128');
                }}
              >
                <span>View Linked Bank Account (DBT)</span>
              </button>
            </div>
          )}

          {activeSubnav === 'help' && (
            <div className="farmer-main-profile-card">
              <h3 style={{ marginBottom: '8px', fontSize: '1.15rem', color: '#17251c', fontWeight: '800' }}>
                Kisan Sahayata & Agricultural Support
              </h3>
              <p style={{ color: '#647067', fontSize: '0.88rem', marginBottom: '20px' }}>
                Connect with agricultural scientists, APMC market supervisors, or our technical support desk.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ padding: '16px', background: '#fafbfa', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', color: '#17251c', fontWeight: '800' }}>Toll-Free Kisan Call Centre</h4>
                  <p style={{ fontSize: '0.82rem', color: '#647067', margin: '0 0 12px 0' }}>Daily 6:00 AM - 10:00 PM in Gujarati & Hindi.</p>
                  <button 
                    className="edit-profile-btn" 
                    style={{ background: '#15803d', color: '#ffffff' }}
                    onClick={() => {
                      if (showToast) showToast('📞 Dialing Toll-Free Kisan Call Centre 1800-180-1551...');
                    }}
                  >
                    <Phone size={14} /> Call 1800-180-1551
                  </button>
                </div>

                <div style={{ padding: '16px', background: '#fafbfa', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', color: '#17251c', fontWeight: '800' }}>Krishi Vigyan Kendra (KVK)</h4>
                  <p style={{ fontSize: '0.82rem', color: '#647067', margin: '0 0 12px 0' }}>Targhadia Research Station, Rajkot.</p>
                  <button 
                    className="edit-profile-btn"
                    onClick={() => {
                      if (showToast) showToast('🌱 Connecting to Rajkot KVK Agronomist desk...');
                    }}
                  >
                    <span>Request Soil Specialist</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
