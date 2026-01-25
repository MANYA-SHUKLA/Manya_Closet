import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShopContext } from '../../context/ShopContext';
import './Checkout.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

const Checkout = () => {
  const { isAuthenticated, token } = useAuth();
  const { all_product, getTotalCartAmount, cartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch checkout summary (cart + addresses)
  useEffect(() => {
    const fetchSummary = async () => {
      if (!isAuthenticated || !token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/checkout/summary`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success && data.data) {
          setAddresses(data.data.addresses || []);
          setSummary(data.data.summary);
          
          // Select default address or first address
          const defaultAddress = data.data.addresses.find(addr => addr.isDefault) || data.data.addresses[0];
          if (defaultAddress) {
            setSelectedShippingAddress(defaultAddress._id);
            setSelectedBillingAddress(defaultAddress._id);
          }
        } else {
          setError(data.message || 'Failed to fetch checkout summary');
        }
      } catch (err) {
        console.error('Error fetching checkout summary:', err);
        setError('Error fetching checkout summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [isAuthenticated, token, navigate]);

  // Handle billing address selection
  useEffect(() => {
    if (useSameAddress && selectedShippingAddress) {
      setSelectedBillingAddress(selectedShippingAddress);
    }
  }, [useSameAddress, selectedShippingAddress]);

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

  // Open Razorpay checkout
  const openRazorpayCheckout = (paymentData) => {
    if (!window.Razorpay) {
      alert('Razorpay SDK not loaded. Please refresh the page.');
      return;
    }

    const options = {
      key: paymentData.key || RAZORPAY_KEY,
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      name: 'Manya Closet',
      description: `Order Payment`,
      order_id: paymentData.razorpayOrderId, // Razorpay order ID (from backend)
      handler: function (response) {
        // ✅ Payment successful - webhook will verify and update order
        // ✅ Frontend should NOT confirm payment, just redirect
        // ✅ Backend controls order state via webhook
        console.log('Payment response:', response);
        navigate(`/orders?payment=success`);
      },
      prefill: {
        name: '',
        email: '',
        contact: ''
      },
      notes: {
        orderId: paymentData.orderId
      },
      theme: {
        color: '#667eea'
      },
      modal: {
        ondismiss: function() {
          // User closed the payment dialog
          console.log('Payment dialog closed');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', function (response) {
      alert(`Payment failed: ${response.error.description}`);
      navigate(`/orders?payment=failed`);
    });
    
    razorpay.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedShippingAddress) {
      alert('Please select a shipping address');
      return;
    }

    if (!useSameAddress && !selectedBillingAddress) {
      alert('Please select a billing address');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Step 1: Create order
      const orderResponse = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shippingAddressId: selectedShippingAddress,
          billingAddressId: useSameAddress ? selectedShippingAddress : selectedBillingAddress,
          paymentMethod: 'razorpay'
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success || !orderData.data.order) {
        setError(orderData.message || 'Failed to create order');
        alert(orderData.message || 'Failed to create order');
        setSubmitting(false);
        return;
      }

      const order = orderData.data.order;

      // Step 2: Create payment order
      const paymentResponse = await fetch(`${API_URL}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: order._id
        })
      });

      const paymentData = await paymentResponse.json();

      if (!paymentData.success || !paymentData.data) {
        setError(paymentData.message || 'Failed to create payment');
        alert(paymentData.message || 'Failed to create payment');
        setSubmitting(false);
        return;
      }

      // Step 3: Open Razorpay checkout
      openRazorpayCheckout({
        razorpayOrderId: paymentData.data.orderId, // This is the Razorpay order ID
        internalOrderId: order._id, // Store internal order ID for reference
        amount: paymentData.data.amount,
        currency: paymentData.data.currency,
        key: paymentData.data.key
      });

      setSubmitting(false);
    } catch (err) {
      console.error('Error during checkout:', err);
      setError('Error during checkout');
      alert('Error during checkout');
      setSubmitting(false);
    }
  };

  const calculateSummary = () => {
    if (summary) {
      return summary;
    }

    const subtotal = getTotalCartAmount();
    const shippingFee = 0;
    const taxAmount = 0;
    const grandTotal = subtotal + shippingFee + taxAmount;

    return {
      subtotal,
      shippingFee,
      taxAmount,
      grandTotal
    };
  };

  const orderSummary = calculateSummary();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="checkout-loading">
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItemsList.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>
          <p>Add items to your cart before checkout</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-subtitle">Review your order and complete payment</p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="checkout-content">
          {/* Shipping Address */}
          <div className="checkout-section">
            <h2 className="section-title">Shipping Address</h2>
            <div className="address-list">
              {addresses.length === 0 ? (
                <div className="no-addresses">
                  <p>No addresses found. Please add an address first.</p>
                  <button
                    type="button"
                    onClick={() => navigate('/profile/addresses')}
                    className="btn-secondary"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`address-card ${selectedShippingAddress === address._id ? 'selected' : ''}`}
                    onClick={() => setSelectedShippingAddress(address._id)}
                  >
                    <input
                      type="radio"
                      name="shippingAddress"
                      value={address._id}
                      checked={selectedShippingAddress === address._id}
                      onChange={() => setSelectedShippingAddress(address._id)}
                      className="address-radio"
                    />
                    <div className="address-details">
                      <h3>{address.addressLine1}</h3>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p>{address.country}</p>
                      {address.phone && <p>Phone: {address.phone}</p>}
                      {address.isDefault && <span className="default-badge">Default</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Billing Address */}
          <div className="checkout-section">
            <h2 className="section-title">Billing Address</h2>
            <div className="billing-option">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useSameAddress}
                  onChange={(e) => setUseSameAddress(e.target.checked)}
                />
                <span>Same as shipping address</span>
              </label>
            </div>

            {!useSameAddress && (
              <div className="address-list">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`address-card ${selectedBillingAddress === address._id ? 'selected' : ''}`}
                    onClick={() => setSelectedBillingAddress(address._id)}
                  >
                    <input
                      type="radio"
                      name="billingAddress"
                      value={address._id}
                      checked={selectedBillingAddress === address._id}
                      onChange={() => setSelectedBillingAddress(address._id)}
                      className="address-radio"
                    />
                    <div className="address-details">
                      <h3>{address.addressLine1}</h3>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p>{address.country}</p>
                      {address.phone && <p>Phone: {address.phone}</p>}
                      {address.isDefault && <span className="default-badge">Default</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="order-summary-sidebar">
          <div className="order-summary-card">
            <h2 className="summary-title">Order Summary</h2>

            <div className="order-items">
              {cartItemsList.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="order-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="order-item-price">
                    ${((item.new_price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${orderSummary.taxAmount.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${orderSummary.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="checkout-btn"
              disabled={submitting || !selectedShippingAddress || addresses.length === 0}
            >
              {submitting ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
