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
import MyCrops from './components/views/MyCrops';
import PriceForecast from './components/views/PriceForecast';
import PriceJourney from './components/views/PriceJourney';
import ProfileSettings from './components/views/ProfileSettings';
import SchemesView from './components/views/SchemesView';
import MessagesView from './components/views/MessagesView';

// Modals
import AddCropModal from './components/modals/AddCropModal';
import BuyerOfferModal from './components/modals/BuyerOfferModal';
import EditProfileModal from './components/modals/EditProfileModal';
import KrishiWorldVideoModal from './components/modals/KrishiWorldVideoModal';

// Mock Data & Translations
import { myCropsData, farmerProfile } from './data/mockData';
import { translations } from './data/translations';
import { cropsAPI, authAPI, checkBackendHealth } from './services/api';

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
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return myCropsData;
  });
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Modal States
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [selectedBuyerForOffer, setSelectedBuyerForOffer] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isKrishiVideoOpen, setIsKrishiVideoOpen] = useState(true);
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
        if (cropsRes.success && Array.isArray(cropsRes.data) && cropsRes.data.length > 0) {
          const mappedCrops = cropsRes.data.map((c) => ({
            id: c._id,
            name: c.cropName,
            variety: 'Desi Supreme',
            quantity: `${c.quantity} ${c.unit || 'Quintal'}`,
            qtyValue: c.quantity,
            price: Number(c.expectedPrice).toLocaleString(),
            grade: 'GRADE_A',
            unit: `/ ${c.unit || 'Q'}`,
            change: '+5.0%',
            trend: 'up',
            status: c.status?.toUpperCase() || 'LISTED',
            image: c.cropName?.toLowerCase().includes('cotton')
              ? 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
            health: 'Good Health',
            nextAction: 'Market rates are favorable. Produce lot is listed.'
          }));
          setCrops(mappedCrops);
        }
      }
    };

    syncBackend();
  }, [isLoggedIn]);

  const handleLoginSuccess = (userData, token) => {
    const userToSet = { ...farmerProfile, ...userData };
    setCurrentUser(userToSet);
    setIsLoggedIn(true);
    setIsKrishiVideoOpen(true);
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
    showToast(language === 'gu' ? 'તમે સફળતાપૂર્વક લૉગ આઉટ થયા છો.' : language === 'hi' ? 'आप सफलतापूर्वक लॉग आउट हो गए हैं।' : 'You have been successfully logged out.');
  };

  const handleTabChange = (targetTab) => {
    if (!isLoggedIn && targetTab !== 'landing' && targetTab !== 'auth') {
      setIsLoggedIn(true);
      setActiveTab(targetTab);
      return;
    }
    setActiveTab(targetTab);
  };

  const handleAddCrop = async (newCrop) => {
    const updated = [newCrop, ...crops];
    setCrops(updated);
    try {
      localStorage.setItem('kisansetu_crops', JSON.stringify(updated));
    } catch (e) {}
    setActiveTab('my-crops');
    showToast(`🌾 ${newCrop.name} added to produce inventory!`);

    // Async push to backend
    try {
      const cleanPrice = Number(String(newCrop.price).replace(/[^0-9.]/g, '')) || 2500;
      await cropsAPI.create({
        cropName: newCrop.name,
        quantity: Number(newCrop.qtyValue) || 10,
        unit: 'Quintal',
        expectedPrice: cleanPrice,
        location: currentUser.location || 'Rajkot, Gujarat',
        harvestDate: newCrop.harvestDate || new Date().toISOString(),
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
      <>
        <LandingPage
          isLoggedIn={isLoggedIn}
          onExploreApp={(targetTab = 'home') => handleTabChange(targetTab)}
          onOpenAuth={(mode = 'signin') => {
            setAuthInitialMode(mode);
            setActiveTab('auth');
          }}
          onOpenKrishiVideo={() => setIsKrishiVideoOpen(true)}
          language={language}
          setLanguage={handleSetLanguage}
        />
        <KrishiWorldVideoModal
          isOpen={isKrishiVideoOpen}
          onClose={() => setIsKrishiVideoOpen(false)}
          onComplete={() => {
            setIsKrishiVideoOpen(false);
            // Removed automatic redirect to 'home' so the user stays on the beautiful landing page
          }}
        />
      </>
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
      />

      {/* Main Content Area */}
      <div className="main-content-area">
        {/* Top Header & Screen Switcher */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          language={language}
          setLanguage={handleSetLanguage}
          user={currentUser}
          onLogout={handleLogout}
        />

        {/* View Viewport */}
        <main className="view-viewport">
          {activeTab === 'home' && (
            <HomeDashboard setActiveTab={setActiveTab} />
          )}

          {activeTab === 'price-radar' && (
            <PriceRadar setActiveTab={setActiveTab} />
          )}

          {activeTab === 'where-to-sell' && (
            <WhereShouldISell setActiveTab={setActiveTab} />
          )}

          {activeTab === 'market-prices' && (
            <MarketPrices />
          )}

          {activeTab === 'buyers' && (
            <BuyerMarketplace
              setSelectedBuyerForOffer={setSelectedBuyerForOffer}
              setIsListingProduceModalOpen={() => setIsAddCropOpen(true)}
            />
          )}

          {activeTab === 'my-crops' && (
            <MyCrops
              crops={crops}
              setIsAddCropOpen={setIsAddCropOpen}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'price-forecast' && (
            <PriceForecast />
          )}

          {activeTab === 'price-journey' && (
            <PriceJourney setActiveTab={setActiveTab} />
          )}

          {activeTab === 'schemes' && (
            <SchemesView setActiveTab={setActiveTab} />
          )}

          {activeTab === 'messages' && (
            <MessagesView />
          )}

          {activeTab === 'profile' && (
            <ProfileSettings
              farmerData={currentUser}
              setIsEditProfileOpen={setIsEditProfileOpen}
              setActiveTab={setActiveTab}
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
      />

      <BuyerOfferModal
        buyer={selectedBuyerForOffer}
        onClose={() => setSelectedBuyerForOffer(null)}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        farmerData={currentUser}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleSaveProfile}
      />

      <KrishiWorldVideoModal
        isOpen={isKrishiVideoOpen}
        onClose={() => setIsKrishiVideoOpen(false)}
        onComplete={() => setIsKrishiVideoOpen(false)}
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
