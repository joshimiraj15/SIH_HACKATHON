// src/components/views/PriceJourney.jsx
import React from 'react';
import { 
  User, 
  Warehouse, 
  Store, 
  ShoppingBag, 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { priceJourneyData } from '../../data/mockData';
import '../../styles/PriceJourney.css';

const PriceJourney = ({ setActiveTab }) => {
  const { stages, insightCallout, breakdown } = priceJourneyData;

  const iconMap = {
    User: User,
    Warehouse: Warehouse,
    Store: Store,
    ShoppingBag: ShoppingBag
  };

  return (
    <div className="price-journey-container">
      {/* Header */}
      <div className="journey-header">
        <h1>Price Journey</h1>
        <p>See how your crop's value grows across the supply chain.</p>
      </div>

      {/* 4-Stage Flow Pipeline */}
      <div className="journey-pipeline-card">
        <div className="pipeline-steps-row">
          {stages.map((stage, idx) => {
            const Icon = iconMap[stage.iconName] || User;
            return (
              <React.Fragment key={stage.id}>
                <div className={`pipeline-step-node ${stage.isHighlighted ? 'active' : ''}`}>
                  <div className="node-icon-circle">
                    <Icon size={22} />
                  </div>
                  <div className="node-title">{stage.title}</div>
                  <div className="node-price">{stage.price}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                    {stage.desc}
                  </div>
                </div>

                {idx < stages.length - 1 && (
                  <div className="pipeline-arrow">
                    <ArrowRight size={20} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Insight Callout */}
      <div className="journey-callout-banner">
        <div className="callout-icon">
          <ShieldAlert size={20} />
        </div>
        <div className="callout-text">
          {insightCallout}
        </div>
      </div>

      {/* Bottom 2 Grid: Breakdown Progress Bars + Story */}
      <div className="journey-bottom-grid">
        {/* Breakdown of Price */}
        <div className="breakdown-card">
          <h3>Breakdown of Price</h3>

          <div className="breakdown-list">
            {breakdown.map((item, idx) => (
              <div key={idx} className="breakdown-row">
                <div className="breakdown-row-header">
                  <strong>{item.label}</strong>
                  <span><strong>{item.amount}</strong> ({item.percent}%)</span>
                </div>
                <div className="breakdown-bar-track">
                  <div 
                    className="breakdown-bar-fill" 
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Story / More Value Card */}
        <div className="journey-story-card">
          <img 
            src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=500&auto=format&fit=crop&q=80" 
            alt="Farmer looking across field" 
            className="story-bg-img"
          />
          <div className="story-quote-box">
            <h4>More Value for Our Farmers</h4>
            <p>By connecting directly to high-grade institutional buyers, bypass multi-tiered broker deductions.</p>
            <button 
              onClick={() => setActiveTab('buyers')}
              style={{
                marginTop: '8px',
                background: '#22c55e',
                color: '#072216',
                padding: '5px 12px',
                borderRadius: '99px',
                fontWeight: '700',
                fontSize: '0.74rem'
              }}
            >
              Sell to Direct Buyers →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceJourney;
