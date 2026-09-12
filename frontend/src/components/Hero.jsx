import React from 'react'
import '../styles/Hero.css'

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h2>Strengthening Market Linkages and Price Discovery for Farmers</h2>
        <div className="hero-tags">
          <span className="tag">Realtime prices</span>
          <span className="tag">Verified buyers</span>
          <span className="tag">Direct selling</span>
        </div>
        <button className="cta-button">Check Market Prices</button>
      </div>
      <div className="hero-image">
        <img 
          src="https://via.placeholder.com/400x300" 
          alt="Farmer with mobile" 
        />
      </div>
    </section>
  )
}

export default Hero
