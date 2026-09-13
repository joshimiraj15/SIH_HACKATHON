// src/components/views/HomeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight, 
  ArrowDownRight,
  ArrowRight, 
  Sparkles, 
  Store, 
  MapPin, 
  Sprout, 
  Radar,
  Users, 
  LineChart,
  Calendar,
  Download,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Layers,
  ChevronRight,
  Sun,
  CloudSun
} from 'lucide-react';
import { farmerProfile, quickStats } from '../../data/mockData';
import { weatherAPI, pricesAPI } from '../../services/api';
import { translations } from '../../data/translations';
import MarketTrendChart from '../dashboard/MarketTrendChart';
import '../../styles/HomeDashboard.css';

const DEFAULT_TICKER_ITEMS = [
  { name: 'Kapas Cotton (Botad)', price: '₹7,450/Qtl', change: '+4.8%', trend: 'up', emoji: '🌱' },
  { name: 'Bold Groundnut (Junagadh)', price: '₹6,280/Qtl', change: '+2.4%', trend: 'up', emoji: '🥜' },
  { name: 'Sharbati Wheat (Rajkot)', price: '₹2,640/Qtl', change: '+3.1%', trend: 'up', emoji: '🌾' },
  { name: 'Unhali Onion (Mahuva)', price: '₹1,450/Qtl', change: '-1.8%', trend: 'down', emoji: '🧅' },
  { name: 'Hybrid Tomato (Ahmedabad)', price: '₹1,850/Qtl', change: '+5.2%', trend: 'up', emoji: '🍅' },
  { name: 'Deesa Potato (Banaskantha)', price: '₹1,520/Qtl', change: '+1.6%', trend: 'up', emoji: '🥔' },
  { name: 'Unjha Jeera / Cumin', price: '₹28,600/Qtl', change: '+3.9%', trend: 'up', emoji: '🌿' },
  { name: 'Yellow Mustard (Patan)', price: '₹5,350/Qtl', change: '-0.9%', trend: 'down', emoji: '🌻' },
  { name: 'Desi Soyabean (Amreli)', price: '₹4,420/Qtl', change: '+2.7%', trend: 'up', emoji: '🌱' },
  { name: 'Divela Castor (Kadi)', price: '₹6,150/Qtl', change: '+1.2%', trend: 'up', emoji: '🌾' },
  { name: 'Green Chilli (Gondal)', price: '₹6,800/Qtl', change: '+6.3%', trend: 'up', emoji: '🌶️' },
  { name: 'Desi Bajra (Deesa)', price: '₹2,380/Qtl', change: '+1.5%', trend: 'up', emoji: '🌾' }
];

const INITIAL_TICKER_LIST = [
  ...DEFAULT_TICKER_ITEMS,
  ...DEFAULT_TICKER_ITEMS
];

const HomeDashboard = ({ setActiveTab, user, language, showToast }) => {
  const t = translations[language] || translations.en;
  const [selectedCropModal, setSelectedCropModal] = useState(null);
  const [exportNotice, setExportNotice] = useState(false);
  const [liveWeather, setLiveWeather] = useState(null);
  const [tickerPrices, setTickerPrices] = useState(INITIAL_TICKER_LIST);

  useEffect(() => {
    weatherAPI.getWeather(user?.district || farmerProfile.district || 'Rajkot')
      .then(res => {
        if (res && res.success) setLiveWeather(res);
      })
      .catch(() => {});

    const fetchPrices = async () => {
      try {
        const res = await pricesAPI.getAllPrices();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          // Group by unique crop to make sure each item in the ticker is a distinct crop!
          const byCrop = new Map();
          for (const item of res.data) {
            const cName = item.cropName || item.crop || item.commodity || item.name;
            if (cName && !byCrop.has(cName.toLowerCase())) {
              byCrop.set(cName.toLowerCase(), item);
            }
          }

          const distinctItems = Array.from(byCrop.values()).map(p => {
            const cropName = p.cropName || p.crop || p.commodity || p.name || 'Produce';
            const mandiName = p.marketName || p.market || p.mandi || 'APMC';
            const rawPrice = p.modalPrice ?? p.modal_price ?? p.price ?? 2500;
            const priceStr = typeof rawPrice === 'number' 
              ? `₹${rawPrice.toLocaleString('en-IN')}/Qtl` 
              : (String(rawPrice).includes('₹') ? rawPrice : `₹${rawPrice}/Qtl`);

            const lower = cropName.toLowerCase();
            let emoji = '🌾';
            if (lower.includes('tomato') || lower.includes('tameta')) emoji = '🍅';
            else if (lower.includes('onion') || lower.includes('dungli')) emoji = '🧅';
            else if (lower.includes('cotton') || lower.includes('kapas')) emoji = '🌱';
            else if (lower.includes('potato') || lower.includes('bateta')) emoji = '🥔';
            else if (lower.includes('groundnut') || lower.includes('magfali')) emoji = '🥜';
            else if (lower.includes('soyabean') || lower.includes('soya')) emoji = '🌿';
            else if (lower.includes('mustard') || lower.includes('raydo')) emoji = '🌻';
            else if (lower.includes('chilli') || lower.includes('marcha')) emoji = '🌶️';
            else if (lower.includes('jeera') || lower.includes('cumin')) emoji = '🌿';
            else if (lower.includes('wheat') || lower.includes('ghau')) emoji = '🌾';

            const cleanMandi = mandiName.replace(/^APMC\s*/i, '').split(',')[0].trim();
            const change = p.change || (p.minPrice && p.maxPrice ? `${((p.modalPrice - p.minPrice) / p.minPrice * 10).toFixed(1)}%` : '+2.5%');
            const trend = p.trend || (change.startsWith('-') ? 'down' : 'up');

            return {
              name: `${cropName} (${cleanMandi})`,
              price: priceStr,
              change: change.startsWith('+') || change.startsWith('-') ? change : `+${change}`,
              trend,
              emoji
            };
          });

          if (distinctItems.length >= 4) {
            setTickerPrices([...distinctItems, ...distinctItems]);
          }
        }
      } catch (err) {
        console.warn('Using default APMC ticker items');
      }
    };
    fetchPrices();
  }, []);

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 2500);
  };

  const isBuyer = String(user?.role || '').toLowerCase() === 'buyer';

  // 4 Required Statistics Cards per specification (Conditional on Role)
  const statsCards = isBuyer ? [
    {
      id: 'mkt-price',
      title: t.todayMarketPrice,
      value: "₹2,610",
      unit: t.avgQtl,
      change: "+5.2%",
      trend: "up",
      icon: TrendingUp,
      colorClass: "green"
    },
    {
      id: 'active-offers',
      title: t.activeOffers,
      value: "18 Bids",
      unit: t.pendingAcceptance,
      change: "+3 new",
      trend: "up",
      icon: Users,
      colorClass: "amber"
    },
    {
      id: 'farmer-listings',
      title: t.newProduceListings,
      value: "124 Lots",
      unit: t.inYourRegion,
      change: "+15.3%",
      trend: "up",
      icon: Sprout,
      colorClass: "emerald"
    },
    {
      id: 'ordered-val',
      title: t.totalOrderedValue,
      value: "₹12,45,000",
      unit: t.grossValue,
      change: "+12.1%",
      trend: "up",
      icon: DollarSign,
      colorClass: "blue"
    }
  ] : [
    {
      id: 'mkt-price',
      title: t.todayMarketPrice,
      value: "₹2,610",
      unit: t.avgQtl,
      change: "+5.2%",
      trend: "up",
      icon: TrendingUp,
      colorClass: "green"
    },
    {
      id: 'listed-crops',
      title: t.listedCrops,
      value: "4 Lots",
      unit: t.inInventory,
      change: "+1 new",
      trend: "up",
      icon: Sprout,
      colorClass: "emerald"
    },
    {
      id: 'buyer-offers',
      title: t.activeBuyerOffers,
      value: "12 Bids",
      unit: t.verifiedBuyersStr,
      change: "+24.5%",
      trend: "up",
      icon: Users,
      colorClass: "amber"
    },
    {
      id: 'expected-rev',
      title: t.expectedRevenueVal,
      value: "₹3,48,500",
      unit: t.grossValue,
      change: "+8.6%",
      trend: "up",
      icon: DollarSign,
      colorClass: "blue"
    }
  ];

  // 6 Required Live Market Price Crops per specification
  const marketCrops = [
    {
      id: 'tomato',
      name: 'Tomato',
      variety: 'Hybrid Desi Red',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
      currentPrice: '₹2,150',
      unit: '/ Quintal',
      previousPrice: '₹2,020',
      change: '+6.4%',
      trend: 'up',
      location: 'Rajkot APMC Mega Yard'
    },
    {
      id: 'onion',
      name: 'Onion',
      variety: 'Garva Red Onion',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80',
      currentPrice: '₹2,350',
      unit: '/ Quintal',
      previousPrice: '₹2,430',
      change: '-3.3%',
      trend: 'down',
      location: 'Mahuva APMC Market'
    },
    {
      id: 'wheat',
      name: 'Wheat',
      variety: 'Sharbati Lokwan',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
      currentPrice: '₹2,610',
      unit: '/ Quintal',
      previousPrice: '₹2,480',
      change: '+5.2%',
      trend: 'up',
      location: 'Gondal APMC Yard'
    },
    {
      id: 'potato',
      name: 'Potato',
      variety: 'Kufri Badshah',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80',
      currentPrice: '₹1,920',
      unit: '/ Quintal',
      previousPrice: '₹1,860',
      change: '+3.2%',
      trend: 'up',
      location: 'Deesa APMC Yard'
    },
    {
      id: 'cotton',
      name: 'Cotton',
      variety: 'Shankar-6 Long Staple',
      image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&auto=format&fit=crop&q=80',
      currentPrice: '₹7,450',
      unit: '/ Quintal',
      previousPrice: '₹7,110',
      change: '+4.8%',
      trend: 'up',
      location: 'Botad APMC Yard'
    },
    {
      id: 'groundnut',
      name: 'Groundnut',
      variety: 'GG-20 Bold Pods',
      image: 'https://images.unsplash.com/photo-1568290740643-98fa20325b5a?w=400&auto=format&fit=crop&q=80',
      currentPrice: '₹6,180',
      unit: '/ Quintal',
      previousPrice: '₹5,970',
      change: '+3.5%',
      trend: 'up',
      location: 'Junagadh APMC Yard'
    }
  ];

  // Active Mandi Deals
  const dealsData = [
    {
      id: 1,
      farm: 'Rajkot APMC Mega Mandi',
      crop: 'Sharbati Wheat',
      amount: '₹1,30,500',
      buyer: 'AgroFresh Processors',
      status: t.statusCompleted,
      statusClass: 'green'
    },
    {
      id: 2,
      farm: 'Gondal APMC Yard',
      crop: 'Shankar-6 Cotton',
      amount: '₹2,23,500',
      buyer: 'Saurashtra Spin Mills',
      status: t.statusInTransit,
      statusClass: 'yellow'
    },
    {
      id: 3,
      farm: 'Junagadh APMC Yard',
      crop: 'Groundnut GG-20',
      amount: '₹92,700',
      buyer: 'Gujarat Organic Oils',
      status: t.statusCompleted,
      statusClass: 'green'
    },
    {
      id: 4,
      farm: 'Ahmedabad Vegetable Yard',
      crop: 'Hybrid Tomatoes',
      amount: '₹43,000',
      buyer: 'Reliance Fresh Direct',
      status: t.statusPending,
      statusClass: 'yellow'
    }
  ];

  return (
    <div className="home-dashboard-container">
      <div className="slim-ticker-container" style={{ margin: '-24px -32px 24px -32px', width: 'calc(100% + 64px)', borderRadius: '0' }}>
        <div className="ticker-date-badge">
          <span className="live-pulse-dot" />
          <span>APMC LIVE RATES • {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="slim-ticker-track">
          {tickerPrices.map((crop, idx) => (
            <div key={idx} className="slim-ticker-item" onClick={() => setActiveTab('market-prices')}>
              <span className="ticker-emoji">{crop.emoji}</span>
              <span className="ticker-name">{crop.name}</span>
              <span className="ticker-price">{crop.price}</span>
              <span className={`ticker-change ${crop.trend === 'up' ? 'text-green' : 'text-red'}`}>
                {crop.trend === 'up' ? '▲' : '▼'} {crop.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ WELCOME SECTION PER PROJECT GOAL ══ */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-text-side">
          <div className="welcome-location-badge">
            <MapPin size={14} className="text-emerald-600" />
            <span>{farmerProfile.district || 'Rajkot'}, Gujarat • Saurashtra Agricultural Belt</span>
          </div>

          <h1 className="welcome-title">
            {t.goodMorning} {isBuyer ? (t.buyerFpo || "Buyer") : (t.farmerSeller || "Farmer")} 👋
          </h1>
          <p className="welcome-subtitle">
            {isBuyer 
              ? t.buyerWelcomeSub
              : t.farmerWelcomeSub}
          </p>

          <div className="welcome-quick-actions">
            {isBuyer ? (
              <>
                <button 
                  type="button" 
                  className="btn-quick-discover"
                  onClick={() => setActiveTab('crop-marketplace')}
                >
                  <Sparkles size={16} />
                  <span>{t.browseCropsToday}</span>
                  <ArrowRight size={16} />
                </button>
                <button 
                  type="button" 
                  className="btn-quick-radar"
                  onClick={() => setActiveTab('market-prices')}
                >
                  <TrendingUp size={16} />
                  <span>{t.navMarketPrices}</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button" 
                  className="btn-quick-discover"
                  onClick={() => setActiveTab('where-to-sell')}
                >
                  <Sparkles size={16} />
                  <span>{t.whereToSellToday}</span>
                  <ArrowRight size={16} />
                </button>
                <button 
                  type="button" 
                  className="btn-quick-radar"
                  onClick={() => setActiveTab('price-radar')}
                >
                  <Radar size={16} />
                  <span>{t.mandiRadarMap}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Mini Weather Summary */}
        <div className="welcome-weather-widget">
          <div className="widget-header">
            <CloudSun size={20} color="#047857" />
            <span>{t.liveFarmWeather}</span>
          </div>
          <div className="widget-temp">
            {liveWeather?.current?.tempVal 
              ? `${liveWeather.current.tempVal}°C` 
              : liveWeather?.current?.temp 
                ? liveWeather.current.temp 
                : liveWeather?.temperature 
                  ? `${liveWeather.temperature}°C` 
                  : '31°C'}
          </div>
          <div className="widget-cond">
            {liveWeather?.current?.condition || liveWeather?.condition || t.clearAndSunny} • Humidity {liveWeather?.current?.humidity || liveWeather?.humidity || '52'}%
          </div>
          <div className="widget-advisory">
            {t.weatherAdvisoryText}
          </div>
        </div>
      </div>

      {/* ══ 4 STATISTICS CARDS ══ */}
      <div className="stats-cards-row">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const isUp = stat.trend === 'up';
          return (
            <div key={stat.id} className={`stat-card border-${stat.colorClass}`}>
              <div className="stat-card-top">
                <span className="stat-card-title">{stat.title}</span>
                <div className={`stat-icon-wrap bg-${stat.colorClass}`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="stat-value-block">
                <div className="stat-main-num">{stat.value}</div>
                <span className="stat-unit-lbl">{stat.unit}</span>
              </div>

              <div className="stat-trend-footer">
                <span className={`trend-indicator-pill ${isUp ? 'trend-green' : 'trend-red'}`}>
                  {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  <span>{stat.change}</span>
                </span>
                <span className="stat-context-txt">{t.vsLastWeek}</span>
              </div>
            </div>
          );
        })}
      </div>


      {/* ══ INTERACTIVE MARKET TREND CHART ══ */}
      <div className="market-trend-chart-section">
        <MarketTrendChart />
      </div>

      {/* ══ ACTIVE MANDI DEALS & SETTLEMENTS ══ */}
      <div className="deals-table-card">
        <div className="deals-table-header">
          <div>
            <h3 className="deals-table-title">{t.recentMandiDeals}</h3>
            <p className="deals-table-subtitle">{t.recentMandiDealsSub}</p>
          </div>

          <div className="deals-table-controls">
            <div className="deals-date-pill">
              <Calendar size={14} />
              <span>{t.todaysClearing}</span>
            </div>

            <button 
              type="button" 
              className="deals-export-btn"
              onClick={handleExport}
            >
              <Download size={14} />
              <span>{t.exportCSV}</span>
            </button>

            {exportNotice && <span className="export-toast">{t.dealExported}</span>}
          </div>
        </div>

        <div className="deals-table-wrapper">
          <table className="deals-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{t.apmcMandiYard}</th>
                <th>{t.cropVariety}</th>
                <th>{t.settlementValue}</th>
                <th>{t.institutionalBuyer}</th>
                <th>{t.status}</th>
                <th style={{ textAlign: 'right' }}>{t.receipt}</th>
              </tr>
            </thead>
            <tbody>
              {dealsData.map((d) => (
                <tr key={d.id} className="deals-table-row">
                  <td className="cell-num">{d.id}</td>
                  <td className="cell-mandi">
                    <div className="font-bold text-gray-900">{d.farm}</div>
                  </td>
                  <td>
                    <span className="crop-pill-tag">{d.crop}</span>
                  </td>
                  <td className="cell-amount font-bold text-emerald-800">{d.amount}</td>
                  <td className="text-gray-600">{d.buyer}</td>
                  <td>
                    <span className={`deal-status-tag ${d.statusClass}`}>
                      {d.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      type="button" 
                      className="btn-deal-action"
                      onClick={() => {
                        if (showToast) showToast(`📄 Viewing weighbridge voucher & payout receipt for Deal #${d.id} (${d.crop})`);
                      }}
                    >
                      <span>{t.voucher}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Crop Details Modal */}
      {selectedCropModal && (
        <div className="modal-backdrop-overlay" onClick={() => setSelectedCropModal(null)}>
          <div className="crop-detail-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-banner">
              <img src={selectedCropModal.image} alt={selectedCropModal.name} className="modal-banner-img" />
              <div className="modal-banner-overlay" />
              <div className="modal-banner-text">
                <h2>{selectedCropModal.name}</h2>
                <span>{selectedCropModal.variety}</span>
              </div>
              <button className="modal-close-icon-btn" onClick={() => setSelectedCropModal(null)}>✕</button>
            </div>

            <div className="crop-modal-body">
              <div className="crop-modal-stats-grid">
                <div className="modal-stat-box">
                  <span className="box-lbl">{t.currentApmcRate}</span>
                  <div className="box-val text-emerald-700">{selectedCropModal.currentPrice}</div>
                  <span className="box-sub">{selectedCropModal.unit}</span>
                </div>
                <div className="modal-stat-box">
                  <span className="box-lbl">{t.movement24h}</span>
                  <div className={`box-val ${selectedCropModal.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {selectedCropModal.change}
                  </div>
                  <span className="box-sub">{t.vsPrevious} {selectedCropModal.previousPrice}</span>
                </div>
                <div className="modal-stat-box">
                  <span className="box-lbl">{t.primaryMandi}</span>
                  <div className="box-val text-gray-900" style={{ fontSize: '1.05rem' }}>{selectedCropModal.location}</div>
                  <span className="box-sub">{t.saurashtraHub}</span>
                </div>
              </div>

              <div className="crop-modal-advice-banner">
                <strong>{t.marketAdvisoryTitle}</strong>
                <p>{t.demandAdvisory ? t.demandAdvisory.replace("{crop}", selectedCropModal.name).replace("{variety}", selectedCropModal.variety) : `Demand for ${selectedCropModal.name} (${selectedCropModal.variety}) is currently strong...`}</p>
              </div>

              <div className="modal-actions-row">
                <button 
                  type="button" 
                  className="btn-modal-action-primary"
                  onClick={() => { setSelectedCropModal(null); setActiveTab('where-to-sell'); }}
                >
                  Calculate Where to Sell →
                </button>
                <button 
                  type="button" 
                  className="btn-modal-action-secondary"
                  onClick={() => { setSelectedCropModal(null); setActiveTab('my-crops'); }}
                >
                  List My Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeDashboard;
