import React from 'react'
import '../styles/Sidebar.css'

const Sidebar = () => {
  const menuItems = [
    { icon: '🏠', label: 'Home' },
    { icon: '📊', label: 'Market Prices' },
    { icon: '👥', label: 'Buyers' },
    { icon: '🌾', label: 'My Produce' },
    { icon: '👨‍🌾', label: 'Farmers Union' },
    { icon: '🚚', label: 'Logistics' },
    { icon: '🏢', label: 'Storage' },
    { icon: '💳', label: 'Transactions' },
    { icon: '📋', label: 'Reports' },
  ]

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">🌿</div>
        <h1>KisanLink</h1>
      </div>
      
      <nav className="menu">
        {menuItems.map((item, index) => (
          <a key={index} href="#" className={`menu-item ${index === 0 ? 'active' : ''}`}>
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="promo-card">
        <h3>Stronger Together</h3>
        <p>Join Farmers Union and get better prices, real support</p>
        <button className="join-btn">Join Now →</button>
        <div className="promo-image">👨‍🌾👩‍🌾</div>
      </div>

      <div className="weather">
        <div className="temp">32°C</div>
        <div className="condition">Clear Sky</div>
        <div className="location">📍 Rajkot, Gujarat</div>
      </div>
    </aside>
  )
}

export default Sidebar
