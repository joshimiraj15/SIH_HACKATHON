// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { 
  Sun, 
  Moon,
  Bell, 
  Search, 
  CheckCircle2, 
  Sparkles,
  ChevronDown,
  Globe,
  LogOut,
  User,
  Users,
  Building2,
  ShieldAlert
} from 'lucide-react';
import { weatherInfo, notificationsList } from '../../data/mockData';
import { translations } from '../../data/translations';
import '../../styles/Header.css';

const Header = ({ 
  activeTab, 
  setActiveTab, 
  language, 
  setLanguage, 
  user, 
  onLogout,
  isNightMode,
  setIsNightMode,
  onSwitchUser 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [notifications, setNotifications] = useState(notificationsList);
  const [searchQuery, setSearchQuery] = useState('');

  const t = translations[language] || translations.en;

  const screens = [
    { id: 'home', num: '1', name: t.navHome || 'Home' },
    { id: 'market-prices', num: '2', name: 'Prices' },
    { id: 'price-radar', num: '3', name: 'Radar' },
    { id: 'where-to-sell', num: '4', name: 'Where To Sell' },
    { id: 'profit-calc', num: '5', name: 'Profit Calc' },
    { id: 'market-map', num: '6', name: 'Mandi Map' },
    { id: 'buyers', num: '7', name: 'Buyers' },
    { id: 'my-crops', num: '8', name: 'Produce' },
    { id: 'offers', num: '9', name: 'Offers' },
    { id: 'orders', num: '10', name: 'Orders' },
    { id: 'price-forecast', num: '11', name: 'AI Forecast' },
    { id: 'admin', num: '12', name: 'Admin' }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const languagesList = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
    { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' }
  ];

  const currentLangObj = languagesList.find(l => l.code === language) || languagesList[0];

  return (
    <header className="kisan-header-wrapper">
      <div className="kisan-top-header">
        {/* Left: Global Search */}
        <div className="header-left">
          <div className="header-search-bar">
            <Search size={16} color="#6b7280" />
            <input 
              type="text" 
              placeholder={t.typeQuestion || "Search crops, mandis, buyers, prices..."} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  setActiveTab('market-prices');
                }
              }}
            />
          </div>
        </div>

        {/* Right: Day/Night, Language, Weather, Notifications, Profile */}
        <div className="header-right">
          {/* Day / Night Theme Toggle */}
          <button 
            className="weather-chip"
            onClick={() => setIsNightMode(!isNightMode)}
            style={{ 
              background: isNightMode ? '#133324' : '#f0fdf4',
              borderColor: isNightMode ? '#22c55e' : '#bbf7d0',
              color: isNightMode ? '#86efac' : '#15803d',
              cursor: 'pointer' 
            }}
            title={isNightMode ? "Switch to Day Mode" : "Switch to Night Mode"}
          >
            {isNightMode ? <Moon size={15} /> : <Sun size={15} />}
            <span style={{ fontSize: '0.78rem', fontWeight: '600' }}>
              {isNightMode ? 'Night' : 'Day'}
            </span>
          </button>

          {/* Language Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              className="weather-chip" 
              style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#15803d', cursor: 'pointer' }}
              onClick={() => setShowLangMenu(!showLangMenu)}
              title="Change Language"
            >
              <Globe size={15} />
              <span>{currentLangObj.flag} {currentLangObj.label.split(' ')[0]}</span>
              <ChevronDown size={13} />
            </button>

            {showLangMenu && (
              <div 
                style={{
                  position: 'absolute',
                  top: '42px',
                  right: 0,
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid #e5e7eb',
                  padding: '6px',
                  minWidth: '170px',
                  zIndex: 100
                }}
              >
                {languagesList.map((lang) => (
                  <div
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: language === lang.code ? '700' : '500',
                      color: language === lang.code ? '#15803d' : '#374151',
                      background: language === lang.code ? '#f0fdf4' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weather Chip */}
          <div className="weather-chip" title="Live Weather Advisory">
            <span className="weather-icon">
              <Sun size={16} />
            </span>
            <span>{weatherInfo.city} {weatherInfo.temp}</span>
          </div>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button 
              className="header-action-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="notifications-popover">
                <div className="notif-header">
                  <h4>Notifications</h4>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead}
                      style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: '600' }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="notif-list">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`notif-item ${!n.read ? 'unread' : ''}`}
                      onClick={() => {
                        setNotifications(notifications.map(item => item.id === n.id ? { ...item, read: true } : item));
                      }}
                    >
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-msg">{n.message}</div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher Menu */}
          <div style={{ position: 'relative' }}>
            <div 
              className="header-profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              title="Account & Role Switcher"
            >
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"} 
                alt={user?.name || "Farmer"} 
                className="header-avatar"
              />
              <ChevronDown size={14} color="#6b7280" />
            </div>

            {showProfileMenu && (
              <div 
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  background: '#ffffff',
                  borderRadius: '14px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid #e5e7eb',
                  padding: '12px',
                  minWidth: '230px',
                  zIndex: 100
                }}
              >
                <div style={{ paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#14281d' }}>{user?.name || 'Ramesh Patel'}</div>
                  <div style={{ fontSize: '0.74rem', color: '#15803d', textTransform: 'capitalize' }}>
                    {user?.role || 'Farmer'} • {user?.location?.district || user?.district || 'Rajkot'}
                  </div>
                </div>

                {/* Instant Switch Demo Account */}
                <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Switch Demo Account
                </div>

                <div 
                  onClick={() => { onSwitchUser && onSwitchUser('farmer'); setShowProfileMenu(false); }}
                  style={{ padding: '6px 8px', borderRadius: '8px', fontSize: '0.8rem', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>🌾</span>
                  <span>Farmer (Ramesh Patel)</span>
                </div>

                <div 
                  onClick={() => { onSwitchUser && onSwitchUser('buyer'); setShowProfileMenu(false); }}
                  style={{ padding: '6px 8px', borderRadius: '8px', fontSize: '0.8rem', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>🏢</span>
                  <span>Buyer (Reliance Fresh)</span>
                </div>

                <div 
                  onClick={() => { onSwitchUser && onSwitchUser('admin'); setShowProfileMenu(false); }}
                  style={{ padding: '6px 8px', borderRadius: '8px', fontSize: '0.8rem', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>🏛️</span>
                  <span>Admin (KisanSetu)</span>
                </div>

                <div style={{ height: '1px', background: '#f3f4f6', margin: '6px 0' }} />

                <div 
                  onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }}
                  style={{ padding: '6px 8px', borderRadius: '8px', fontSize: '0.84rem', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <User size={15} />
                  <span>{t.navProfile || 'Profile & Settings'}</span>
                </div>

                <div 
                  onClick={() => { onLogout(); setShowProfileMenu(false); }}
                  style={{ padding: '6px 8px', borderRadius: '8px', fontSize: '0.84rem', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}
                >
                  <LogOut size={15} />
                  <span>{t.logout || 'Sign Out'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Screen Gallery Navigation Switcher */}
      <div className="screen-switcher-bar">
        <div className="screen-switcher-label">
          <Sparkles size={14} /> Ref Screens:
        </div>
        {screens.map((s) => (
          <button
            key={s.id}
            className={`screen-pill ${activeTab === s.id ? 'active' : ''}`}
            onClick={() => setActiveTab(s.id)}
          >
            <span className="num-badge">{s.num}</span>
            <span>{s.name}</span>
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
