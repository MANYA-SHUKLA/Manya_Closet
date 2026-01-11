import React, { useContext, useState } from 'react'
import "./ProductDisplay.css"
import star_icon from "../../assets/star_icon.png"
import star_dull_icon from "../../assets/star_dull_icon.png";
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
  const { product } = props;
  const { addTocart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const images = [product.image, product.image, product.image, product.image];

  const discountPercentage = Math.round(((product.old_price - product.new_price) / product.old_price) * 100);

  return (
    <div className='productdisplay'>
      {/* Image Gallery Section */}
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {images.map((img, index) => (
            <div 
              key={index}
              className={`image-thumbnail ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <img src={img} alt={`View ${index + 1}`} />
              <div className="thumbnail-overlay"></div>
            </div>
          ))}
        </div>
        
        <div className='productdisplay-main-image'>
          <div className="image-container">
            <img 
              className='main-product-image' 
              src={images[selectedImage]} 
              alt={product.name} 
            />
            <div className="image-backdrop"></div>
            {discountPercentage > 0 && (
              <div className="floating-discount">
                <span>-{discountPercentage}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="productdisplay-right">
        <div className="product-header">
          <div className="breadcrumb">
            <span>Home</span>
            <span className="separator">•</span>
            <span>Women</span>
            <span className="separator">•</span>
            <span>T-Shirts</span>
          </div>
          
          <h1 className="product-name">{product.name}</h1>
          
          <div className="rating-section">
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <img 
                  key={star}
                  src={star <= 4 ? star_icon : star_dull_icon} 
                  alt="star" 
                  className="star-icon"
                />
              ))}
            </div>
            <span className="rating-text">4.0</span>
            <span className="review-count">(130 Reviews)</span>
          </div>
        </div>

        <div className="pricing-section">
          <div className="price-container">
            <span className="current-price">${product.new_price}</span>
            {product.old_price > product.new_price && (
              <>
                <span className="original-price">${product.old_price}</span>
                <span className="savings">Save ${(product.old_price - product.new_price).toFixed(2)}</span>
              </>
            )}
          </div>
          <div className="payment-options">
            <span>or 4 interest-free payments of ${(product.new_price / 4).toFixed(2)}</span>
          </div>
        </div>

        <div className="product-description">
          <h3>Description</h3>
          <p>Experience premium comfort with our meticulously crafted garment. Made from high-quality materials, this piece combines contemporary style with exceptional durability. Perfect for both casual outings and sophisticated occasions.</p>
        </div>

        <div className="size-section">
          <div className="size-header">
            <h3>Size</h3>
            <button className="size-guide">Size Guide</button>
          </div>
          <div className="size-grid">
            {sizes.map(size => (
              <button
                key={size}
                className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="quantity-section">
          <h3>Quantity</h3>
          <div className="quantity-selector">
            <button 
              className="qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              −
            </button>
            <span className="qty-display">{quantity}</span>
            <button 
              className="qty-btn"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="add-to-cart"
            onClick={() => addTocart(product.id)}
          >
            <svg className="cart-icon" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13H17Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Add to Cart
          </button>
          
          <button className="wishlist-btn">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20.84 4.61C20.32 4.09 19.69 3.69 19 3.41C18.31 3.13 17.58 2.99 16.84 3C16.1 3.01 15.37 3.17 14.69 3.47C14.01 3.77 13.39 4.21 12.88 4.76L12 5.64L11.12 4.76C10.6 4.21 9.98 3.77 9.3 3.47C8.62 3.17 7.89 3.01 7.15 3C6.41 2.99 5.68 3.13 4.99 3.41C4.3 3.69 3.67 4.09 3.15 4.61C1.61 6.15 1.61 8.85 3.15 10.39L12 19.24L20.85 10.39C22.39 8.85 22.39 6.15 20.84 4.61Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="shipping-info">
          <div className="shipping-item">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <div>
              <strong>Express Delivery</strong>
              <span>Free shipping on orders over $50</span>
            </div>
          </div>
          
          <div className="shipping-item">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 7V17C3 18.1 3.9 19 5 19H19C20.1 19 21 18.1 21 17V7C21 5.9 20.1 5 19 5H5C3.9 5 3 5.9 3 7Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 5V3C8 1.9 8.9 1 10 1H14C15.1 1 16 1.9 16 3V5" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <div>
              <strong>Easy Returns</strong>
              <span>30-day return policy</span>
            </div>
          </div>
        </div>

        <div className="product-meta">
          <div className="meta-item">
            <span className="meta-label">Category:</span>
            <span className="meta-value">Women, T-Shirt, Crop Top</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Tags:</span>
            <span className="meta-value">Modern, Latest, Trend, Shorts</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">SKU:</span>
            <span className="meta-value">TSH-{product.id}-WMN</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDisplay