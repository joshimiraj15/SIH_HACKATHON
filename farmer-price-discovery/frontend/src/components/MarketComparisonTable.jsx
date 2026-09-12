import React from 'react';
import { Building2, Award } from 'lucide-react';

export default function MarketComparisonTable({ comparisonData }) {
  if (!comparisonData || !comparisonData.data) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Mandi-wise Price Discovery Comparison</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Comparing real-time modal prices across nearby APMC markets</p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-right">
          <span className="text-xs text-slate-400 block">State Avg Price</span>
          <span className="text-base font-extrabold text-emerald-400">₹{comparisonData.averagePrice} / Qtl</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Market / Mandi</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4 text-right">Min Price</th>
              <th className="py-3 px-4 text-right">Modal Price</th>
              <th className="py-3 px-4 text-right">Max Price</th>
              <th className="py-3 px-4 text-right">Arrival Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {comparisonData.data.map((item, idx) => {
              const isBest = item._id === comparisonData.bestMarket.marketName;
              return (
                <tr key={idx} className={`hover:bg-slate-800/40 transition-all ${isBest ? 'bg-emerald-950/20' : ''}`}>
                  <td className="py-3.5 px-4 font-semibold text-white flex items-center space-x-2">
                    <span>{item._id}</span>
                    {isBest && (
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                        <Award className="w-3 h-3" />
                        <span>Best Price</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{item.district}, {item.state}</td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-400">₹{item.minPrice}</td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-emerald-400 text-base">₹{item.latestPrice}</td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-400">₹{item.maxPrice}</td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-300">{item.arrivalQuantity} Qtl</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
