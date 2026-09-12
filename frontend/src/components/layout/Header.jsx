// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  Globe, 
  LogOut, 
  User, 
  Sun,
  Droplets,
  Wind,
  MapPin,
  TrendingUp,
  CloudRain
} from 'lucide-react';
import { notificationsList } from '../../data/mockData';
import { translations } from '../../data/translations';
import { fetchLiveWeather } from '../../services/weatherService';
import '../../styles/Header.css';

const liveTickerCrops = [
  { crop: 'Wheat (Gehun)', price: '₹2,480/qtl', change: '+2.8%', trend: 'up', mandi: 'Rajkot' },
  { crop: 'Cotton (Kapas)', price: '₹7,250/qtl', change: '+3.4%', trend: 'up', mandi: 'Gondal' },
  { crop: 'Cumin (Jeera)', price: '₹24,500/qtl', change: '+4.2%', trend: 'up', mandi: 'Unjha' },
  { crop: 'Groundnut (Sing)', price: '₹6,840/qtl', change: '-0.9%', trend: 'down', mandi: 'Junagadh' },
  { crop: 'Mustard (Sarson)', price: '₹5,420/qtl', change: '+1.5%', trend: 'up', mandi: 'Ahmedabad' },
  { crop: 'Tomato', price: '₹2,650/qtl', change: '+8.2%', trend: 'up', mandi: 'Surat' },
  { crop: 'Onion (Pyaz)', price: '₹1,850/qtl', change: '+3.1%', trend: 'up', mandi: 'Nashik' },
  { crop: 'Castor (Eranda)', price: '₹5,960/qtl', change: '-0.6%', trend: 'down', mandi: 'Patan' },
  { crop: 'Potato (Aloo)', price: '₹1,240/qtl', change: '+1.1%', trend: 'up', mandi: 'Deesa' },
  { crop: 'Soybean', price: '₹4,620/qtl', change: '-1.4%', trend: 'down', mandi: 'Indore' },
  { crop: 'Turmeric (Haldi)', price: '₹13,800/qtl', change: '+5.6%', trend: 'up', mandi: 'Sangli' },
  { crop: 'Maize (Makka)', price: '₹2,180/qtl', change: '+0.8%', trend: 'up', mandi: 'Vadodara' }
];

const Header = ({ activeTab, setActiveTab, language, setLanguage, user, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showWeatherDropdown, setShowWeatherDropdown] = useState(false);
  const [notifications, setNotifications] = useState(notificationsList);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time weather state from Open-Meteo
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const t = translations[language] || translations.en;
  const userDistrict = user?.district || 'Rajkot';

  useEffect(() => {
    let isMounted = true;
    setWeatherLoading(true);
    fetchLiveWeather(userDistrict)
      .then((data) => {
        if (isMounted) {
          setWeatherData(data);
          setWeatherLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setWeatherLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userDistrict]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const languagesList = [
    { code: 'en', label: 'English' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'kn', label: 'ಕನ್ನಡ' }
  ];

  const currentLangObj = languagesList.find(l => l.code === language) || languagesList[0];
  const firstName = (user?.name || 'Meet').split(' ')[0];

  return (
    <header className="kisan-header-wrapper">
      <div className="kisan-top-header">
        {/* Left: Personalized Greeting */}
        <div className="header-greeting-block">
          <h1 className="header-greeting-title">Hi, {firstName} 👋</h1>
          <p className="header-greeting-sub">Live APMC Intelligence & Mandi Trading Hub</p>
        </div>

        {/* Center: Search Bar */}
        <div className="header-search-wrapper">
          <div className="header-search-pill">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search mandi prices, crops, buyers, APMC..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Right Action Icons: Live Open-Meteo Weather, Language, Bell, Profile */}
        <div className="header-right-actions">
          {/* Live Open-Meteo Weather Pill */}
          <div className="weather-menu-wrap">
            <button 
              type="button"
              className="header-weather-pill"
              onClick={() => {
                setShowWeatherDropdown(!showWeatherDropdown);
                setShowLangMenu(false);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              title="Click for live Open-Meteo agricultural forecast"
            >
              <span className="weather-emoji">{weatherData?.icon || '🌤️'}</span>
              <span className="weather-temp-txt">
                {weatherLoading ? 'Loading...' : `${weatherData?.temperature || 31}°C`}
              </span>
              <span className="weather-cond-txt">{weatherData?.condition || 'Clear'}</span>
              <ChevronDown size={12} className="weather-chevron" />
            </button>

            {/* Live Open-Meteo Weather Popup */}
            {showWeatherDropdown && (
              <div className="dropdown-panel weather-dropdown">
                <div className="weather-drop-header">
                  <div className="weather-drop-title">
                    <MapPin size={14} className="text-amber-600" />
                    <span>{weatherData?.district || userDistrict}, Gujarat</span>
                  </div>
                  <span className="weather-api-badge">Open-Meteo Live</span>
                </div>

                {/* Main Temperature Card */}
                <div className="weather-main-row">
                  <div className="weather-big-icon">{weatherData?.icon || '🌤️'}</div>
                  <div className="weather-temp-block">
                    <div className="big-temp">{weatherData?.temperature || 31}°C</div>
                    <div className="cond-label">{weatherData?.condition || 'Mainly Clear'}</div>
                  </div>
                </div>

                {/* Humidity, Wind, Feels Like Metrics */}
                <div className="weather-metrics-grid">
                  <div className="weather-metric-cell">
                    <div className="met-label">💧 Humidity</div>
                    <div className="met-val">{weatherData?.humidity || 52}%</div>
                  </div>
                  <div className="weather-metric-cell">
                    <div className="met-label">💨 Wind</div>
                    <div className="met-val">{weatherData?.windSpeed || 12} km/h</div>
                  </div>
                  <div className="weather-metric-cell">
                    <div className="met-label">🌡️ Feels Like</div>
                    <div className="met-val">{weatherData?.apparentTemperature || 33}°C</div>
                  </div>
                </div>

                {/* Agricultural Advisory */}
                <div className="weather-advisory-box">
                  <strong>🌱 Agricultural Advisory:</strong>
                  <div>{weatherData?.advisory || 'Optimal weather for harvesting, grain drying and APMC mandi trade.'}</div>
                </div>

                {/* 5-Day Forecast Row */}
                {weatherData?.daily && weatherData.daily.length > 0 && (
                  <div className="weather-forecast-days">
                    {weatherData.daily.map((day, idx) => (
                      <div key={idx} className="forecast-day-item">
                        <span className="day-name">{day.day}</span>
                        <span className="day-icon">{day.icon}</span>
                        <span className="day-temps">{day.maxTemp}° / {day.minTemp}°</span>
                        {day.rainProb > 0 && (
                          <span className="day-rain">💧{day.rainProb}%</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="lang-menu-wrap">
            <button 
              type="button"
              className="header-icon-pill" 
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowWeatherDropdown(false);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              title="Change Language"
            >
              <Globe size={15} />
              <span className="lang-text">{currentLangObj.label}</span>
              <ChevronDown size={12} />
            </button>

            {showLangMenu && (
              <div className="dropdown-panel lang-dropdown">
                {languagesList.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className={`dropdown-item ${language === lang.code ? 'active' : ''}`}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                  >
                    <span>{lang.label}</span>
                    {language === lang.code && <span className="check-dot">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="notif-menu-wrap">
            <button 
              type="button"
              className="header-icon-btn notif-btn"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowWeatherDropdown(false);
                setShowLangMenu(false);
                setShowProfileMenu(false);
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="notif-dot-badge">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="dropdown-panel notif-dropdown">
                <div className="notif-header">
                  <span className="notif-title">Notifications</span>
                  {unreadCount > 0 && (
                    <button type="button" onClick={markAllRead} className="mark-read-btn">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="notif-scroll-list">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`notif-card ${!n.read ? 'unread' : ''}`}
                      onClick={() => {
                        setNotifications(notifications.map(item => item.id === n.id ? { ...item, read: true } : item));
                      }}
                    >
                      <div className="notif-card-title">{n.title}</div>
                      <div className="notif-card-msg">{n.message}</div>
                      <div className="notif-card-time">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="profile-menu-wrap">
            <div 
              className="header-avatar-btn"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowWeatherDropdown(false);
                setShowLangMenu(false);
                setShowNotifications(false);
              }}
              title="Account Menu"
            >
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"} 
                alt={user?.name || "Farmer"} 
                className="header-avatar-img"
              />
            </div>

            {showProfileMenu && (
              <div className="dropdown-panel profile-dropdown">
                <div className="profile-summary">
                  <div className="profile-user-name">{user?.name || 'Meet Maniya'}</div>
                  <div className="profile-user-role">{user?.location || 'Rajkot, Gujarat'}</div>
                </div>

                <button 
                  type="button"
                  className="dropdown-item"
                  onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }}
                >
                  <User size={15} />
                  <span>Profile & Settings</span>
                </button>

                <button 
                  type="button"
                  className="dropdown-item text-danger"
                  onClick={() => { onLogout(); setShowProfileMenu(false); }}
                >
                  <LogOut size={15} />
                  <span>{t.logout || 'Log Out'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ STOCK-MARKET STYLE APMC MANDI TICKER BAR ══ */}
      <div className="mandi-ticker-bar" title="Live Mandi Price Ticker (Hover to Pause)">
        <div className="ticker-label-badge">
          <TrendingUp size={13} className="ticker-label-icon" />
          <span className="live-pulse-dot" />
          <span>APMC BAZAR LIVE</span>
        </div>

        <div className="ticker-marquee-wrapper">
          <div className="ticker-track">
            {/* Duplicated list for 100% smooth infinite marquee scroll */}
            {[...liveTickerCrops, ...liveTickerCrops].map((item, idx) => (
              <div 
                key={idx} 
                className="ticker-item"
                onClick={() => setActiveTab('price-radar')}
              >
                <span className="ticker-crop-name">{item.crop}</span>
                <span className="ticker-price">{item.price}</span>
                <span className={`ticker-change ${item.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
                  {item.trend === 'up' ? '▲' : '▼'} {item.change}
                </span>
                <span className="ticker-mandi">({item.mandi})</span>
                <span className="ticker-divider">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
