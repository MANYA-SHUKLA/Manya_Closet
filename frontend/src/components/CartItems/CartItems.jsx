import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./CartItems.css"
// Using online image URL
const remove_icon = "https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
  import { ShopContext } from "../context/ShopContext"

const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart, cartLoading } = useContext(ShopContext);
    const [updatingItems, setUpdatingItems] = useState({});
    const navigate = useNavigate();

    // Get cart items with product details
    const getCartItemsWithDetails = () => {
        const items = [];
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                const product = all_product.find(p => p.id === itemId || p.id?.toString() === itemId);
                if (product) {
                    items.push({
                        ...product,
                        quantity: cartItems[itemId]
                    });
                }
            }
        }
        return items;
    };

    const cartItemsList = getCartItemsWithDetails();

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            // Remove item if quantity is 0
            await handleRemove(itemId);
            return;
        }

        setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
        const result = await removeFromCart(itemId, newQuantity);
        setUpdatingItems(prev => ({ ...prev, [itemId]: false }));

        if (!result.success) {
            alert(result.message || 'Failed to update quantity');
        }
    };

    const handleRemove = async (itemId) => {
        setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
        const result = await removeFromCart(itemId);
        setUpdatingItems(prev => ({ ...prev, [itemId]: false }));

        if (!result.success) {
            alert(result.message || 'Failed to remove item');
        }
    };

    const handleIncrease = async (itemId, currentQuantity, stock) => {
        if (stock !== undefined && currentQuantity >= stock) {
            return;
        }
        await handleQuantityChange(itemId, currentQuantity + 1);
    };

    const handleDecrease = async (itemId, currentQuantity) => {
        await handleQuantityChange(itemId, currentQuantity - 1);
    };

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
                        {cartLoading && cartItemsList.length === 0 ? (
                            <div className="cart-loading">
                                <p>Loading cart...</p>
                            </div>
                        ) : cartItemsList.length === 0 ? (
                            <div className="cart-empty">
                                <p>Your cart is empty</p>
                                <p className="empty-subtitle">Add some products to get started!</p>
                            </div>
                        ) : (
                            cartItemsList.map((item) => {
                                const isUpdating = updatingItems[item.id];
                                return (
                                    <div key={item.id} className="cart-item-wrapper">
                                        <div className='cartItems-format'>
                                            <div className="product-image-container">
                                                <img src={item.image} alt={item.name} className="product-image" />
                                            </div>
                                            <div className="product-details">
                                                <h3 className="product-name">{item.name}</h3>
                                                {item.category && (
                                                    <p className="product-category">{item.category}</p>
                                                )}
                                                {item.stock !== undefined && (
                                                    <p className="product-stock">
                                                        {item.inStock ? `In Stock (${item.stock} available)` : 'Out of Stock'}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="price-section">
                                                <span className="price-currency">$</span>
                                                <span className="price-value">{item.new_price?.toFixed(2)}</span>
                                            </div>
                                            <div className="quantity-section">
                                                <div className="quantity-controls">
                                                    <button
                                                        className="quantity-btn quantity-btn-decrease"
                                                        onClick={() => handleDecrease(item.id, item.quantity)}
                                                        disabled={isUpdating || item.quantity <= 1}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="quantity-value">{item.quantity}</span>
                                                    <button
                                                        className="quantity-btn quantity-btn-increase"
                                                        onClick={() => handleIncrease(item.id, item.quantity, item.stock)}
                                                        disabled={isUpdating || (item.stock !== undefined && item.quantity >= item.stock)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="total-section">
                                                <span className="total-currency">$</span>
                                                <span className="total-value">{((item.new_price || 0) * item.quantity).toFixed(2)}</span>
                                            </div>
                                            <div className="remove-section">
                                                <button
                                                    className="remove-btn"
                                                    onClick={() => handleRemove(item.id)}
                                                    disabled={isUpdating}
                                                    aria-label="Remove item"
                                                >
                                                    <img src={remove_icon} alt="Remove" />
                                                    <span className="remove-text">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
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
                        
                        <button 
                            type="button"
                            className="checkout-btn"
                            onClick={() => navigate('/checkout')}
                        >
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
