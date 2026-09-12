import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MarketComparisonTable from '../components/MarketComparisonTable';

const API_BASE = 'http://localhost:5000/api';

export default function PriceDiscoveryPage() {
  const [commodity, setCommodity] = useState('Tomato');
  const [comparisonData, setComparisonData] = useState(null);

  const fetchDiscovery = async () => {
    try {
      const res = await axios.get(`${API_BASE}/prices/comparison?commodity=${commodity}`);
      setComparisonData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDiscovery();
  }, [commodity]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <h2 className="text-lg font-bold text-white mb-2">Price Discovery Engine</h2>
        <p className="text-xs text-slate-400 mb-4">Discover the best available APMC market prices across districts</p>

        <div className="flex items-center space-x-3 max-w-md">
          <input
            type="text"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            placeholder="Search crop (e.g. Wheat, Tomato, Onion)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {comparisonData && <MarketComparisonTable comparisonData={comparisonData} />}
    </div>
  );
}
