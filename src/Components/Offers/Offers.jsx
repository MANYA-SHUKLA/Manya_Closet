import React from 'react'
import "./Offers.css"
import exclusive from "../../assets/exclu.webp"

const Offers = () => {
  return (
    <div className='offers'>
      <div className="offers-container">
        <div className="offers-left">
          <div className="offers-content">
            <div className="offers-badge">
              <span>Limited Time</span>
            </div>
            <h1 className="offers-title">
              <span className="title-line">Exclusive</span>
              <span className="title-line gradient-text">Offers For You</span>
            </h1>
            <p className="offers-subtitle">ONLY ON BEST SELLERS PRODUCTS</p>
            <div className="offers-features">
              <div className="feature-item">
                <div className="feature-icon">✨</div>
                <span>Premium Quality</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <span>Best Prices</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <span>Fast Delivery</span>
              </div>
            </div>
            <button className="offers-btn">
              <span>Check Now</span>
              <div className="btn-arrow">→</div>
            </button>
          </div>
        </div>
        <div className="offers-right">
          <div className="image-container">
            <div className="image-glow"></div>
            <img src={exclusive} alt="Exclusive Offers" className="offers-image" />
            <div className="floating-elements">
              <div className="floating-circle circle-1"></div>
              <div className="floating-circle circle-2"></div>
              <div className="floating-circle circle-3"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="offers-bg-pattern"></div>
    </div>
  )
}

export default Offers