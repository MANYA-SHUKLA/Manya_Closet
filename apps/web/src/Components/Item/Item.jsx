import React, { useState } from 'react';
import "./Item.css";
import { Link } from 'react-router-dom';

const Item = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const calculateDiscount = () => {
    if (props.old_price && props.new_price) {
      return Math.round(((props.old_price - props.new_price) / props.old_price) * 100);
    }
    return 0;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    
    // Simulate API call or actual cart functionality
    setTimeout(() => {
      setIsAdding(false);
      setShowPopup(true);
      
      // You can add actual cart logic here
      // Example: addToCartFunction(props.id, props.name, props.new_price);
      
      // Hide popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }, 800);
  };

  const handleImageClick = () => {
    window.scrollTo(0, 0);
  };

  const discount = calculateDiscount();

  return (
    <>
      <div 
        className={`item-card ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="discount-badge">
            -{discount}%
          </div>
        )}

        {/* Product Image */}
        <div className="item-image-container">
          <Link to={`/product/${props.id}`} onClick={handleImageClick}>
            <img 
              src={props.image} 
              alt={props.name || "Product image"}
              className="item-image"
            />
          </Link>
          
          {/* Add to Cart Button - appears on hover */}
          <button 
            className={`add-to-cart-btn ${isHovered ? 'visible' : ''} ${isAdding ? 'loading' : ''}`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <div className="spinner"></div>
                Adding...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L17 18"></path>
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="item-info">
          <h3 className="item-name">{props.name}</h3>
          
          <div className="item-prices">
            <div className="price-container">
              <span className="item-price-new">${props.new_price}</span>
              {props.old_price && (
                <span className="item-price-old">${props.old_price}</span>
              )}
            </div>
            {discount > 0 && (
              <div className="savings">
                Save ${(props.old_price - props.new_price).toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className={`popup-overlay ${showPopup ? 'show' : ''}`}>
          <div className="popup-content">
            <div className="success-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </div>
            <h3>Added to Cart Successfully!</h3>
            <p>{props.name} has been added to your cart</p>
            <div className="popup-product">
              <img src={props.image} alt={props.name} className="popup-image" />
              <div>
                <p className="popup-price">${props.new_price}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Item;