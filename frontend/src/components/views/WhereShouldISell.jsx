// src/components/views/WhereShouldISell.jsx
import React, { useState } from 'react';
import { translations } from '../../data/translations';
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
  Loader2,
  Calendar,
  Layers,
  ArrowRight,
  Flame,
  Percent
} from 'lucide-react';
import '../../styles/WhereShouldISell.css';

const WhereShouldISell = ({ setActiveTab, showToast, language }) => {
  const t = translations[language] || translations.en;
  const [crop, setCrop] = useState('Wheat');
  const [quantity, setQuantity] = useState('50'); // Quintals
  const [unit, setUnit] = useState('Quintals');
  const [location, setLocation] = useState('Rajkot');
  const [expectedDate, setExpectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);

  // Dynamic recommendation engine based on user inputs
  const cropMultipliers = {
    Wheat: { price: 2610, unit: 'Qtl' },
    Cotton: { price: 7450, unit: 'Qtl' },
    Groundnut: { price: 6180, unit: 'Qtl' },
    Tomato: { price: 2150, unit: 'Qtl' },
    Onion: { price: 2350, unit: 'Qtl' },
    Potato: { price: 1920, unit: 'Qtl' }
  };

  const getRecommendations = () => {
    const baseRate = cropMultipliers[crop]?.price || 2500;
    const qtyNum = parseFloat(quantity) || 50;

    return [
      {
        id: 1,
        marketName: 'Rajkot APMC Mega Yard',
        city: 'Rajkot',
        distance: 14,
        currentPrice: baseRate,
        estimatedRevenue: Math.round(baseRate * qtyNum),
        transportCost: 850,
        netProfit: Math.round(baseRate * qtyNum) - 850,
        demandLevel: 'High',
        recommendationScore: 98,
        isBest: true,
        reason: 'Lowest logistics cost, highest price discovery index'
      },
      {
        id: 2,
        marketName: 'Gondal APMC Market',
        city: 'Gondal',
        distance: 38,
        currentPrice: Math.round(baseRate * 0.98),
        estimatedRevenue: Math.round(baseRate * 0.98 * qtyNum),
        transportCost: 1450,
        netProfit: Math.round(baseRate * 0.98 * qtyNum) - 1450,
        demandLevel: 'High',
        recommendationScore: 91,
        isBest: false,
        reason: 'Strong oilseeds & grains procurement center'
      },
      {
        id: 3,
        marketName: 'Junagadh APMC Yard',
        city: 'Junagadh',
        distance: 102,
        currentPrice: Math.round(baseRate * 0.96),
        estimatedRevenue: Math.round(baseRate * 0.96 * qtyNum),
        transportCost: 3200,
        netProfit: Math.round(baseRate * 0.96 * qtyNum) - 3200,
        demandLevel: 'Medium',
        recommendationScore: 84,
        isBest: false,
        reason: 'Consistent daily auctions for Saurashtra farmers'
      },
      {
        id: 4,
        marketName: 'Ahmedabad Jamalpur Yard',
        city: 'Ahmedabad',
        distance: 215,
        currentPrice: Math.round(baseRate * 1.02),
        estimatedRevenue: Math.round(baseRate * 1.02 * qtyNum),
        transportCost: 6500,
        netProfit: Math.round(baseRate * 1.02 * qtyNum) - 6500,
        demandLevel: 'High',
        recommendationScore: 78,
        isBest: false,
        reason: 'Higher rate but freight costs reduce net profit'
      }
    ];
  };

  const [recommendations, setRecommendations] = useState(getRecommendations());

  const handleCalculate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setRecommendations(getRecommendations());
      setLoading(false);
    }, 450);
  };

  return (
    <div className="where-to-sell-container">
      {/* Header */}
      <div className="where-header">
        <div>
          <span className="section-micro-tag">{t.intelPriceOpt}</span>
          <h1>{t.whereToSellTitleAlt}</h1>
          <p>{t.whereToSellDesc}</p>
        </div>
      </div>

      {/* Input Selection Form Card */}
      <form onSubmit={handleCalculate} className="where-filter-card">
        <div className="where-filters-row">
          {/* Crop Selector */}
          <div className="where-filter-box">
            <label>{t.cropCommodityLbl}</label>
            <select 
              value={crop} 
              onChange={(e) => setCrop(e.target.value)}
              className="radar-select"
            >
              {t.cropOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="where-filter-box">
            <label>{t.harvestQtyLbl}</label>
            <input 
              type="number" 
              min="1"
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)}
              className="radar-input"
              placeholder="e.g. 50"
            />
          </div>

          {/* Location */}
          <div className="where-filter-box">
            <label>{t.farmLocationLbl}</label>
            <select 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              className="radar-select"
            >
              <option value="Rajkot">Rajkot, Gujarat</option>
              <option value="Gondal">Gondal, Gujarat</option>
              <option value="Junagadh">Junagadh, Gujarat</option>
              <option value="Morbi">Morbi, Gujarat</option>
              <option value="Jamnagar">Jamnagar, Gujarat</option>
              <option value="Ahmedabad">Ahmedabad, Gujarat</option>
              <option value="Surat">Surat, Gujarat</option>
            </select>
          </div>

          {/* Expected Selling Date */}
          <div className="where-filter-box">
            <label>{t.expectedSellDateLbl}</label>
            <input 
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              className="radar-input"
            />
          </div>
        </div>

        <button type="submit" className="where-find-btn" disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Compass size={16} />}
          <span>{loading ? t.analyzingMandis : t.calcBestMandi}</span>
        </button>
      </form>

      {/* Recommendations Cards Grid */}
      <div className="recommendations-container">
        <div className="recommendations-header-bar">
          <div>
            <h2 className="rec-section-title">{t.recommendedMarkets ? t.recommendedMarkets.replace("{qty}", quantity).replace("{crop}", crop) : `Recommended Markets for ${quantity} Qtl ${crop}`}</h2>
            <p className="rec-section-sub">{t.sellingAround ? t.sellingAround.replace("{date}", expectedDate).replace("{location}", location) : `Selling around ${expectedDate} from ${location} farm gate`}</p>
          </div>
          <span className="results-count-badge">{t.mandisEvaluated ? t.mandisEvaluated.replace("{count}", "4") : "4 Mandis Evaluated"}</span>
        </div>

        <div className="recommendation-cards-grid">
          {recommendations.map((item) => (
            <div 
              key={item.id} 
              className={`recommendation-card ${item.isBest ? 'is-best-option' : ''}`}
            >
              {/* Highlight Ribbon for Best Option */}
              {item.isBest && (
                <div className="best-market-ribbon">
                  <Award size={14} />
                  <span>{t.bestMarket}</span>
                </div>
              )}

              <div className="rec-card-header">
                <div>
                  <h3 className="rec-market-name">{item.marketName}</h3>
                  <div className="rec-distance-row">
                    <MapPin size={13} />
                    <span>{item.distance} {t.kmFrom ? t.kmFrom.replace("{location}", location) : `km from ${location}`}</span>
                  </div>
                </div>

                <div className="rec-score-pill">
                  <span className="score-val">{item.recommendationScore}%</span>
                  <span className="score-lbl">{t.matchLbl}</span>
                </div>
              </div>

              {/* Demand & Reason */}
              <div className="rec-demand-row">
                <span className={`demand-badge demand-${item.demandLevel.toLowerCase()}`}>
                  <Flame size={12} /> {item.demandLevel} {t.demandLbl}
                </span>
                <span className="rec-reason-txt">{item.reason}</span>
              </div>

              {/* Financial Metrics Grid */}
              <div className="rec-financials-box">
                <div className="financial-cell">
                  <span className="fin-lbl">{t.currentPriceLbl}</span>
                  <strong className="fin-val text-gray-900">₹{item.currentPrice.toLocaleString()}</strong>
                  <span className="fin-sub">{t.perQtl}</span>
                </div>

                <div className="financial-cell">
                  <span className="fin-lbl">{t.estimatedRevenueLbl}</span>
                  <strong className="fin-val text-gray-900">₹{item.estimatedRevenue.toLocaleString()}</strong>
                  <span className="fin-sub">{t.grossPayout}</span>
                </div>

                <div className="financial-cell">
                  <span className="fin-lbl">{t.transportCostLbl}</span>
                  <strong className="fin-val text-red-600">- ₹{item.transportCost.toLocaleString()}</strong>
                  <span className="fin-sub">{t.freightEst}</span>
                </div>

                <div className="financial-cell highlight-net">
                  <span className="fin-lbl">{t.netProfitLbl}</span>
                  <strong className="fin-val text-emerald-700">₹{item.netProfit.toLocaleString()}</strong>
                  <span className="fin-sub">{t.inYourPocket}</span>
                </div>
              </div>

              {/* Card Action */}
              <div className="rec-card-footer">
                <button 
                  type="button" 
                  className={`btn-choose-mandi ${item.isBest ? 'btn-best' : ''}`}
                  onClick={() => {
                    if (showToast) showToast(`🚚 Selected ${item.marketName}! Dispatch lot created for ${quantity} Qtl ${crop}. Proceeding to transport booking.`);
                    if (setActiveTab) setActiveTab('my-crops');
                  }}
                >
                  <span>{item.isBest ? t.sellAtBestMarket : t.selectThisMandi}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhereShouldISell;
