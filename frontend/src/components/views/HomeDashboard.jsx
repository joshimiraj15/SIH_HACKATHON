// src/components/views/HomeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
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
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Sun
} from 'lucide-react';
import { 
  farmerProfile, 
  quickStats, 
  priceTrend7Days 
} from '../../data/mockData';
import { translations } from '../../data/translations';
import barnImg from '../../assets/barn.jpg';
import MarketPrices from '../MarketPrices';
import { fetchLiveWeather } from '../../services/weatherService';
import '../../styles/HomeDashboard.css';

const HomeDashboard = ({ setActiveTab, language = 'en' }) => {
  const [activeTabSub, setActiveTabSub] = useState('overview');
  const [exportNotice, setExportNotice] = useState(false);
  const [liveWeather, setLiveWeather] = useState(null);

  const t = translations[language] || translations.en;

  useEffect(() => {
    fetchLiveWeather(farmerProfile.district || 'Rajkot')
      .then(setLiveWeather)
      .catch(() => {});
  }, []);

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 2500);
  };

  const labels = {
    overview: {
      en: "Overview", gu: "ઓવરવ્યૂ", hi: "ओवरव्यू", mr: "एकूण माहिती", pa: "ਓਵਰਵਿਊ", ta: "மேலோட்டம்", te: "అవలోకనం", kn: "ಅವಲೋಕನ"
    },
    portfolioVal: {
      en: "Total Portfolio Valuation", gu: "કુલ બજાર મૂલ્યાંકન", hi: "कुल पोर्टफोलियो मूल्य", mr: "एकूण पोर्टफोलिओ मूल्य", pa: "ਕੁੱਲ ਪੋਰਟਫੋਲੀਓ ਮੁਲਾਂਕਣ", ta: "மொத்த போர்ட்ஃபோலியோ மதிப்பு", te: "మొత్తం పోర్ట్‌ఫోలియో విలువ", kn: "ಒಟ್ಟು ಪೋರ್ಟ್‌ಫೋಲಿಯೋ ಮೌಲ್ಯ"
    },
    sell: {
      en: "Sell", gu: "વેચો", hi: "बेचें", mr: "विका", pa: "ਵੇਚੋ", ta: "விற்க", te: "అమ్మండి", kn: "ಮಾರಿ"
    },
    radar: {
      en: "Radar", gu: "રડાર", hi: "રડાર", mr: "રડાર", pa: "ਰਡਾਰ", ta: "ரேடார்", te: "రాడార్", kn: "ರಾಡಾರ್"
    },
    buyers: {
      en: "Buyers", gu: "ખરીદદારો", hi: "खरीदार", mr: "खरेदीदार", pa: "ਖਰੀਦਦਾਰ", ta: "வாங்குபவர்கள்", te: "కొనుగోలుదారులు", kn: "ಖರೀದಿದಾರರು"
    },
    forecast: {
      en: "Forecast", gu: "અનુમાન", hi: "पूर्वानुमान", mr: "अंदाज", pa: "ਪੂਰਵ-ਅਨੁਮਾਨ", ta: "முன்கணிப்பு", te: "అంచనా", kn: "ಮುನ್ಸೂಚನೆ"
    },
    weatherCenter: {
      en: "Mandi & Weather Center", gu: "મંડી અને હવામાન કેન્દ્ર", hi: "मंडी और मौसम केंद्र", mr: "बाजार व हवामान केंद्र", pa: "ਮੰਡੀ ਅਤੇ ਮੌਸਮ ਕੇਂਦਰ", ta: "சந்தை & வானிலை மையம்", te: "మార్కెట్ & వాతావరణ కేంద్రం", kn: "ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಹವಾಮಾನ ಕೇಂದ್ರ"
    },
    weatherAdvisory: {
      en: "Optimal weather for harvesting and mandi transport across regional APMCs.",
      gu: "સૌરાષ્ટ્રમાં પાક લણણી અને યાર્ડ ટ્રાન્સપોર્ટ માટે ઉત્તમ વાતાવરણ.",
      hi: "फसल की कटाई और मंडी परिवहन के लिए अनुकूल मौसम।",
      mr: "काढणी आणि बाजार वाहतुकीसाठी उत्तम हवामान.",
      pa: "ਵਾਢੀ ਅਤੇ ਮੰਡੀ ਢੋਆ-ਢੁਆਈ ਲਈ ਵਧੀਆ ਮੌਸਮ।",
      ta: "அறுவடை மற்றும் சந்தை போக்குவரத்திற்கு சாதகமான வானிலை.",
      te: "కోత మరియు మార్కెట్ రవాణాకు అనుకూల వాతావరణం.",
      kn: "ಕೊಯ್ಲು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಸಾರಿಗೆಗೆ ಸೂಕ್ತ ಹವಾಮಾನ."
    },
    exploreForecast: {
      en: "Explore Forecast →", gu: "ભાવ અનુમાન જુઓ →", hi: "पूर्वानुमान देखें →", mr: "अंदाज पहा →", pa: "ਪੂਰਵ-ਅਨੁਮਾਨ ਦੇਖੋ →", ta: "முன்கணிப்பு காண்க →", te: "అంచనా చూడండి →", kn: "ಮುನ್ಸೂಚನೆ ನೋಡಿ →"
    },
    newTopBid: {
      en: "NEW TOP BID", gu: "નવી ઊંચી બોલી", hi: "नई उच्चतम बोली", mr: "नवीन सर्वोच्च बोली", pa: "ਨਵੀਂ ਉੱਚੀ ਬੋਲੀ", ta: "புதிய சிறந்த ஏலம்", te: "కొత్త అత్యధిక బిడ్", kn: "ಹೊಸ ಗರಿಷ್ಠ ಬಿಡ್"
    },
    topApmcRate: {
      en: "Top APMC Rate", gu: "શ્રેષ્ઠ યાર્ડ ભાવ", hi: "सर्वोत्तम मंडी रेट", mr: "उच्चतम APMC दर", pa: "ਸਭ ਤੋਂ ਵਧੀਆ ਮੰਡੀ ਰੇਟ", ta: "உயர் சந்தை விலை", te: "అత్యధిక మార్కెట్ ధర", kn: "ಉನ್ನತ APMC ದರ"
    },
    buyingQuota: {
      en: "Daily Buying Quota", gu: "દૈનિક ખરીદી ક્વોટા", hi: "दैनिक खरीद कोटा", mr: "दैनिक खरेदी कोटा", pa: "ਰੋਜ਼ਾਨਾ ਖਰੀਦ ਕੋਟਾ", ta: "தினசரி கொள்முதல் பங்கு", te: "రోజువారీ కొనుగోలు కోటా", kn: "ದೈನಂದಿನ ಖರೀದಿ ಕೋಟಾ"
    },
    directDealNow: {
      en: "Direct Deal Now", gu: "ડાયરેક્ટ સોદો કરો", hi: "डायरेक्ट सौदा करें", mr: "थेट व्यवहार करा", pa: "ਸਿੱਧਾ ਸੌਦਾ ਕਰੋ", ta: "நேரடி ஒப்பந்தம்", te: "నేరుగా ఒప్పందం", kn: "ನೇರ ಒಪ್ಪಂದ ಮಾಡಿ"
    },
    fundedDealsTitle: {
      en: "Funded Deals & Mandi Listings", gu: "લાઈવ વેપારી સોદાઓ અને માર્કેટ યાદીઓ", hi: "लाइव मंडी सौदे और बाजार लिस्टिंग", mr: "थेट बाजार सौदे आणि यादी", pa: "ਲਾਈਵ ਮੰਡੀ ਸੌਦੇ ਅਤੇ ਸੂਚੀਆਂ", ta: "நேரலை சந்தை ஒப்பந்தங்கள்", te: "ప్రత్యక్ష మార్కెట్ ఒప్పందాలు", kn: "ಲೈವ್ ಮಾರುಕಟ್ಟೆ ಒಪ್ಪಂದಗಳು"
    },
    fundedDealsSub: {
      en: "Live transactions across Saurashtra & Gujarat market yards",
      gu: "મુખ્ય માર્કેટિંગ યાર્ડના લાઈવ વેપારી સોદાઓ",
      hi: "प्रमुख मार्केटिंग यार्ड के लाइव सौदे",
      mr: "बाजार समितीतील थेट व्यवहार",
      pa: "ਮੰਡੀਆਂ ਵਿੱਚ ਲਾਈਵ ਲੈਣ-ਦੇਣ",
      ta: "சந்தை முற்றங்களில் நேரலை பரிவர்த்தனைகள்",
      te: "మార్కెట్ యార్డులలో ప్రత్యక్ష లావాదేవీలు",
      kn: "ಮಾರುಕಟ್ಟೆ ಆವರಣಗಳಲ್ಲಿ ಲೈವ್ ವಹಿವಾಟುಗಳು"
    },
    exportBtn: {
      en: "Export", gu: "એક્સપોર્ટ", hi: "एक्सपोर्ट", mr: "निर्यात", pa: "ਐਕਸਪੋਰਟ", ta: "ஏற்றுமதி", te: "ఎగుమతి", kn: "ರಫ್ತು"
    },
    thMandi: {
      en: "Mandi / Buyer", gu: "યાર્ડ / ખરીદદાર", hi: "मंडी / खरीदार", mr: "बाजार / खरेदीदार", pa: "ਮੰਡੀ / ਖਰੀਦਦਾਰ", ta: "சந்தை / வாங்குபவர்", te: "మార్కెట్ / కొనుగోలుదారు", kn: "ಮಾರುಕಟ್ಟೆ / ಖರೀದಿಗಾರ"
    },
    thCategory: {
      en: "Category", gu: "વર્ગ", hi: "श्रेणी", mr: "वर्ग", pa: "ਸ਼੍ਰੇਣੀ", ta: "வகை", te: "వర్గం", kn: "ವರ್ಗ"
    },
    thAmount: {
      en: "Amount", gu: "રકમ", hi: "राशि", mr: "रक्कम", pa: "ਰਕਮ", ta: "தொகை", te: "మొత్తం", kn: "ಮೊತ್ತ"
    },
    thStatus: {
      en: "Status", gu: "સ્થિતિ", hi: "स्थिति", mr: "स्थिती", pa: "ਸਥਿਤੀ", ta: "நிலை", te: "స్థితి", kn: "ಸ್ಥಿತಿ"
    },
    thActions: {
      en: "Actions", gu: "ક્રિયાઓ", hi: "कार्रवाई", mr: "कृती", pa: "ਕਾਰਵਾਈ", ta: "செயல்கள்", te: "చర్యలు", kn: "ಕ್ರಿಯೆಗಳು"
    },
    liveBoardTitle: {
      en: "Live APMC Market Board", gu: "લાઈવ APMC માર્કેટ બોર્ડ", hi: "लाइव APMC मार्केट बोर्ड", mr: "थेट एपीएमसी बाजार मंडळ", pa: "ਲਾਈਵ APMC ਮਾਰਕੀਟ ਬੋਰਡ", ta: "நேரலை APMC சந்தை வாரியம்", te: "ప్రత్యక్ష APMC మార్కెట్ బోర్డు", kn: "ಲೈವ್ APMC ಮಾರುಕಟ್ಟೆ ಮಂಡಳಿ"
    },
    liveBoardSub: {
      en: "Real-time modal rates and price volatility across major agricultural centers",
      gu: "મુખ્ય કૃષિ યાર્ડોના આજના લાઈવ ભાવો અને તેજી-મંદી",
      hi: "प्रमुख कृषि मंडियों के ताजा भाव और तेजी-मंदी",
      mr: "प्रमुख कृषी बाजारातील आजचे दर",
      pa: "ਮੁੱਖ ਮੰਡੀਆਂ ਦੇ ਅੱਜ ਦੇ ਤਾਜ਼ਾ ਭਾਅ",
      ta: "முக்கிய சந்தைகளின் இன்றைய விலைகள்",
      te: "ప్రధాన మార్కెట్ల నేటి లైవ్ ధరలు",
      kn: "ಪ್ರಮುಖ ಮಾರುಕಟ್ಟೆಗಳ ಇಂದಿನ ದರಗಳು"
    },
    viewFullRadar: {
      en: "View Full Price Radar →", gu: "પૂરું પ્રાઇસ રડાર જુઓ →", hi: "पूरा प्राइस रडार देखें →", mr: "पूर्ण रडार पहा →", pa: "ਪੂਰਾ ਰਡਾਰ ਦੇਖੋ →", ta: "முழு ரேடார் காண்க →", te: "పూర్తి రాడార్ చూడండి →", kn: "ಸಂಪೂರ್ಣ ರಾಡಾರ್ ನೋಡಿ →"
    }
  };

  const getL = (key) => (labels[key]?.[language] || labels[key]?.en || '');

  // 6 Active Mandi Deals
  const dealsData = [
    {
      id: 1,
      farm: 'Rajkot APMC Mega Mandi',
      phone: '+91 98765-12001',
      crop: language === 'gu' ? 'શરબતી ઘઉં' : language === 'hi' ? 'शरबती गेहूं' : 'Sharbati Wheat',
      category: language === 'gu' ? 'અનાજ' : language === 'hi' ? 'अनाज' : 'Grains',
      amount: '+ ₹3,200.00',
      unit: '/Qtl',
      status: language === 'gu' ? 'પૂર્ણ' : language === 'hi' ? 'पूर्ण' : 'Completed',
      statusColor: 'green'
    },
    {
      id: 2,
      farm: 'Ahmedabad Vegetable Yard',
      phone: '+91 98765-12002',
      crop: language === 'gu' ? 'હાઇબ્રિડ ટામેટા' : language === 'hi' ? 'हाइब्रिड टमाटर' : 'Hybrid Tomatoes',
      category: language === 'gu' ? 'શાકભાજી' : language === 'hi' ? 'सब्जियां' : 'Vegetables',
      amount: '- ₹1,850.00',
      unit: '/Qtl',
      status: language === 'gu' ? 'રદ' : language === 'hi' ? 'रद्द' : 'Canceled',
      statusColor: 'red'
    },
    {
      id: 3,
      farm: 'Gondal APMC Yard',
      phone: '+91 98765-12003',
      crop: language === 'gu' ? 'શંકર-૬ કપાસ' : language === 'hi' ? 'शंकर-6 कपास' : 'Shankar-6 Cotton',
      category: language === 'gu' ? 'રેસા' : language === 'hi' ? 'रेशा' : 'Fiber',
      amount: '+ ₹7,400.00',
      unit: '/Qtl',
      status: language === 'gu' ? 'પેન્ડિંગ' : language === 'hi' ? 'लंबित' : 'Pending',
      statusColor: 'yellow'
    },
    {
      id: 4,
      farm: 'Junagadh APMC Yard',
      phone: '+91 98765-12004',
      crop: language === 'gu' ? 'મગફળી GG-20' : language === 'hi' ? 'मूंगफली GG-20' : 'Groundnut GG-20',
      category: language === 'gu' ? 'તેલીબિયાં' : language === 'hi' ? 'तिलहन' : 'Oilseeds',
      amount: '+ ₹6,150.00',
      unit: '/Qtl',
      status: language === 'gu' ? 'પૂર્ણ' : language === 'hi' ? 'पूर्ण' : 'Completed',
      statusColor: 'green'
    },
    {
      id: 5,
      farm: 'Mahuva APMC Market',
      phone: '+91 98765-12005',
      crop: language === 'gu' ? 'લાલ ડુંગળી (ગરવા)' : language === 'hi' ? 'लाल प्याज (गरवा)' : 'Red Onion (Garva)',
      category: language === 'gu' ? 'શાકભાજી' : language === 'hi' ? 'सब्जियां' : 'Vegetables',
      amount: '+ ₹2,400.00',
      unit: '/Qtl',
      status: language === 'gu' ? 'પેન્ડિંગ' : language === 'hi' ? 'लंबित' : 'Pending',
      statusColor: 'yellow'
    },
    {
      id: 6,
      farm: 'Deesa Cold Storage Hub',
      phone: '+91 98765-12006',
      crop: language === 'gu' ? 'બટાકા (કુફરી બાદશાહ)' : language === 'hi' ? 'आलू (कुफरी बादशाह)' : 'Potato (Kufri Badshah)',
      category: language === 'gu' ? 'કંદમૂળ' : language === 'hi' ? 'कंद' : 'Tubers',
      amount: '+ ₹1,920.00',
      unit: '/Qtl',
      status: language === 'gu' ? 'પૂર્ણ' : language === 'hi' ? 'पूर्ण' : 'Completed',
      statusColor: 'green'
    }
  ];

  return (
    <div className="home-dashboard-container">
      {/* ════ TOP 3-COLUMN GRID ════ */}
      <div className="home-top-grid">
        
        {/* COLUMN 1: Overview & Balance Card */}
        <div className="overview-balance-card">
          <div className="ov-header">
            <span className="ov-eyebrow">{getL('overview')}</span>
            <div className="ov-sublabel">{getL('portfolioVal')} <span className="ov-trend">+₹42,500</span></div>
          </div>

          <div className="ov-balance-row">
            <div className="ov-balance-num">₹3,48,500<span className="ov-cents">.60</span></div>
            <span className="ov-gain-pill">+113.4%</span>
          </div>

          {/* 4 Quick Action Circular Buttons */}
          <div className="ov-actions-row">
            <button 
              type="button" 
              className="ov-action-item"
              onClick={() => setActiveTab('my-crops')}
              title="Add or Manage Produce"
            >
              <div className="ov-action-circle bg-amber">
                <Sprout size={18} />
              </div>
              <span className="ov-action-label">{getL('sell')}</span>
            </button>

            <button 
              type="button" 
              className="ov-action-item"
              onClick={() => setActiveTab('price-radar')}
              title="Find Best Mandi"
            >
              <div className="ov-action-circle bg-green">
                <Radar size={18} />
              </div>
              <span className="ov-action-label">{getL('radar')}</span>
            </button>

            <button 
              type="button" 
              className="ov-action-item"
              onClick={() => setActiveTab('buyers')}
              title="Match Direct Buyers"
            >
              <div className="ov-action-circle bg-coral">
                <Users size={18} />
              </div>
              <span className="ov-action-label">{getL('buyers')}</span>
            </button>

            <button 
              type="button" 
              className="ov-action-item"
              onClick={() => setActiveTab('price-forecast')}
              title="AI Price Predictions"
            >
              <div className="ov-action-circle bg-blue">
                <LineChart size={18} />
              </div>
              <span className="ov-action-label">{getL('forecast')}</span>
            </button>
          </div>
        </div>

        {/* COLUMN 2: Weather & Mandi Forecast Banner */}
        <div className="learning-center-card">
          <div className="learning-card-content">
            <span className="learning-badge">
              {liveWeather ? `${liveWeather.icon} ${liveWeather.temperature}°C • ${liveWeather.district}` : '🌤️ 31°C • Open-Meteo Live'}
            </span>
            <h3 className="learning-title">
              {liveWeather?.condition ? `${liveWeather.condition}` : getL('weatherCenter')}
            </h3>
            <p className="learning-desc">
              {liveWeather?.advisory || getL('weatherAdvisory')}
            </p>
            <button 
              type="button" 
              className="learning-btn"
              onClick={() => setActiveTab('price-forecast')}
            >
              {getL('exploreForecast')}
            </button>
          </div>
        </div>

        {/* COLUMN 3: Spotlight Mandi Hub Card */}
        <div className="spotlight-farm-card">
          <div className="spotlight-img-wrap">
            <img src={barnImg} alt="Rajkot APMC Hub" className="spotlight-img" />
            <span className="spotlight-tag">{getL('newTopBid')}</span>
          </div>

          <div className="spotlight-body">
            <div className="spotlight-header-row">
              <div>
                <h4 className="spotlight-title">Rajkot APMC Hub</h4>
                <div className="spotlight-loc">
                  <MapPin size={12} /> Rajkot, Saurashtra
                </div>
              </div>
              <span className="spotlight-crop-pill">
                {language === 'gu' ? 'ઘઉં' : language === 'hi' ? 'गेहूं' : 'Wheat'}
              </span>
            </div>

            <div className="spotlight-meta-row">
              <span className="meta-label">{getL('topApmcRate')}</span>
              <span className="meta-value">₹2,950 / Qtl</span>
            </div>

            {/* Quota Progress Bar */}
            <div className="spotlight-quota-block">
              <div className="quota-label-row">
                <span>{getL('buyingQuota')}</span>
                <span>72%</span>
              </div>
              <div className="quota-bar-track">
                <div className="quota-bar-fill" style={{ width: '72%' }} />
              </div>
            </div>

            <button 
              type="button" 
              className="spotlight-action-btn"
              onClick={() => setActiveTab('buyers')}
            >
              {getL('directDealNow')}
            </button>
          </div>
        </div>

      </div>

      {/* ════ BOTTOM SECTION: FUNDED INVESTMENTS / CROP DEALS TABLE ════ */}
      <div className="deals-table-card">
        <div className="deals-table-header">
          <div>
            <h3 className="deals-table-title">{getL('fundedDealsTitle')}</h3>
            <p className="deals-table-subtitle">{getL('fundedDealsSub')}</p>
          </div>

          <div className="deals-table-controls">
            <div className="deals-date-pill">
              <Calendar size={14} />
              <span>10 Sep 25 – 17 Sep 25</span>
            </div>

            <button 
              type="button" 
              className="deals-export-btn"
              onClick={handleExport}
            >
              <Download size={14} />
              <span>{getL('exportBtn')}</span>
            </button>

            {exportNotice && <span className="export-toast">✓ Report Downloaded</span>}
          </div>
        </div>

        {/* Clean Responsive Data Table */}
        <div className="deals-table-wrapper">
          <table className="deals-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>{getL('thMandi')}</th>
                <th>{getL('thCategory')}</th>
                <th>{getL('thAmount')}</th>
                <th>{getL('thStatus')}</th>
                <th style={{ textAlign: 'right' }}>{getL('thActions')}</th>
              </tr>
            </thead>
            <tbody>
              {dealsData.map((item) => (
                <tr key={item.id} className="deals-table-row">
                  <td className="cell-num">{item.id}</td>
                  <td>
                    <div className="farm-cell">
                      <div className="farm-icon-circle">
                        {item.category.includes('Grain') || item.category.includes('અનાજ') || item.category.includes('अनाज') ? '🌾' : ''}
                        {item.category.includes('Veg') || item.category.includes('શાકભાજી') || item.category.includes('सब्जियां') ? '🍅' : ''}
                        {item.category.includes('Fiber') || item.category.includes('રેસા') || item.category.includes('रेशा') ? '🌱' : ''}
                        {item.category.includes('Oil') || item.category.includes('તેલીબિયાં') || item.category.includes('तिलहन') ? '🥜' : ''}
                        {item.category.includes('Tuber') || item.category.includes('કંદમૂળ') || item.category.includes('कंद') ? '🥔' : ''}
                      </div>
                      <div>
                        <div className="farm-name">{item.farm}</div>
                        <div className="farm-sub">{item.crop} • {item.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-pill">{item.category}</span>
                  </td>
                  <td>
                    <span className={`amount-text ${item.amount.startsWith('+') ? 'gain' : 'loss'}`}>
                      {item.amount}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill status-${item.statusColor}`}>
                      <span className="status-dot" />
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      type="button" 
                      className="row-action-btn"
                      onClick={() => setActiveTab('where-to-sell')}
                      title="View Details"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════ SECONDARY: LIVE APMC MARKET FEED ════ */}
      <div className="home-market-feed-section">
        <div className="market-feed-header">
          <div>
            <h3 className="feed-title">{getL('liveBoardTitle')}</h3>
            <p className="feed-sub">{getL('liveBoardSub')}</p>
          </div>
          <button 
            type="button" 
            className="feed-view-all-btn"
            onClick={() => setActiveTab('market-prices')}
          >
            {getL('viewFullRadar')}
          </button>
        </div>

        <MarketPrices language={language} />
      </div>
    </div>
  );
};

export default HomeDashboard;
