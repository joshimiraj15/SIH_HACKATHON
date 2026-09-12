// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

// Layout & Auth
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AuthPage from './components/auth/AuthPage';

// AI Chatbot
import AIChatbot from './components/chat/AIChatbot';

// Views
import LandingPage from './components/views/LandingPage';
import HomeDashboard from './components/views/HomeDashboard';
import MarketPrices from './components/MarketPrices';
import PriceRadar from './components/views/PriceRadar';
import WhereShouldISell from './components/views/WhereShouldISell';
import BuyerMarketplace from './components/views/BuyerMarketplace';
import BuyerDashboard from './components/views/BuyerDashboard';
import MyCrops from './components/views/MyCrops';
import PriceForecast from './components/views/PriceForecast';
import PriceJourney from './components/views/PriceJourney';
import ProfileSettings from './components/views/ProfileSettings';
import SchemesView from './components/views/SchemesView';
import MessagesView from './components/views/MessagesView';

// Modals
import AddCropModal from './components/modals/AddCropModal';
import BuyerOfferModal from './components/modals/BuyerOfferModal';
import PlaceOrderModal from './components/modals/PlaceOrderModal';
import EditProfileModal from './components/modals/EditProfileModal';

// Mock Data & Translations
import { myCropsData, farmerProfile } from './data/mockData';
import { translations } from './data/translations';
import { cropsAPI, authAPI, offersAPI, checkBackendHealth } from './services/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('kisansetu_token'));
  });
  const [authInitialMode, setAuthInitialMode] = useState('signin');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('kisansetu_user');
    return saved ? JSON.parse(saved) : farmerProfile;
  });

  const [activeRole, setActiveRole] = useState(() => {
    const saved = localStorage.getItem('kisansetu_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role?.toLowerCase() === 'buyer') return 'buyer';
      } catch (e) {}
    }
    return 'farmer';
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

  const [buyerOffers, setBuyerOffers] = useState(() => {
    try {
      const saved = localStorage.getItem('kisansetu_offers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 'offer-1',
        cropId: 'crop-1',
        cropName: 'Wheat (Sharbati Gold)',
        farmerName: 'Meet Maniya',
        farmerLocation: 'Rajkot, Gujarat',
        buyerName: 'AgroFresh Foods',
        offeredPrice: 2520,
        quantity: 100,
        totalValue: 252000,
        paymentTerm: 'Instant Digital Transfer (UPI/RTGS)',
        logistics: 'Farm Gate Pickup (Buyer Arranged)',
        notes: 'Interested in Grade A Sharbati wheat batch.',
        status: 'pending',
        timestamp: 'Today'
      }
    ];
  });

  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Modal States
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [selectedBuyerForOffer, setSelectedBuyerForOffer] = useState(null);
  const [selectedCropForOrder, setSelectedCropForOrder] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const t = translations[language] || translations.en;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleToggleRole = () => {
    const nextRole = activeRole === 'farmer' ? 'buyer' : 'farmer';
    setActiveRole(nextRole);
    if (nextRole === 'buyer') {
      setActiveTab('buyer-dashboard');
      showToast('🏢 Switched to Buyer (Procurement) Mode!');
    } else {
      setActiveTab('home');
      showToast('🌾 Switched to Farmer (Seller) Mode!');
    }
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

        const offersRes = await offersAPI.getOffers();
        if (offersRes.success && Array.isArray(offersRes.data) && offersRes.data.length > 0) {
          setBuyerOffers(offersRes.data);
        }
      }
    };

    syncBackend();
  }, [isLoggedIn]);

  const handleLoginSuccess = (userData, token) => {
    const userToSet = { ...farmerProfile, ...userData };
    const userRole = (userData.role || 'farmer').toLowerCase();
    setCurrentUser(userToSet);
    setActiveRole(userRole);
    setIsLoggedIn(true);
    if (userRole === 'buyer') {
      setActiveTab('buyer-dashboard');
    } else {
      setActiveTab('home');
    }
    localStorage.setItem('kisansetu_user', JSON.stringify(userToSet));
    if (token) localStorage.setItem('kisansetu_token', token);
    showToast(`🌾 ${t.welcomeBack} (${userToSet.name}) as ${userRole === 'buyer' ? 'Buyer' : 'Farmer'}`);
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

  const handlePlaceOffer = async (offerData) => {
    const updatedOffers = [offerData, ...buyerOffers];
    setBuyerOffers(updatedOffers);
    try {
      localStorage.setItem('kisansetu_offers', JSON.stringify(updatedOffers));
    } catch (e) {}
    showToast(`📦 Offer sent to ${offerData.farmerName} for ₹${offerData.totalValue.toLocaleString()}!`);

    try {
      await offersAPI.makeOffer({
        cropId: offerData.cropId,
        offeredPrice: offerData.offeredPrice,
        quantity: offerData.quantity,
        message: offerData.notes
      });
    } catch (err) {
      console.warn('Could not save offer to backend, stored in local state.');
    }
  };

  const handleAcceptOffer = async (offerId) => {
    const updated = buyerOffers.map((o) => o.id === offerId ? { ...o, status: 'accepted' } : o);
    setBuyerOffers(updated);
    try {
      localStorage.setItem('kisansetu_offers', JSON.stringify(updated));
    } catch (e) {}
    showToast('🎉 Contract Offer Accepted! Partner notified.');

    try {
      await offersAPI.acceptOffer(offerId);
    } catch (err) {}
  };

  const handleDeclineOffer = async (offerId) => {
    const updated = buyerOffers.map((o) => o.id === offerId ? { ...o, status: 'rejected' } : o);
    setBuyerOffers(updated);
    try {
      localStorage.setItem('kisansetu_offers', JSON.stringify(updated));
    } catch (e) {}
    showToast('Offer declined.');

    try {
      await offersAPI.rejectOffer(offerId);
    } catch (err) {}
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
          onExploreApp={(targetTab = (activeRole === 'buyer' ? 'buyer-dashboard' : 'home')) => handleTabChange(targetTab)}
          onOpenAuth={(mode = 'signin') => {
            setAuthInitialMode(mode);
            setActiveTab('auth');
          }}
          language={language}
          setLanguage={handleSetLanguage}
        />
        <AIChatbot
          language={language}
          setLanguage={handleSetLanguage}
          setActiveTab={handleTabChange}
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
        activeRole={activeRole}
        onToggleRole={handleToggleRole}
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
          activeRole={activeRole}
          onToggleRole={handleToggleRole}
        />

        {/* View Viewport */}
        <main className="view-viewport">
          {activeTab === 'home' && (
            <HomeDashboard setActiveTab={setActiveTab} language={language} />
          )}

          {activeTab === 'buyer-dashboard' && (
            <BuyerDashboard
              farmerCrops={crops}
              buyerOffers={buyerOffers}
              onOpenPlaceOrderModal={(crop) => setSelectedCropForOrder(crop)}
              onContactFarmer={() => setActiveTab('messages')}
              setActiveTab={setActiveTab}
              buyerUser={currentUser}
            />
          )}

          {activeTab === 'price-radar' && (
            <PriceRadar setActiveTab={setActiveTab} language={language} />
          )}

          {activeTab === 'where-to-sell' && (
            <WhereShouldISell setActiveTab={setActiveTab} language={language} />
          )}

          {activeTab === 'market-prices' && (
            <MarketPrices language={language} />
          )}

          {activeTab === 'buyers' && (
            <BuyerMarketplace
              setSelectedBuyerForOffer={setSelectedBuyerForOffer}
              setIsListingProduceModalOpen={() => setIsAddCropOpen(true)}
              language={language}
            />
          )}

          {activeTab === 'my-crops' && (
            <MyCrops
              crops={crops}
              setIsAddCropOpen={setIsAddCropOpen}
              setActiveTab={setActiveTab}
              language={language}
              buyerOffers={buyerOffers}
              onAcceptOffer={handleAcceptOffer}
              onDeclineOffer={handleDeclineOffer}
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
            <MessagesView language={language} />
          )}

          {activeTab === 'profile' && (
            <ProfileSettings
              farmerData={currentUser}
              setIsEditProfileOpen={setIsEditProfileOpen}
              setActiveTab={setActiveTab}
              language={language}
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

      <PlaceOrderModal
        isOpen={Boolean(selectedCropForOrder)}
        crop={selectedCropForOrder}
        buyerUser={currentUser}
        onClose={() => setSelectedCropForOrder(null)}
        onSubmitOffer={handlePlaceOffer}
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

