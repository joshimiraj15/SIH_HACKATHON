import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FarmerDashboard from './pages/FarmerDashboard';
import PriceDiscoveryPage from './pages/PriceDiscoveryPage';
import AdminMlDashboard from './pages/AdminMlDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <FarmerDashboard />}
        {activeTab === 'discovery' && <PriceDiscoveryPage />}
        {activeTab === 'admin' && <AdminMlDashboard />}
      </main>
    </div>
  );
}
