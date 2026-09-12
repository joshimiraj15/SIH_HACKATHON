// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

// Layout & Auth
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MarketTicker from './components/layout/MarketTicker';
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return true; // Bypass auth for demo
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

  const [activeTab, setActiveTab] = useState('home');
  const [crops, setCrops] = useState(myCropsData);

  // Modal States
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [selectedBuyerForOffer, setSelectedBuyerForOffer] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isKrishiVideoOpen, setIsKrishiVideoOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const t = translations[language] || translations.en;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

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

  const handleAddCrop = (newCrop) => {
    setCrops([newCrop, ...crops]);
    showToast(`🌾 ${newCrop.name} added to produce inventory!`);
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
        onOpenHelp={() => setIsKrishiVideoOpen(true)}
      />

      {/* Main Content Area */}
      <div className="main-content-area">
        <MarketTicker />
        {/* Top Header & Screen Switcher Removed */}

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
