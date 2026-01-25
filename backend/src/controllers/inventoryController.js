import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import { checkProductStockAndNotify } from '../utils/stockNotificationService.js';

// @desc    Get all inventory (Admin)
// @route   GET /api/admin/inventory
// @access  Private/Admin
export const getAllInventory = async (req, res) => {
  try {
    const { page = 1, limit = 50, lowStock, isInStock } = req.query;

    const query = {};
    
    // Filter by low stock
    if (lowStock === 'true') {
      query.$expr = {
        $lte: ['$quantity', '$lowStockThreshold']
      };
    }
    
    // Filter by stock status
    if (isInStock !== undefined) {
      query.isInStock = isInStock === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const inventory = await Inventory.find(query)
      .populate('product', 'name images slug price')
      .sort({ quantity: 1 }) // Sort by quantity ascending (low stock first)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Inventory.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        inventory,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all inventory error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching inventory'
    });
  }
};

// @desc    Get inventory for a product
// @route   GET /api/admin/inventory/:productId
// @access  Private/Admin
export const getProductInventory = async (req, res) => {
  try {
    const { productId } = req.params;

    const inventory = await Inventory.findOne({ product: productId })
      .populate('product', 'name images slug price');

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found for this product'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        inventory
      }
    });
  } catch (error) {
    console.error('Get product inventory error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching inventory'
    });
  }
};

// @desc    Update inventory
// @route   PUT /api/admin/inventory/:productId
// @access  Private/Admin
export const updateInventory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, reservedQuantity, lowStockThreshold, isInStock } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find or create inventory
    let inventory = await Inventory.findOne({ product: productId });
    const previousQuantity = inventory ? inventory.quantity : 0;
    const wasOutOfStock = previousQuantity === 0 || (inventory && !inventory.isInStock);

    if (!inventory) {
      // Create new inventory entry
      inventory = await Inventory.create({
        product: productId,
        quantity: quantity || 0,
        reservedQuantity: reservedQuantity || 0,
        lowStockThreshold: lowStockThreshold || 10,
        isInStock: isInStock !== undefined ? isInStock : (quantity || 0) > 0
      });
    } else {
      // Update existing inventory
      if (quantity !== undefined) {
        inventory.quantity = quantity;
        inventory.isInStock = quantity > 0;
        inventory.lastRestocked = new Date();
      }
      if (reservedQuantity !== undefined) {
        inventory.reservedQuantity = reservedQuantity;
      }
      if (lowStockThreshold !== undefined) {
        inventory.lowStockThreshold = lowStockThreshold;
      }
      if (isInStock !== undefined) {
        inventory.isInStock = isInStock;
      }
      
      await inventory.save();
    }

    // Populate product details
    await inventory.populate('product', 'name images slug price');

    // Check if product came back in stock and notify wishlist users
    const isNowInStock = inventory.quantity > 0 && inventory.isInStock;
    if (wasOutOfStock && isNowInStock) {
      // Product was out of stock and is now back in stock - notify users
      try {
        await checkProductStockAndNotify(productId);
      } catch (notificationError) {
        console.error('Error sending stock notifications:', notificationError);
        // Don't fail the request if notification fails
      }
    }

    res.status(200).json({
      success: true,
      message: 'Inventory updated successfully',
      data: {
        inventory
      }
    });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating inventory'
    });
  }
};

