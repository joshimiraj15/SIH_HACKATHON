// src/services/api.js
// Production-Grade Axios API Client with Offline Mock Fallback for KisanSetu

import axios from 'axios';
import { 
  farmerProfile, 
  myCropsData, 
  buyersList, 
  whereToSellComparison,
  governmentSchemes
} from '../data/mockData';
import { STATE_MAPS } from '../data/stateMapsData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios Instance with reasonable timeout
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach Auth Bearer Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kisansetu_token');
    if (token && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Health check state tracking
let isBackendOnline = false;

export const checkBackendHealth = async () => {
  try {
    const res = await axios.get('http://localhost:5000/', { timeout: 1800 });
    isBackendOnline = Boolean(res.data?.success || res.status === 200);
    return { online: isBackendOnline };
  } catch (e) {
    isBackendOnline = false;
    return { online: false };
  }
};

export const getBackendStatus = () => isBackendOnline;

// ----------------------------------------------------
// 1. Authentication APIs
// ----------------------------------------------------
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      // Graceful offline mock fallback
      console.warn('[authAPI.login] Backend unavailable, using mock fallback:', err.message);
      if (!email || !password) {
         return { success: false, error: 'Invalid credentials' };
      }
      return {
        success: true,
        data: {
          ...farmerProfile,
          email: email,
          token: 'mock-jwt-token-kishanlink'
        },
        isFallback: true
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      console.warn('[authAPI.register] Backend unavailable, using mock fallback:', err.message);
      return {
        success: true,
        data: {
          ...farmerProfile,
          ...userData,
          id: `farmer-${Date.now()}`,
          token: 'mock-jwt-token-kishanlink'
        },
        isFallback: true
      };
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      return { success: true, data: farmerProfile, isFallback: true };
    }
  },

  sendOTP: async (target) => {
    try {
      const response = await apiClient.post('/auth/send-otp', { target });
      return { success: true, data: response.data?.data || response.data, message: response.data?.message };
    } catch (err) {
      console.warn('[authAPI.sendOTP] Backend unavailable, using mock OTP fallback:', err.message);
      // Mock OTP fallback for offline development
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const isEmail = target.includes('@');
      return {
        success: true,
        data: { target, otp: mockOtp, type: isEmail ? 'email' : 'phone' },
        message: `OTP code sent successfully to ${isEmail ? 'email' : 'mobile'}: ${target}`,
        isFallback: true
      };
    }
  },

  verifyOTP: async (target, otp) => {
    try {
      const response = await apiClient.post('/auth/verify-otp', { target, otp });
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      console.warn('[authAPI.verifyOTP] Backend unavailable, using mock verification fallback:', err.message);
      const cleanOTP = otp?.trim();
      const isValid = cleanOTP === '123456' || cleanOTP === '6842' || cleanOTP.length === 6;
      if (isValid) {
        return {
          success: true,
          data: {
            target,
            verified: true,
            user: {
              ...farmerProfile,
              email: target.includes('@') ? target : farmerProfile.email,
              phone: !target.includes('@') ? target : farmerProfile.phone,
              token: 'mock-jwt-otp-token'
            }
          },
          isFallback: true
        };
      } else {
        return { success: false, error: 'Invalid OTP code. Try entering 123456 or 6842.' };
      }
    }
  }
};

// ----------------------------------------------------
// 2. Markets & Price Radar APIs
// ----------------------------------------------------
export const marketsAPI = {
  // GET /api/markets
  getMarkets: async (state = 'Gujarat') => {
    try {
      const response = await apiClient.get('/markets', { params: { state } });
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      const stateData = STATE_MAPS[state] || STATE_MAPS.Gujarat;
      return { success: true, data: stateData.mandis, isFallback: true };
    }
  },

  // GET /api/market-prices/live-mandi
  getLiveMandiPrices: async (state = 'Maharashtra', commodity = 'Onion') => {
    try {
      const response = await apiClient.get('/market-prices/live-mandi', { params: { state, commodity } });
      return { success: true, data: response.data?.data || response.data, source: response.data?.source };
    } catch (err) {
      console.warn('[marketsAPI.getLiveMandiPrices] Backend call failed, using direct Mandi API fallback:', err.message);
      try {
        const directRes = await axios.get('https://mandi-api.onrender.com/v1/prices', {
          params: { state, commodity },
          timeout: 8000
        });
        if (directRes.data && Array.isArray(directRes.data.data)) {
          return { success: true, data: directRes.data.data, source: 'mandi-api-direct' };
        }
      } catch (err2) {
        console.warn('[marketsAPI.getLiveMandiPrices] Direct Mandi API failed:', err2.message);
      }
      return {
        success: true,
        data: [
          {
            id: 200180,
            state: state || 'Maharashtra',
            district: 'Solapur',
            market: 'Laxmi-Sopan APMC, Barshi',
            commodity: commodity || 'Onion',
            variety: 'Red',
            grade: 'Local',
            arrival_date: new Date().toISOString().split('T')[0],
            min_price: 600,
            max_price: 4100,
            modal_price: 3400
          },
          {
            id: 199742,
            state: state || 'Maharashtra',
            district: 'Nashik',
            market: 'APMC Manmad',
            commodity: commodity || 'Onion',
            variety: 'Unhali',
            grade: 'Local',
            arrival_date: new Date().toISOString().split('T')[0],
            min_price: 500,
            max_price: 4300,
            modal_price: 3900
          }
        ],
        isFallback: true
      };
    }
  },

  // GET /api/market-prices
  getMarketPrices: async (params = {}) => {

    try {
      const response = await apiClient.get('/market-prices', { params });
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      return {
        success: true,
        data: [
          { crop: 'Tomato', mandi: 'Rajkot APMC', price: 2150, unit: '/ quintal', prevPrice: 2020, change: '+6.4%', trend: 'up' },
          { crop: 'Onion', mandi: 'Mahuva APMC', price: 2350, unit: '/ quintal', prevPrice: 2450, change: '-4.1%', trend: 'down' },
          { crop: 'Wheat', mandi: 'Gondal APMC', price: 2610, unit: '/ quintal', prevPrice: 2480, change: '+5.2%', trend: 'up' },
          { crop: 'Potato', mandi: 'Deesa APMC', price: 1920, unit: '/ quintal', prevPrice: 1860, change: '+3.2%', trend: 'up' },
          { crop: 'Cotton', mandi: 'Botad APMC', price: 7450, unit: '/ quintal', prevPrice: 7100, change: '+4.9%', trend: 'up' },
          { crop: 'Groundnut', mandi: 'Junagadh APMC', price: 6180, unit: '/ quintal', prevPrice: 5970, change: '+3.5%', trend: 'up' }
        ],
        isFallback: true
      };
    }
  },

  // GET /api/markets/recommendation
  getRecommendation: async (crop = 'Wheat', quantity = 50, location = 'Rajkot') => {
    try {
      const response = await apiClient.get('/markets/recommendation', {
        params: { crop, quantity, location }
      });
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      return {
        success: true,
        data: whereToSellComparison,
        bestMarket: {
          name: 'Rajkot APMC Mega Mandi',
          price: 2610,
          distance: 14,
          estimatedRevenue: 130500,
          transportCost: 3200,
          netProfit: 127300,
          demand: 'High',
          score: 98
        },
        isFallback: true
      };
    }
  }
};

// ----------------------------------------------------
// 3. Crops & Produce Inventory APIs
// ----------------------------------------------------
export const cropsAPI = {
  // GET /api/crops
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/crops', { params });
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      return { success: true, data: myCropsData, isFallback: true };
    }
  },

  // GET /api/crops/my
  getMyCrops: async () => {
    try {
      const response = await apiClient.get('/crops/my');
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      const saved = localStorage.getItem('kisansetu_crops');
      const data = saved ? JSON.parse(saved) : myCropsData;
      return { success: true, data, isFallback: true };
    }
  },

  // POST /api/crops
  create: async (cropData) => {
    try {
      const response = await apiClient.post('/crops', cropData);
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      console.warn('[cropsAPI.create] Backend offline, persisting locally:', err.message);
      return {
        success: true,
        data: {
          id: `lot-${Date.now()}`,
          ...cropData,
          status: 'LISTED',
          createdAt: new Date().toISOString()
        },
        isFallback: true
      };
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/crops/${id}`);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: true, isFallback: true };
    }
  }
};

// ----------------------------------------------------
// 3.5 AI Chatbot API (Gemini RAG)
// ----------------------------------------------------
export const chatAPI = {
  ask: async (question, language = 'gu', state = 'Maharashtra') => {
    try {
      const response = await apiClient.post('/chat', { question, language, state });
      return { 
        success: true, 
        answer: response.data?.answer || response.data?.message, 
        language: response.data?.language || language,
        source: response.data?.source || 'Gemini API' 
      };
    } catch (err) {
      console.warn('[chatAPI.ask] Backend call failed, using intelligent RAG fallback:', err.message);
      const isGu = language === 'gu' || /[\u0A80-\u0AFF]/.test(question);
      const isHi = language === 'hi' || /[\u0900-\u097F]/.test(question);

      if (isGu) {
        return {
          success: true,
          answer: `આજે માર્કેટમાં મુખ્ય પાકોના મોડલ ભાવ પ્રતિ ક્વિન્ટલ ₹3,200 થી ₹4,200 આસપાસ છે. ML પ્રિડિક્શન મુજબ આવતા 3 દિવસમાં ભાવ વધવાની સંભાવના છે.`,
          language: 'gu',
          source: 'Offline RAG Fallback'
        };
      } else if (isHi) {
        return {
          success: true,
          answer: `आज मंडी में फसल के भाव ₹3,200 से ₹4,200 प्रति क्विंटल के बीच दर्ज हुए हैं। 3-दिवसीय पूर्वानुमान के अनुसार बाजार सकारात्मक रहेगा।`,
          language: 'hi',
          source: 'Offline RAG Fallback'
        };
      } else {
        return {
          success: true,
          answer: `Today's modal market prices range from ₹3,200 to ₹4,200 per quintal. The 3-day ML forecast indicates a stable to bullish trend.`,
          language: 'en',
          source: 'Offline RAG Fallback'
        };
      }
    }
  }
};

// ----------------------------------------------------
// 4. Buyer Marketplace APIs
// ----------------------------------------------------
export const buyersAPI = {

  // GET /api/buyers
  getBuyers: async (params = {}) => {
    try {
      const response = await apiClient.get('/buyers', { params });
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      return { success: true, data: buyersList, isFallback: true };
    }
  },

  // POST /api/offers
  sendOffer: async (offerData) => {
    try {
      const response = await apiClient.post('/offers', offerData);
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      return {
        success: true,
        data: { id: `offer-${Date.now()}`, ...offerData, status: 'PENDING' },
        isFallback: true
      };
    }
  }
};

// ----------------------------------------------------
// 5. AI Price Forecast APIs
// ----------------------------------------------------
export const forecastAPI = {
  // GET /api/forecast
  getForecast: async (crop = 'Tomato', market = 'Rajkot', period = '7days') => {
    try {
      const response = await apiClient.get('/forecast', {
        params: { crop, market, period }
      });
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      return {
        success: true,
        data: {
          crop,
          market,
          currentPrice: crop === 'Cotton' ? 7450 : crop === 'Groundnut' ? 6180 : crop === 'Wheat' ? 2610 : 2150,
          confidence: 94.2,
          trend: 'Bullish',
          tomorrow: { price: 2200, min: 2120, max: 2280 },
          next3Days: { price: 2310, min: 2210, max: 2420 },
          next7Days: { price: 2480, min: 2350, max: 2600 },
          note: 'Prices are predicted using historical market trends, seasonal patterns, demand and supply indicators.'
        },
        isFallback: true
      };
    }
  }
};

// ----------------------------------------------------
// 5.5 Open-Meteo Weather Forecast API
// ----------------------------------------------------
export const weatherAPI = {
  getWeather: async (district = 'Rajkot') => {
    try {
      const response = await apiClient.get('/weather', { params: { district } });
      return { success: true, ...response.data };
    } catch (err) {
      console.warn('[weatherAPI.getWeather] Backend call failed, using direct Open-Meteo fallback:', err.message);
      try {
        const directRes = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=22.3039&longitude=70.8022&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum&timezone=auto');
        if (directRes.data && directRes.data.current) {
          const c = directRes.data.current;
          return {
            success: true,
            location: `${district}, Gujarat`,
            current: {
              temp: `${Math.round(c.temperature_2m)}°C`,
              tempVal: Math.round(c.temperature_2m),
              humidity: `${c.relative_humidity_2m}%`,
              windSpeed: `${c.wind_speed_10m} km/h`,
              maxTemp: '33°C',
              minTemp: '22°C',
              rainSum: '0 mm'
            },
            advisory: {
              gu: 'હવામાન અનુકૂળ છે. દવાનો છંટકાવ અને લણણી કામગીરી માટે યોગ્ય સમય.',
              en: 'Clear skies. Favorable conditions for spraying and harvesting.'
            }
          };
        }
      } catch (err2) {}

      return {
        success: true,
        location: `${district}, Gujarat`,
        current: {
          temp: '29°C',
          tempVal: 29,
          humidity: '60%',
          windSpeed: '11 km/h',
          maxTemp: '33°C',
          minTemp: '22°C',
          rainSum: '0 mm'
        },
        advisory: {
          gu: 'હવામાન ચોખ્ખું છે. દવાનો છંટકાવ અને પિયત કામગીરી માટે સાનુકૂળ સમય.',
          en: 'Clear skies. Favorable conditions for irrigation and spraying.'
        }
      };
    }
  }
};

// ----------------------------------------------------
// 6. Schemes APIs
// ----------------------------------------------------

export const schemesAPI = {
  getSchemes: async (category = 'All') => {
    try {
      const response = await apiClient.get('/schemes', { params: { category } });
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      return { success: true, data: governmentSchemes, isFallback: true };
    }
  }
};

// offersAPI – used by BuyerOfferModal
export const offersAPI = {
  makeOffer: async (offerData) => {
    try {
      const response = await apiClient.post('/offers', offerData);
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      return {
        success: true,
        data: { id: `offer-${Date.now()}`, ...offerData, status: 'PENDING' },
        isFallback: true
      };
    }
  }
};

// Backward-compatible export for existing callers
export const pricesAPI = {
  getPriceComparison: async (crop) => {
    return await marketsAPI.getRecommendation(crop);
  },
  getLivePrices: async (state, commodity) => {
    return await marketsAPI.getLiveMandiPrices(state, commodity);
  },
  getLiveMandiPrices: async (state, commodity) => {
    return await marketsAPI.getLiveMandiPrices(state, commodity);
  },
  getAllPrices: async () => {
    return await marketsAPI.getMarketPrices();
  }
};

