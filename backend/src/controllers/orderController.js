import Order from '../models/Order.js';
import User from '../models/User.js';
import { sendOrderStatusEmail } from '../utils/emailService.js';
import { generateInvoicePDF } from '../utils/invoiceGenerator.js';

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ user: userId })
      .populate('shippingAddress billingAddress', 'addressLine1 addressLine2 city state postalCode country phone fullName')
      .populate('items.product', 'name images slug')
      .sort({ createdAt: -1 }); // Latest first

    res.status(200).json({
      success: true,
      data: {
        orders
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching orders'
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:orderId
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: userId
    })
      .populate('shippingAddress billingAddress', 'addressLine1 addressLine2 city state postalCode country phone fullName')
      .populate('items.product', 'name images slug price')
      .populate('payment');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching order'
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('shippingAddress', 'addressLine1 city state postalCode country')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching orders'
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:orderId/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('shippingAddress');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const oldStatus = order.status;
    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    await order.save();

    // Send email if status changed to shipped or delivered
    if ((status === 'shipped' || status === 'delivered') && oldStatus !== status) {
      try {
        await sendOrderStatusEmail(
          order.user.email,
          order.user.name,
          order.orderNumber,
          status,
          trackingNumber || order.trackingNumber
        );
      } catch (emailError) {
        console.error('Error sending order status email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating order status'
    });
  }
};

// @desc    Cancel order (User)
// @route   POST /api/orders/:orderId/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: userId
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['pending', 'confirmed', 'processing'];
    const previousStatus = order.status;
    
    if (!cancellableStatuses.includes(previousStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled. Current status: ${previousStatus}`
      });
    }

    // Release inventory if order was confirmed/processing
    if (previousStatus === 'confirmed' || previousStatus === 'processing') {
      const Inventory = (await import('../models/Inventory.js')).default;
      
      for (const item of order.items) {
        const inventory = await Inventory.findOne({ product: item.product._id || item.product });
        if (inventory) {
          inventory.reservedQuantity = Math.max(0, inventory.reservedQuantity - item.quantity);
          await inventory.save();
        }
      }
    }

    // Update order status
    order.status = 'cancelled';
    if (reason) {
      order.notes = (order.notes || '') + `\nCancellation reason: ${reason}`;
    }
    await order.save();

    // If payment was made, initiate refund
    if (order.paymentStatus === 'paid' && order.payment) {
      const Payment = (await import('../models/Payment.js')).default;
      const payment = await Payment.findById(order.payment);
      
      if (payment && payment.status === 'paid') {
        // Update payment status to refunded
        payment.status = 'refunded';
        payment.refundAmount = payment.amount;
        payment.refundedAt = new Date();
        await payment.save();

        // Update order payment status
        order.paymentStatus = 'refunded';
        await order.save();

        // Note: Actual refund processing should be done through admin refund API
        // or automated refund system
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while cancelling order'
    });
  }
};

// @desc    Request return (User)
// @route   POST /api/orders/:orderId/return
// @access  Private
export const requestReturn = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;
    const { reason, items } = req.body; // items: array of item IDs to return

    const order = await Order.findOne({
      _id: orderId,
      user: userId
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be returned (must be delivered)
    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Order must be delivered to request return'
      });
    }

    // Check if return already requested
    if (order.status === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Return already processed for this order'
      });
    }

    // Update order status to indicate return requested
    // Note: You might want to add a 'return_requested' status or use notes
    order.notes = (order.notes || '') + `\nReturn requested. Reason: ${reason || 'Not specified'}`;
    
    // Store return request details
    if (!order.returnRequest) {
      order.returnRequest = {
        requestedAt: new Date(),
        reason: reason || 'Not specified',
        items: items || [],
        status: 'pending'
      };
    }
    
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Return request submitted successfully. Admin will review your request.',
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          returnRequest: order.returnRequest
        }
      }
    });
  } catch (error) {
    console.error('Request return error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while processing return request'
    });
  }
};

// @desc    Download invoice PDF
// @route   GET /api/orders/:orderId/invoice
// @access  Private
export const downloadInvoice = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: userId
    })
      .populate('shippingAddress billingAddress')
      .populate('items.product', 'name images slug price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Generate PDF invoice
    const pdfBuffer = await generateInvoicePDF(order);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${order.orderNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download invoice error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while generating invoice'
    });
  }
};
