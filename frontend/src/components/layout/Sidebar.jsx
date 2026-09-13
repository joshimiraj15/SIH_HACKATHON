// src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import {
  Home,
  Radar,
  Compass,
  TrendingUp,
  Users,
  Sprout,
  LineChart,
  Route,
  ShieldCheck,
  MessageSquare,
  UserCircle,
  LogOut,
  CloudSun,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { translations } from '../../data/translations';
import { fetchLiveWeather } from '../../services/weatherService';
import '../../styles/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, language, user, onLogout, isOpenMobile, onCloseMobile }) => {
  const t = translations[language] || translations.en;
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchLiveWeather(user?.district || 'Rajkot')
      .then((data) => { if (isMounted) setWeather(data); })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [user?.district]);

  // All 11 views — always visible, no numbers
  const navItems = [
    { id: 'home',           label: 'Home',              icon: Home          },
    { id: 'price-radar',    label: 'Price Radar',       icon: Radar,        badge: 'Live' },
    { id: 'where-to-sell',  label: 'Where Should I Sell?', icon: Compass,  badge: 'AI'  },
    { id: 'market-prices',  label: 'Market Prices',     icon: TrendingUp    },
    { id: 'buyers',         label: 'Buyers',            icon: Users,        badge: 'Verified' },
    { id: 'my-crops',       label: 'My Crops',          icon: Sprout        },
    { id: 'price-forecast', label: 'Price Forecast',    icon: LineChart     },
    { id: 'price-journey',  label: 'Price Journey',     icon: Route         },
    { id: 'schemes',        label: 'Govt Schemes',      icon: ShieldCheck   },
    { id: 'messages',       label: 'Messages',          icon: MessageSquare, badge: '3' },
    { id: 'profile',        label: 'Profile & Settings',icon: UserCircle    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div className="sidebar-mobile-backdrop" onClick={onCloseMobile} />
      )}

      <aside className={`kisan-sidebar ${isOpenMobile ? 'mobile-open' : ''}`}>

        {/* Brand Header */}
        <div className="sidebar-brand-wrapper">
          <div
            className="kisan-brand"
            onClick={() => { setActiveTab('home'); onCloseMobile?.(); }}
            role="button"
            tabIndex={0}
          >
            <div className="brand-icon-wrapper">
              <span className="brand-sprout-emoji">🌾</span>
            </div>
            <div className="brand-text">
              <h2>Kisan<span>Setu</span></h2>
              <span className="brand-tagline">AgriTech Marketplace</span>
            </div>
          </div>

          {isOpenMobile && (
            <button className="sidebar-mobile-close" onClick={onCloseMobile} aria-label="Close sidebar">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Public Landing Pill */}
        <div className="sidebar-quick-landing">
          <button
            type="button"
            className="landing-shortcut-btn"
            onClick={() => { setActiveTab('landing'); onCloseMobile?.(); }}
          >
            <Sparkles size={14} />
            <span>Public Landing Page</span>
            <ExternalLink size={12} className="ml-auto opacity-60" />
          </button>
        </div>

        {/* Views Label */}
        <div className="sidebar-views-label">
          <span>VIEWS</span>
        </div>

        {/* Main Navigation — all 11 views */}
        <nav className="nav-section">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile?.();
                }}
              >
                <div className="nav-item-left">
                  <span className="nav-icon">
                    <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`nav-badge badge-${String(item.badge).toLowerCase()}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="sidebar-bottom-section">
          {/* Weather Card */}
          <div className="sidebar-weather-card">
            <div className="weather-card-top">
              <div className="weather-icon-badge">
                <CloudSun size={18} color="#047857" />
              </div>
              <div className="weather-info-text">
                <span className="weather-city-label">{user?.district || 'Rajkot'}, Gujarat</span>
                <span className="weather-temp-label">{weather?.temperature || '31'}°C • {weather?.condition || 'Sunny'}</span>
              </div>
            </div>
            <div className="weather-card-tip">
              <span>Optimal for harvesting &amp; mandi trading</span>
            </div>
          </div>

          {/* Profile Pill */}
          <div
            className="sidebar-farmer-pill"
            onClick={() => { setActiveTab('profile'); onCloseMobile?.(); }}
            title="View & Edit Profile"
          >
            <div className="farmer-avatar-wrap">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
                alt={user?.name || "Farmer"}
                className="farmer-avatar-img"
              />
              <span className="online-dot" />
            </div>
            <div className="farmer-info">
              <div className="farmer-name">{user?.name || "Meet Maniya"}</div>
              <div className="farmer-role">{user?.role || "Farmer"} • {user?.district || "Rajkot"}</div>
            </div>
            <ChevronRight size={15} className="farmer-settings-icon" />
          </div>

          {/* Logout */}
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={onLogout}
            title="Log out of KisanSetu"
          >
            <LogOut size={16} />
            <span>{t.logout || 'Sign Out'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
