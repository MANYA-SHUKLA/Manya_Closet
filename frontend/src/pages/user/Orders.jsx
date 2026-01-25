import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Orders.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Orders = () => {
  const { isAuthenticated, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success && data.data.orders) {
          setOrders(data.data.orders);
          setError(null);
        } else {
          setError(data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, token]);

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled',
      'refunded': 'status-refunded'
    };
    return statusClasses[status] || 'status-default';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleReviewClick = (order, item) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    setReviewData({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedItem || !selectedOrder || !token) return;

    setSubmittingReview(true);
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product: selectedItem.product?._id || selectedItem.product,
          order: selectedOrder._id,
          rating: reviewData.rating,
          comment: reviewData.comment
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Review submitted successfully!');
        setShowReviewModal(false);
        setSelectedOrder(null);
        setSelectedItem(null);
        // Refresh orders to show updated review status
        window.location.reload();
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Error submitting review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="orders-page">
        <div className="orders-auth-prompt">
          <h1>My Orders</h1>
          <p>Please <Link to="/login">login</Link> to view your orders.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-error">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="orders-title">My Orders</h1>
        <p className="orders-subtitle">Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>You haven't placed any orders yet</p>
          <p className="empty-subtitle">Start shopping to see your orders here!</p>
          <Link to="/" className="shop-now-btn">
            <span>Start Shopping</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-header-left">
                  <h3 className="order-number">Order #{order.orderNumber}</h3>
                  <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="order-header-right">
                  <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                  {order.paymentStatus === 'paid' && (
                    <span className="payment-badge paid">Paid</span>
                  )}
                </div>
              </div>

              <div className="order-items">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={item._id || index} className="order-item-preview">
                    <img 
                      src={item.product?.images?.[0] || '/placeholder.jpg'} 
                      alt={item.product?.name || item.name}
                      className="order-item-image"
                    />
                    <div className="order-item-info">
                      <p className="order-item-name">{item.name}</p>
                      <p className="order-item-quantity">Qty: {item.quantity}</p>
                    </div>
                    <div className="order-item-right">
                      <p className="order-item-price">${item.total?.toFixed(2)}</p>
                      {order.status === 'delivered' && (
                        <button
                          className="review-btn"
                          onClick={() => handleReviewClick(order, item)}
                          title="Write a review"
                        >
                          ⭐ Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="more-items">+{order.items.length - 3} more items</p>
                )}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total:</span>
                  <span className="total-amount">₹{order.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="order-actions">
                  <Link to={`/orders/${order._id}`} className="view-order-btn">
                    View Details
                  </Link>
                  {order.paymentStatus === 'paid' && (
                    <a
                      href={`${API_URL}/orders/${order._id}/invoice`}
                      className="download-invoice-btn"
                      download
                      onClick={(e) => {
                        e.preventDefault();
                        // Download invoice with authentication
                        fetch(`${API_URL}/orders/${order._id}/invoice`, {
                          headers: {
                            'Authorization': `Bearer ${token}`
                          }
                        })
                          .then(response => {
                            if (response.ok) {
                              return response.blob();
                            }
                            throw new Error('Failed to download invoice');
                          })
                          .then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `invoice-${order.orderNumber}.pdf`;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(a);
                          })
                          .catch(error => {
                            console.error('Error downloading invoice:', error);
                            alert('Failed to download invoice. Please try again.');
                          });
                      }}
                    >
                      Download Invoice
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedItem && (
        <div className="review-modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal-header">
              <h2>Write a Review</h2>
              <button className="close-btn" onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            <div className="review-modal-body">
              <div className="review-product-info">
                <img 
                  src={selectedItem.product?.images?.[0] || '/placeholder.jpg'} 
                  alt={selectedItem.name}
                  className="review-product-image"
                />
                <div>
                  <h3>{selectedItem.name}</h3>
                  <p>Order #{selectedOrder?.orderNumber}</p>
                </div>
              </div>
              
              <div className="review-rating">
                <label>Rating:</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= reviewData.rating ? 'active' : ''}`}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div className="review-comment">
                <label htmlFor="review-comment">Your Review:</label>
                <textarea
                  id="review-comment"
                  rows="5"
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  placeholder="Share your experience with this product..."
                />
              </div>
            </div>
            <div className="review-modal-footer">
              <button className="cancel-btn" onClick={() => setShowReviewModal(false)}>
                Cancel
              </button>
              <button 
                className="submit-btn" 
                onClick={handleSubmitReview}
                disabled={submittingReview || !reviewData.comment.trim()}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
