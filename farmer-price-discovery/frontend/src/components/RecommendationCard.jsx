import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, AlertCircle, Sparkles } from 'lucide-react';

export default function RecommendationCard({ data }) {
  if (!data) return null;

  const { trend, recommended_day, recommendation, reliability } = data;

  const isIncreasing = trend === 'Increasing';
  const isDecreasing = trend === 'Decreasing';

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all shadow-xl ${
      isIncreasing
        ? 'bg-emerald-950/30 border-emerald-500/30 shadow-emerald-950/50'
        : isDecreasing
        ? 'bg-rose-950/30 border-rose-500/30 shadow-rose-950/50'
        : 'bg-amber-950/30 border-amber-500/30 shadow-amber-950/50'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl ${
            isIncreasing ? 'bg-emerald-500/20 text-emerald-400' : isDecreasing ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            {isIncreasing ? <ArrowUpRight className="w-6 h-6" /> : isDecreasing ? <ArrowDownRight className="w-6 h-6" /> : <Minus className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Market Advice</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>{reliability} Reliability</span>
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Trend: <span className={isIncreasing ? 'text-emerald-400' : isDecreasing ? 'text-rose-400' : 'text-amber-400'}>{trend}</span>
            </h3>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-400">Best Selling Target Date</p>
          <p className="text-base font-extrabold text-emerald-400">{recommended_day}</p>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <p className="text-sm font-medium text-slate-200 leading-relaxed">
          "{recommendation}"
        </p>
      </div>

      <div className="mt-4 flex items-center space-x-2 text-xs text-slate-400">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Disclaimer: ML estimate based on historical APMC trends. Not a financial guarantee.</span>
      </div>
    </div>
  );
}
