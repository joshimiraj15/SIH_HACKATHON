// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

// Layout & Auth
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AuthPage from './components/auth/AuthPage';

// AI Chatbot
import AIChatbot from './components/chat/AIChatbot';

// 8 Views
import LandingPage from './components/views/LandingPage';
import HomeDashboard from './components/views/HomeDashboard';
import MarketPrices from './components/MarketPrices';
import PriceRadar from './components/views/PriceRadar';
import WhereShouldISell from './components/views/WhereShouldISell';
import BuyerMarketplace from './components/views/BuyerMarketplace';
import CropMarketplace from './components/views/CropMarketplace';
import MyCrops from './components/views/MyCrops';
import PriceForecast from './components/views/PriceForecast';
import PriceJourney from './components/views/PriceJourney';
import ProfileSettings from './components/views/ProfileSettings';
import SchemesView from './components/views/SchemesView';
import MessagesView from './components/views/MessagesView';
import AdminPanel from './components/views/AdminPanel';


// Modals
import AddCropModal from './components/modals/AddCropModal';
import BuyerOfferModal from './components/modals/BuyerOfferModal';
import EditProfileModal from './components/modals/EditProfileModal';


// Mock Data & Translations
import { myCropsData, farmerProfile } from './data/mockData';
import { translations } from './data/translations';
import { cropsAPI, authAPI, checkBackendHealth } from './services/api';

const CROP_IMAGES = {
  cotton: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&auto=format&fit=crop&q=80',
  wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80',
  groundnut: 'https://images.unsplash.com/photo-1568290740643-98fa20325b5a?w=400&auto=format&fit=crop&q=80',
  soybean: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?w=400&auto=format&fit=crop&q=80',
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80'
};

const getCropImage = (cropName) => {
  if (!cropName) return CROP_IMAGES.wheat;
  const lower = String(cropName).toLowerCase();
  for (const [key, url] of Object.entries(CROP_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return CROP_IMAGES.wheat;
};

export const normalizeCrop = (c) => {
  const name = c.name || c.cropName || 'Crop Lot';
  
  // Resolve valid clean price - never return NaN
  let priceStr = '2,480';
  const rawPrice = c.price ?? c.expectedPrice;
  if (rawPrice !== undefined && rawPrice !== null && String(rawPrice) !== 'NaN') {
    const cleanNum = Number(String(rawPrice).replace(/[^0-9.]/g, ''));
    if (!isNaN(cleanNum) && cleanNum > 0) {
      priceStr = cleanNum.toLocaleString('en-IN');
    }
  }

  const quantity = c.quantity || (c.qtyValue ? `${c.qtyValue} Quintals` : '10 Quintals');
  const image = c.image && !c.image.includes('NaN') ? c.image : getCropImage(name);

  return {
    id: c.id || c._id || `lot-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name,
    variety: c.variety || 'Desi Supreme',
    quantity,
    qtyValue: c.qtyValue || Number(String(quantity).replace(/[^0-9.]/g, '')) || 10,
    price: priceStr,
    grade: c.grade || 'GRADE_A',
    unit: c.unit || '/ Q',
    change: c.change || '+5.0%',
    trend: c.trend || 'up',
    status: c.status || 'Ready for Mandi',
    image,
    health: c.health || 'Good Health',
    nextAction: c.nextAction || 'Market rates are favorable. Produce lot is listed.',
    harvestDate: c.harvestDate || '',
    location: c.location || '',
    description: c.description || ''
  };
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('kisansetu_token'));
  });
  const [authInitialMode, setAuthInitialMode] = useState('signin');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('kisansetu_user');
    return saved ? JSON.parse(saved) : farmerProfile;
  });

  // Language State: 'en', 'gu', 'hi'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('kisansetu_lang') || 'en';
  });

  const handleSetLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('kisansetu_lang', lang);
  };

  const [activeTab, setActiveTab] = useState('landing');
  const [crops, setCrops] = useState(() => {
    try {
      const saved = localStorage.getItem('kisansetu_crops');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If all saved items were corrupted with NaN or missing names, reset
          const isCorrupted = parsed.every(c => !c.name && !c.cropName || String(c.price).includes('NaN'));
          if (!isCorrupted) {
            return parsed.map(c => normalizeCrop(c));
          }
        }
      }
    } catch (e) {}
    return myCropsData.map(c => normalizeCrop(c));
  });
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal States
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [selectedBuyerForOffer, setSelectedBuyerForOffer] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);

  const t = translations[language] || translations.en;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync with backend on mount
  useEffect(() => {
    const syncBackend = async () => {
      const health = await checkBackendHealth();
      setIsBackendConnected(health.online);

      const token = localStorage.getItem('kisansetu_token');
      if (token && token !== 'undefined') {
        const cropsRes = await cropsAPI.getMyCrops();
        // Only override if real data was returned from the online server (not local fallback)
        if (cropsRes.success && !cropsRes.isFallback && Array.isArray(cropsRes.data) && cropsRes.data.length > 0) {
          const mappedCrops = cropsRes.data.map((c) => normalizeCrop(c));
          setCrops(mappedCrops);
          localStorage.setItem('kisansetu_crops', JSON.stringify(mappedCrops));
        }
      }
    };

    syncBackend();
  }, [isLoggedIn]);

  const handleLoginSuccess = (userData, token) => {
    const userToSet = { ...farmerProfile, ...userData };
    setCurrentUser(userToSet);
    setIsLoggedIn(true);

    setActiveTab('home');
    localStorage.setItem('kisansetu_user', JSON.stringify(userToSet));
    if (token) localStorage.setItem('kisansetu_token', token);
    showToast(`🌾 ${t.welcomeBack} (${userToSet.name})`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('landing');
    localStorage.removeItem('kisansetu_token');
    localStorage.removeItem('kisansetu_user');
    showToast(t.logoutSuccess);
  };

  const handleTabChange = (targetTab) => {
    if (!isLoggedIn && targetTab !== 'landing' && targetTab !== 'auth') {
      setAuthInitialMode('signin');
      setActiveTab('auth');
      return;
    }

    setActiveTab(targetTab);
  };

  const handleAddCrop = async (newCrop) => {
    const normalized = normalizeCrop(newCrop);
    const updated = [normalized, ...crops];
    setCrops(updated);
    try {
      localStorage.setItem('kisansetu_crops', JSON.stringify(updated));
    } catch (e) {}
    setActiveTab('my-crops');
    showToast(`🌾 ${normalized.name} added to produce inventory!`);

    // Async push to backend
    try {
      const cleanPrice = Number(String(normalized.price).replace(/[^0-9.]/g, '')) || 2500;
      await cropsAPI.create({
        cropName: normalized.name,
        quantity: Number(normalized.qtyValue) || 10,
        unit: 'Quintal',
        expectedPrice: cleanPrice,
        location: currentUser.location || 'Rajkot, Gujarat',
        harvestDate: normalized.harvestDate || new Date().toISOString(),
        description: `Listed by ${currentUser.name}`
      });
    } catch (err) {
      console.warn('Could not save crop to backend, kept in local state.');
    }
  };

  const handleSaveProfile = (updated) => {
    const merged = { ...currentUser, ...updated };
    setCurrentUser(merged);
    localStorage.setItem('kisansetu_user', JSON.stringify(merged));
    showToast(`✅ Profile for ${merged.name} updated!`);
  };

  // View Routing Logic
  if (activeTab === 'landing') {
    return (
      <LandingPage
        isLoggedIn={isLoggedIn}
        onExploreApp={(targetTab = 'home') => handleTabChange(targetTab)}
        onOpenAuth={(mode = 'signin') => {
          setAuthInitialMode(mode);
          setActiveTab('auth');
        }}
        language={language}
        setLanguage={handleSetLanguage}
      />
    );
  }

  if (activeTab === 'auth') {
    return (
      <AuthPage
        initialMode={authInitialMode}
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => setActiveTab('landing')}
        language={language}
        setLanguage={handleSetLanguage}
      />
    );
  }

  // Auth Guard for all internal dashboard views
  if (!isLoggedIn) {
    return (
      <AuthPage
        initialMode="signin"
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => setActiveTab('landing')}
        language={language}
        setLanguage={handleSetLanguage}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        language={language}
        user={currentUser}
        onLogout={handleLogout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-content-area">
        {/* Top Header & Screen Switcher */}
        <Header
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          language={language}
          setLanguage={handleSetLanguage}
          user={currentUser}
          onLogout={handleLogout}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* View Viewport */}
        <main className="view-viewport">
          {activeTab === 'home' && (
            <HomeDashboard setActiveTab={setActiveTab} user={currentUser} language={language} showToast={showToast} />
          )}

          {activeTab === 'assistant' && (
            <AIChatbot language={language} setLanguage={handleSetLanguage} setActiveTab={setActiveTab} isFullPage={true} />
          )}

          {activeTab === 'markets' && (
            <MarketPrices language={language} setActiveTab={setActiveTab} showToast={showToast} />
          )}

          {activeTab === 'prediction' && (
            <PriceForecast language={language} />
          )}

          {activeTab === 'admin' && (
            <AdminPanel />
          )}

          {activeTab === 'price-radar' && (
            <PriceRadar setActiveTab={setActiveTab} language={language} />
          )}

          {activeTab === 'where-to-sell' && (
            <WhereShouldISell setActiveTab={setActiveTab} showToast={showToast} language={language} />
          )}

          {activeTab === 'market-prices' && (
            <MarketPrices language={language} setActiveTab={setActiveTab} showToast={showToast} />
          )}

          {activeTab === 'buyers' && (
            <BuyerMarketplace
              setSelectedBuyerForOffer={setSelectedBuyerForOffer}
              setIsListingProduceModalOpen={() => setIsAddCropOpen(true)}
              setActiveTab={setActiveTab}
              showToast={showToast}
              language={language}
            />
          )}

          {activeTab === 'crop-marketplace' && (
            <CropMarketplace setActiveTab={setActiveTab} showToast={showToast} language={language} />
          )}

          {activeTab === 'my-crops' && (
            <MyCrops
              crops={crops}
              setCrops={setCrops}
              setIsAddCropOpen={setIsAddCropOpen}
              setActiveTab={setActiveTab}
              language={language}
            />
          )}

          {activeTab === 'price-forecast' && (
            <PriceForecast language={language} />
          )}

          {activeTab === 'price-journey' && (
            <PriceJourney setActiveTab={setActiveTab} language={language} />
          )}

          {activeTab === 'schemes' && (
            <SchemesView setActiveTab={setActiveTab} language={language} />
          )}

          {activeTab === 'messages' && (
            <MessagesView language={language} showToast={showToast} />
          )}

          {activeTab === 'profile' && (
            <ProfileSettings
              farmerData={currentUser}
              setIsEditProfileOpen={setIsEditProfileOpen}
              setActiveTab={setActiveTab}
              showToast={showToast}
              language={language}
              setLanguage={handleSetLanguage}
              onLogout={handleLogout}
            />
          )}

        </main>
      </div>

      {/* Floating AI Agricultural Chatbot */}
      <AIChatbot
        language={language}
        setLanguage={handleSetLanguage}
        setActiveTab={setActiveTab}
      />

      {/* Modals */}
      <AddCropModal
        isOpen={isAddCropOpen}
        onClose={() => setIsAddCropOpen(false)}
        onAddCrop={handleAddCrop}
        language={language}
      />

      <BuyerOfferModal
        buyer={selectedBuyerForOffer}
        onClose={() => setSelectedBuyerForOffer(null)}
        language={language}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        farmerData={currentUser}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleSaveProfile}
        language={language}
      />



      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="toast-success">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;
