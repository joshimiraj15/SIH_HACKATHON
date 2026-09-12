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
  Sparkles,
  CloudRain
} from 'lucide-react';
import { notificationsList } from '../../data/mockData';
import { translations } from '../../data/translations';
import { fetchLiveWeather } from '../../services/weatherService';
import '../../styles/Header.css';

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

  const screens = [
    { id: 'home', num: '1', name: t.navHome || 'Home' },
    { id: 'price-radar', num: '2', name: t.navPriceRadar || 'Mandi Radar' },
    { id: 'where-to-sell', num: '3', name: t.navWhereToSell || 'Where to Sell' },
    { id: 'buyers', num: '4', name: t.navBuyers || 'Buyers' },
    { id: 'my-crops', num: '5', name: t.navMyCrops || 'My Crops' },
    { id: 'price-forecast', num: '6', name: t.navPriceForecast || 'Forecast' },
    { id: 'profile', num: '7', name: t.navProfile || 'Profile' }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const languagesList = [
    { code: 'en', label: 'English' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'hi', label: 'हिंदी' }
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

      {/* Screen Gallery Navigation Switcher */}
      <div className="screen-switcher-bar">
        <div className="screen-switcher-tag">
          <Sparkles size={13} /> Screens:
        </div>
        <div className="screen-pills-list">
          {screens.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`screen-pill-btn ${activeTab === s.id ? 'active' : ''}`}
              onClick={() => setActiveTab(s.id)}
            >
              <span className="pill-num">{s.num}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
