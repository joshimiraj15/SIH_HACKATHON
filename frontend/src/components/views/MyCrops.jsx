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
  Droplets,
  ShoppingBag,
  Check,
  X,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { recentActivities } from '../../data/mockData';
import '../../styles/MyCrops.css';

const MyCrops = ({ crops, setIsAddCropOpen, setActiveTab, buyerOffers = [], onAcceptOffer, onDeclineOffer }) => {
  return (
    <div className="my-crops-container">
      {/* Header */}
      <div className="my-crops-header">
        <div>
          <h1>My Produce & Crop Inventory</h1>
          <p>Manage your crop lots, set pricing, view market trends, and accept buyer contract offers</p>
        </div>

        <button 
          className="add-crop-btn"
          onClick={() => setIsAddCropOpen(true)}
        >
          <Plus size={18} />
          <span>Add Crop Lot</span>
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

      {/* Incoming Buyer Purchase Offers */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '28px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              📥 Incoming Buyer Contract Offers ({buyerOffers.length})
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
              Direct procurement offers submitted by verified traders and institutional buyers
            </p>
          </div>

          <button
            type="button"
            className="cat-tab-btn"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            onClick={() => setActiveTab('messages')}
          >
            View Messages →
          </button>
        </div>

        {buyerOffers.length === 0 ? (
          <div style={{
            background: '#F8FAFC',
            border: '1px dashed #CBD5E1',
            borderRadius: '16px',
            padding: '28px',
            textAlign: 'center',
            color: '#64748B'
          }}>
            <ShoppingBag size={36} color="#94A3B8" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: '700', color: '#334155' }}>No Active Offers Pending</div>
            <div style={{ fontSize: '0.82rem' }}>Buyer purchase offers for your listed crop lots will appear here automatically.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {buyerOffers.map((o) => (
              <div key={o.id} style={{
                background: o.status === 'accepted' ? '#F0FDF4' : '#F8FAFC',
                border: o.status === 'accepted' ? '1.5px solid #86EFAC' : '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.74rem', background: '#E2E8F0', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', color: '#334155' }}>
                        {o.cropName}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', margin: '4px 0 0 0' }}>
                        {o.buyerName}
                      </h4>
                    </div>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '10px',
                      background: o.status === 'accepted' ? '#DCFCE7' : o.status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                      color: o.status === 'accepted' ? '#166534' : o.status === 'rejected' ? '#991B1B' : '#D97706'
                    }}>
                      {o.status === 'accepted' ? '✓ Accepted' : o.status === 'rejected' ? 'Declined' : 'Pending'}
                    </span>
                  </div>

                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 12px', margin: '10px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#64748B' }}>Offered Rate:</span>
                      <strong style={{ color: '#166534', fontSize: '0.95rem' }}>₹{o.offeredPrice.toLocaleString()} / Q</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: '4px' }}>
                      <span style={{ color: '#64748B' }}>Quantity Requested:</span>
                      <strong>{o.quantity} Quintals</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed #E2E8F0' }}>
                      <span style={{ color: '#64748B' }}>Total Value:</span>
                      <strong style={{ color: '#0F172A' }}>₹{o.totalValue.toLocaleString()}</strong>
                    </div>
                  </div>

                  {o.notes && (
                    <div style={{ fontSize: '0.78rem', color: '#475569', fontStyle: 'italic', marginBottom: '12px' }}>
                      "{o.notes}"
                    </div>
                  )}
                </div>

                {o.status === 'pending' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => onDeclineOffer && onDeclineOffer(o.id)}
                      style={{
                        background: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        color: '#475569',
                        padding: '8px',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                        } catch (e) {}
                        onAcceptOffer && onAcceptOffer(o.id);
                      }}
                      style={{
                        background: '#166534',
                        border: 'none',
                        color: '#FFFFFF',
                        padding: '8px',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Accept Offer →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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

