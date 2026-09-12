import React from 'react'
import '../styles/Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search for crops, buyers, markets..." 
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="header-right">
        <div className="notification-bell">
          <span className="bell-icon">🔔</span>
          <span className="notification-badge">1</span>
        </div>
        
        <div className="user-profile">
          <img 
            src="https://via.placeholder.com/40" 
            alt="Ramesh Patel" 
            className="profile-pic"
          />
          <div className="user-info">
            <p className="user-name">Ramesh Patel</p>
            <p className="user-role">Farmer</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
