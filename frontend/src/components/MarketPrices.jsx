// src/components/MarketPrices.jsx
import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, MapPin, ArrowUpRight } from 'lucide-react';
import '../styles/MarketPrices.css';

const MarketPrices = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Clean, focused dataset of major Gujarat crops & top mandis
  const marketList = [
    {
      id: 1,
      name: 'Wheat',
      localName: 'ઘઉં',
      category: 'Grains',
      icon: '🌾',
      price: '₹2,610',
      unit: '/ quintal',
      change: '+5.2%',
      trend: 'up',
      bestMandi: 'Rajkot APMC',
      note: 'High demand from Saurashtra buyers'
    },
    {
      id: 2,
      name: 'Cotton',
      localName: 'કપાસ',
      category: 'Cotton',
      icon: '🌱',
      price: '₹7,450',
      unit: '/ quintal',
      change: '+4.8%',
      trend: 'up',
      bestMandi: 'Gondal APMC',
      note: 'Shankar-6 premium quality'
    },
    {
      id: 3,
      name: 'Groundnut',
      localName: 'મગફળી',
      category: 'Oilseeds',
      icon: '🥜',
      price: '₹6,180',
      unit: '/ quintal',
      change: '+3.6%',
      trend: 'up',
      bestMandi: 'Junagadh APMC',
      note: 'GG-20 bold pods in high demand'
    },
    {
      id: 4,
      name: 'Cumin Seed',
      localName: 'જીરું',
      category: 'Spices',
      icon: '🌿',
      price: '₹32,500',
      unit: '/ quintal',
      change: '+14.2%',
      trend: 'up',
      bestMandi: 'Unjha APMC',
      note: 'Strong export orders active'
    },
    {
      id: 5,
      name: 'Red Onion',
      localName: 'ડુંગળી',
      category: 'Vegetables',
      icon: '🧅',
      price: '₹2,350',
      unit: '/ quintal',
      change: '+6.4%',
      trend: 'up',
      bestMandi: 'Mahuva APMC',
      note: 'Garva red onion arrivals steady'
    },
    {
      id: 6,
      name: 'Potato',
      localName: 'બટાકા',
      category: 'Vegetables',
      icon: '🥔',
      price: '₹1,920',
      unit: '/ quintal',
      change: '+3.1%',
      trend: 'up',
      bestMandi: 'Deesa APMC',
      note: 'Cold storage stocks moving fast'
    },
    {
      id: 7,
      name: 'Tomato',
      localName: 'ટામેટા',
      category: 'Vegetables',
      icon: '🍅',
      price: '₹1,850',
      unit: '/ quintal',
      change: '-2.4%',
      trend: 'down',
      bestMandi: 'Ahmedabad APMC',
      note: 'Ample supply in local markets'
    },
    {
      id: 8,
      name: 'White Sesame',
      localName: 'તલ',
      category: 'Oilseeds',
      icon: '🌾',
      price: '₹14,800',
      unit: '/ quintal',
      change: '+7.5%',
      trend: 'up',
      bestMandi: 'Amreli APMC',
      note: 'Export buyer bids climbing'
    }
  ];

  const categories = [
    { key: 'All', label: 'All Crops' },
    { key: 'Grains', label: '🌾 Wheat & Grains' },
    { key: 'Cotton', label: '🌱 Cotton' },
    { key: 'Oilseeds', label: '🥜 Groundnut & Seeds' },
    { key: 'Vegetables', label: '🍅 Vegetables' },
    { key: 'Spices', label: '🌿 Spices' }
  ];

  const filteredCrops = useMemo(() => {
    return marketList.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchLocal = item.localName.toLowerCase().includes(q);
        const matchMandi = item.bestMandi.toLowerCase().includes(q);
        if (!matchName && !matchLocal && !matchMandi) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="zen-market-container">
      {/* ─── Header: Clean & Peaceful ─── */}
      <div className="zen-header">
        <div>
          <h1 className="zen-title">Today's Market Prices</h1>
          <p className="zen-subtitle">Simple, live APMC mandi rates across Gujarat — updated every morning</p>
        </div>

        {/* Clean Search Input */}
        <div className="zen-search-wrap">
          <Search size={17} className="zen-search-icon" />
          <input 
            type="text"
            placeholder="Search crop or mandi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="zen-search-input"
          />
        </div>
      </div>

      {/* ─── Simple Category Tabs ─── */}
      <div className="zen-category-bar">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            className={`zen-cat-pill ${selectedCategory === cat.key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ─── Spacious, Clear Crop Cards Grid ─── */}
      <div className="zen-cards-grid">
        {filteredCrops.map((crop) => (
          <div key={crop.id} className="zen-crop-card">
            {/* Top row: Icon, Name & Trend */}
            <div className="zen-card-top">
              <div className="zen-crop-info">
                <span className="zen-crop-emoji">{crop.icon}</span>
                <div>
                  <h3 className="zen-crop-title">{crop.name}</h3>
                  <span className="zen-crop-local">{crop.localName}</span>
                </div>
              </div>

              <span className={`zen-trend-pill ${crop.trend}`}>
                {crop.trend === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {crop.change}
              </span>
            </div>

            {/* Price Row: Big, Bold, Easy to Read */}
            <div className="zen-price-block">
              <span className="zen-price-value">{crop.price}</span>
              <span className="zen-price-unit">{crop.unit}</span>
            </div>

            {/* Bottom Row: Best Mandi Location & Note */}
            <div className="zen-card-bottom">
              <div className="zen-mandi-tag">
                <MapPin size={13} className="zen-loc-icon" />
                <span>Best at <strong>{crop.bestMandi}</strong></span>
              </div>
              <p className="zen-crop-note">{crop.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* When no results */}
      {filteredCrops.length === 0 && (
        <div className="zen-empty-state">
          <p>No crops found for "{searchQuery}". Try selecting "All Crops".</p>
          <button type="button" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="zen-reset-btn">
            Show All Crops
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketPrices;
