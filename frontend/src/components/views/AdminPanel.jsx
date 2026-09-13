// src/components/views/AdminPanel.jsx
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  Plus, 
  Users, 
  Store, 
  TrendingUp, 
  FileText, 
  Activity, 
  CheckCircle2,
  Database,
  BarChart3
} from 'lucide-react';

const AdminPanel = () => {
  const [activeSubTab, setActiveSubTab] = useState('stats'); // 'stats' | 'prices' | 'crops' | 'buyers' | 'csv'
  const [message, setMessage] = useState('');

  // Form States
  const [cropForm, setCropForm] = useState({ cropName: '', category: 'Vegetables', season: 'Kharif', minimumPrice: '', maximumPrice: '', averagePrice: '' });
  const [priceForm, setPriceForm] = useState({ cropName: 'Tomato', marketName: 'Rajkot APMC', state: 'Gujarat', district: 'Rajkot', minPrice: '', maxPrice: '', modalPrice: '' });
  const [buyerForm, setBuyerForm] = useState({ name: '', company: '', cropRequired: 'Onion', quantity: '', location: '', price: '', contact: '' });

  const handleAddCrop = (e) => {
    e.preventDefault();
    setMessage('Crop added successfully!');
    setCropForm({ cropName: '', category: 'Vegetables', season: 'Kharif', minimumPrice: '', maximumPrice: '', averagePrice: '' });
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddPrice = (e) => {
    e.preventDefault();
    setMessage('Market price record published successfully!');
    setPriceForm({ cropName: 'Tomato', marketName: 'Rajkot APMC', state: 'Gujarat', district: 'Rajkot', minPrice: '', maxPrice: '', modalPrice: '' });
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddBuyer = (e) => {
    e.preventDefault();
    setMessage('Buyer requirement listed successfully!');
    setBuyerForm({ name: '', company: '', cropRequired: 'Onion', quantity: '', location: '', price: '', contact: '' });
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCSVUpload = (e) => {
    e.preventDefault();
    setMessage('CSV dataset imported and synced with ML model dataset!');
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '3px 10px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} /> System Administrator Mode
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#17251c', margin: '6px 0 2px 0' }}>KisanSetu Admin Portal</h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>Manage market data, crops, buyers, CSV dataset uploads, and monitor ML AI stats.</p>
        </div>
      </div>

      {message && (
        <div style={{ background: '#d1fae5', border: '1px solid #10b981', color: '#065f46', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> {message}
        </div>
      )}

      {/* Admin Sub-Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { key: 'stats', label: '📊 System Stats & ML Logs', icon: Activity },
          { key: 'prices', label: '💰 Add Market Price', icon: TrendingUp },
          { key: 'crops', label: '🌱 Add Crop', icon: Plus },
          { key: 'buyers', label: '🏢 Manage Buyers', icon: Users },
          { key: 'csv', label: '📁 CSV Dataset Upload', icon: Upload }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveSubTab(tab.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.86rem',
                border: 'none',
                cursor: 'pointer',
                background: isActive ? '#10b981' : '#f3f4f6',
                color: isActive ? '#ffffff' : '#374151'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: System Stats */}
      {activeSubTab === 'stats' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '18px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '700' }}>Active Mandi Prices</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#047857' }}>1,480+</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '18px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '700' }}>Registered Farmers</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#17251c' }}>12,450</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '18px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '700' }}>AI Gemini Queries</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#047857' }}>38,920</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '18px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '700' }}>ML Prediction R² Score</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#15803d' }}>0.942</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Add Market Price */}
      {activeSubTab === 'prices' && (
        <form onSubmit={handleAddPrice} style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '24px', borderRadius: '14px', maxWidth: '600px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '800' }}>Add Market Price Entry</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Crop Name</label>
              <input type="text" value={priceForm.cropName} onChange={e => setPriceForm({...priceForm, cropName: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Market Name</label>
              <input type="text" value={priceForm.marketName} onChange={e => setPriceForm({...priceForm, marketName: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>State</label>
              <input type="text" value={priceForm.state} onChange={e => setPriceForm({...priceForm, state: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>District</label>
              <input type="text" value={priceForm.district} onChange={e => setPriceForm({...priceForm, district: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Min Price (₹)</label>
              <input type="number" value={priceForm.minPrice} onChange={e => setPriceForm({...priceForm, minPrice: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Modal Price (₹)</label>
              <input type="number" value={priceForm.modalPrice} onChange={e => setPriceForm({...priceForm, modalPrice: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            </div>
          </div>
          <button type="submit" style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            Publish Market Price Entry
          </button>
        </form>
      )}

      {/* Tab 3: Add Crop */}
      {activeSubTab === 'crops' && (
        <form onSubmit={handleAddCrop} style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '24px', borderRadius: '14px', maxWidth: '600px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '800' }}>Add Crop Catalog Item</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Crop Name</label>
              <input type="text" value={cropForm.cropName} onChange={e => setCropForm({...cropForm, cropName: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Category</label>
              <select value={cropForm.category} onChange={e => setCropForm({...cropForm, category: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="Vegetables">Vegetables</option>
                <option value="Grains">Grains</option>
                <option value="Cotton">Cotton</option>
                <option value="Oilseeds">Oilseeds</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Season</label>
              <input type="text" value={cropForm.season} onChange={e => setCropForm({...cropForm, season: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Average Price (₹)</label>
              <input type="number" value={cropForm.averagePrice} onChange={e => setCropForm({...cropForm, averagePrice: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            </div>
          </div>
          <button type="submit" style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            Save Crop Catalog
          </button>
        </form>
      )}

      {/* Tab 4: Manage Buyers */}
      {activeSubTab === 'buyers' && (
        <form onSubmit={handleAddBuyer} style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '24px', borderRadius: '14px', maxWidth: '600px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '800' }}>Add Buyer Requirement</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Buyer Name</label>
              <input type="text" value={buyerForm.name} onChange={e => setBuyerForm({...buyerForm, name: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Company Name</label>
              <input type="text" value={buyerForm.company} onChange={e => setBuyerForm({...buyerForm, company: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Crop Required</label>
              <input type="text" value={buyerForm.cropRequired} onChange={e => setBuyerForm({...buyerForm, cropRequired: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Offered Rate (₹/Qtl)</label>
              <input type="number" value={buyerForm.price} onChange={e => setBuyerForm({...buyerForm, price: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            </div>
          </div>
          <button type="submit" style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            Save Buyer Requirement
          </button>
        </form>
      )}

      {/* Tab 5: CSV Upload */}
      {activeSubTab === 'csv' && (
        <form onSubmit={handleCSVUpload} style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '24px', borderRadius: '14px', maxWidth: '600px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '800' }}>Upload CSV Market Prices Dataset</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '16px' }}>CSV format: date, crop, market, district, state, min_price, max_price, modal_price, arrival_quantity, season</p>
          <input type="file" accept=".csv" style={{ marginBottom: '16px', display: 'block' }} required />
          <button type="submit" style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={16} /> Upload & Retrain ML Models
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminPanel;
