import React, { useState, useEffect, useRef } from 'react';
import "./Description.css";

const Description = () => {
  const [activeTab, setActiveTab] = useState('description');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={`descriptionbox ${isVisible ? 'animate-in' : ''}`} ref={sectionRef}>
      <div className="descriptionbox-navigator">
        <button 
          className={`descriptionbox-nav-box ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => handleTabClick('description')}
          aria-selected={activeTab === 'description'}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-text">Description</span>
        </button>
        <button 
          className={`descriptionbox-nav-box ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => handleTabClick('reviews')}
          aria-selected={activeTab === 'reviews'}
        >
          <span className="nav-icon">⭐</span>
          <span className="nav-text">Reviews</span>
          <span className="review-count">(135)</span>
        </button>
      </div>

      <div className="descriptionbox-content">
        <div className={`tab-content ${activeTab === 'description' ? 'active' : ''}`}>
          <div className="descriptionbox-description">
            <h3 className="content-title">Product Description</h3>
            <div className="description-text">
              <p>
                Discover the perfect blend of style and comfort with this exceptional piece. 
                Crafted with premium materials and attention to detail, this item represents 
                the pinnacle of modern fashion design. Whether you're dressing up for a special 
                occasion or looking for everyday elegance, this versatile piece adapts to your lifestyle.
              </p>
              <p>
                Our design philosophy centers around creating timeless pieces that transcend 
                seasonal trends. Each garment undergoes rigorous quality testing to ensure 
                durability and comfort. The fabric selection process involves sourcing from 
                sustainable suppliers who share our commitment to environmental responsibility.
              </p>
              <div className="feature-highlights">
                <h4>Key Features:</h4>
                <ul className="feature-list">
                  <li>Premium quality materials</li>
                  <li>Sustainable manufacturing process</li>
                  <li>Versatile design for multiple occasions</li>
                  <li>Comfortable fit with modern silhouette</li>
                  <li>Easy care and maintenance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className={`tab-content ${activeTab === 'reviews' ? 'active' : ''}`}>
          <div className="reviews-section">
            <h3 className="content-title">Customer Reviews</h3>
            <div className="reviews-summary">
              <div className="rating-overview">
                <div className="overall-rating">
                  <span className="rating-number">4.8</span>
                  <div className="stars">
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star half">★</span>
                  </div>
                  <span className="total-reviews">Based on 135 reviews</span>
                </div>
              </div>
            </div>
            
            <div className="sample-reviews">
              <div className="review-item">
                <div className="review-header">
                  <span className="reviewer-name">Sarah M.</span>
                  <div className="review-rating">
                    <span className="star">★★★★★</span>
                  </div>
                </div>
                <p className="review-text">
                  "Absolutely love this piece! The quality is outstanding and the fit is perfect. 
                  I've received so many compliments. Definitely worth the investment."
                </p>
              </div>
              
              <div className="review-item">
                <div className="review-header">
                  <span className="reviewer-name">Emma K.</span>
                  <div className="review-rating">
                    <span className="star">★★★★★</span>
                  </div>
                </div>
                <p className="review-text">
                  "Great quality and fast shipping. The material feels luxurious and the 
                  design is exactly what I was looking for. Highly recommended!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;