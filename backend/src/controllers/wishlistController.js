import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;

    let wishlist = await Wishlist.findOne({ user: userId })
      .populate('items.product', 'name price images slug category');

    if (!wishlist) {
      // Create empty wishlist if it doesn't exist
      wishlist = await Wishlist.create({ user: userId, items: [] });
    }

    res.status(200).json({
      success: true,
      data: {
        wishlist: wishlist.toObject()
      }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching wishlist'
    });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist/add
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
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

    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, items: [] });
    }

    // Check if item already exists in wishlist
    const existingItem = wishlist.items.find(
      item => item.product.toString() === productId.toString()
    );

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add new item
    wishlist.items.push({
      product: productId,
      addedAt: new Date()
    });

    await wishlist.save();

    // Populate product details
    await wishlist.populate('items.product', 'name price images slug category');

    res.status(200).json({
      success: true,
      message: 'Item added to wishlist successfully',
      data: {
        wishlist: wishlist.toObject()
      }
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while adding to wishlist'
    });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/remove
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    // Find item in wishlist
    const itemIndex = wishlist.items.findIndex(
      item => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist'
      });
    }

    // Remove item
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    // Populate product details
    await wishlist.populate('items.product', 'name price images slug category');

    res.status(200).json({
      success: true,
      message: 'Item removed from wishlist successfully',
      data: {
        wishlist: wishlist.toObject()
      }
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while removing from wishlist'
    });
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
export const checkWishlistItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: {
          isInWishlist: false
        }
      });
    }

    const isInWishlist = wishlist.items.some(
      item => item.product.toString() === productId.toString()
    );

    res.status(200).json({
      success: true,
      data: {
        isInWishlist
      }
    });
  } catch (error) {
    console.error('Check wishlist item error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while checking wishlist'
    });
  }
};

