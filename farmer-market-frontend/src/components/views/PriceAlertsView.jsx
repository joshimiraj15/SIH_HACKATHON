// src/components/views/PriceAlertsView.jsx
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/PriceAlerts.css';

const PriceAlertsView = ({ showToast }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [cropName, setCropName] = useState('Wheat');
  const [market, setMarket] = useState('All Mandis');
  const [condition, setCondition] = useState('above');
  const [targetPrice, setTargetPrice] = useState(2450);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.alerts.getAll();
      if (res?.data) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch price alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      const res = await api.alerts.create({
        cropName,
        market,
        condition,
        targetPrice: Number(targetPrice),
      });

      if (res.success) {
        if (showToast) showToast(res.message);
        setIsCreating(false);
        fetchAlerts();
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to create price alert');
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await api.alerts.toggle(id);
      if (res.success) {
        if (showToast) showToast(res.message);
        fetchAlerts();
      }
    } catch (err) {
      if (showToast) showToast(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.alerts.delete(id);
      if (res.success) {
        if (showToast) showToast('Price alert removed');
        fetchAlerts();
      }
    } catch (err) {
      if (showToast) showToast(err.message);
    }
  };

  return (
    <div className="price-alerts-container">
      <div className="view-header-strip">
        <div>
          <h2>Smart Mandi Price Monitors & Alerts</h2>
          <p>Get instant notifications when commodities cross your desired profit price threshold</p>
        </div>
        <button className="btn-primary" onClick={() => setIsCreating(!isCreating)}>
          <Plus size={16} />
          <span>{isCreating ? 'Close Form' : 'Set New Price Alert'}</span>
        </button>
      </div>

      {/* Creation Form */}
      {isCreating && (
        <form className="create-alert-card" onSubmit={handleCreateAlert}>
          <h3>Set Custom Mandi Price Trigger</h3>
          <div className="alert-form-grid">
            <div className="form-field">
              <label>Crop / Commodity:</label>
              <select value={cropName} onChange={(e) => setCropName(e.target.value)}>
                <option value="Wheat">Wheat</option>
                <option value="Cotton">Cotton</option>
                <option value="Groundnut">Groundnut</option>
                <option value="Tomato">Tomato</option>
                <option value="Onion">Onion</option>
                <option value="Potato">Potato</option>
                <option value="Cumin">Cumin (Jeera)</option>
              </select>
            </div>

            <div className="form-field">
              <label>Target Mandi:</label>
              <select value={market} onChange={(e) => setMarket(e.target.value)}>
                <option value="All Mandis">All Mandis</option>
                <option value="Gondal Mandi">Gondal Mandi</option>
                <option value="Rajkot APMC">Rajkot APMC</option>
                <option value="Unjha Mandi">Unjha Mandi</option>
                <option value="Surat APMC">Surat APMC</option>
                <option value="Lasalgaon APMC">Lasalgaon APMC</option>
              </select>
            </div>

            <div className="form-field">
              <label>Notify me when price goes:</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                <option value="above">Above (≥)</option>
                <option value="below">Below (≤)</option>
              </select>
            </div>

            <div className="form-field">
              <label>Target Price (₹ / quintal):</label>
              <input 
                type="number" 
                min="100" 
                value={targetPrice} 
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                required 
              />
            </div>
          </div>

          <div className="form-actions-row">
            <button type="submit" className="btn-save-alert">
              Activate Price Monitor
            </button>
            <button type="button" className="btn-cancel" onClick={() => setIsCreating(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Alerts Grid */}
      {loading ? (
        <div className="loading-state">
          <RefreshCw size={28} className="spin-anim" />
          <p>Loading active monitors...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="empty-state">
          <Bell size={48} />
          <h3>No price alerts configured</h3>
          <p>Set an alert above to get notified when crop prices rise in your target mandis.</p>
        </div>
      ) : (
        <div className="alerts-grid">
          {alerts.map((alert) => (
            <div key={alert._id} className={`alert-card ${alert.isTriggered ? 'triggered-border' : ''}`}>
              <div className="alert-card-header">
                <div>
                  <span className="crop-tag">{alert.cropName}</span>
                  <h4 className="alert-title">
                    {alert.condition === 'above' ? 'Crosses Above' : 'Drops Below'} ₹{alert.targetPrice}/qtl
                  </h4>
                </div>
                <div className="alert-header-icons">
                  <button 
                    className="btn-toggle-icon" 
                    onClick={() => handleToggle(alert._id)}
                    title={alert.isActive ? 'Pause monitor' : 'Resume monitor'}
                  >
                    {alert.isActive ? <ToggleRight size={26} className="text-emerald" /> : <ToggleLeft size={26} className="text-muted" />}
                  </button>
                  <button 
                    className="btn-delete-icon" 
                    onClick={() => handleDelete(alert._id)}
                    title="Delete alert"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="alert-meta-line">
                <span>Target Mandi: <strong>{alert.market}</strong></span>
                <span>Current Price: <strong>₹{alert.currentPrice || '2,450'}/qtl</strong></span>
              </div>

              <div className="alert-status-footer">
                {alert.isTriggered ? (
                  <span className="status-badge-triggered">
                    <CheckCircle size={14} /> Triggered & Active
                  </span>
                ) : (
                  <span className="status-badge-monitoring">
                    <Bell size={14} /> Actively Monitoring
                  </span>
                )}
                <span className="notification-type-tag">SMS & In-App</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceAlertsView;
