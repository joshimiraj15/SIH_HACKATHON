// src/components/views/HomeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowRight, 
  Sparkles, 
  Store, 
  MapPin, 
  Sprout, 
  Radar,
  Users,
  LineChart,
  Calendar,
  Download,
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Sun
} from 'lucide-react';
import { 
  farmerProfile, 
  quickStats, 
  priceTrend7Days 
} from '../../data/mockData';
import barnImg from '../../assets/barn.jpg';
import MarketPrices from '../MarketPrices';
import { fetchLiveWeather } from '../../services/weatherService';
import '../../styles/HomeDashboard.css';

const HomeDashboard = ({ setActiveTab }) => {
  const [activeTabSub, setActiveTabSub] = useState('overview');
  const [exportNotice, setExportNotice] = useState(false);
  const [liveWeather, setLiveWeather] = useState(null);

  useEffect(() => {
    fetchLiveWeather(farmerProfile.district || 'Rajkot')
      .then(setLiveWeather)
      .catch(() => {});
  }, []);

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 2500);
  };

  // 6 Active Mandi Deals matching 3.webp
  const dealsData = [
    {
      id: 1,
      farm: 'Rajkot APMC Mega Mandi',
      phone: '+91 98765-12001',
      crop: 'Sharbati Wheat',
      category: 'Grains',
      amount: '+ ₹3,200.00',
      unit: '/Qtl',
      status: 'Completed',
      statusColor: 'green'
    },
    {
      id: 2,
      farm: 'Ahmedabad Vegetable Yard',
      phone: '+91 98765-12002',
      crop: 'Hybrid Tomatoes',
      category: 'Vegetables',
      amount: '- ₹1,850.00',
      unit: '/Qtl',
      status: 'Canceled',
      statusColor: 'red'
    },
    {
      id: 3,
      farm: 'Gondal APMC Yard',
      phone: '+91 98765-12003',
      crop: 'Shankar-6 Cotton',
      category: 'Fiber',
      amount: '+ ₹7,400.00',
      unit: '/Qtl',
      status: 'Pending',
      statusColor: 'yellow'
    },
    {
      id: 4,
      farm: 'Junagadh APMC Yard',
      phone: '+91 98765-12004',
      crop: 'Groundnut GG-20',
      category: 'Oilseeds',
      amount: '+ ₹6,150.00',
      unit: '/Qtl',
      status: 'Completed',
      statusColor: 'green'
    },
    {
      id: 5,
      farm: 'Mahuva APMC Market',
      phone: '+91 98765-12005',
      crop: 'Red Onion (Garva)',
      category: 'Vegetables',
      amount: '+ ₹2,400.00',
      unit: '/Qtl',
      status: 'Pending',
      statusColor: 'yellow'
    },
    {
      id: 6,
      farm: 'Deesa Cold Storage Hub',
      phone: '+91 98765-12006',
      crop: 'Potato (Kufri Badshah)',
      category: 'Tubers',
      amount: '+ ₹1,920.00',
      unit: '/Qtl',
      status: 'Completed',
      statusColor: 'green'
    }
  ];

  return (
    <div className="home-dashboard-container">
      {/* ════ TOP 3-COLUMN GRID (Direct Ref: 3.webp) ════ */}
      <div className="home-top-grid">
        
        {/* COLUMN 1: Overview & Balance Card */}
        <div className="overview-balance-card">
          <div className="ov-header">
            <span className="ov-eyebrow">Overview</span>
            <div className="ov-sublabel">Total Portfolio Valuation <span className="ov-trend">+₹42,500</span></div>
          </div>

          <div className="ov-balance-row">
            <div className="ov-balance-num">₹3,48,500<span className="ov-cents">.60</span></div>
            <span className="ov-gain-pill">+113.4%</span>
          </div>

          {/* 4 Quick Action Circular Buttons */}
          <div className="ov-actions-row">
            <button 
              type="button" 
              className="ov-action-item"
              onClick={() => setActiveTab('my-crops')}
              title="Add or Manage Produce"
            >
              <div className="ov-action-circle bg-amber">
                <Sprout size={18} />
              </div>
              <span className="ov-action-label">Sell</span>
            </button>

            <button 
              type="button" 
              className="ov-action-item"
              onClick={() => setActiveTab('price-radar')}
              title="Find Best Mandi"
            >
              <div className="ov-action-circle bg-green">
                <Radar size={18} />
              </div>
              <span className="ov-action-label">Radar</span>
            </button>

            <button 
              type="button" 
              className="ov-action-item"
              onClick={() => setActiveTab('buyers')}
              title="Match Direct Buyers"
            >
              <div className="ov-action-circle bg-coral">
                <Users size={18} />
              </div>
              <span className="ov-action-label">Buyers</span>
            </button>

            <button 
              type="button" 
              className="ov-action-item"
              onClick={() => setActiveTab('price-forecast')}
              title="AI Price Predictions"
            >
              <div className="ov-action-circle bg-blue">
                <LineChart size={18} />
              </div>
              <span className="ov-action-label">Forecast</span>
            </button>
          </div>
        </div>

        {/* COLUMN 2: Learning Center / Mandi Forecast & Weather Banner */}
        <div className="learning-center-card">
          <div className="learning-card-content">
            <span className="learning-badge">
              {liveWeather ? `${liveWeather.icon} ${liveWeather.temperature}°C • ${liveWeather.district}` : '🌤️ 31°C • Open-Meteo Live'}
            </span>
            <h3 className="learning-title">
              {liveWeather?.condition ? `${liveWeather.condition} Forecast` : 'Mandi & Weather Center'}
            </h3>
            <p className="learning-desc">
              {liveWeather?.advisory || 'Optimal weather for wheat harvesting and mandi transport across Saurashtra.'}
            </p>
            <button 
              type="button" 
              className="learning-btn"
              onClick={() => setActiveTab('price-forecast')}
            >
              Explore Forecast →
            </button>
          </div>
        </div>

        {/* COLUMN 3: Spotlight Mandi Hub Card (Stockton Farm style) */}
        <div className="spotlight-farm-card">
          <div className="spotlight-img-wrap">
            <img src={barnImg} alt="Rajkot APMC Hub" className="spotlight-img" />
            <span className="spotlight-tag">NEW TOP BID</span>
          </div>

          <div className="spotlight-body">
            <div className="spotlight-header-row">
              <div>
                <h4 className="spotlight-title">Rajkot APMC Hub</h4>
                <div className="spotlight-loc">
                  <MapPin size={12} /> Rajkot, Saurashtra
                </div>
              </div>
              <span className="spotlight-crop-pill">Wheat</span>
            </div>

            <div className="spotlight-meta-row">
              <span className="meta-label">Top APMC Rate</span>
              <span className="meta-value">₹2,950 / Qtl</span>
            </div>

            {/* Quota Progress Bar */}
            <div className="spotlight-quota-block">
              <div className="quota-label-row">
                <span>Daily Buying Quota</span>
                <span>72%</span>
              </div>
              <div className="quota-bar-track">
                <div className="quota-bar-fill" style={{ width: '72%' }} />
              </div>
            </div>

            <button 
              type="button" 
              className="spotlight-action-btn"
              onClick={() => setActiveTab('buyers')}
            >
              Direct Deal Now
            </button>
          </div>
        </div>

      </div>

      {/* ════ BOTTOM SECTION: FUNDED INVESTMENTS / CROP DEALS TABLE ════ */}
      <div className="deals-table-card">
        <div className="deals-table-header">
          <div>
            <h3 className="deals-table-title">Funded Deals & Mandi Listings</h3>
            <p className="deals-table-subtitle">Live transactions across Saurashtra & Gujarat market yards</p>
          </div>

          <div className="deals-table-controls">
            <div className="deals-date-pill">
              <Calendar size={14} />
              <span>10 Sep 25 – 17 Sep 25</span>
            </div>

            <button 
              type="button" 
              className="deals-export-btn"
              onClick={handleExport}
            >
              <Download size={14} />
              <span>Export</span>
            </button>

            {exportNotice && <span className="export-toast">✓ Report Downloaded</span>}
          </div>
        </div>

        {/* Clean Responsive Data Table */}
        <div className="deals-table-wrapper">
          <table className="deals-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Mandi / Buyer</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dealsData.map((item) => (
                <tr key={item.id} className="deals-table-row">
                  <td className="cell-num">{item.id}</td>
                  <td>
                    <div className="farm-cell">
                      <div className="farm-icon-circle">
                        {item.category === 'Grains' && '🌾'}
                        {item.category === 'Vegetables' && '🍅'}
                        {item.category === 'Fiber' && '🌱'}
                        {item.category === 'Oilseeds' && '🥜'}
                        {item.category === 'Tubers' && '🥔'}
                      </div>
                      <div>
                        <div className="farm-name">{item.farm}</div>
                        <div className="farm-sub">{item.crop} • {item.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-pill">{item.category}</span>
                  </td>
                  <td>
                    <span className={`amount-text ${item.amount.startsWith('+') ? 'gain' : 'loss'}`}>
                      {item.amount}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill status-${item.statusColor}`}>
                      <span className="status-dot" />
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      type="button" 
                      className="row-action-btn"
                      onClick={() => setActiveTab('where-to-sell')}
                      title="View Details"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════ SECONDARY: LIVE APMC MARKET FEED ════ */}
      <div className="home-market-feed-section">
        <div className="market-feed-header">
          <div>
            <h3 className="feed-title">Live Gujarat APMC Market Board</h3>
            <p className="feed-sub">Real-time modal rates and price volatility across major agricultural centers</p>
          </div>
          <button 
            type="button" 
            className="feed-view-all-btn"
            onClick={() => setActiveTab('market-prices')}
          >
            View Full Price Radar →
          </button>
        </div>

        <MarketPrices />
      </div>
    </div>
  );
};

export default HomeDashboard;
