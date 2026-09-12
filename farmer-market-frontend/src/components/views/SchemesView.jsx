// src/components/views/SchemesView.jsx
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Award, 
  Scale, 
  RefreshCw,
  FileText,
  DollarSign
} from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/SchemesView.css';

const SchemesView = () => {
  const [schemes, setSchemes] = useState([]);
  const [mspRates, setMspRates] = useState([]);
  const [selectedTab, setSelectedTab] = useState('schemes'); // 'schemes' or 'msp'
  const [loading, setLoading] = useState(true);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const [schemesRes, mspRes] = await Promise.all([
        api.schemes.getAll().catch(() => ({ data: [] })),
        api.schemes.getMspRates().catch(() => ({ data: [] })),
      ]);

      if (schemesRes?.data) setSchemes(schemesRes.data);
      if (mspRes?.data) setMspRates(mspRes.data);
    } catch (err) {
      console.error('Failed to load schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  return (
    <div className="schemes-view-container">
      {/* Header */}
      <div className="view-header-strip">
        <div>
          <h2>Government Agriculture Schemes & Official MSP Benchmarks</h2>
          <p>Verified DBT income support, crop insurance coverage, solar subsidies, and guaranteed MSP floor prices</p>
        </div>

        <div className="schemes-tab-toggle">
          <button 
            className={`tab-btn ${selectedTab === 'schemes' ? 'active' : ''}`}
            onClick={() => setSelectedTab('schemes')}
          >
            <ShieldCheck size={16} />
            <span>Central & State Schemes</span>
          </button>
          <button 
            className={`tab-btn ${selectedTab === 'msp' ? 'active' : ''}`}
            onClick={() => setSelectedTab('msp')}
          >
            <Scale size={16} />
            <span>Official MSP Rates (2024-26)</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <RefreshCw size={28} className="spin-anim" />
          <p>Fetching official government schemes and MSP data...</p>
        </div>
      ) : selectedTab === 'schemes' ? (
        /* Schemes Grid */
        <div className="schemes-cards-grid">
          {schemes.map((s) => (
            <div key={s._id} className="scheme-card">
              <div className="scheme-top-badge-row">
                <span className="scheme-category-badge">{s.category}</span>
                <span className="scheme-ministry-badge">{s.ministry}</span>
              </div>

              <h3 className="scheme-title">{s.title}</h3>
              <div className="benefit-highlight-box">
                <span className="benefit-label">Direct Financial Benefit</span>
                <strong className="benefit-value">{s.benefitAmount}</strong>
              </div>

              <p className="scheme-desc">{s.description}</p>

              <div className="scheme-eligibility-block">
                <h4>Eligibility Criteria:</h4>
                <ul>
                  {s.eligibility?.map((item, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={13} className="text-emerald" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="scheme-documents-block">
                <h4>Required Documents:</h4>
                <div className="doc-tags">
                  {s.documentsRequired?.map((doc, idx) => (
                    <span key={idx} className="doc-tag">
                      <FileText size={12} /> {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="scheme-footer-action">
                <a 
                  href={s.portalUrl || 'https://pmkisan.gov.in'} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-apply-scheme"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* MSP Official Table */
        <div className="msp-table-card">
          <div className="msp-card-header">
            <div>
              <h3>Cabinet Committee on Economic Affairs (CCEA) Approved MSP</h3>
              <p>Minimum guaranteed prices per quintal ensuring at least 50% to 105% margin over cost of production (A2+FL)</p>
            </div>
          </div>

          <div className="msp-table-wrap">
            <table className="msp-table">
              <thead>
                <tr>
                  <th>Commodity Crop</th>
                  <th>Season</th>
                  <th>2023-24 MSP</th>
                  <th>2024-25 MSP</th>
                  <th>Projected 2025-26</th>
                  <th>Current Market Rate</th>
                  <th>Price Realization</th>
                </tr>
              </thead>
              <tbody>
                {mspRates.map((r) => {
                  const msp24 = r.msp2024_25 || 2425;
                  const marketAvg = r.marketPriceAvg || 2450;
                  const isAboveMsp = marketAvg >= msp24;

                  return (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.crop}</strong>
                      </td>
                      <td>
                        <span className="season-pill">{r.season}</span>
                      </td>
                      <td>₹ {r.msp2023_24?.toLocaleString('en-IN')}</td>
                      <td>
                        <strong className="text-emerald">₹ {msp24.toLocaleString('en-IN')}</strong>
                      </td>
                      <td>₹ {r.msp2025_26?.toLocaleString('en-IN')}</td>
                      <td>
                        <strong>₹ {marketAvg.toLocaleString('en-IN')}</strong>
                      </td>
                      <td>
                        <span className={`realization-badge ${isAboveMsp ? 'badge-profit' : 'badge-procure'}`}>
                          {isAboveMsp ? 'Trading +₹' + (marketAvg - msp24) + ' Above MSP' : 'Govt. Procurement Eligible'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemesView;
