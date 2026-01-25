import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';

// Helper function to get or create cart (for both authenticated and guest users)
const getOrCreateCart = async (userId, sessionId) => {
  let cart;
  
  if (userId) {
    cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [], totalAmount: 0 });
    }
  } else if (sessionId) {
    cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = await Cart.create({ sessionId, items: [], totalAmount: 0 });
    }
  } else {
    throw new Error('Either userId or sessionId is required');
  }
  
  return cart;
};

// @desc    Get user's cart (or guest cart)
// @route   GET /api/cart
// @access  Public (guest) / Private (authenticated)
export const getCart = async (req, res) => {
  try {
    const userId = req.userId || null;
    const sessionId = req.headers['x-session-id'] || req.query.sessionId || null;

    // Get or create cart
    const cart = await getOrCreateCart(userId, sessionId);
    await cart.populate('items.product', 'name price images slug');

    // Get stock information for each item
    const itemsWithStock = await Promise.all(
      cart.items.map(async (item) => {
        const inventory = await Inventory.findOne({ product: item.product._id });
        const itemObj = item.toObject();
        itemObj.product.stock = inventory ? inventory.quantity : 0;
        itemObj.product.inStock = inventory ? inventory.isInStock : false;
        itemObj.product.availableQuantity = inventory ? inventory.availableQuantity : 0;
        return itemObj;
      })
    );

    const cartObj = cart.toObject();
    cartObj.items = itemsWithStock;

    res.status(200).json({
      success: true,
      data: {
        cart: cartObj
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching cart'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Public (guest) / Private (authenticated)
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId || null;
    const sessionId = req.headers['x-session-id'] || req.body.sessionId || null;
    const { productId, quantity = 1 } = req.body;

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    // Check stock
    const inventory = await Inventory.findOne({ product: productId });
    if (!inventory || !inventory.isInStock) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }

    // Get or create cart
    const cart = await getOrCreateCart(userId, sessionId);

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId.toString()
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      // Check if new quantity exceeds available stock
      const availableStock = inventory.availableQuantity;
      if (newQuantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableStock} items available in stock`
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.price;
    } else {
      // Check if requested quantity is available
      if (quantity > inventory.availableQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${inventory.availableQuantity} items available in stock`
        });
      }

      // Add new item
      cart.items.push({
        product: productId,
        quantity: quantity,
        price: product.price
      });
    }

    // Save cart (totalAmount will be calculated by pre-save hook)
    await cart.save();

    // Populate product details
    await cart.populate('items.product', 'name price images slug');

    // Get stock information
    const itemsWithStock = await Promise.all(
      cart.items.map(async (item) => {
        const itemInventory = await Inventory.findOne({ product: item.product._id });
        const itemObj = item.toObject();
        itemObj.product.stock = itemInventory ? itemInventory.quantity : 0;
        itemObj.product.inStock = itemInventory ? itemInventory.isInStock : false;
        return itemObj;
      })
    );

    const cartObj = cart.toObject();
    cartObj.items = itemsWithStock;

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        cart: cartObj
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while adding to cart'
    });
  }
};

// @desc    Remove item from cart or update quantity
// @route   POST /api/cart/remove
// @access  Public (guest) / Private (authenticated)
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId || null;
    const sessionId = req.headers['x-session-id'] || req.body.sessionId || null;
    const { productId, quantity } = req.body;

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // If quantity is provided and greater than 0, update quantity
    if (quantity !== undefined && quantity > 0) {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
      
      // Check stock if updating quantity
      const inventory = await Inventory.findOne({ product: productId });
      if (inventory && quantity > inventory.availableQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${inventory.availableQuantity} items available in stock`
        });
      }
    } else {
      // Remove item completely
      cart.items.splice(itemIndex, 1);
    }

    // Save cart (totalAmount will be calculated by pre-save hook)
    await cart.save();

    // Populate product details
    await cart.populate('items.product', 'name price images slug');

    // Get stock information
    const itemsWithStock = await Promise.all(
      cart.items.map(async (item) => {
        const itemInventory = await Inventory.findOne({ product: item.product._id });
        const itemObj = item.toObject();
        itemObj.product.stock = itemInventory ? itemInventory.quantity : 0;
        itemObj.product.inStock = itemInventory ? itemInventory.isInStock : false;
        return itemObj;
      })
    );

    const cartObj = cart.toObject();
    cartObj.items = itemsWithStock;

    res.status(200).json({
      success: true,
      message: quantity !== undefined && quantity > 0 
        ? 'Cart updated successfully' 
        : 'Item removed from cart successfully',
      data: {
        cart: cartObj
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating cart'
    });
  }
};

// @desc    Merge guest cart with user cart on login
// @route   POST /api/cart/merge
// @access  Private
export const mergeGuestCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { sessionId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Get user cart
    let userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      userCart = await Cart.create({ user: userId, items: [], totalAmount: 0 });
    }

    // Get guest cart
    const guestCart = await Cart.findOne({ sessionId });

    if (!guestCart || !guestCart.items || guestCart.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No guest cart to merge',
        data: {
          cart: await Cart.findById(userCart._id).populate('items.product', 'name price images slug')
        }
      });
    }

    // Merge items from guest cart into user cart
    for (const guestItem of guestCart.items) {
      const existingItemIndex = userCart.items.findIndex(
        item => item.product.toString() === guestItem.product.toString()
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity (add guest quantity to user quantity)
        userCart.items[existingItemIndex].quantity += guestItem.quantity;
        // Update price to latest
        userCart.items[existingItemIndex].price = guestItem.price;
      } else {
        // New item, add it
        userCart.items.push({
          product: guestItem.product,
          quantity: guestItem.quantity,
          price: guestItem.price
        });
      }
    }

    // Save merged cart
    await userCart.save();

    // Delete guest cart
    await Cart.findByIdAndDelete(guestCart._id);

    // Populate and return merged cart
    await userCart.populate('items.product', 'name price images slug');

    // Get stock information
    const itemsWithStock = await Promise.all(
      userCart.items.map(async (item) => {
        const inventory = await Inventory.findOne({ product: item.product._id });
        const itemObj = item.toObject();
        itemObj.product.stock = inventory ? inventory.quantity : 0;
        itemObj.product.inStock = inventory ? inventory.isInStock : false;
        itemObj.product.availableQuantity = inventory ? inventory.availableQuantity : 0;
        return itemObj;
      })
    );

    const cartObj = userCart.toObject();
    cartObj.items = itemsWithStock;

    res.status(200).json({
      success: true,
      message: 'Cart merged successfully',
      data: {
        cart: cartObj
      }
    });
  } catch (error) {
    console.error('Merge cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while merging cart'
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Public (guest) / Private (authenticated)
export const clearCart = async (req, res) => {
  try {
    const userId = req.userId || null;
    const sessionId = req.headers['x-session-id'] || req.query.sessionId || null;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either authentication or session ID is required'
      });
    }
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        cart: cart.toObject()
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while clearing cart'
    });
  }
};

