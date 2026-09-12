// Centralized API Service for KisanSetu
const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('kisansetu_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network request failed' }));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const api = {
  // Auth
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },
    register: async (userData) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    updateProfile: async (data) => {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    getDemoUsers: async () => {
      const res = await fetch(`${API_BASE_URL}/auth/demo-users`);
      return handleResponse(res);
    },
  },

  // Crops produce inventory
  crops: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/crops?${query}`);
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/crops/${id}`);
      return handleResponse(res);
    },
    getMyListings: async () => {
      const res = await fetch(`${API_BASE_URL}/crops/my/listings`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${API_BASE_URL}/crops`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    update: async (id, data) => {
      const res = await fetch(`${API_BASE_URL}/crops/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/crops/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Market Prices & Decision Engines
  prices: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/prices?${query}`);
      return handleResponse(res);
    },
    getRadar: async (cropName = 'Wheat') => {
      const res = await fetch(`${API_BASE_URL}/prices/radar/${encodeURIComponent(cropName)}`);
      return handleResponse(res);
    },
    getWhereToSell: async (data) => {
      const res = await fetch(`${API_BASE_URL}/prices/where-to-sell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    getForecast: async (cropName = 'Wheat') => {
      const res = await fetch(`${API_BASE_URL}/prices/forecast/${encodeURIComponent(cropName)}`);
      return handleResponse(res);
    },
    addPrice: async (data) => {
      const res = await fetch(`${API_BASE_URL}/prices`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
  },

  // Offers
  offers: {
    create: async (data) => {
      const res = await fetch(`${API_BASE_URL}/offers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    getMyOffers: async () => {
      const res = await fetch(`${API_BASE_URL}/offers/my-offers`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    updateStatus: async (id, status, counterPrice = null) => {
      const res = await fetch(`${API_BASE_URL}/offers/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, counterPrice }),
      });
      return handleResponse(res);
    },
  },

  // Orders
  orders: {
    createDirect: async (data) => {
      const res = await fetch(`${API_BASE_URL}/orders/direct`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    getMyOrders: async () => {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    updateStatus: async (id, orderStatus, note = '') => {
      const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ orderStatus, note }),
      });
      return handleResponse(res);
    },
  },

  // Chat & Messages
  chat: {
    getConversations: async () => {
      const res = await fetch(`${API_BASE_URL}/chat/conversations`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getMessagesWithUser: async (targetUserId) => {
      const res = await fetch(`${API_BASE_URL}/chat/messages/${targetUserId}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    sendMessage: async (data) => {
      const res = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    askAiAssistant: async (query, language = 'en') => {
      const res = await fetch(`${API_BASE_URL}/chat/ai-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language }),
      });
      return handleResponse(res);
    },
  },

  // Price Alerts
  alerts: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/alerts`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${API_BASE_URL}/alerts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    toggle: async (id) => {
      const res = await fetch(`${API_BASE_URL}/alerts/${id}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/alerts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Government Schemes & MSP
  schemes: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/schemes?${query}`);
      return handleResponse(res);
    },
    getMspRates: async () => {
      const res = await fetch(`${API_BASE_URL}/schemes/msp-rates`);
      return handleResponse(res);
    },
  },

  // Crop Advisory
  advisory: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/advisory?${query}`);
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${API_BASE_URL}/advisory`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
  },

  // Admin Dashboard
  admin: {
    getStats: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getUsers: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/admin/users?${query}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    toggleVerification: async (userId) => {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/verify`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    toggleActive: async (userId) => {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/toggle-active`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Analytics
  analytics: {
    getDashboard: async () => {
      const res = await fetch(`${API_BASE_URL}/analytics`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },
};
