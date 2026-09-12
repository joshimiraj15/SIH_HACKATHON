// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

// Layout & Auth
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AuthPage from './components/auth/AuthPage';

// AI Chatbot
import AIChatbot from './components/chat/AIChatbot';

// 19 Complete Marketplace Views
import HomeDashboard from './components/views/HomeDashboard';
import MarketPricesView from './components/views/MarketPricesView';
import PriceRadar from './components/views/PriceRadar';
import WhereShouldISell from './components/views/WhereShouldISell';
import ProfitCalculatorView from './components/views/ProfitCalculatorView';
import MarketMapView from './components/views/MarketMapView';
import BuyerMarketplace from './components/views/BuyerMarketplace';
import MyCrops from './components/views/MyCrops';
import OffersView from './components/views/OffersView';
import OrdersView from './components/views/OrdersView';
import PriceForecast from './components/views/PriceForecast';
import PriceJourney from './components/views/PriceJourney';
import PriceAlertsView from './components/views/PriceAlertsView';
import CropAdvisoryView from './components/views/CropAdvisoryView';
import SchemesView from './components/views/SchemesView';
import MessagesView from './components/views/MessagesView';
import AnalyticsView from './components/views/AnalyticsView';
import AdminDashboard from './components/views/AdminDashboard';
import ProfileSettings from './components/views/ProfileSettings';

// Modals
import AddCropModal from './components/modals/AddCropModal';
import BuyerOfferModal from './components/modals/BuyerOfferModal';
import EditProfileModal from './components/modals/EditProfileModal';

// API & Translations
import { api } from './services/api';
import { translations } from './data/translations';
import { farmerProfile } from './data/mockData';

function App() {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('kisansetu_user');
    return saved ? JSON.parse(saved) : {
      ...farmerProfile,
      name: 'Ramesh Patel',
      role: 'farmer',
      email: 'farmer@kisansetu.com',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      location: { district: 'Rajkot', state: 'Gujarat' }
    };
  });

  // Language State: 'en', 'gu', 'hi'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('kisansetu_lang') || 'en';
  });

  // Night Mode Theme
  const [isNightMode, setIsNightMode] = useState(() => {
    return localStorage.getItem('kisansetu_theme') === 'night';
  });

  useEffect(() => {
    if (isNightMode) {
      document.body.classList.add('night-mode');
      localStorage.setItem('kisansetu_theme', 'night');
    } else {
      document.body.classList.remove('night-mode');
      localStorage.setItem('kisansetu_theme', 'day');
    }
  }, [isNightMode]);

  const handleSetLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('kisansetu_lang', lang);
  };

  const [activeTab, setActiveTab] = useState('home');

  // Modal States
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [selectedCropForOffer, setSelectedCropForOffer] = useState(null);
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

  const handleLoginSuccess = (userData, token) => {
    const userToSet = { ...farmerProfile, ...userData };
    setCurrentUser(userToSet);
    setIsLoggedIn(true);
    localStorage.setItem('kisansetu_user', JSON.stringify(userToSet));
    if (token) localStorage.setItem('kisansetu_token', token);
    showToast(`🌾 ${t.welcomeBack || 'Welcome back'} (${userToSet.name})`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('kisansetu_token');
    showToast(language === 'gu' ? 'તમે સફળતાપૂર્વક લૉગ આઉટ થયા છો.' : language === 'hi' ? 'आप सफलतापूर्वक लॉग आउट हो गए हैं।' : 'You have been successfully logged out.');
  };

  // Instant switch role helper for live judging / pairing
  const handleSwitchUser = async (role) => {
    try {
      let email = 'farmer@kisansetu.com';
      let pass = 'farmer123';
      if (role === 'buyer') {
        email = 'buyer@kisansetu.com';
        pass = 'buyer123';
      } else if (role === 'admin') {
        email = 'admin@kisansetu.com';
        pass = 'admin123';
      }

      const res = await api.auth.login(email, pass);
      if (res.success && res.user) {
        handleLoginSuccess(res.user, res.token);
        if (role === 'buyer') setActiveTab('buyers');
        else if (role === 'admin') setActiveTab('admin');
        else setActiveTab('home');
      }
    } catch (err) {
      console.error('Role switch error:', err);
      showToast('Switched to ' + role + ' mode');
    }
  };

  const handleSaveProfile = (updated) => {
    const merged = { ...currentUser, ...updated };
    setCurrentUser(merged);
    localStorage.setItem('kisansetu_user', JSON.stringify(merged));
    showToast(`✅ Profile for ${merged.name} updated!`);
  };

  // If user is not logged in, render the Auth Page
  if (!isLoggedIn) {
    return (
      <AuthPage 
        onLoginSuccess={handleLoginSuccess}
        language={language}
        setLanguage={handleSetLanguage}
      />
    );
  }

  return (
    <div className={`app-container ${isNightMode ? 'night-mode' : ''}`}>
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
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
          isNightMode={isNightMode}
          setIsNightMode={setIsNightMode}
          onSwitchUser={handleSwitchUser}
        />

        {/* View Viewport */}
        <main className="view-viewport">
          {activeTab === 'home' && (
            <HomeDashboard 
              setActiveTab={setActiveTab} 
              currentUser={currentUser} 
              isNightMode={isNightMode} 
            />
          )}

          {activeTab === 'market-prices' && (
            <MarketPricesView setActiveTab={setActiveTab} />
          )}

          {activeTab === 'price-radar' && (
            <PriceRadar setActiveTab={setActiveTab} />
          )}

          {activeTab === 'where-to-sell' && (
            <WhereShouldISell setActiveTab={setActiveTab} />
          )}

          {activeTab === 'profit-calc' && (
            <ProfitCalculatorView setActiveTab={setActiveTab} />
          )}

          {activeTab === 'market-map' && (
            <MarketMapView setActiveTab={setActiveTab} />
          )}

          {activeTab === 'buyers' && (
            <BuyerMarketplace 
              setSelectedCropForOffer={setSelectedCropForOffer}
              setSelectedBuyerForOffer={setSelectedBuyerForOffer}
              setActiveTab={setActiveTab}
              currentUser={currentUser}
              showToast={showToast}
            />
          )}

          {activeTab === 'my-crops' && (
            <MyCrops 
              setIsAddCropOpen={() => setIsAddCropOpen(true)}
              setActiveTab={setActiveTab}
              showToast={showToast}
            />
          )}

          {activeTab === 'offers' && (
            <OffersView 
              setActiveTab={setActiveTab}
              currentUser={currentUser}
              showToast={showToast}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView 
              currentUser={currentUser}
              showToast={showToast}
            />
          )}

          {activeTab === 'price-forecast' && (
            <PriceForecast />
          )}

          {activeTab === 'price-journey' && (
            <PriceJourney setActiveTab={setActiveTab} />
          )}

          {activeTab === 'alerts' && (
            <PriceAlertsView showToast={showToast} />
          )}

          {activeTab === 'advisory' && (
            <CropAdvisoryView />
          )}

          {activeTab === 'schemes' && (
            <SchemesView setActiveTab={setActiveTab} />
          )}

          {activeTab === 'messages' && (
            <MessagesView currentUser={currentUser} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView currentUser={currentUser} />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard showToast={showToast} />
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
        onCropCreated={() => {
          showToast('🌾 Produce listing created in KisanSetu Marketplace!');
          setActiveTab('my-crops');
        }}
        showToast={showToast}
      />

      <BuyerOfferModal 
        crop={selectedCropForOffer}
        buyer={selectedBuyerForOffer}
        onClose={() => {
          setSelectedCropForOffer(null);
          setSelectedBuyerForOffer(null);
        }}
        onOfferCreated={() => {
          showToast('💼 Offer sent to seller!');
          setActiveTab('offers');
        }}
        showToast={showToast}
      />

      <EditProfileModal 
        isOpen={isEditProfileOpen}
        farmerData={currentUser}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleSaveProfile}
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
