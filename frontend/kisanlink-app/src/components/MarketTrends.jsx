import React from 'react'
import '../styles/MarketTrends.css'

const MarketTrends = () => {
  return (
    <section className="market-trends">
      <div className="trends-header">
        <h2>Market Price Trends</h2>
        <a href="#" className="view-all">View All →</a>
      </div>

      <div className="trends-container">
        <div className="crop-tabs">
          <button className="tab active">Tomato</button>
          <button className="tab">Onion</button>
          <button className="tab">Potato</button>
          <button className="tab">Wheat</button>
          <button className="tab">All Crops</button>
        </div>

        <div className="chart-container">
          <svg className="chart" viewBox="0 0 500 200">
            {/* Simple line chart */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              points="50,150 100,120 150,100 200,110 250,90 300,80 350,100 400,70 450,50"
            />
            <circle cx="50" cy="150" r="3" fill="#10b981" />
            <circle cx="100" cy="120" r="3" fill="#10b981" />
            <circle cx="150" cy="100" r="3" fill="#10b981" />
            <circle cx="200" cy="110" r="3" fill="#10b981" />
            <circle cx="250" cy="90" r="3" fill="#10b981" />
            <circle cx="300" cy="80" r="3" fill="#10b981" />
            <circle cx="350" cy="100" r="3" fill="#10b981" />
            <circle cx="400" cy="70" r="3" fill="#10b981" />
            <circle cx="450" cy="50" r="3" fill="#10b981" />
            
            {/* Grid lines */}
            <line x1="40" y1="180" x2="460" y2="180" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="40" y1="50" x2="460" y2="50" stroke="#e5e7eb" strokeWidth="1" />
          </svg>
          <div className="chart-labels">
            <span>Sep 3</span>
            <span>Sep 4</span>
            <span>Sep 5</span>
            <span>Sep 6</span>
            <span>Sep 7</span>
            <span>Sep 8</span>
            <span>Today</span>
          </div>
        </div>

        <div className="price-info">
          <div className="current-price">
            <span className="label">Current Price:</span>
            <span className="price">₹2,480</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MarketTrends
