// src/components/views/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Sprout, 
  LineChart, 
  ArrowRight, 
  ChevronRight, 
  Globe, 
  CheckCircle2, 
  Star, 
  MapPin, 
  ArrowUpRight, 
  Sparkles, 
  Users, 
  DollarSign, 
  Clock, 
  Truck, 
  Search,
  Zap
} from 'lucide-react';
import heroFarm from '../../assets/hero-farm-new.jpg';
import barnImg  from '../../assets/barn.jpg';
import slide1   from '../../assets/slide1.jpg';
import slide2   from '../../assets/slide2.jpg';
import slide3   from '../../assets/slide3.jpg';
import slide4   from '../../assets/slide4.jpg';
import slide5   from '../../assets/slide5.jpg';
import { translations } from '../../data/translations';
import { pricesAPI } from '../../services/api';
import '../../styles/LandingPage.css';

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

const LandingPage = ({
  isLoggedIn,
  onExploreApp,
  onOpenAuth,
  language = 'en',
  setLanguage
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [activeCropPreview, setActiveCropPreview] = useState('Wheat');
  const t = translations[language] || translations.en;

  const languagesList = [
    { code: 'en', label: 'English' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'hi', label: 'हिंदी' }
  ];

  const currentLangObj = languagesList.find(l => l.code === language) || languagesList[0];

  const [tickerPrices, setTickerPrices] = useState(INITIAL_TICKER_LIST);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await pricesAPI.getAllPrices();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
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

  const featureBadges = [
    { label: 'Real-time Prices', icon: TrendingUp, desc: 'Live APMC rates' },
    { label: 'Verified Buyers', icon: ShieldCheck, desc: 'Zero middlemen risk' },
    { label: 'Direct Selling', icon: Sprout, desc: 'Higher farmer profit' },
    { label: 'AI Price Forecast', icon: LineChart, desc: 'Smart selling timing' }
  ];

  return (
    <div className="landing-page-root">
      {/* ══ STICKY HEADER ══ */}
      <header className="landing-sticky-header">
        <div className="landing-nav-container">
          {/* Logo */}
          <div className="landing-brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="brand-badge-icon">
              <span>🌾</span>
            </div>
            <div className="brand-title-wrap">
              <span className="brand-main-title">Kisan<span>Setu</span></span>
              <span className="brand-sub-badge">AgriTech Platform</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="landing-nav-links">
            <a href="#hero" className="nav-link-item">Home</a>
            <a href="#market-preview" className="nav-link-item" onClick={(e) => { e.preventDefault(); onExploreApp('market-prices'); }}>Market Prices</a>
            <a href="#buyers" className="nav-link-item" onClick={(e) => { e.preventDefault(); onExploreApp('buyers'); }}>Buyers</a>
            <a href="#forecast" className="nav-link-item" onClick={(e) => { e.preventDefault(); onExploreApp('price-forecast'); }}>Price Forecast</a>
            <a href="#how-it-works" className="nav-link-item">About</a>
          </nav>

          {/* Right Actions */}
          <div className="landing-header-actions">
            {/* Language Selector */}
            <div className="landing-lang-wrapper">
              <button 
                type="button"
                className="landing-lang-btn" 
                onClick={() => setShowLangMenu(!showLangMenu)}
                title="Select Language"
              >
                <Globe size={15} />
                <span>{currentLangObj.label}</span>
              </button>

              {showLangMenu && (
                <div className="landing-lang-dropdown">
                  {languagesList.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={`lang-option-item ${language === lang.code ? 'active' : ''}`}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login & Get Started Buttons */}
            {isLoggedIn ? (
              <button 
                className="btn-landing-primary" 
                onClick={() => onExploreApp('home')}
              >
                Go to Dashboard →
              </button>
            ) : (
              <>
                <button 
                  className="btn-landing-login" 
                  onClick={() => onOpenAuth('signin')}
                >
                  Login
                </button>
                <button 
                  className="btn-landing-primary" 
                  onClick={() => onOpenAuth('signup')}
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ══ HERO SECTION ══ */}
      <section id="hero" className="landing-hero-section">
        <div className="hero-gradient-overlay" />
        
        <div className="landing-container hero-inner-grid">
          {/* Left Column: Heading, Supporting Text, Badges, CTAs */}
          <div className="hero-left-content">
            {/* Top Innovation Tag */}
            <div className="hero-top-tag">
              <span className="pulse-dot" />
              <span>India's Leading Farmer-First Marketplace</span>
            </div>

            {/* Main Heading per Project Goal */}
            <h1 className="hero-headline">
              Strengthening Market Linkages and <span className="text-highlight">Price Discovery</span> for Farmers
            </h1>

            {/* Supporting Text */}
            <p className="hero-subtext">
              Discover real-time crop prices across top mandis, connect directly with verified institutional buyers, and make smarter selling decisions with AI price forecasting.
            </p>

            {/* 4 Feature Badges */}
            <div className="hero-feature-badges-grid">
              {featureBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="hero-badge-pill">
                    <div className="badge-icon-wrap">
                      <Icon size={16} />
                    </div>
                    <div className="badge-text-block">
                      <span className="badge-title">{badge.label}</span>
                      <span className="badge-desc">{badge.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="hero-cta-group">
              <button 
                className="btn-hero-cta primary" 
                onClick={() => onExploreApp('market-prices')}
              >
                <span>Explore Market</span>
                <ArrowRight size={18} />
              </button>

              <button 
                className="btn-hero-cta secondary" 
                onClick={() => onOpenAuth('signup')}
              >
                <span>Get Started</span>
                <Sparkles size={16} />
              </button>

            </div>

            {/* Trust Metrics */}
            <div className="hero-trust-metrics">
              <div className="trust-metric-item">
                <strong>10,000+</strong>
                <span>Verified Farmers</span>
              </div>
              <div className="trust-metric-divider" />
              <div className="trust-metric-item">
                <strong>500+</strong>
                <span>FPO & Buyers</span>
              </div>
              <div className="trust-metric-divider" />
              <div className="trust-metric-item">
                <strong>₹50 Cr+</strong>
                <span>Transacted Fairly</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image with Overlay & Floating Live Mandi Card */}
          <div className="hero-right-visual">
            <div className="hero-image-card-frame">
              <img 
                src={heroFarm} 
                alt="Indian farmer in lush green agricultural field at sunrise" 
                className="hero-main-img"
              />
              <div className="hero-img-gradient-scrim" />

              {/* Floating Live Market Widget */}
              <div className="hero-floating-card top-right-float">
                <div className="float-card-header">
                  <span className="live-radar-dot" />
                  <span>Rajkot APMC Mega Yard</span>
                </div>
                <div className="float-card-body">
                  <div className="float-crop-tag">🌾 Sharbati Wheat</div>
                  <div className="float-crop-price">₹2,610 <span className="unit">/ Qtl</span></div>
                  <div className="float-crop-trend up">
                    <ArrowUpRight size={14} /> +₹180 today (High Demand)
                  </div>
                </div>
              </div>

              {/* Floating Verified Buyer Widget */}
              <div className="hero-floating-card bottom-left-float">
                <div className="buyer-avatar-float">
                  <ShieldCheck size={20} color="#047857" />
                </div>
                <div>
                  <div className="buyer-name-float">AgroFresh Institutional Buyer</div>
                  <div className="buyer-req-float">Seeking 400 Qtl Tomato • Cash on Delivery</div>
                  <div className="buyer-rating-tag">⭐ 4.9 Rating • Verified APMC Partner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ LIVE APMC MARKET TICKER PREVIEW ══ */}
      <section className="live-ticker-section">
        <div className="landing-container">
          <div className="ticker-header-row">
            <div>
              <span className="section-eyebrow">{t.liveMandiRates || "Real-Time Mandi Rates"}</span>
              <h2 className="ticker-title">{t.liveCropPrices || "Today's Live Crop Market Prices"}</h2>
            </div>
            <button 
              className="view-all-mandi-btn"
              onClick={() => onExploreApp('market-prices')}
            >
              <span>{t.viewAllMandis || "View All 30+ Mandis"}</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="slim-ticker-container">
            <div className="ticker-date-badge">
              <span className="live-pulse-dot" />
              <span>APMC LIVE RATES • {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="slim-ticker-track">
              {tickerPrices.map((crop, idx) => (
                <div key={idx} className="slim-ticker-item" onClick={() => onExploreApp('market-prices')}>
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
        </div>
      </section>

      {/* ══ HOW IT WORKS SECTION ══ */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="landing-container">
          <div className="section-center-heading">
            <span className="section-eyebrow">Seamless Process</span>
            <h2 className="section-main-heading">How KisanSetu Empowers Every Farmer</h2>
            <p className="section-subtext">Four simple steps to connect directly with wholesale markets, eliminate unfair broker cuts, and maximize farm revenue.</p>
          </div>

          <div className="hiw-steps-grid">
            <div className="hiw-step-card">
              <div className="step-number-tag">01</div>
              <div className="step-icon-circle">
                <Search size={22} />
              </div>
              <h3 className="step-title">Discover Live Rates</h3>
              <p className="step-desc">Access real-time commodity prices from APMC yards across Gujarat and India updated every 15 minutes.</p>
            </div>

            <div className="hiw-step-card">
              <div className="step-number-tag">02</div>
              <div className="step-icon-circle">
                <LineChart size={22} />
              </div>
              <h3 className="step-title">AI Price Forecast</h3>
              <p className="step-desc">Our machine learning models forecast market demand and price movements over 7-14 days to pick the optimal selling date.</p>
            </div>

            <div className="hiw-step-card">
              <div className="step-number-tag">03</div>
              <div className="step-icon-circle">
                <ShieldCheck size={22} />
              </div>
              <h3 className="step-title">Connect Verified Buyers</h3>
              <p className="step-desc">Receive competitive offers directly from verified FPOs, food processors, exporters, and wholesale buyers without middlemen.</p>
            </div>

            <div className="hiw-step-card">
              <div className="step-number-tag">04</div>
              <div className="step-icon-circle">
                <DollarSign size={22} />
              </div>
              <h3 className="step-title">Guaranteed Settlement</h3>
              <p className="step-desc">Complete transparent weighbridge dispatch with secure digital payout directly into your Kisan bank account.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARKET INTELLIGENCE HIGHLIGHTS ══ */}
      <section className="features-preview-section">
        <div className="landing-container">
          <div className="features-banner-card">
            <div className="features-text-side">
              <span className="section-eyebrow text-emerald-300">Intelligent Price Discovery</span>
              <h2 className="features-banner-heading">"Where Should I Sell My Crop?"</h2>
              <p className="features-banner-desc">
                Input your harvest quantity and location to calculate net profits across 6 nearby mandis after deducting transport, fuel, and handling costs. Stop guessing where you will earn the most.
              </p>
              <div className="features-cta-row">
                <button 
                  className="btn-landing-primary"
                  onClick={() => onExploreApp('where-to-sell')}
                >
                  <span>Try Smart Selling Tool</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="features-visual-side">
              <div className="recommendation-mock-card">
                <div className="rec-badge-top">BEST MARKET MATCH</div>
                <div className="rec-mandi-name">Rajkot APMC Mega Yard</div>
                <div className="rec-metrics-grid">
                  <div>
                    <span className="label">Current Price</span>
                    <strong>₹2,610 / Qtl</strong>
                  </div>
                  <div>
                    <span className="label">Distance</span>
                    <strong>14 km</strong>
                  </div>
                  <div>
                    <span className="label">Est. Transport</span>
                    <strong className="text-red-600">- ₹850</strong>
                  </div>
                  <div>
                    <span className="label">Net Farmer Profit</span>
                    <strong className="text-emerald-700">₹1,27,300</strong>
                  </div>
                </div>
                <div className="rec-score-bar">
                  <span>Recommendation Score: 98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ VERIFIED BUYERS SHOWCASE ══ */}
      <section id="buyers" className="verified-buyers-section">
        <div className="landing-container">
          <div className="section-center-heading">
            <span className="section-eyebrow">Institutional Network</span>
            <h2 className="section-main-heading">Trusted Buyers Ready for Your Harvest</h2>
            <p className="section-subtext">Direct connections with leading food processors, export houses, and government-backed FPO consortiums.</p>
          </div>

          <div className="landing-buyers-grid">
            <div className="landing-buyer-card">
              <div className="buyer-card-top">
                <div className="buyer-logo-box">AF</div>
                <div>
                  <h3 className="buyer-company-name">AgroFresh Food Processors</h3>
                  <div className="buyer-badge-tag"><ShieldCheck size={13} /> Verified Corporate</div>
                </div>
                <div className="buyer-rating-pill">⭐ 4.9</div>
              </div>
              <div className="buyer-demand-info">
                <div><strong>Crop:</strong> Sharbati Wheat & Potato</div>
                <div><strong>Requirement:</strong> 500 Quintals</div>
                <div><strong>Offered Rate:</strong> ₹2,650 / Qtl</div>
              </div>
              <button 
                className="btn-connect-buyer"
                onClick={() => onExploreApp('buyers')}
              >
                <span>Connect & View Deal</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="landing-buyer-card">
              <div className="buyer-card-top">
                <div className="buyer-logo-box">RF</div>
                <div>
                  <h3 className="buyer-company-name">Reliance Retail Agri Direct</h3>
                  <div className="buyer-badge-tag"><ShieldCheck size={13} /> Verified Corporate</div>
                </div>
                <div className="buyer-rating-pill">⭐ 4.8</div>
              </div>
              <div className="buyer-demand-info">
                <div><strong>Crop:</strong> Hybrid Red Tomato</div>
                <div><strong>Requirement:</strong> 350 Crates</div>
                <div><strong>Offered Rate:</strong> ₹2,200 / Qtl</div>
              </div>
              <button 
                className="btn-connect-buyer"
                onClick={() => onExploreApp('buyers')}
              >
                <span>Connect & View Deal</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="landing-buyer-card">
              <div className="buyer-card-top">
                <div className="buyer-logo-box">GO</div>
                <div>
                  <h3 className="buyer-company-name">Gujarat Organic Cotton FPO</h3>
                  <div className="buyer-badge-tag"><ShieldCheck size={13} /> Verified FPO</div>
                </div>
                <div className="buyer-rating-pill">⭐ 5.0</div>
              </div>
              <div className="buyer-demand-info">
                <div><strong>Crop:</strong> Shankar-6 Raw Cotton</div>
                <div><strong>Requirement:</strong> 1,200 Quintals</div>
                <div><strong>Offered Rate:</strong> ₹7,600 / Qtl</div>
              </div>
              <button 
                className="btn-connect-buyer"
                onClick={() => onExploreApp('buyers')}
              >
                <span>Connect & View Deal</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CALL TO ACTION BANNER ══ */}
      <section className="landing-final-cta-section">
        <div className="landing-container">
          <div className="final-cta-card">
            <h2 className="final-cta-heading">
              Ready to Get Better Prices for Your Crops?
            </h2>
            <p className="final-cta-sub">
              Join thousands of Indian farmers who make data-driven selling decisions with KisanSetu every day.
            </p>
            <div className="final-cta-actions">
              <button 
                className="btn-landing-primary large"
                onClick={() => onOpenAuth('signup')}
              >
                <span>Register as a Farmer</span>
                <ArrowRight size={18} />
              </button>
              <button 
                className="btn-landing-secondary large"
                onClick={() => onExploreApp('home')}
              >
                <span>Explore Live Platform</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="landing-footer">
        <div className="landing-container footer-inner-grid">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <span className="brand-badge-icon">🌾</span>
              <span className="brand-main-title text-white">Kisan<span>Setu</span></span>
            </div>
            <p className="footer-desc">
              India's premier agricultural market linkage and price discovery ecosystem, dedicated to farmer prosperity and transparent commodity trade.
            </p>
            <div className="footer-copyright">
              © {new Date().getFullYear()} KisanSetu AgriTech. All rights reserved.
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Platform</h4>
            <a onClick={() => onExploreApp('market-prices')}>Market Prices</a>
            <a onClick={() => onExploreApp('price-radar')}>Price Radar</a>
            <a onClick={() => onExploreApp('where-to-sell')}>Where to Sell</a>
            <a onClick={() => onExploreApp('price-forecast')}>AI Price Forecast</a>
          </div>

          <div className="footer-links-col">
            <h4>Farmers</h4>
            <a onClick={() => onExploreApp('my-crops')}>My Produce Lots</a>
            <a onClick={() => onExploreApp('buyers')}>Verified Buyers</a>
            <a onClick={() => onExploreApp('schemes')}>Govt Schemes</a>
            <a onClick={() => onExploreApp('messages')}>Buyer Chat</a>
          </div>

          <div className="footer-links-col">
            <h4>Contact & Support</h4>
            <span>📞 Kisan Helpline: 1800-180-1551</span>
            <span>📍 APMC Market Yard Complex, Rajkot, Gujarat</span>
            <span>✉️ contact@kisansetu.in</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
