import React from 'react'
import '../styles/MarketPrices.css'

const MarketPrices = () => {
  const crops = [
    { name: 'Tomato', price: '₹2,480', unit: '/qtl', change: 8.4, trend: 'up' },
    { name: 'Onion', price: '₹2,130', unit: '/qtl', change: 5.2, trend: 'up' },
    { name: 'Wheat', price: '₹2,640', unit: '/qtl', change: 2.1, trend: 'up' },
    { name: 'Potato', price: '₹1,890', unit: '/qtl', change: 2.6, trend: 'down' },
  ]

  const topMarkets = [
    { name: 'Rajkot APMC', price: '₹2,480', change: 6.4 },
    { name: 'Jamnagar Mandi', price: '₹2,320', change: 4.8 },
    { name: 'Gondal Mandi', price: '₹2,180', change: 4.2 },
    { name: 'Veraval Mandi', price: '₹2,060', change: 3.8 },
  ]

  const topBuyers = [
    { name: 'FreshMart Foods', category: 'Retail Chain - 50 Qtl' },
    { name: 'AgroFresh Pvt. Ltd.', category: 'Processor - 100 Qtl' },
    { name: 'Global Agro Export', category: 'Exporter - 200 Qtl' },
  ]

  return (
    <section className="market-prices">
      <h2>Live Market Prices</h2>
      
      <div className="prices-container">
        <div className="crop-prices">
          {crops.map((crop, index) => (
            <div key={index} className="price-card">
              <div className="crop-icon">🌾</div>
              <h3>{crop.name}</h3>
              <p className="price">{crop.price}</p>
              <p className="unit">{crop.unit}</p>
              <p className={`change ${crop.trend}`}>
                {crop.trend === 'up' ? '▲' : '▼'} {crop.change}%
              </p>
            </div>
          ))}
        </div>

        <div className="market-info">
          <div className="top-markets">
            <h3>Top Markets (Tomato)</h3>
            <div className="market-list">
              {topMarkets.map((market, index) => (
                <div key={index} className="market-item">
                  <span className="location-icon">📍</span>
                  <div className="market-details">
                    <p className="market-name">{market.name}</p>
                    <p className="market-price">{market.price}</p>
                  </div>
                  <span className="market-change">↑ {market.change}%</span>
                </div>
              ))}
            </div>
            <a href="#" className="view-all">View All →</a>
          </div>

          <div className="top-buyers">
            <h3>Top Buyers</h3>
            <div className="buyer-list">
              {topBuyers.map((buyer, index) => (
                <div key={index} className="buyer-item">
                  <div className="buyer-icon">🏢</div>
                  <div className="buyer-details">
                    <p className="buyer-name">{buyer.name}</p>
                    <p className="buyer-category">{buyer.category}</p>
                  </div>
                  <button className="connect-btn">Connect</button>
                </div>
              ))}
            </div>
            <a href="#" className="view-all">View All →</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MarketPrices
