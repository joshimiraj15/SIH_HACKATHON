// src/components/layout/Sidebar.jsx
import React from 'react';
import { 
  Home, 
  TrendingUp, 
  Radar, 
  Users, 
  Sprout, 
  LineChart, 
  Compass,
  ShieldCheck, 
  MessageSquare, 
  ChevronRight,
  Sparkles,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { translations } from '../../data/translations';
import '../../styles/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, language, user }) => {
  const t = translations[language] || translations.en;

  const navItems = [
    { id: 'landing', label: 'Landing Page', icon: Sparkles, badge: 'New' },
    { id: 'home', label: t.navHome || 'Home', icon: Home },
    { id: 'market-prices', label: t.navMarketPrices || 'Market Prices', icon: TrendingUp },
    { id: 'price-radar', label: t.navPriceRadar || 'Mandi Radar', icon: Radar, badge: 'Live' },
    { id: 'where-to-sell', label: t.navWhereToSell || 'Where to Sell', icon: Compass },
    { id: 'buyers', label: t.navBuyers || 'Buyers', icon: Users },
    { id: 'my-crops', label: t.navMyCrops || 'My Produce', icon: Sprout, badge: '4' },
    { id: 'price-forecast', label: t.navPriceForecast || 'Forecast', icon: LineChart, badge: 'AI' },
    { id: 'schemes', label: t.navSchemes || 'Govt Schemes', icon: ShieldCheck },
    { id: 'messages', label: t.navMessages || 'Messages', icon: MessageSquare }
  ];

  return (
    <aside className="kisan-sidebar">
      {/* Brand Header */}
      <div 
        className="kisan-brand" 
        onClick={() => setActiveTab('home')} 
        style={{ cursor: 'pointer' }}
      >
        <div className="brand-icon-wrapper">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="#FFFFFF" stroke="none" />
            <polyline points="9 22 9 12 15 12 15 22" stroke="#15803D" />
          </svg>
        </div>
        <div className="brand-text">
          <h2>Kishan<span>Setu</span></h2>
          <span className="brand-tagline">Agri Intelligence Platform</span>
        </div>
      </div>

      {/* Main Navigation List */}
      <nav className="nav-section">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-item-left">
                <span className="icon">
                  <Icon size={18} strokeWidth={isActive ? 2.4 : 1.9} />
                </span>
                <span className="label">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`nav-badge ${item.badge === 'Live' ? 'badge-live' : ''} ${item.badge === 'AI' ? 'badge-ai' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Area: Farmer Profile Card */}
      <div className="sidebar-footer">
        <div 
          className="farmer-pill" 
          onClick={() => setActiveTab('profile')}
          title="Click to view & edit Profile"
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
            <div className="farmer-role">{(user?.role || "Farmer")} • {(user?.district || "Rajkot")}</div>
          </div>
          <ChevronRight size={15} className="farmer-settings-icon" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
