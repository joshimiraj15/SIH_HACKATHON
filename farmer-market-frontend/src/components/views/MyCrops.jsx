// src/components/views/MyCrops.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowRight, 
  RefreshCw,
  Trash2,
  MapPin,
  Store,
  CheckCircle,
  Tag,
  Package
} from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/MyCrops.css';

const MyCrops = ({ setIsAddCropOpen, setActiveTab, showToast }) => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCrops = async () => {
    try {
      setLoading(true);
      const res = await api.crops.getMyListings();
      if (res?.data) {
        setCrops(res.data);
      }
    } catch (err) {
      console.error('Failed to load my crops:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCrops();
  }, []);

  const handleDeleteCrop = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove listing '${name}'?`)) return;
    try {
      const res = await api.crops.delete(id);
      if (res.success) {
        if (showToast) showToast(`Produce listing '${name}' removed.`);
        fetchMyCrops();
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to remove listing');
    }
  };

  return (
    <div className="my-crops-container">
      {/* Header */}
      <div className="my-crops-header">
        <div>
          <h1>My Farm Produce Inventory</h1>
          <p>Manage your harvest listings, set selling prices, and monitor buyer demand</p>
        </div>

        <div className="my-crops-actions">
          <button className="btn-refresh" onClick={fetchMyCrops}>
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button 
            className="add-crop-btn"
            onClick={() => setIsAddCropOpen(true)}
          >
            <Plus size={18} />
            <span>List New Produce</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <RefreshCw size={28} className="spin-anim" />
          <p>Loading your farm listings...</p>
        </div>
      ) : crops.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <h3>No crop produce listed yet</h3>
          <p>List your harvested or standing crops to receive offers directly from institutional buyers and mandis.</p>
          <button 
            className="add-crop-btn" 
            onClick={() => setIsAddCropOpen(true)}
            style={{ marginTop: '16px' }}
          >
            <Plus size={18} />
            <span>List First Produce Batch</span>
          </button>
        </div>
      ) : (
        <div className="crops-grid-row">
          {crops.map((crop) => (
            <div key={crop._id} className="crop-card">
              <div className="crop-card-img-wrap">
                <img 
                  src={crop.images?.[0] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80'} 
                  alt={crop.cropName} 
                  className="crop-card-img" 
                />
                <span className="quality-pill">{crop.qualityGrade || 'Grade A'}</span>
                {crop.isOrganic && <span className="organic-pill">Organic</span>}
              </div>

              <div className="crop-card-body">
                <div className="crop-card-title-line">
                  <div>
                    <div className="crop-name-title">{crop.cropName}</div>
                    <div className="crop-qty-label">{crop.variety}</div>
                  </div>
                  <button 
                    className="btn-delete-crop"
                    onClick={() => handleDeleteCrop(crop._id, crop.cropName)}
                    title="Remove listing"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="crop-price-row">
                  <div className="crop-price-val">
                    ₹ {crop.pricePerUnit} <span>/ {crop.unit}</span>
                  </div>
                  <span className="stock-tag">
                    {crop.quantity} {crop.unit} in stock
                  </span>
                </div>

                <div className="crop-loc-tag">
                  <MapPin size={13} />
                  <span>{crop.location?.district || 'Rajkot'}, {crop.location?.state || 'Gujarat'}</span>
                </div>

                <div className="crop-card-footer-btns">
                  <button 
                    className="btn-check-best-mandi"
                    onClick={() => setActiveTab('where-should-i-sell')}
                  >
                    <span>Check Best Mandi</span>
                    <ArrowRight size={13} />
                  </button>
                  <button 
                    className="btn-view-offers"
                    onClick={() => setActiveTab('offers')}
                  >
                    View Bids
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCrops;
