// src/components/views/MyCrops.jsx
import React from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  PlusCircle, 
  Sprout, 
  Info,
  Droplets
} from 'lucide-react';
import { recentActivities } from '../../data/mockData';
import '../../styles/MyCrops.css';

const MyCrops = ({ crops, setIsAddCropOpen, setActiveTab }) => {
  return (
    <div className="my-crops-container">
      {/* Header */}
      <div className="my-crops-header">
        <div>
          <h1>My Crops</h1>
          <p>Track your crops, get insights and manage your produce</p>
        </div>

        <button 
          className="add-crop-btn"
          onClick={() => setIsAddCropOpen(true)}
        >
          <Plus size={18} />
          <span>Add Crop</span>
        </button>
      </div>

      {/* 4 Crop Cards */}
      <div className="crops-grid-row">
        {crops.map((crop) => (
          <div key={crop.id} className="crop-card">
            <div className="crop-card-img-wrap">
              <img src={crop.image} alt={crop.name} className="crop-card-img" />
            </div>

            <div className="crop-card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div className="crop-name-title">{crop.name}</div>
                <span className="grade-badge-tag" style={{
                  background: crop.grade === 'GRADE_A' ? '#dcfce7' : '#f3f4f6',
                  color: crop.grade === 'GRADE_A' ? '#15803d' : '#374151',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: '700'
                }}>
                  {crop.grade || 'GRADE_A'}
                </span>
              </div>
              <div className="crop-qty-label">{crop.quantity} • Lot Status: <strong style={{ color: '#2d6a4f' }}>{crop.status || 'LISTED'}</strong></div>

              <div className="crop-price-row">
                <div className="crop-price-val">
                  ₹{crop.price} <span>{crop.unit}</span>
                </div>

                <span className={`crop-trend-pill ${crop.trend === 'up' ? 'up' : 'down'}`}>
                  {crop.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {crop.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid: Crop Health & Advisory + Recent Activities */}
      <div className="crops-bottom-grid">
        {/* Crop Health & Advisory */}
        <div className="health-advisory-card">
          <div>
            <h3>Crop Health & Advisory</h3>

            <div className="advisory-item-row">
              <span className="advisory-crop-name">Wheat</span>
              <span className="health-status-badge">
                <CheckCircle2 size={12} /> Good Health
              </span>
            </div>

            <div className="advisory-tips-box">
              <Droplets size={18} color="#16a34a" />
              <span><strong>Tips:</strong> Irrigation needed in 3 days. Soil moisture optimal.</span>
            </div>
          </div>

          <div 
            className="advisory-view-link"
            onClick={() => setActiveTab('price-forecast')}
          >
            <span>View Full Diagnostic Details</span>
            <ArrowRight size={14} />
          </div>

          <div className="advisory-bg-leaves">
            <Sprout size={90} color="#16a34a" />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="activities-card">
          <h3>Recent Activities</h3>

          <div className="activities-list">
            {recentActivities.map((act) => {
              let Icon = TrendingUp;
              if (act.type === 'buyer') Icon = Users;
              if (act.type === 'crop') Icon = PlusCircle;

              return (
                <div key={act.id} className="activity-item">
                  <div className="activity-left">
                    <div className="activity-icon-wrap">
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="activity-text-title">{act.title}</div>
                      <div className="activity-text-sub">{act.detail}</div>
                    </div>
                  </div>
                  <div className="activity-time-tag">{act.time}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCrops;
