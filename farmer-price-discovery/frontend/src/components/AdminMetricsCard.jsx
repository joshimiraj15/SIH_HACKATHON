import React from 'react';
import { Cpu, RefreshCw } from 'lucide-react';

export default function AdminMetricsCard({ metrics, onRetrain, isRetraining }) {
  if (!metrics) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-teal-500/20 text-teal-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Machine Learning Model Validation Metrics</h3>
            <p className="text-xs text-slate-400">Time-series cross-validation performance</p>
          </div>
        </div>

        <button
          onClick={onRetrain}
          disabled={isRetraining}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
        >
          <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
          <span>{isRetraining ? 'Retraining...' : 'Retrain ML Model'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-medium block">Mean Absolute Error (MAE)</span>
          <span className="text-xl font-extrabold text-emerald-400 mt-1 block">₹{metrics.mae}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-medium block">Root Mean Sq Error (RMSE)</span>
          <span className="text-xl font-extrabold text-teal-400 mt-1 block">₹{metrics.rmse}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-medium block">MAPE (%)</span>
          <span className="text-xl font-extrabold text-indigo-400 mt-1 block">{metrics.mape}%</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-medium block">R² Accuracy Score</span>
          <span className="text-xl font-extrabold text-purple-400 mt-1 block">{metrics.r2}</span>
        </div>
      </div>
    </div>
  );
}
