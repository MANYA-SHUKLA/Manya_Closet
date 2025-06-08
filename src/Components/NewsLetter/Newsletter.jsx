import React, { useState, useRef } from 'react'
import "./Newsletter.css"

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscribedEmail, setSubscribedEmail] = useState('')
  const popupTimeoutRef = useRef(null)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      setIsSubscribing(true)
      setSubscribedEmail(email)
      
      // Clear any existing timeout
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current)
      }
      
      setTimeout(() => {
        setIsSubscribing(false)
        setShowPopup(true)
        setEmail('')
      }, 1500)
      
      // Set popup to disappear after 10 seconds from when it becomes visible
      setTimeout(() => {
        popupTimeoutRef.current = setTimeout(() => {
          setShowPopup(false)
        }, 10000)
      }, 1500)
    } else {
      // Show error for invalid email
      alert('Please enter a valid email address')
    }
  }

  const handleClosePopup = () => {
    // Clear the auto-close timeout when manually closing
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current)
    }
    setShowPopup(false)
  }

  return (
    <>
      <div className='newsletter'>
        <div className="newsletter-background">
          <div className="bg-circle circle-1"></div>
          <div className="bg-circle circle-2"></div>
          <div className="bg-circle circle-3"></div>
        </div>
        
        <div className="newsletter-content">
          <div className="newsletter-badge">
            <span>Stay Updated</span>
          </div>
          
          <h1 className="newsletter-title">
            Get Exclusive Offers & Updates
          </h1>
          
          <p className="newsletter-subtitle">
            Subscribe to our newsletter and be the first to know about amazing deals, 
            new arrivals, and exclusive member-only benefits delivered straight to your inbox.
          </p>
          
          <div className="newsletter-stats">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Subscribers</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">Weekly</div>
              <div className="stat-label">Updates</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">Exclusive</div>
              <div className="stat-label">Deals</div>
            </div>
          </div>
          
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="input-container">
              <div className="input-icon">📧</div>
              <input 
                type="email" 
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className={`subscribe-btn ${isSubscribing ? 'loading' : ''}`}
                disabled={isSubscribing}
              >
                {isSubscribing ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <span>Subscribe Now</span>
                    <div className="btn-arrow">→</div>
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="newsletter-features">
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <span>100% Privacy Protected</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📱</span>
              <span>Mobile Optimized</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Instant Updates</span>
            </div>
          </div>
        </div>
        
        <div className="newsletter-decoration">
          <div className="floating-element element-1">✨</div>
          <div className="floating-element element-2">💎</div>
          <div className="floating-element element-3">🎯</div>
        </div>
      </div>
      
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup success-popup">
            <div className="popup-animation-wrapper">
              <div className="success-icon-container">
                <div className="success-checkmark">
                  <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                    <div className="icon-circle"></div>
                    <div className="icon-fix"></div>
                  </div>
                </div>
              </div>
              
              <div className="popup-content">
                <h2>🎉 Subscription Successful!</h2>
                <p>Welcome to our exclusive community! You'll receive premium content and special offers.</p>
                
                <div className="email-confirmation-section">
                  <div className="email-icon">📧</div>
                  <div className="email-details">
                    <span className="email-label">Confirmed Email</span>
                    <span className="email-address">{subscribedEmail}</span>
                  </div>
                  <div className="verified-badge">✓ Verified</div>
                </div>
                
                <div className="popup-benefits">
                  <div className="benefit-item">
                    <span className="benefit-icon">🎁</span>
                    <span>Exclusive Deals</span>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">⚡</span>
                    <span>Early Access</span>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">📱</span>
                    <span>Weekly Updates</span>
                  </div>
                </div>
                
                <button 
                  className="popup-dismiss-btn"
                  onClick={handleClosePopup}
                >
                  Awesome, Got it!
                </button>
              </div>
              
              <button 
                className="popup-close" 
                onClick={handleClosePopup}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Newsletter