// src/components/views/WhereShouldISell.jsx
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  ArrowUpRight, 
  Compass, 
  Truck, 
  CheckCircle2,
  DollarSign,
  RefreshCw,
  Scale
} from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/WhereShouldISell.css';

const WhereShouldISell = ({ setActiveTab }) => {
  const [crop, setCrop] = useState('Wheat');
  const [quantity, setQuantity] = useState(50); // quintals
  const [vehicleType, setVehicleType] = useState('Tractor Trolley');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await api.prices.getWhereToSell({
        cropName: crop,
        quantity: Number(quantity) || 50,
        vehicleType,
      });

      if (res?.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to get recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [crop, quantity, vehicleType]);

  const topRec = data?.topRecommendation;
  const comparisonList = data?.comparison || [];

  return (
    <div className="where-to-sell-container">
      {/* Header */}
      <div className="where-header">
        <div>
          <h1>Where Should I Sell? Decision Engine</h1>
          <p>Multi-Mandi comparison calculating distance, fuel cost, APMC cess, and true net in-hand profit</p>
        </div>
        <button className="btn-refresh" onClick={fetchRecommendations}>
          <RefreshCw size={15} />
          <span>Recalculate</span>
        </button>
      </div>

      {/* Filter Parameters Card */}
      <div className="where-filter-card">
        <div className="where-filters-row">
          <div className="where-filter-box">
            <label>Crop / Commodity</label>
            <select 
              value={crop} 
              onChange={(e) => setCrop(e.target.value)}
              className="radar-select"
            >
              <option value="Wheat">🌾 Wheat (Ghau)</option>
              <option value="Cotton">☁️ Cotton (Kapas)</option>
              <option value="Groundnut">🥜 Groundnut (Magfali)</option>
              <option value="Tomato">🍅 Tomato (Tameta)</option>
              <option value="Onion">🧅 Onion (Dungri)</option>
              <option value="Potato">🥔 Potato (Batata)</option>
            </select>
          </div>

          <div className="where-filter-box">
            <label>Produce Quantity (Quintals)</label>
            <input 
              type="number" 
              min="1"
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)}
              className="radar-input"
            />
          </div>

          <div className="where-filter-box">
            <label>Transport Vehicle</label>
            <select 
              value={vehicleType} 
              onChange={(e) => setVehicleType(e.target.value)}
              className="radar-select"
            >
              <option value="Tractor Trolley">Tractor Trolley (Up to 70 qtl)</option>
              <option value="Mini Tempo (3 Wheeler)">Mini Tempo (Up to 30 qtl)</option>
              <option value="Medium Truck (7-10 Ton)">Medium Truck (Up to 100 qtl)</option>
              <option value="Large Truck (16 Ton)">Large Truck (Up to 160 qtl)</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <RefreshCw size={28} className="spin-anim" />
          <p>Running multi-mandi geospatial logistics & profit simulation...</p>
        </div>
      ) : topRec ? (
        <>
          {/* Top Recommendation Banner */}
          <div className="top-mandi-highlight-card">
            <div className="badge-ribbon">
              <Award size={18} />
              <span>#1 Top Net Profit Recommendation</span>
            </div>

            <div className="top-mandi-main">
              <div>
                <h2>{topRec.market}</h2>
                <p className="location-line">
                  <MapPin size={16} />
                  <span>District {topRec.district}, {topRec.state} ({topRec.distanceKm} km from your farm)</span>
                </p>
              </div>

              <div className="top-mandi-hero-num">
                <span className="hero-num-label">Estimated Net In-Hand Profit</span>
                <div className="hero-num-val">
                  ₹ {topRec.netProfit?.toLocaleString('en-IN')}
                </div>
                <div className="gain-callout">
                  +{data.potentialGain ? `₹${data.potentialGain.toLocaleString('en-IN')} extra profit` : 'Best yield'} vs furthest/lowest market
                </div>
              </div>
            </div>

            <div className="top-mandi-breakdown-row">
              <div className="breakdown-stat">
                <span>Modal Mandi Rate</span>
                <strong>₹ {topRec.modalPrice} / qtl</strong>
              </div>
              <div className="breakdown-stat">
                <span>Round-Trip Fuel</span>
                <strong className="text-red">- ₹ {topRec.transportCost?.toLocaleString('en-IN')}</strong>
              </div>
              <div className="breakdown-stat">
                <span>APMC Cess (1.5%)</span>
                <strong className="text-red">- ₹ {topRec.apmcCess?.toLocaleString('en-IN')}</strong>
              </div>
              <div className="breakdown-stat">
                <span>Net Received Per Qtl</span>
                <strong className="text-emerald">₹ {topRec.netInHandPerQuintal} / qtl</strong>
              </div>
            </div>
          </div>

          {/* All Mandis Comparison Table */}
          <div className="comparison-table-card">
            <div className="comp-header">
              <h3>All Surrounding Mandis Ranked by Net Profit</h3>
              <p>Factoring distance, fuel expenditure, and local APMC cess</p>
            </div>

            <div className="comp-table-wrap">
              <table className="comp-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Mandi Market</th>
                    <th>Distance</th>
                    <th>Mandi Price</th>
                    <th>Logistics Cost</th>
                    <th>Net In-Hand Profit</th>
                    <th>Net / Quintal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonList.map((m, idx) => (
                    <tr key={m.id || idx} className={idx === 0 ? 'top-row-highlight' : ''}>
                      <td>
                        <span className={`rank-pill ${idx === 0 ? 'rank-1' : ''}`}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td>
                        <strong>{m.market}</strong>
                        <div className="dist-sub">{m.district}</div>
                      </td>
                      <td>{m.distanceKm} km</td>
                      <td>₹ {m.modalPrice}/qtl</td>
                      <td className="text-red">₹ {m.transportCost?.toLocaleString('en-IN')}</td>
                      <td>
                        <strong className="text-emerald">₹ {m.netProfit?.toLocaleString('en-IN')}</strong>
                      </td>
                      <td>
                        <strong>₹ {m.netInHandPerQuintal}</strong>
                      </td>
                      <td>
                        <button 
                          className="btn-sell-here"
                          onClick={() => setActiveTab('profit-calculator')}
                        >
                          Detailed Calc →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default WhereShouldISell;
