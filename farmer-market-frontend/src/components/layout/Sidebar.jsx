// src/components/layout/Sidebar.jsx
import React from 'react';
import { 
  Home, 
  TrendingUp, 
  Radar, 
  Compass, 
  Calculator,
  Map,
  Users, 
  Sprout, 
  Tag, 
  Package, 
  LineChart, 
  Bell, 
  ShieldAlert, 
  ShieldCheck, 
  MessageSquare, 
  BarChart3, 
  Settings2, 
  ChevronRight
} from 'lucide-react';
import { translations } from '../../data/translations';
import '../../styles/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, language, user }) => {
  const t = translations[language] || translations.en;
  const userRole = user?.role || 'farmer';

  const sections = [
    {
      title: 'MARKET DISCOVERY',
      items: [
        { id: 'home', label: t.navHome || 'Home', icon: Home },
        { id: 'market-prices', label: t.navMarketPrices || 'Market Prices', icon: TrendingUp, badge: 'Live' },
        { id: 'price-radar', label: t.navPriceRadar || 'Price Radar', icon: Radar },
        { id: 'where-to-sell', label: t.navWhereToSell || 'Where Should I Sell?', icon: Compass },
        { id: 'profit-calc', label: 'Profit & Transport', icon: Calculator },
        { id: 'market-map', label: 'Mandi Map', icon: Map },
      ]
    },
    {
      title: 'TRADE & DEALS',
      items: [
        { id: 'buyers', label: t.navBuyers || 'Buyer Marketplace', icon: Users },
        { id: 'my-crops', label: t.navMyCrops || 'My Produce', icon: Sprout, badge: 'Active' },
        { id: 'offers', label: 'Offers & Bids', icon: Tag, badge: 'Deal' },
        { id: 'orders', label: 'Orders & Escrow', icon: Package },
      ]
    },
    {
      title: 'ADVISORY & TOOLS',
      items: [
        { id: 'price-forecast', label: t.navPriceForecast || 'AI Forecast', icon: LineChart, badge: 'AI' },
        { id: 'alerts', label: 'Price Alerts', icon: Bell },
        { id: 'advisory', label: 'Crop Advisory', icon: ShieldAlert },
        { id: 'schemes', label: t.navSchemes || 'Govt Schemes & MSP', icon: ShieldCheck },
        { id: 'messages', label: t.navMessages || 'Messages', icon: MessageSquare },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'admin', label: 'Admin Portal', icon: Settings2, badge: userRole === 'admin' ? 'Admin' : '' },
      ]
    }
  ];

  return (
    <aside className="kisan-sidebar">
      {/* Brand Logo */}
      <div className="kisan-brand" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
        <div className="brand-icon-wrapper">
          <Sprout size={22} strokeWidth={2.4} />
        </div>
        <div className="brand-text">
          <h2>Kisan<span>Setu</span></h2>
          <span className="brand-tagline">{t.tagline || 'Direct Mandis. Better Returns.'}</span>
        </div>
      </div>

      {/* Main Navigation with Categorized Sections */}
      <nav className="nav-section" style={{ overflowY: 'auto', paddingRight: '4px', gap: '12px' }}>
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="sidebar-group">
            <div style={{
              fontSize: '0.66rem',
              fontWeight: '700',
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.4)',
              padding: '6px 12px 2px 12px',
              textTransform: 'uppercase'
            }}>
              {section.title}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <div
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                    style={{ padding: '8px 12px', fontSize: '0.84rem' }}
                  >
                    <div className="nav-item-left">
                      <span className="icon">
                        <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                      </span>
                      <span className="label">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="nav-badge" style={{
                        fontSize: '0.62rem',
                        padding: '2px 6px',
                        background: item.badge === 'AI' ? '#8b5cf6' : item.badge === 'Live' ? '#ef4444' : '#22c55e',
                        color: '#ffffff'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Farmer Profile Footer */}
      <div className="sidebar-profile">
        <div 
          className="farmer-pill" 
          onClick={() => setActiveTab('profile')}
          title="Click to view & edit Profile"
        >
          <div className="farmer-avatar-wrap">
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"} 
              alt={user?.name || "Farmer"} 
              className="farmer-avatar-img"
            />
            <span className="online-dot" />
          </div>
          <div className="farmer-info">
            <div className="farmer-name">{user?.name || "Ramesh Patel"}</div>
            <div className="farmer-role" style={{ textTransform: 'capitalize' }}>
              {(user?.role || "farmer")} • {(user?.location?.district || user?.district || "Rajkot")}
            </div>
          </div>
          <ChevronRight size={16} className="farmer-settings-icon" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
