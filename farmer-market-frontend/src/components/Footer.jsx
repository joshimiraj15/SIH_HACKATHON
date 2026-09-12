import React from 'react'
import '../styles/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Fair Prices</h4>
          <ul>
            <li><a href="#">Direct Market Access</a></li>
            <li><a href="#">Price Comparison</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Stronger Farmers</h4>
          <ul>
            <li><a href="#">Farmer Training</a></li>
            <li><a href="#">Best Practices</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Sustainable Future</h4>
          <ul>
            <li><a href="#">Green Farming</a></li>
            <li><a href="#">Eco-friendly</a></li>
          </ul>
        </div>

        <div className="footer-promo">
          <img 
            src="https://via.placeholder.com/150x100" 
            alt="Farmer" 
            className="footer-image"
          />
          <p>From Our Farms To Your Table</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 KisanLink. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
