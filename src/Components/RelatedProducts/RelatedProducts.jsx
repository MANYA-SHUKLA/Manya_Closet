import React, { useState, useEffect, useRef } from 'react';
import "./RealatedProducts.css";
import Item from '../Item/Item';
import data_product from '../../assets/data';

const RelatedProducts = ({ currentProductId, category, limit = 8 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);

  // Filter related products (exclude current product and limit results)
  const getRelatedProducts = () => {
    let filtered = data_product.filter(item => item.id !== currentProductId);
    
    // If category is provided, prioritize products from the same category
    if (category) {
      const sameCategory = filtered.filter(item => 
        item.category?.toLowerCase() === category.toLowerCase()
      );
      const otherProducts = filtered.filter(item => 
        item.category?.toLowerCase() !== category.toLowerCase()
      );
      filtered = [...sameCategory, ...otherProducts];
    }
    
    return filtered.slice(0, limit);
  };

  const relatedProducts = getRelatedProducts();
  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(relatedProducts.length / itemsPerSlide);

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

  // Auto-slide functionality
  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section 
      className={`relatedproducts ${isVisible ? 'animate-in' : ''}`} 
      ref={sectionRef}
    >
      <div className="relatedproducts-container">
        {/* Header Section */}
        <div className="relatedproducts-header">
          <div className="header-content">
            <h2 className="relatedproducts-title">You Might Also Like</h2>
            <p className="relatedproducts-subtitle">
              Discover more amazing products curated just for you
            </p>
          </div>
          <div className="header-decoration">
            <div className="decoration-line"></div>
            <div className="decoration-dot"></div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relatedproducts-carousel">
          {totalSlides > 1 && (
            <button 
              className="carousel-btn carousel-btn-prev" 
              onClick={prevSlide}
              aria-label="Previous products"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          <div className="relatedproducts-slider" ref={carouselRef}>
            <div 
              className="relatedproducts-track"
              style={{ 
                transform: `translateX(-${currentSlide * 100}%)`,
                width: `${totalSlides * 100}%`
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="relatedproducts-slide">
                  <div className="relatedproducts-grid">
                    {relatedProducts
                      .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                      .map((item, index) => (
                        <div 
                          key={item.id} 
                          className="relatedproducts-item-wrapper"
                          style={{ '--delay': `${(slideIndex * itemsPerSlide + index) * 0.1}s` }}
                        >
                          <Item 
                            id={item.id} 
                            name={item.name} 
                            image={item.image} 
                            new_price={item.new_price} 
                            old_price={item.old_price}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalSlides > 1 && (
            <button 
              className="carousel-btn carousel-btn-next" 
              onClick={nextSlide}
              aria-label="Next products"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Pagination Dots */}
        {totalSlides > 1 && (
          <div className="relatedproducts-pagination">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`pagination-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="relatedproducts-footer">
          <button className="view-all-btn">
            <span>View All Products</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;