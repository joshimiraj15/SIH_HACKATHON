// src/components/views/PriceForecast.jsx
import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  ArrowUpRight, 
  TrendingUp, 
  Info,
  Calendar,
  Zap
} from 'lucide-react';
import { priceForecastData } from '../../data/mockData';
import '../../styles/PriceForecast.css';

const PriceForecast = () => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const { currentPrice, projectedCards, insightTitle, insightText, chartPoints } = priceForecastData;

  // SVG Chart Dimensions
  const svgWidth = 700;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 20;

  const minPrice = 20;
  const maxPrice = 40;

  const mapX = (day, maxDay = 14) => paddingX + (day / maxDay) * (svgWidth - 2 * paddingX);
  const mapY = (val) => svgHeight - paddingY - ((val - minPrice) / (maxPrice - minPrice)) * (svgHeight - 2 * paddingY);

  // Build Upper Band & Lower Band Path
  const upperPoints = chartPoints.map(p => `${mapX(p.day)},${mapY(p.upper)}`);
  const lowerPoints = [...chartPoints].reverse().map(p => `${mapX(p.day)},${mapY(p.lower)}`);
  const areaPath = `M ${upperPoints.join(' L ')} L ${lowerPoints.join(' L ')} Z`;

  // Build Price Line Path
  const linePath = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p.day)},${mapY(p.price)}`).join(' ');

  return (
    <div className="price-forecast-container">
      {/* Header */}
      <div className="forecast-header">
        <h1>Price Forecast</h1>
        <p>AI-powered market prediction for better planning.</p>
      </div>

      {/* Top Row: Current Crop Card + 3 Projection Cards */}
      <div className="forecast-top-row">
        {/* Current Crop */}
        <div className="current-price-card">
          <div className="current-crop-avatar">🍅</div>
          <div className="current-crop-info">
            <h3>Tomato</h3>
            <div className="current-crop-price-label">Current Price</div>
            <div className="current-crop-price-val">₹{currentPrice}</div>
          </div>
        </div>

        {/* 3 Forecast Cards */}
        <div className="forecast-cards-group">
          {projectedCards.map((card, idx) => (
            <div key={idx} className={`f-card ${card.highlight ? 'highlight' : ''}`}>
              <div className="f-card-label">{card.label}</div>
              <div className="f-card-price">{card.price}</div>
              <div className="f-card-change">
                <ArrowUpRight size={12} /> {card.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction Insight Alert */}
      <div className="prediction-insight-card">
        <div className="insight-left">
          <div className="insight-lightbulb">
            <Lightbulb size={22} />
          </div>
          <div>
            <div className="insight-title-text">+ {insightTitle}</div>
            <div className="insight-msg-text">{insightText}</div>
          </div>
        </div>

        <div className="insight-bonus-pill">
          + ₹2,100
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="forecast-chart-card">
        <div className="chart-header-row">
          <h3>14-Day Price Projection & Confidence Band</h3>
          <div className="chart-legend-row">
            <div className="legend-band-box">
              <span className="band-sample" />
              <span>Forecast Range</span>
            </div>
            <div className="legend-band-box">
              <span className="line-sample" />
              <span>Projected Trend</span>
            </div>
          </div>
        </div>

        <div className="forecast-svg-wrapper">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight + 30}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {/* Horizontal Grid lines */}
            {[20, 24, 28, 32, 36, 40].map((val) => {
              const y = mapY(val);
              return (
                <g key={val}>
                  <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="#f1f5f9" strokeDasharray="3 3" />
                  <text x={paddingX - 10} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
                    ₹{val}
                  </text>
                </g>
              );
            })}

            {/* Shaded Confidence Area */}
            <path d={areaPath} fill="rgba(34, 197, 94, 0.16)" />

            {/* Projected Price Line */}
            <path d={linePath} fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Data Points */}
            {chartPoints.map((p, i) => {
              const cx = mapX(p.day);
              const cy = mapY(p.price);
              return (
                <g key={i}>
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={hoveredIdx === i ? 6 : 4} 
                    fill="#ffffff" 
                    stroke="#15803d" 
                    strokeWidth="2.5" 
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                  <text 
                    x={cx} 
                    y={svgHeight + 15} 
                    textAnchor="middle" 
                    fontSize="10" 
                    fill="#64748b" 
                    fontWeight="600"
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip */}
          {hoveredIdx !== null && (
            <div style={{
              position: 'absolute',
              top: `${mapY(chartPoints[hoveredIdx].price) - 35}px`,
              left: `${mapX(chartPoints[hoveredIdx].day)}px`,
              transform: 'translateX(-50%)',
              background: '#0c2d1e',
              color: '#ffffff',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '700',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}>
              ₹{chartPoints[hoveredIdx].price}/kg (Range: ₹{chartPoints[hoveredIdx].lower} - ₹{chartPoints[hoveredIdx].upper})
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceForecast;
