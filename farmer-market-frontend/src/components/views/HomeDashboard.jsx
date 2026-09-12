// src/components/views/HomeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Store, 
  MapPin, 
  DollarSign, 
  Sprout, 
  Zap,
  TrendingDown,
  ShoppingBag,
  Bell,
  Navigation,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/HomeDashboard.css';

const HomeDashboard = ({ setActiveTab, currentUser, isNightMode }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [livePrices, setLivePrices] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Kisan';
  const role = currentUser?.role || 'farmer';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [pricesRes, analyticsRes, ordersRes] = await Promise.all([
          api.prices.getAll({ limit: 6 }).catch(() => ({ data: [] })),
          api.analytics.getDashboard().catch(() => ({ metrics: null })),
          api.orders.getMyOrders().catch(() => ({ data: [] })),
        ]);

        if (pricesRes?.data) setLivePrices(pricesRes.data);
        if (analyticsRes?.metrics) setAnalytics(analyticsRes.metrics);
        if (ordersRes?.data) setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  // Dynamic SVG Trend chart based on live wheat prices or default series
  const chartData = [
    { day: 'Mon', price: 2360 },
    { day: 'Tue', price: 2390 },
    { day: 'Wed', price: 2375 },
    { day: 'Thu', price: 2420 },
    { day: 'Fri', price: 2410 },
    { day: 'Sat', price: 2450 },
    { day: 'Sun', price: 2465 },
  ];

  const minPrice = 2300;
  const maxPrice = 2500;
  const chartWidth = 320;
  const chartHeight = 80;

  const points = chartData.map((item, index) => {
    const x = (index / (chartData.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - ((item.price - minPrice) / (maxPrice - minPrice)) * (chartHeight - 20) - 10;
    return { ...item, x, y };
  });

  const pathD = points.reduce((acc, point, index) => {
    return `${acc} ${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`;
  }, '');

  return (
    <div className={`home-dashboard-container ${isNightMode ? 'night-theme-active' : ''}`}>
      {/* Welcome Banner */}
      <div className="welcome-header">
        <div>
          <h1>
            Namaste, {userName}! <span>🌾</span>
          </h1>
          <p>
            {role === 'farmer'
              ? 'Real-time Mandi market linkage, direct verified buyers, and maximum net profits.'
              : role === 'buyer'
              ? 'Direct farm gate procurement, verified farmers, and fair mandi transparency.'
              : 'KisanSetu Platform Administration & Governance Center.'}
          </p>
        </div>
        <div className="welcome-actions">
          <button 
            className="quick-action-primary"
            onClick={() => setActiveTab(role === 'farmer' ? 'my-crops' : 'buyers')}
          >
            <Sparkles size={16} />
            <span>{role === 'farmer' ? '+ Post Produce' : 'Explore Produce'}</span>
          </button>
        </div>
      </div>

      {/* Top Section: Hero Card + Market Weather */}
      <div className="dashboard-top-grid">
        {/* Wheat Trending Hero Card */}
        <div className="hero-wheat-card">
          <img 
            src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80" 
            alt="Wheat Field" 
            className="hero-wheat-bg-img"
          />
          <div className="hero-content">
            <div className="hero-tags">
              <span className="crop-tag">🌾 Sharbati Wheat</span>
              <span className="trending-pill">
                <Sparkles size={12} /> High Demand Today
              </span>
            </div>

            <div className="hero-price-row">
              <div className="hero-price">₹ 2,450</div>
              <div className="hero-unit">/ quintal</div>
              <div className="hero-change">
                <ArrowUpRight size={14} /> +1.87% (Gondal Mandi)
              </div>
            </div>

            <div className="hero-metrics">
              <span><span className="metric-dot" /> Demand High</span>
              <span><span className="metric-dot" /> Supply Steady</span>
              <span><span className="metric-dot" /> Bullish Outlook</span>
            </div>

            <div className="hero-button-group">
              <button 
                className="hero-details-btn"
                onClick={() => setActiveTab('where-should-i-sell')}
              >
                <span>Where Should I Sell?</span>
                <ArrowRight size={14} />
              </button>
              <button 
                className="hero-sub-btn"
                onClick={() => setActiveTab('price-radar')}
              >
                <span>Price Radar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Market Weather / Signal Card */}
        <div className="market-weather-card">
          <div className="weather-header">
            <h3>Mandi Climate</h3>
            <span className="bullish-badge">
              <TrendingUp size={14} /> Bullish Signal
            </span>
          </div>

          <p className="weather-desc">
            Saurashtra and Malwa arrival flows remain healthy. Grain millers actively procuring Sharbati and Lokwan batches above MSP benchmarks.
          </p>

          <div className="crop-pills-row">
            <span className="crop-pill positive">🌾 Wheat +1.8%</span>
            <span className="crop-pill positive">☁️ Cotton +1.7%</span>
            <span className="crop-pill positive">🥜 Groundnut +1.4%</span>
            <span className="crop-pill positive">🧅 Onion +3.4%</span>
          </div>

          {/* Mini 7-Day Trend Chart */}
          <div className="mini-chart-container">
            <div className="mini-chart-header">
              <span>7-Day Price Curve</span>
              <span className="chart-high">Peak: ₹2,465</span>
            </div>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="trend-svg">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={pathD} fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint === i ? 5 : 3}
                  fill="#16a34a"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </svg>
            <div className="chart-labels">
              {chartData.map((d, i) => (
                <span key={i}>{d.day}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Circular Cards (Matching Reference UI 3 & 4) */}
      <div className="quick-action-strip">
        <button className="action-circle-item" onClick={() => setActiveTab('market-prices')}>
          <div className="action-circle-icon bg-emerald">
            <Store size={22} />
          </div>
          <span className="action-circle-label">Live Prices</span>
        </button>
        <button className="action-circle-item" onClick={() => setActiveTab('price-radar')}>
          <div className="action-circle-icon bg-blue">
            <Navigation size={22} />
          </div>
          <span className="action-circle-label">Price Radar</span>
        </button>
        <button className="action-circle-item" onClick={() => setActiveTab('where-should-i-sell')}>
          <div className="action-circle-icon bg-orange">
            <MapPin size={22} />
          </div>
          <span className="action-circle-label">Best Mandi</span>
        </button>
        <button className="action-circle-item" onClick={() => setActiveTab('profit-calculator')}>
          <div className="action-circle-icon bg-purple">
            <DollarSign size={22} />
          </div>
          <span className="action-circle-label">Transport Calc</span>
        </button>
        <button className="action-circle-item" onClick={() => setActiveTab('buyers')}>
          <div className="action-circle-icon bg-teal">
            <ShoppingBag size={22} />
          </div>
          <span className="action-circle-label">Buyers</span>
        </button>
        <button className="action-circle-item" onClick={() => setActiveTab('price-alerts')}>
          <div className="action-circle-icon bg-amber">
            <Bell size={22} />
          </div>
          <span className="action-circle-label">Price Alerts</span>
        </button>
        <button className="action-circle-item" onClick={() => setActiveTab('schemes')}>
          <div className="action-circle-icon bg-red">
            <ShieldCheck size={22} />
          </div>
          <span className="action-circle-label">Govt Schemes</span>
        </button>
        <button className="action-circle-item" onClick={() => setActiveTab('advisory')}>
          <div className="action-circle-icon bg-lime">
            <Sprout size={22} />
          </div>
          <span className="action-circle-label">Crop Advisory</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="dashboard-stats-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">In-Hand Realized Value</span>
            <span className="kpi-icon-pill bg-emerald">
              <DollarSign size={16} />
            </span>
          </div>
          <div className="kpi-value">₹ {analytics?.totalEarnings ? analytics.totalEarnings.toLocaleString('en-IN') : '96,000'}</div>
          <div className="kpi-footnote text-emerald">
            <ArrowUpRight size={14} /> +18.4% vs local village trader
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Produce Listed</span>
            <span className="kpi-icon-pill bg-blue">
              <Sprout size={16} />
            </span>
          </div>
          <div className="kpi-value">{analytics?.activeListings || 4} Listings</div>
          <div className="kpi-footnote">
            310 quintals total available stock
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Deals & Offers</span>
            <span className="kpi-icon-pill bg-amber">
              <Clock size={16} />
            </span>
          </div>
          <div className="kpi-value">{analytics?.pendingOffers || 1} Pending</div>
          <div className="kpi-footnote text-amber" onClick={() => setActiveTab('offers')} style={{ cursor: 'pointer' }}>
            Click to review and accept bids →
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Top Profit Mandi Today</span>
            <span className="kpi-icon-pill bg-purple">
              <Store size={16} />
            </span>
          </div>
          <div className="kpi-value">Gondal Mandi</div>
          <div className="kpi-footnote text-purple">
            +₹35/qtl extra profit after transport
          </div>
        </div>
      </div>

      {/* Active Deals / Orders Table (Matching Reference UI 3) */}
      <div className="dashboard-section-card">
        <div className="section-card-header">
          <div>
            <h2>Active Marketplace Transactions & Orders</h2>
            <p>Track payments in Escrow, dispatch status, and buyer receipts</p>
          </div>
          <button className="view-all-btn" onClick={() => setActiveTab('orders')}>
            View All Orders →
          </button>
        </div>

        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Tracking #</th>
                <th>Crop Item</th>
                <th>Party</th>
                <th>Quantity</th>
                <th>Amount (₹)</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span className="tracking-badge">{order.trackingNumber || 'KS-849201'}</span>
                    </td>
                    <td>
                      <strong>{order.crop?.cropName || 'Sharbati Wheat'}</strong>
                    </td>
                    <td>
                      {role === 'farmer' ? order.buyer?.name || 'Reliance Fresh' : order.farmer?.name || 'Ramesh Patel'}
                    </td>
                    <td>{order.quantity} {order.unit || 'quintal'}</td>
                    <td>
                      <strong className="text-emerald">₹ {order.totalAmount?.toLocaleString('en-IN')}</strong>
                    </td>
                    <td>
                      <span className={`status-tag ${order.paymentStatus === 'released_to_farmer' ? 'status-green' : 'status-yellow'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`status-tag ${order.orderStatus === 'delivered' ? 'status-green' : 'status-blue'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="table-action-btn"
                        onClick={() => setActiveTab('orders')}
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>
                    <span className="tracking-badge">KS-849201</span>
                  </td>
                  <td><strong>Sharbati Wheat Grade A</strong></td>
                  <td>Reliance Fresh Logistics</td>
                  <td>40 quintal</td>
                  <td><strong className="text-emerald">₹ 96,000</strong></td>
                  <td><span className="status-tag status-yellow">in_escrow</span></td>
                  <td><span className="status-tag status-blue">in_transit</span></td>
                  <td>
                    <button className="table-action-btn" onClick={() => setActiveTab('orders')}>
                      Track
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
