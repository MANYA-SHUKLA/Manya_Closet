import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShopContext } from '../../context/ShopContext';
import Item from '../../components/Item/Item';
import './Wishlist.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Wishlist = () => {
  const { isAuthenticated, token } = useAuth();
  const { all_product } = useContext(ShopContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch wishlist from API
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated || !token) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/wishlist`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success && data.data.wishlist) {
          // Map wishlist items to product format
          const items = data.data.wishlist.items.map(item => {
            const product = item.product;
            return {
              id: product._id || product.id,
              name: product.name,
              category: product.category?.slug || product.category || 'unisex',
              image: product.images?.[0] || '',
              new_price: product.price,
              old_price: product.compareAtPrice || null,
              stock: product.stock || 0,
              inStock: product.inStock !== undefined ? product.inStock : true,
              rating: product.rating?.average || 0,
              ratingCount: product.rating?.count || 0,
              addedAt: item.addedAt
            };
          });
          setWishlistItems(items);
        } else {
          setError('Failed to fetch wishlist');
        }
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Error fetching wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated, token]);

  const handleRemoveFromWishlist = async (productId) => {
    if (!isAuthenticated || !token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/wishlist/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });

      const data = await response.json();

      if (data.success) {
        // Remove item from local state
        setWishlistItems(prev => prev.filter(item => item.id !== productId && item.id?.toString() !== productId));
      } else {
        alert(data.message || 'Failed to remove from wishlist');
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('Error removing from wishlist');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-empty">
          <h2>Please login to view your wishlist</h2>
          <p>Sign in to save your favorite products</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-loading">
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1 className="wishlist-title">My Wishlist</h1>
        <p className="wishlist-subtitle">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty">
          <div className="empty-icon">❤️</div>
          <h2>Your wishlist is empty</h2>
          <p>Start adding products you love to your wishlist</p>
        </div>
      ) : (
        <div className="wishlist-items">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-item-wrapper">
              <Item
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
                category={item.category}
                stock={item.stock}
                inStock={item.inStock}
                rating={item.rating}
                ratingCount={item.ratingCount}
              />
              <button
                className="remove-from-wishlist-btn"
                onClick={() => handleRemoveFromWishlist(item.id)}
                aria-label="Remove from wishlist"
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
