// src/components/dashboard/MarketTrendChart.jsx
import React, { useState, useMemo } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

const CROP_TREND_DATA = {
  Tomato: {
    name: 'Tomato',
    emoji: '🍅',
    unit: '₹ / Quintal',
    currentPrice: 2150,
    mandi: 'Rajkot APMC',
    durations: {
      '7D': [
        { label: '6 Days Ago', price: 1850 },
        { label: '5 Days Ago', price: 1920 },
        { label: '4 Days Ago', price: 1990 },
        { label: '3 Days Ago', price: 2050 },
        { label: '2 Days Ago', price: 2010 },
        { label: 'Yesterday', price: 2100 },
        { label: 'Today', price: 2150 }
      ],
      '30D': [
        { label: 'Week 1', price: 1720 },
        { label: 'Week 2', price: 1890 },
        { label: 'Week 3', price: 2040 },
        { label: 'Week 4', price: 2150 }
      ],
      '3M': [
        { label: 'Month 1', price: 1540 },
        { label: 'Month 2', price: 1820 },
        { label: 'Month 3', price: 2150 }
      ]
    }
  },
  Onion: {
    name: 'Onion',
    emoji: '🧅',
    unit: '₹ / Quintal',
    currentPrice: 2350,
    mandi: 'Mahuva APMC',
    durations: {
      '7D': [
        { label: '6 Days Ago', price: 2550 },
        { label: '5 Days Ago', price: 2500 },
        { label: '4 Days Ago', price: 2480 },
        { label: '3 Days Ago', price: 2420 },
        { label: '2 Days Ago', price: 2390 },
        { label: 'Yesterday', price: 2360 },
        { label: 'Today', price: 2350 }
      ],
      '30D': [
        { label: 'Week 1', price: 2680 },
        { label: 'Week 2', price: 2550 },
        { label: 'Week 3', price: 2420 },
        { label: 'Week 4', price: 2350 }
      ],
      '3M': [
        { label: 'Month 1', price: 2800 },
        { label: 'Month 2', price: 2550 },
        { label: 'Month 3', price: 2350 }
      ]
    }
  },
  Wheat: {
    name: 'Wheat',
    emoji: '🌾',
    unit: '₹ / Quintal',
    currentPrice: 2610,
    mandi: 'Gondal APMC',
    durations: {
      '7D': [
        { label: '6 Days Ago', price: 2460 },
        { label: '5 Days Ago', price: 2490 },
        { label: '4 Days Ago', price: 2510 },
        { label: '3 Days Ago', price: 2550 },
        { label: '2 Days Ago', price: 2580 },
        { label: 'Yesterday', price: 2595 },
        { label: 'Today', price: 2610 }
      ],
      '30D': [
        { label: 'Week 1', price: 2350 },
        { label: 'Week 2', price: 2440 },
        { label: 'Week 3', price: 2520 },
        { label: 'Week 4', price: 2610 }
      ],
      '3M': [
        { label: 'Month 1', price: 2200 },
        { label: 'Month 2', price: 2410 },
        { label: 'Month 3', price: 2610 }
      ]
    }
  },
  Cotton: {
    name: 'Cotton',
    emoji: '🌱',
    unit: '₹ / Quintal',
    currentPrice: 7450,
    mandi: 'Botad APMC',
    durations: {
      '7D': [
        { label: '6 Days Ago', price: 7100 },
        { label: '5 Days Ago', price: 7180 },
        { label: '4 Days Ago', price: 7250 },
        { label: '3 Days Ago', price: 7320 },
        { label: '2 Days Ago', price: 7380 },
        { label: 'Yesterday', price: 7410 },
        { label: 'Today', price: 7450 }
      ],
      '30D': [
        { label: 'Week 1', price: 6900 },
        { label: 'Week 2', price: 7120 },
        { label: 'Week 3', price: 7300 },
        { label: 'Week 4', price: 7450 }
      ],
      '3M': [
        { label: 'Month 1', price: 6650 },
        { label: 'Month 2', price: 7050 },
        { label: 'Month 3', price: 7450 }
      ]
    }
  },
  Groundnut: {
    name: 'Groundnut',
    emoji: '🥜',
    unit: '₹ / Quintal',
    currentPrice: 6180,
    mandi: 'Junagadh APMC',
    durations: {
      '7D': [
        { label: '6 Days Ago', price: 5950 },
        { label: '5 Days Ago', price: 6000 },
        { label: '4 Days Ago', price: 6040 },
        { label: '3 Days Ago', price: 6090 },
        { label: '2 Days Ago', price: 6120 },
        { label: 'Yesterday', price: 6150 },
        { label: 'Today', price: 6180 }
      ],
      '30D': [
        { label: 'Week 1', price: 5780 },
        { label: 'Week 2', price: 5920 },
        { label: 'Week 3', price: 6050 },
        { label: 'Week 4', price: 6180 }
      ],
      '3M': [
        { label: 'Month 1', price: 5500 },
        { label: 'Month 2', price: 5850 },
        { label: 'Month 3', price: 6180 }
      ]
    }
  }
};

const MarketTrendChart = () => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedDuration, setSelectedDuration] = useState('7D'); // '7D', '30D', '3M'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const cropData = CROP_TREND_DATA[selectedCrop] || CROP_TREND_DATA.Tomato;
  const points = cropData.durations[selectedDuration] || cropData.durations['7D'];

  // Metrics calculations
  const stats = useMemo(() => {
    const prices = points.map(p => p.price);
    const highest = Math.max(...prices);
    const lowest = Math.min(...prices);
    const sum = prices.reduce((acc, val) => acc + val, 0);
    const average = Math.round(sum / prices.length);
    const current = prices[prices.length - 1];
    const prev = prices[0];
    const diff = current - prev;
    const pct = ((diff / prev) * 100).toFixed(1);

    return { highest, lowest, average, current, diff, pct };
  }, [points]);

  // SVG Coordinates calculation
  const width = 640;
  const height = 190;
  const padX = 40;
  const padY = 25;

  const minP = stats.lowest * 0.96;
  const maxP = stats.highest * 1.04;

  const coords = points.map((p, i) => {
    const x = padX + (i / (points.length - 1 || 1)) * (width - 2 * padX);
    const y = height - padY - ((p.price - minP) / (maxP - minP || 1)) * (height - 2 * padY);
    return { ...p, x, y };
  });

  const polylinePoints = coords.map(c => `${c.x},${c.y}`).join(' ');
  const areaPoints = `${coords[0].x},${height - padY} ` + polylinePoints + ` ${coords[coords.length - 1].x},${height - padY}`;

  return (
    <div className="market-trend-component-card">
      {/* Top Header: Crop Selector Tabs & Duration Switcher */}
      <div className="trend-component-header">
        <div>
          <div className="trend-comp-badge">Interactive Mandi Analysis</div>
          <h3 className="trend-comp-title">Market Price Trend Chart</h3>
        </div>

        {/* Duration Pills */}
        <div className="trend-duration-pill-group">
          {[
            { id: '7D', label: '7 Days' },
            { id: '30D', label: '30 Days' },
            { id: '3M', label: '3 Months' }
          ].map((d) => (
            <button
              key={d.id}
              type="button"
              className={`duration-pill-btn ${selectedDuration === d.id ? 'active' : ''}`}
              onClick={() => { setSelectedDuration(d.id); setHoveredPoint(null); }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Selector Tabs */}
      <div className="crop-tabs-selector-bar">
        {Object.keys(CROP_TREND_DATA).map((cropKey) => {
          const item = CROP_TREND_DATA[cropKey];
          const isSelected = selectedCrop === cropKey;
          return (
            <button
              key={cropKey}
              type="button"
              className={`crop-tab-btn ${isSelected ? 'active' : ''}`}
              onClick={() => { setSelectedCrop(cropKey); setHoveredPoint(null); }}
            >
              <span className="crop-tab-emoji">{item.emoji}</span>
              <span className="crop-tab-name">{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* 4 Stat Metrics Row */}
      <div className="trend-metrics-summary-grid">
        <div className="trend-metric-cell">
          <span className="metric-label">Current Price</span>
          <div className="metric-val text-emerald-700">₹{stats.current.toLocaleString()}</div>
          <span className={`metric-badge ${stats.diff >= 0 ? 'up' : 'down'}`}>
            {stats.diff >= 0 ? '+' : ''}{stats.pct}%
          </span>
        </div>

        <div className="trend-metric-cell">
          <span className="metric-label">Highest Price</span>
          <div className="metric-val">₹{stats.highest.toLocaleString()}</div>
          <span className="metric-sub-label">Peak Mandi Rate</span>
        </div>

        <div className="trend-metric-cell">
          <span className="metric-label">Lowest Price</span>
          <div className="metric-val">₹{stats.lowest.toLocaleString()}</div>
          <span className="metric-sub-label">Support Level</span>
        </div>

        <div className="trend-metric-cell">
          <span className="metric-label">Average Price</span>
          <div className="metric-val">₹{stats.average.toLocaleString()}</div>
          <span className="metric-sub-label">{cropData.mandi}</span>
        </div>
      </div>

      {/* SVG Interactive Line Chart */}
      <div className="trend-svg-chart-wrapper">
        <svg viewBox={`0 0 ${width} ${height}`} className="trend-svg-canvas">
          <defs>
            <linearGradient id="trendGreenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padX} y1={padY} x2={width - padX} y2={padY} stroke="#E5E7EB" strokeDasharray="3 3" />
          <line x1={padX} y1={height / 2} x2={width - padX} y2={height / 2} stroke="#E5E7EB" strokeDasharray="3 3" />
          <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="#E5E7EB" strokeWidth="1" />

          {/* Area Fill */}
          <polygon points={areaPoints} fill="url(#trendGreenGrad)" />

          {/* Main Clean Green Line */}
          <polyline
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />

          {/* Data Points */}
          {coords.map((c, idx) => (
            <g key={idx}>
              <circle
                cx={c.x}
                cy={c.y}
                r={hoveredPoint?.label === c.label ? 6 : 4}
                fill={hoveredPoint?.label === c.label ? '#047857' : '#FFFFFF'}
                stroke="#10B981"
                strokeWidth={hoveredPoint?.label === c.label ? 3 : 2}
                style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={() => setHoveredPoint(c)}
              />
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div 
            className="chart-hover-tooltip"
            style={{ 
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%` 
            }}
          >
            <div className="tooltip-title">{hoveredPoint.label}</div>
            <div className="tooltip-price">₹{hoveredPoint.price.toLocaleString()}</div>
          </div>
        )}

        {/* X-Axis Labels */}
        <div className="chart-x-labels-row">
          {coords.map((c, idx) => (
            <span key={idx} className="chart-x-label">
              {c.label.replace(' Days Ago', 'd').replace('Yesterday', 'Yday').replace('Week ', 'Wk ').replace('Month ', 'M')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketTrendChart;
