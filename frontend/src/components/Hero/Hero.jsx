import React from 'react'
import "./Hero.css"
// Using online image URLs
const hand_icon = "https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
const arrow_icon = "https://cdn-icons-png.flaticon.com/512/271/271228.png"
const men = "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=1000&fit=crop&q=80"

const Hero = () => {
    return (
        <section className='hero'>
            <div className="hero-container">
                {/* Left Content Section */}
                <div className="hero-left">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            <span className="hero-title-main">Best Deals!</span>
                            <span className="hero-title-sub">Best Prices!</span>
                        </h1>
                        
                        <div className="hero-new-collection">
                            <div className="hero-hand-section">
                                <span className="hero-new-text">New</span>
                                <img 
                                    src={hand_icon} 
                                    alt="Hand wave icon" 
                                    className="hero-hand-icon"
                                />
                            </div>
                            <div className="hero-collection-text">
                                <h2 className="hero-collection-title">Collections</h2>
                                <h3 className="hero-collection-subtitle">for Everyone</h3>
                            </div>
                        </div>
                        
                        <div className="hero-description">
                            <p>Discover the latest trends and timeless classics in our carefully curated collection</p>
                        </div>
                        
                        <button className="hero-cta-btn">
                            <span className="hero-btn-text">Latest Collection</span>
                            <img 
                                src={arrow_icon} 
                                alt="Arrow icon" 
                                className="hero-arrow-icon"
                            />
                        </button>
                        
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="stat-number">1000+</span>
                                <span className="stat-label">Products</span>
                            </div>
                            <div className="hero-stat">
                                <span className="stat-number">50K+</span>
                                <span className="stat-label">Happy Customers</span>
                            </div>
                            <div className="hero-stat">
                                <span className="stat-number">99%</span>
                                <span className="stat-label">Satisfaction</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Image Section */}
                <div className="hero-right">
                    <div className="hero-image-container">
                        <div className="hero-image-bg"></div>
                        <img 
                            src={men} 
                            alt="Fashion model showcasing latest collection" 
                            className="hero-image"
                        />
                        <div className="hero-floating-card">
                            <div className="floating-card-content">
                                <span className="floating-text">Trending Now</span>
                                <div className="floating-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Background Decorations */}
            <div className="hero-decorations">
                <div className="decoration-circle decoration-1"></div>
                <div className="decoration-circle decoration-2"></div>
                <div className="decoration-circle decoration-3"></div>
            </div>
        </section>
    )
}

export default Hero