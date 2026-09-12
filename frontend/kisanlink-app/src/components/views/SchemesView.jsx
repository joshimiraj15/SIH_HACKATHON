// src/components/views/SchemesView.jsx
import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, ExternalLink, Award } from 'lucide-react';
import { governmentSchemes } from '../../data/mockData';
import '../../styles/WhereShouldISell.css';

const SchemesView = ({ setActiveTab }) => {
  return (
    <div className="where-to-sell-container">
      <div className="where-header">
        <h1>Government Schemes & Subsidies</h1>
        <p>Direct benefit transfers, crop insurance and agricultural subsidies for Gujarat farmers.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {governmentSchemes.map((s) => (
          <div key={s.id} className="best-option-card" style={{ flexDirection: 'column', alignItems: 'flex-start', background: '#ffffff', borderColor: '#bbf7d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={20} color="#15803d" />
              <span className="best-option-badge-tag">{s.status}</span>
            </div>

            <h3 style={{ fontSize: '1.15rem', color: '#14281d', fontWeight: '700', marginBottom: '6px' }}>{s.title}</h3>
            <p style={{ fontSize: '0.88rem', color: '#16a34a', fontWeight: '700', marginBottom: '14px' }}>{s.benefit}</p>

            {s.nextInstallment && (
              <div style={{ fontSize: '0.8rem', color: '#64748b', background: '#f8faf8', padding: '8px 12px', borderRadius: '6px', width: '100%', marginBottom: '12px' }}>
                Next Installment: <strong>{s.nextInstallment}</strong>
              </div>
            )}

            <button 
              className="where-find-btn" 
              style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
              onClick={() => alert(`Applying for ${s.title} with Aadhaar linking.`)}
            >
              <span>{s.action || 'View Benefit Status'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemesView;
