import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export default function PricePredictionChart({ data }) {
  if (!data || !data.predictions) return null;

  const chartData = [
    {
      date: 'Today',
      actual: data.current_price,
      predicted: data.current_price,
      lowerBound: data.current_price,
      upperBound: data.current_price
    },
    ...data.predictions.map((p, idx) => ({
      date: `Day ${idx + 1} (${p.date.split('-').slice(1).join('/')})`,
      actual: null,
      predicted: p.predicted_price,
      lowerBound: p.lower_bound,
      upperBound: p.upper_bound
    }))
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md shadow-lg">
      <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
        <span>3-Day Price Forecast & Confidence Bounds</span>
        <span className="text-xs font-normal text-slate-400">Model: {data.model_name || 'XGBoost'}</span>
      </h3>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <defs>
              <linearGradient id="colorBound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} unit="₹" />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
              formatter={(val) => [`₹${val}`, 'Price']}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="upperBound"
              stroke="none"
              fill="url(#colorBound)"
              name="Confidence Range"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 6, fill: '#10b981' }}
              activeDot={{ r: 8 }}
              name="Predicted Price (₹)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
