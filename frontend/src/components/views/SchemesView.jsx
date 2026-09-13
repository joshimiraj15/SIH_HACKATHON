// src/components/views/SchemesView.jsx
import React, { useState } from 'react';
import { translations } from '../../data/translations';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Filter, 
  CreditCard, 
  Droplet, 
  Sun, 
  ExternalLink,
  Award,
  Calendar,
  FileCheck,
  X
} from 'lucide-react';
import '../../styles/WhereShouldISell.css';

const SCHEMES_DATABASE = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'Direct Income',
    icon: '🌾',
    iconColor: '#10B981',
    description: 'Central sector scheme to supplement financial needs of landholding farmers for agricultural inputs and domestic expenses.',
    eligibility: 'All landholding farmer families with cultivable land in their names (subject to income exclusion criteria).',
    benefits: '₹6,000 per year transferred directly in 3 equal installments of ₹2,000 into Aadhaar-linked bank accounts.',
    nextInstallment: '19th Installment due in Nov 2025',
    status: 'Active • Enrolled',
    portalUrl: 'https://pmkisan.gov.in'
  },
  {
    id: 'pmfby',
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana) Crop Insurance',
    category: 'Insurance',
    icon: '🛡️',
    iconColor: '#047857',
    description: 'Comprehensive risk insurance coverage from pre-sowing to post-harvest against unpreventable natural risks, drought, pest attack & floods.',
    eligibility: 'All farmers growing notified crops in notified areas (both loanee and non-loanee farmers eligible).',
    benefits: 'Ultra-low premium: only 2% for Kharif crops, 1.5% for Rabi, and 5% for commercial/horticultural crops. Full claim settlement.',
    nextInstallment: 'Kharif Cut-off: 31st July',
    status: 'Enrollment Open',
    portalUrl: 'https://pmfby.gov.in'
  },
  {
    id: 'soil-health',
    name: 'Soil Health Card Scheme',
    category: 'Soil Health',
    icon: '🌱',
    iconColor: '#15803D',
    description: 'Issues customized soil health cards to farmers with crop-wise nutrient recommendations to reduce fertilizer wastage and improve farm yield.',
    eligibility: 'All farmers across Gujarat with agricultural land. Soil sample collected from field every 2 years.',
    benefits: 'Free 12-parameter soil testing (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC) + customized fertilizer dosage advisory.',
    nextInstallment: 'Cycle 3 Active across Rajkot district',
    status: 'Sample Tested (Optimal)',
    portalUrl: 'https://soilhealth.dac.gov.in'
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC) Scheme',
    category: 'Credit',
    icon: '💳',
    iconColor: '#D97706',
    description: 'Provides timely institutional credit to farmers for their cultivation and crop production needs without high moneylender interest.',
    eligibility: 'Individual/joint farmers, tenant farmers, oral lessees, sharecroppers, and SHG/JLG groups.',
    benefits: 'Revolving credit up to ₹3 Lakhs at subsidized 4% interest rate (with 3% prompt repayment incentive). Zero collateral up to ₹1.6 Lakhs.',
    nextInstallment: 'Pre-approved limit: ₹2,40,000',
    status: 'Pre-Approved',
    portalUrl: 'https://kcc.gov.in'
  },
  {
    id: 'subsidies',
    name: 'Agricultural Subsidies & Farm Mechanization (PM-KUSUM & Drip)',
    category: 'Subsidies',
    icon: '☀️',
    iconColor: '#F59E0B',
    description: 'Subsidies on solar agriculture pumps (PM-KUSUM Component-B), micro-irrigation systems, tractors, and rotary tillers.',
    eligibility: 'Farmers possessing agricultural electricity connection or un-electrified diesel pumps. Gujarat ikhedut portal registration.',
    benefits: 'Up to 75% subsidy on standalone solar water pumps; 70% subsidy on drip and sprinkler irrigation installations.',
    nextInstallment: 'Application Window open on iKhedut',
    status: 'Subsidy Sanctioned',
    portalUrl: 'https://ikhedut.gujarat.gov.in'
  }
];

const SchemesView = ({ setActiveTab, language }) => {
  const t = translations[language] || translations.en;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState(null);
  const [applySuccessMsg, setApplySuccessMsg] = useState(null);

  const categories = ['All', 'Direct Income', 'Insurance', 'Soil Health', 'Credit', 'Subsidies'];

  const filteredSchemes = SCHEMES_DATABASE.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.benefits.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();
    const schemeName = selectedSchemeForApply.name;
    setSelectedSchemeForApply(null);
    setApplySuccessMsg(t.applicationSubmitted ? t.applicationSubmitted.replace("{schemeName}", schemeName) : `Application for ${schemeName} submitted! Aadhaar verification initiated.`);
    setTimeout(() => setApplySuccessMsg(null), 4000);
  };

  return (
    <div className="where-to-sell-container">
      {/* Header */}
      <div className="where-header">
        <div>
          <span className="section-micro-tag">{t.govtDirectBenefit}</span>
          <h1>{t.govtAgriSchemes}</h1>
          <p>
            {t.govtAgriSchemesDesc}
          </p>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="schemes-filter-panel" style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '16px 20px',
        border: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Category Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat === "All" ? t.allCrops || "All" : cat === "Direct Income" ? t.catDirectIncome : cat === "Insurance" ? t.catInsurance : cat === "Soil Health" ? t.catSoilHealth : cat === "Credit" ? t.catCredit : cat === "Subsidies" ? t.catSubsidies : cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '7px 16px',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#10B981' : '#E5E7EB',
                background: selectedCategory === cat ? '#ECFDF5' : '#FFFFFF',
                color: selectedCategory === cat ? '#047857' : '#4B5563',
                transition: 'all 0.18s ease'
              }}
            >
              {cat === "All" ? t.allCrops || "All" : cat === "Direct Income" ? t.catDirectIncome : cat === "Insurance" ? t.catInsurance : cat === "Soil Health" ? t.catSoilHealth : cat === "Credit" ? t.catCredit : cat === "Subsidies" ? t.catSubsidies : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#F9FAF8',
          border: '1px solid #E5E7EB',
          borderRadius: '999px',
          padding: '8px 16px',
          minWidth: '240px'
        }}>
          <Search size={15} color="#9CA3AF" />
          <input
            type="text"
            placeholder={t.searchSchemesPH || "Search PM-KISAN, subsidy, KCC..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.86rem', width: '100%' }}
          />
        </div>
      </div>

      {/* Success Banner */}
      {applySuccessMsg && (
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          color: '#047857',
          padding: '12px 18px',
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} />
          <span>{applySuccessMsg}</span>
        </div>
      )}

      {/* Schemes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px'
      }}>
        {filteredSchemes.map((scheme) => (
          <div 
            key={scheme.id}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E5E7EB',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              transition: 'all 0.2s ease'
            }}
          >
            {/* Header: Icon, Name & Status */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#ECFDF5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  flexShrink: 0
                }}>
                  {scheme.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#17251C', lineHeight: '1.2' }}>
                    {scheme.name}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#647067', fontWeight: '600' }}>
                    {scheme.category}
                  </span>
                </div>
              </div>

              <span style={{
                background: '#ECFDF5',
                color: '#047857',
                padding: '3px 8px',
                borderRadius: '999px',
                fontSize: '0.68rem',
                fontWeight: '700',
                whiteSpace: 'nowrap'
              }}>
                {scheme.status}
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.84rem', color: '#4B5563', lineHeight: '1.5' }}>
              {scheme.description}
            </p>

            {/* Eligibility & Benefits Box */}
            <div style={{ background: '#F9FAF8', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#647067', textTransform: 'uppercase' }}>
                  {t.eligibilityLbl}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#17251C', lineHeight: '1.4' }}>
                  {scheme.eligibility}
                </span>
              </div>

              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#047857', textTransform: 'uppercase' }}>
                  {t.benefitsLbl}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#047857', lineHeight: '1.4' }}>
                  {scheme.benefits}
                </span>
              </div>
            </div>

            {/* Next Installment / Status Timeline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#647067' }}>
              <Calendar size={13} className="text-emerald-600" />
              <span>{scheme.nextInstallment}</span>
            </div>

            {/* Apply Action Button */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedSchemeForApply(scheme)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
                }}
              >
                <span>{t.applyCheckStatusBtn}</span>
                <ArrowRight size={14} />
              </button>

              <a
                href={scheme.portalUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: '#F3F4F6',
                  border: '1px solid #CBD5E1',
                  color: '#374151',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none'
                }}
                title={t.officialPortalBtn || "Official Portal"}
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Apply / Status Modal */}
      {selectedSchemeForApply && (
        <div className="modal-backdrop-overlay" onClick={() => setSelectedSchemeForApply(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3><ShieldCheck size={18} color="#10B981" />{t.applyForScheme ? t.applyForScheme.replace("{schemeName}", selectedSchemeForApply.name.split("(")[0]) : ` Apply for ${selectedSchemeForApply.name.split("(")[0]}`}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedSchemeForApply(null)}><X size={18} /></button>
            </div>

            <form onSubmit={handleApplySubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '12px', borderRadius: '10px', fontSize: '0.82rem', color: '#047857' }}>
                  <strong>{t.benefitLbl}</strong> {selectedSchemeForApply.benefits}
                </div>

                <div className="form-group">
                  <label>{t.aadhaarNumberLbl}</label>
                  <input type="text" placeholder="XXXX-XXXX-XXXX" defaultValue="4921-8274-1920" className="form-control" required />
                </div>

                <div className="form-group">
                  <label>{t.landRecordNumberLbl}</label>
                  <input type="text" placeholder="e.g. KH-48201/Rajkot" defaultValue="KH-48201/Rajkot" className="form-control" required />
                </div>

                <div className="form-group">
                  <label>{t.bankAccountNumberLbl}</label>
                  <input type="text" placeholder="Account Number" defaultValue="SBI-009827163810" className="form-control" required />
                </div>

                <div className="form-group">
                  <label>{t.mobileNumberLbl}</label>
                  <input type="tel" defaultValue="+91 98765-43210" className="form-control" required />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setSelectedSchemeForApply(null)}>{t.cancelBtn}</button>
                <button type="submit" className="btn-primary" style={{ background: '#10B981', borderColor: '#10B981' }}>
                  {t.submitEkycApplyBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemesView;
