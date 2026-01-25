import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';

export const ShopContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper function to map API product to frontend format
const mapProductToFrontend = (apiProduct) => {
  return {
    id: apiProduct._id,
    name: apiProduct.name,
    category: apiProduct.category?.slug || apiProduct.gender || 'unisex',
    image: apiProduct.images?.[0] || '',
    new_price: apiProduct.price,
    old_price: apiProduct.compareAtPrice || null,
    stock: apiProduct.stock || 0,
    inStock: apiProduct.inStock !== undefined ? apiProduct.inStock : (apiProduct.stock || 0) > 0,
    rating: apiProduct.rating?.average || 0,
    ratingCount: apiProduct.rating?.count || 0
  };
};

const ShopContextProvider = (props) => {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [all_product, setAll_product] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();

        if (data.success && data.data.products) {
          // Map API products to frontend format
          const mappedProducts = data.data.products.map(mapProductToFrontend);
          setAll_product(mappedProducts);
        } else {
          setError('Failed to fetch products');
          console.error('Failed to fetch products:', data);
        }
      } catch (err) {
        setError('Error fetching products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch cart from API when user is authenticated
  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated || !token) {
        setCartItems({});
        return;
      }

      try {
        setCartLoading(true);
        const response = await fetch(`${API_URL}/cart`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success && data.data.cart) {
          // Convert cart items to the format expected by frontend
          const cartObj = {};
          data.data.cart.items.forEach(item => {
            cartObj[item.product._id || item.product.id] = item.quantity;
          });
          setCartItems(cartObj);
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
      } finally {
        setCartLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, token]);

  const addTocart = async (itemId, quantity = 1) => {
    if (!isAuthenticated || !token) {
      // Redirect to login with return URL
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return { success: false, message: 'Please login to add items to cart' };
    }

    try {
      setCartLoading(true);
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: itemId, quantity })
      });

      const data = await response.json();

      if (data.success && data.data.cart) {
        // Update cart items state
        const cartObj = {};
        data.data.cart.items.forEach(item => {
          cartObj[item.product._id || item.product.id] = item.quantity;
        });
        setCartItems(cartObj);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Failed to add to cart' };
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      return { success: false, message: 'Error adding to cart' };
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCart = async (itemId, quantity = null) => {
    if (!isAuthenticated || !token) {
      return { success: false, message: 'Please login to update cart' };
    }

    try {
      setCartLoading(true);
      const response = await fetch(`${API_URL}/cart/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: itemId, quantity })
      });

      const data = await response.json();

      if (data.success && data.data.cart) {
        // Update cart items state
        const cartObj = {};
        data.data.cart.items.forEach(item => {
          cartObj[item.product._id || item.product.id] = item.quantity;
        });
        setCartItems(cartObj);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Failed to update cart' };
      }
    } catch (err) {
      console.error('Error updating cart:', err);
      return { success: false, message: 'Error updating cart' };
    } finally {
      setCartLoading(false);
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = all_product.find((product) => product.id === itemId || product.id?.toString() === itemId);
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[itemId];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItems = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        totalItems += cartItems[itemId];
      }
    }
    return totalItems;
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addTocart,
    removeFromCart,
    loading,
    error,
    cartLoading
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
