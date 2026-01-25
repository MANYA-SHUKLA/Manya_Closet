import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Address from '../models/Address.js';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

// @desc    Create checkout order
// @route   POST /api/checkout
// @access  Private
export const createCheckout = async (req, res) => {
  try {
    const userId = req.userId;
    const { shippingAddressId, billingAddressId, paymentMethod = 'razorpay', couponCode } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name price images slug');

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate and get shipping address
    if (!shippingAddressId) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    const shippingAddress = await Address.findOne({
      _id: shippingAddressId,
      user: userId,
      isActive: true
    });

    if (!shippingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Shipping address not found or inactive'
      });
    }

    // Validate and get billing address (use shipping if not provided)
    let billingAddress = shippingAddress;
    if (billingAddressId && billingAddressId !== shippingAddressId) {
      billingAddress = await Address.findOne({
        _id: billingAddressId,
        user: userId,
        isActive: true
      });

      if (!billingAddress) {
        return res.status(404).json({
          success: false,
          message: 'Billing address not found or inactive'
        });
      }
    }

    // Validate inventory and lock items
    const orderItems = [];
    const inventoryUpdates = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      const inventory = await Inventory.findOne({ product: product._id });

      if (!inventory) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      if (!inventory.isInStock) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is out of stock`
        });
      }

      const availableQuantity = inventory.quantity - inventory.reservedQuantity;
      if (cartItem.quantity > availableQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableQuantity} units available for ${product.name}`
        });
      }

      // Lock inventory (reserve quantity)
      inventory.reservedQuantity += cartItem.quantity;
      inventoryUpdates.push({
        inventoryId: inventory._id,
        reservedQuantity: inventory.reservedQuantity
      });

      // Create order item
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: cartItem.quantity,
        price: cartItem.price,
        total: cartItem.price * cartItem.quantity
      });
    }

    // Update inventory (lock items)
    for (const update of inventoryUpdates) {
      await Inventory.findByIdAndUpdate(
        update.inventoryId,
        { reservedQuantity: update.reservedQuantity }
      );
    }

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    const shippingFee = 0; // Free shipping for now
    const taxAmount = 0; // No tax for now
    
    // Apply coupon if provided
    let discountAmount = 0;
    let couponData = null;
    
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      
      if (coupon && coupon.isValid()) {
        // Check user usage limit
        const userUsageCount = await Order.countDocuments({
          user: userId,
          'coupon.code': coupon.code,
          status: { $ne: 'cancelled' }
        });
        
        if (userUsageCount < coupon.perUserLimit) {
          const discountResult = coupon.calculateDiscount(subtotal);
          if (!discountResult.message) {
            discountAmount = discountResult.discount;
            couponData = {
              code: coupon.code,
              discount: discountAmount
            };
          }
        }
      }
    }
    
    const grandTotal = subtotal + shippingFee + taxAmount - discountAmount;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await Order.create({
      user: userId,
      orderNumber,
      items: orderItems,
      shippingAddress: shippingAddress._id,
      billingAddress: billingAddress._id,
      subtotal: subtotal,
      shippingCost: shippingFee,
      tax: taxAmount,
      discount: discountAmount,
      coupon: couponData,
      totalAmount: grandTotal,
      status: 'pending', // Order created (pending = CREATED state)
      paymentStatus: 'pending',
      paymentMethod
    });

    // Populate order with product details
    await order.populate('items.product', 'name price images slug');

    // Clear cart after successful order creation
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    // Increment coupon usage count after order is created
    if (couponCode && couponData) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        coupon.usageCount += 1;
        await coupon.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: order.toObject()
      }
    });
  } catch (error) {
    console.error('Create checkout error:', error);

    // If order creation fails, unlock inventory
    // Note: In production, you might want to use transactions for this
    if (error.name !== 'ValidationError') {
      // Rollback inventory reservations if possible
      // This is a simplified version - in production use database transactions
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating order'
    });
  }
};

// @desc    Get checkout summary (cart + addresses)
// @route   GET /api/checkout/summary
// @access  Private
export const getCheckoutSummary = async (req, res) => {
  try {
    const userId = req.userId;

    // Get cart
    const cart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name price images slug stock');

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Get user addresses
    const addresses = await Address.find({
      user: userId,
      isActive: true
    }).sort({ isDefault: -1, createdAt: -1 });

    // Calculate totals
    const subtotal = cart.totalAmount || cart.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    const shippingFee = 0;
    const taxAmount = 0;
    const grandTotal = subtotal + shippingFee + taxAmount;

    res.status(200).json({
      success: true,
      data: {
        cart: cart.toObject(),
        addresses: addresses.map(addr => addr.toObject()),
        summary: {
          subtotal,
          shippingFee,
          taxAmount,
          grandTotal
        }
      }
    });
  } catch (error) {
    console.error('Get checkout summary error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching checkout summary'
    });
  }
};

