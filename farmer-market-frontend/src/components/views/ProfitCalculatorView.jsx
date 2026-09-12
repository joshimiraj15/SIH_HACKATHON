// src/components/views/ProfitCalculatorView.jsx
import React, { useState } from 'react';
import { 
  Calculator, 
  Truck, 
  Fuel, 
  DollarSign, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';
import '../../styles/ProfitCalculator.css';

const ProfitCalculatorView = ({ setActiveTab }) => {
  const [crop, setCrop] = useState('Wheat');
  const [quantityQuintals, setQuantityQuintals] = useState(60);
  const [expectedPricePerQtl, setExpectedPricePerQtl] = useState(2440);
  const [distanceKm, setDistanceKm] = useState(35);
  const [vehicle, setVehicle] = useState('Tractor Trolley');
  const [dieselPrice, setDieselPrice] = useState(90);

  const vehicleOptions = [
    { name: 'Tractor Trolley', baseRatePerKm: 18, capacity: 'Up to 70 Quintals' },
    { name: 'Mini Tempo (3 Wheeler)', baseRatePerKm: 14, capacity: 'Up to 30 Quintals' },
    { name: 'Medium Truck (7-10 Ton)', baseRatePerKm: 28, capacity: 'Up to 100 Quintals' },
    { name: 'Large 10-Wheeler Truck', baseRatePerKm: 42, capacity: 'Up to 160 Quintals' },
  ];

  const selectedVehicleObj = vehicleOptions.find((v) => v.name === vehicle) || vehicleOptions[0];

  // Calculations
  const grossRevenue = quantityQuintals * expectedPricePerQtl;
  const transportCost = Math.round(distanceKm * 2 * selectedVehicleObj.baseRatePerKm);
  const apmcMandiCess = Math.round(grossRevenue * 0.015); // 1.5% APMC market fee
  const loadingCharges = quantityQuintals * 8; // ₹8/qtl
  const packagingCost = quantityQuintals * 12; // ₹12/qtl bags/stitching
  const totalExpenses = transportCost + apmcMandiCess + loadingCharges + packagingCost;

  const netInHandProfit = grossRevenue - totalExpenses;
  const netInHandPerQuintal = Math.round(netInHandProfit / (quantityQuintals || 1));
  const expensePercentage = ((totalExpenses / (grossRevenue || 1)) * 100).toFixed(1);

  return (
    <div className="profit-calculator-container">
      <div className="calc-header-strip">
        <div>
          <h2>Farmer Net In-Hand Profit & Logistics Calculator</h2>
          <p>Deduct transport fuel, APMC cess, handling, and packaging to find your true farm-gate margin</p>
        </div>
      </div>

      <div className="calc-main-layout">
        {/* Input Parameters Panel */}
        <div className="calc-form-card">
          <h3>1. Crop & Production Parameters</h3>
          
          <div className="form-group-row">
            <div className="form-field">
              <label>Crop / Commodity:</label>
              <select value={crop} onChange={(e) => setCrop(e.target.value)}>
                <option value="Wheat">Wheat (Ghau)</option>
                <option value="Cotton">Cotton (Kapas)</option>
                <option value="Groundnut">Groundnut (Magfali)</option>
                <option value="Tomato">Tomato (Tameta)</option>
                <option value="Onion">Onion (Dungri)</option>
                <option value="Potato">Potato (Batata)</option>
                <option value="Cumin">Cumin (Jeera)</option>
              </select>
            </div>

            <div className="form-field">
              <label>Expected Produce Quantity (Quintals):</label>
              <input 
                type="number" 
                min="1" 
                value={quantityQuintals} 
                onChange={(e) => setQuantityQuintals(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-field">
            <label>Expected Mandi Sale Price (₹ per Quintal):</label>
            <div className="slider-with-input">
              <input 
                type="range" 
                min="1000" 
                max="30000" 
                step="20"
                value={expectedPricePerQtl} 
                onChange={(e) => setExpectedPricePerQtl(Number(e.target.value))} 
              />
              <span className="slider-val-tag">₹ {expectedPricePerQtl}</span>
            </div>
          </div>

          <h3 style={{ marginTop: '24px' }}>2. Transport & Distance</h3>

          <div className="form-group-row">
            <div className="form-field">
              <label>Distance to Mandi (km one-way):</label>
              <input 
                type="number" 
                min="1" 
                max="500" 
                value={distanceKm} 
                onChange={(e) => setDistanceKm(Number(e.target.value))}
              />
            </div>

            <div className="form-field">
              <label>Transport Vehicle:</label>
              <select value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
                {vehicleOptions.map((v) => (
                  <option key={v.name} value={v.name}>{v.name} ({v.capacity})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>Diesel Benchmark Rate (₹ / Litre):</label>
            <input 
              type="number" 
              value={dieselPrice} 
              onChange={(e) => setDieselPrice(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Results & Breakdown Card */}
        <div className="calc-summary-card">
          <div className="summary-title">Financial Breakdown</div>

          <div className="net-profit-hero">
            <span className="net-label">Total Net In-Hand Earnings</span>
            <div className="net-amount">₹ {netInHandProfit.toLocaleString('en-IN')}</div>
            <div className="net-per-qtl">
              ₹ {netInHandPerQuintal} / quintal net received
            </div>
          </div>

          <div className="breakdown-list">
            <div className="breakdown-item">
              <span>Gross Market Value ({quantityQuintals} qtl × ₹{expectedPricePerQtl})</span>
              <strong className="text-emerald">+ ₹ {grossRevenue.toLocaleString('en-IN')}</strong>
            </div>

            <div className="breakdown-item">
              <span><Truck size={14} /> Round-trip Logistics ({distanceKm * 2} km)</span>
              <strong className="text-red">- ₹ {transportCost.toLocaleString('en-IN')}</strong>
            </div>

            <div className="breakdown-item">
              <span><Scale size={14} /> APMC Market Cess (1.5%)</span>
              <strong className="text-red">- ₹ {apmcMandiCess.toLocaleString('en-IN')}</strong>
            </div>

            <div className="breakdown-item">
              <span>Handling & Unloading (₹8/qtl)</span>
              <strong className="text-red">- ₹ {loadingCharges.toLocaleString('en-IN')}</strong>
            </div>

            <div className="breakdown-item">
              <span>Gunny Bags Packaging (₹12/qtl)</span>
              <strong className="text-red">- ₹ {packagingCost.toLocaleString('en-IN')}</strong>
            </div>

            <div className="breakdown-total">
              <span>Total Logistics & Overhead Deductions</span>
              <strong className="text-red">₹ {totalExpenses.toLocaleString('en-IN')} ({expensePercentage}%)</strong>
            </div>
          </div>

          <button 
            className="btn-where-sell-cta"
            onClick={() => setActiveTab('where-should-i-sell')}
          >
            <span>Run Multi-Mandi Comparison</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfitCalculatorView;
