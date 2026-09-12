import React from 'react'
import '../styles/MarketIntelligence.css'

const MarketIntelligence = () => {
  const features = [
    { icon: '📈', title: 'Price Forecast', desc: 'Tomato prices may rise 5-7% this week' },
    { icon: '📍', title: 'Best Nearby Market', desc: 'Rajkot APMC offers ₹730 premium/qntl' },
    { icon: '🚨', title: 'Market Alert', desc: 'High demand from processors' },
    { icon: '🌾', title: 'List Your Produce', desc: 'Reach verified buyers' },
    { icon: '🚚', title: 'Find Logistics', desc: 'Door-to-door delivery' },
    { icon: '📦', title: 'Check Storage', desc: 'Secure storage solutions' },
    { icon: '👥', title: 'Join Farmers Union', desc: 'Get better prices & support' },
    { icon: '🔔', title: 'Get Market Alerts', desc: 'Price updates & trends' },
  ]

  return (
    <section className="market-intelligence">
      <div className="intelligence-header">
        <h2>Market Intelligence</h2>
        <a href="#" className="ai-insights">AI Insights →</a>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
            <a href="#" className="feature-link">→</a>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MarketIntelligence
