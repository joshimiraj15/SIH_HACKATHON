import React, { useState } from 'react';
import axios from 'axios';
import AdminMetricsCard from '../components/AdminMetricsCard';

const API_BASE = 'http://localhost:5000/api';

export default function AdminMlDashboard() {
  const [metrics, setMetrics] = useState({ mae: 82.4, rmse: 115.2, mape: 4.6, r2: 0.91 });
  const [isRetraining, setIsRetraining] = useState(false);

  const handleRetrain = async () => {
    setIsRetraining(true);
    try {
      const res = await axios.post(`${API_BASE}/ml/train`);
      if (res.data.metrics) {
        setMetrics(res.data.metrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRetraining(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminMetricsCard metrics={metrics} onRetrain={handleRetrain} isRetraining={isRetraining} />
    </div>
  );
}
