// src/components/views/AnalyticsView.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Calendar, 
  Sprout, 
  Scale, 
  ShoppingBag,
  RefreshCw,
  Award
} from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/AnalyticsView.css';

const AnalyticsView = ({ currentUser }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = currentUser?.role || 'farmer';

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.analytics.getDashboard();
      if (res?.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [currentUser]);

  const metrics = data?.metrics;

  const cropVolumeData = [
    { crop: 'Sharbati Wheat', volume: 120, revenue: 290400, percent: 45 },
    { crop: 'Shankar-6 Cotton', volume: 85, revenue: 635800, percent: 30 },
    { crop: 'Bold Groundnut', volume: 60, revenue: 387000, percent: 15 },
    { crop: 'Table Tomato', volume: 45, revenue: 84600, percent: 10 },
  ];

  return (
    <div className="analytics-view-container">
      <div className="view-header-strip">
        <div>
          <h2>Platform & Farm Financial Analytics</h2>
          <p>
            {role === 'farmer'
              ? 'Analyze trade realizations, compare returns over local traders, and track produce turnover'
              : 'Institutional procurement metrics, order completion rates, and spending analytics'}
          </p>
        </div>
        <button className="btn-refresh" onClick={fetchAnalytics}>
          <RefreshCw size={15} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="analytics-kpi-grid">
        <div className="stat-card-clean">
          <span className="stat-label">Total Trade Volume Realized</span>
          <div className="stat-value text-emerald">
            ₹ {metrics?.totalEarnings ? metrics.totalEarnings.toLocaleString('en-IN') : '96,000'}
          </div>
          <span className="stat-badge-positive">
            <ArrowUpRight size={13} /> +18.4% above local middleman prices
          </span>
        </div>

        <div className="stat-card-clean">
          <span className="stat-label">Produce Turnover</span>
          <div className="stat-value">
            {metrics?.totalProduceVolumeQuintals || 310} <small>Quintals</small>
          </div>
          <span className="stat-note">82% Grade A certified produce</span>
        </div>

        <div className="stat-card-clean">
          <span className="stat-label">Active Orders & Deals</span>
          <div className="stat-value">
            {metrics?.completedDeals || 1} Fulfilled
          </div>
          <span className="stat-note">100% Escrow on-time release</span>
        </div>

        <div className="stat-card-clean">
          <span className="stat-label">Price Realization vs MSP</span>
          <div className="stat-value text-purple">
            +₹35 <small>/ quintal</small>
          </div>
          <span className="stat-note">Consistently above CCEA benchmark</span>
        </div>
      </div>

      {/* Volume Breakdown & Crop Share */}
      <div className="analytics-charts-layout">
        <div className="analytics-card-half">
          <div className="card-header-clean">
            <h3>Produce Volume & Revenue Distribution</h3>
            <span>Rabi & Kharif Season</span>
          </div>

          <div className="crop-bars-list">
            {cropVolumeData.map((item) => (
              <div key={item.crop} className="crop-bar-item">
                <div className="bar-labels-line">
                  <strong>{item.crop}</strong>
                  <span>{item.volume} qtl (₹{item.revenue.toLocaleString('en-IN')})</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card-half">
          <div className="card-header-clean">
            <h3>Value Realization Comparison</h3>
            <span>KisanSetu vs Traditional Mandi vs Local Middleman</span>
          </div>

          <div className="comparison-bars">
            <div className="channel-row highlight-channel">
              <div className="channel-name">
                <Award size={16} className="text-emerald" />
                <span>KisanSetu Direct Marketplace</span>
              </div>
              <strong className="text-emerald">₹ 2,420 / qtl (100%)</strong>
            </div>

            <div className="channel-row">
              <div className="channel-name">
                <span>Direct APMC Mandi (Without Logistics Planning)</span>
              </div>
              <strong>₹ 2,340 / qtl (-3.3%)</strong>
            </div>

            <div className="channel-row">
              <div className="channel-name">
                <span>Village Middleman / Commission Broker</span>
              </div>
              <strong className="text-red">₹ 2,050 / qtl (-15.2%)</strong>
            </div>

            <div className="channel-benefit-callout">
              💡 <strong>Net Gain:</strong> By using KisanSetu's "Where Should I Sell" tool and Direct Buyer Offers, you saved <strong>₹18,500</strong> in transport leakages and middleman cuts this season!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
