import React, { useContext } from 'react'
import "./CartItems.css"
import remove_icon from "../../assets/remove.webp"
import { ShopContext } from '../../Context/ShopContext'

const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

    return (
        <div className='cartItems'>
            <div className="cart-header">
                <h1 className="cart-title">Shopping Cart</h1>
                <p className="cart-subtitle">Review your selected items</p>
            </div>

            <div className="cart-container">
                <div className="cart-items-section">
                    <div className="cartitems-format-main">
                        <p>Product</p>
                        <p>Details</p>
                        <p>Price</p>
                        <p>Quantity</p>
                        <p>Total</p>
                        <p>Action</p>
                    </div>
                    
                    <div className="cart-items-list">
                        {all_product.map((e) => {
                            if (cartItems[e.id] > 0) {
                                return (
                                    <div key={e.id} className="cart-item-wrapper">
                                        <div className='cartItems-format'>
                                            <div className="product-image-container">
                                                <img src={e.image} alt={e.name} className="product-image" />
                                            </div>
                                            <div className="product-details">
                                                <h3 className="product-name">{e.name}</h3>
                                                <p className="product-category">Premium Collection</p>
                                            </div>
                                            <div className="price-section">
                                                <span className="price-currency">$</span>
                                                <span className="price-value">{e.new_price}</span>
                                            </div>
                                            <div className="quantity-section">
                                                <div className="quantity-display">
                                                    <span className="quantity-number">{cartItems[e.id]}</span>
                                                    <span className="quantity-label">qty</span>
                                                </div>
                                            </div>
                                            <div className="total-section">
                                                <span className="total-currency">$</span>
                                                <span className="total-value">{(e.new_price * cartItems[e.id]).toFixed(2)}</span>
                                            </div>
                                            <div className="remove-section">
                                                <button 
                                                    className="remove-btn"
                                                    onClick={() => removeFromCart(e.id)}
                                                    aria-label="Remove item"
                                                >
                                                    <img src={remove_icon} alt="Remove" />
                                                    <span className="remove-text">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return null;
                        })}
                    </div>
                </div>

                <div className="cart-summary-section">
                    <div className="cartitems-total">
                        <div className="summary-header">
                            <h2>Order Summary</h2>
                            <div className="summary-icon">🛍️</div>
                        </div>
                        
                        <div className="summary-content">
                            <div className="cartitems-total-item">
                                <span>Subtotal</span>
                                <span className="amount">${getTotalCartAmount().toFixed(2)}</span>
                            </div>
                            
                            <div className="cartitems-total-item">
                                <span>Shipping</span>
                                <span className="shipping-free">
                                    <span className="free-badge">FREE</span>
                                </span>
                            </div>
                            
                            <div className="cartitems-total-item discount-item">
                                <span>Discount</span>
                                <span className="discount-amount">-$0.00</span>
                            </div>
                            
                            <div className="total-divider"></div>
                            
                            <div className="cartitems-total-item final-total">
                                <span>Total</span>
                                <span className="final-amount">${getTotalCartAmount().toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <button className="checkout-btn">
                            <span className="btn-icon">🔒</span>
                            <span>PROCEED TO CHECKOUT</span>
                            <span className="btn-arrow">→</span>
                        </button>
                    </div>

                    <div className="cartitems-promocode">
                        <div className="promo-header">
                            <h3>Have a Promo Code?</h3>
                            <div className="promo-icon">🎟️</div>
                        </div>
                        <p className="promo-description">Enter your promotional code to get discount</p>
                        <div className="cartitems-promobox">
                            <div className="promo-input-wrapper">
                                <input 
                                    type='text' 
                                    placeholder='Enter promo code...'
                                    className="promo-input"
                                />
                                <button className="promo-submit-btn">
                                    <span>Apply</span>
                                    <span className="apply-icon">✓</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItems