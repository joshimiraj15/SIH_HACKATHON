// src/components/views/CropAdvisoryView.jsx
import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  ShieldAlert, 
  Droplets, 
  Bug, 
  FlaskConical, 
  CheckCircle2, 
  RefreshCw,
  Search
} from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/CropAdvisory.css';

const CropAdvisoryView = () => {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const crops = ['All', 'Wheat', 'Cotton', 'Tomato', 'Groundnut'];
  const categories = ['All', 'Disease', 'Pest Control', 'Fertilizer & Nutrition', 'Irrigation'];

  const fetchAdvisories = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCrop !== 'All') params.cropName = selectedCrop;
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const res = await api.advisory.getAll(params);
      if (res?.data) {
        setAdvisories(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch advisories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisories();
  }, [selectedCrop, selectedCategory]);

  return (
    <div className="crop-advisory-container">
      <div className="view-header-strip">
        <div>
          <h2>Agricultural Crop Advisory & Disease Identification</h2>
          <p>Scientific pest diagnosis, organic remedies, and ICAR-approved chemical treatment dosages</p>
        </div>
        <button className="btn-refresh" onClick={fetchAdvisories}>
          <RefreshCw size={15} />
          <span>Refresh Advisories</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="advisory-filter-bar">
        <div className="filter-group">
          <label>Crop:</label>
          <div className="chips-list">
            {crops.map((c) => (
              <button 
                key={c}
                className={`filter-chip ${selectedCrop === c ? 'active' : ''}`}
                onClick={() => setSelectedCrop(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Category:</label>
          <div className="chips-list">
            {categories.map((cat) => (
              <button 
                key={cat}
                className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advisories Grid */}
      {loading ? (
        <div className="loading-state">
          <RefreshCw size={28} className="spin-anim" />
          <p>Loading agricultural guides...</p>
        </div>
      ) : advisories.length === 0 ? (
        <div className="empty-state">
          <Sprout size={48} />
          <h3>No advisories found for current filter</h3>
          <p>Select another crop or category to explore pest and disease management.</p>
        </div>
      ) : (
        <div className="advisories-grid">
          {advisories.map((adv) => (
            <div key={adv._id} className="advisory-card">
              <div className="advisory-card-header">
                <div className="adv-tags">
                  <span className="adv-crop-badge">🌱 {adv.cropName}</span>
                  <span className="adv-category-badge">{adv.category}</span>
                </div>
                <span className={`severity-tag severity-${adv.severity?.toLowerCase()}`}>
                  <ShieldAlert size={13} /> {adv.severity} Severity
                </span>
              </div>

              <h3 className="adv-title">{adv.title}</h3>
              <span className="adv-season-meta">Stage: <strong>{adv.stage}</strong> | Season: <strong>{adv.season}</strong></span>

              {/* Symptoms */}
              <div className="symptoms-section">
                <h4>Observed Symptoms:</h4>
                <ul>
                  {adv.symptoms?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Solutions Grid */}
              <div className="solutions-grid">
                {adv.organicSolution && (
                  <div className="solution-box organic-box">
                    <div className="sol-header">
                      <Sprout size={16} className="text-emerald" />
                      <strong>Organic / Biological Solution:</strong>
                    </div>
                    <p>{adv.organicSolution}</p>
                  </div>
                )}

                {adv.chemicalSolution && (
                  <div className="solution-box chemical-box">
                    <div className="sol-header">
                      <FlaskConical size={16} className="text-blue" />
                      <strong>Recommended Chemical Control:</strong>
                    </div>
                    <p>{adv.chemicalSolution}</p>
                    {adv.recommendedDosage && (
                      <div className="dosage-tag">
                        <strong>Dosage:</strong> {adv.recommendedDosage}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropAdvisoryView;
