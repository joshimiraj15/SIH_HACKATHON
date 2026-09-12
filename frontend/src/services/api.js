// src/services/api.js
// Centralized API Client for Kishan Setu Backend & ML Services

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to get Auth Headers with JWT Token from localStorage
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('kisansetu_token');
  return {
    'Content-Type': 'application/json',
    ...(token && token !== 'undefined' ? { Authorization: `Bearer ${token}` } : {})
  };
};

/**
 * Generic Fetch wrapper with error handling and fallback support
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    ...getAuthHeaders(),
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `HTTP error ${response.status}`;
      return {
        success: false,
        error: errorMsg,
        status: response.status,
        data: null
      };
    }

    return {
      success: true,
      data: data?.data !== undefined ? data.data : data,
      raw: data
    };
  } catch (err) {
    console.warn(`[API Network Error] on ${url}:`, err.message);
    return {
      success: false,
      error: err.message,
      networkError: true,
      data: null
    };
  }
}

// ----------------------------------------------------
// 1. Authentication APIs
// ----------------------------------------------------
export const authAPI = {
  login: async (email, password) => {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (userData) => {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getProfile: async () => {
    return await request('/auth/profile', {
      method: 'GET'
    });
  }
};

// ----------------------------------------------------
// 2. Crops / Produce Lot APIs
// ----------------------------------------------------
export const cropsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await request(`/crops${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  getMyCrops: async () => {
    return await request('/crops/my', { method: 'GET' });
  },

  getById: async (id) => {
    return await request(`/crops/${id}`, { method: 'GET' });
  },

  create: async (cropData) => {
    return await request('/crops', {
      method: 'POST',
      body: JSON.stringify(cropData)
    });
  },

  update: async (id, updateData) => {
    return await request(`/crops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  delete: async (id) => {
    return await request(`/crops/${id}`, {
      method: 'DELETE'
    });
  }
};

// ----------------------------------------------------
// 3. APMC Mandi Prices & Price Discovery APIs
// ----------------------------------------------------
export const pricesAPI = {
  getAllPrices: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await request(`/prices${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  searchPrices: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await request(`/prices/search${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  getPriceComparison: async (commodity) => {
    return await request(`/prices/comparison?commodity=${encodeURIComponent(commodity)}`, { method: 'GET' });
  },

  getPriceHistory: async (commodity, market) => {
    const params = new URLSearchParams();
    if (commodity) params.append('commodity', commodity);
    if (market) params.append('market', market);
    return await request(`/prices/history?${params.toString()}`, { method: 'GET' });
  },

  getLatestByCrop: async (cropName) => {
    return await request(`/prices/latest/${encodeURIComponent(cropName)}`, { method: 'GET' });
  },

  discoverPrice: async (cropName, state, district) => {
    const params = new URLSearchParams();
    if (state) params.append('state', state);
    if (district) params.append('district', district);
    return await request(`/prices/discover/${encodeURIComponent(cropName)}?${params.toString()}`, { method: 'GET' });
  }
};

// ----------------------------------------------------
// 4. Buyer Offers APIs
// ----------------------------------------------------
export const offersAPI = {
  getOffers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await request(`/offers${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  makeOffer: async (offerData) => {
    return await request('/offers', {
      method: 'POST',
      body: JSON.stringify(offerData)
    });
  },

  acceptOffer: async (offerId) => {
    return await request(`/offers/${offerId}/accept`, {
      method: 'PUT'
    });
  },

  rejectOffer: async (offerId) => {
    return await request(`/offers/${offerId}/reject`, {
      method: 'PUT'
    });
  }
};

// ----------------------------------------------------
// 5. Prediction & AI Advisory APIs
// ----------------------------------------------------
export const predictionsAPI = {
  getPredictions: async (cropName, marketName) => {
    const params = new URLSearchParams();
    if (cropName) params.append('crop', cropName);
    if (marketName) params.append('market', marketName);
    return await request(`/predictions?${params.toString()}`, { method: 'GET' });
  },

  getRecommendations: async (cropName) => {
    const query = cropName ? `?crop=${encodeURIComponent(cropName)}` : '';
    return await request(`/recommendations${query}`, { method: 'GET' });
  }
};

// ----------------------------------------------------
// 6. Backend Server Health Check
// ----------------------------------------------------
export const checkBackendHealth = async () => {
  try {
    const res = await fetch('http://localhost:5000/', { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      return { online: true, message: data.message };
    }
    return { online: false, message: 'Server returned error status' };
  } catch (e) {
    return { online: false, message: 'Backend server not responding on port 5000' };
  }
};

export default {
  auth: authAPI,
  crops: cropsAPI,
  prices: pricesAPI,
  offers: offersAPI,
  predictions: predictionsAPI,
  checkBackendHealth
};
