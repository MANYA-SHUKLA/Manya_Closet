import Return from '../models/Return.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Inventory from '../models/Inventory.js';
import { sendReturnStatusEmail } from '../utils/emailService.js';

// Return window in days (configurable)
const RETURN_WINDOW_DAYS = parseInt(process.env.RETURN_WINDOW_DAYS) || 30;

// @desc    Request return for an order
// @route   POST /api/returns/request
// @access  Private
export const requestReturn = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId, reason, items } = req.body;

    // Validation
    if (!orderId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and reason are required'
      });
    }

    // Check if order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      user: userId
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or does not belong to you'
      });
    }

    // Check if order is delivered
    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: `Return can only be requested for delivered orders. Current status: ${order.status}`
      });
    }

    // Check if return window is still valid (30 days from delivery)
    const deliveryDate = order.updatedAt; // Assuming updatedAt is when it was delivered
    const returnWindowExpiresAt = new Date(deliveryDate);
    returnWindowExpiresAt.setDate(returnWindowExpiresAt.getDate() + RETURN_WINDOW_DAYS);

    if (new Date() > returnWindowExpiresAt) {
      return res.status(400).json({
        success: false,
        message: `Return window has expired. Returns must be requested within ${RETURN_WINDOW_DAYS} days of delivery.`
      });
    }

    // Check if return already exists for this order
    const existingReturn = await Return.findOne({ order: orderId });
    if (existingReturn && existingReturn.status !== 'rejected' && existingReturn.status !== 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'A return request already exists for this order'
      });
    }

    // Create return request
    const returnRequest = await Return.create({
      order: orderId,
      user: userId,
      reason,
      items: items || [],
      status: 'requested',
      returnWindow: deliveryDate,
      returnWindowExpiresAt,
      refundAmount: order.totalAmount // Full refund by default
    });

    // Update order return request status
    order.returnRequest = {
      status: 'pending',
      reason: reason,
      requestedAt: new Date()
    };
    await order.save();

    // Send email notification
    try {
      const user = await import('../models/User.js').then(m => m.default.findById(userId));
      if (user) {
        await sendReturnStatusEmail(
          user.email,
          user.name,
          order.orderNumber,
          'requested',
          reason
        );
      }
    } catch (emailError) {
      console.error('Error sending return status email:', emailError);
    }

    const populatedReturn = await Return.findById(returnRequest._id)
      .populate('order', 'orderNumber status totalAmount')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Return request submitted successfully',
      data: {
        return: populatedReturn
      }
    });
  } catch (error) {
    console.error('Request return error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while submitting return request'
    });
  }
};

// @desc    Get user's return requests
// @route   GET /api/returns
// @access  Private
export const getUserReturns = async (req, res) => {
  try {
    const userId = req.userId;

    const returns = await Return.find({ user: userId })
      .populate('order', 'orderNumber status totalAmount items')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        returns
      }
    });
  } catch (error) {
    console.error('Get user returns error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching returns'
    });
  }
};

// @desc    Get single return by ID
// @route   GET /api/returns/:returnId
// @access  Private
export const getReturnById = async (req, res) => {
  try {
    const userId = req.userId;
    const { returnId } = req.params;

    const returnRequest = await Return.findOne({
      _id: returnId,
      user: userId
    })
      .populate('order', 'orderNumber status totalAmount items shippingAddress')
      .populate('pickupAddress');

    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        return: returnRequest
      }
    });
  } catch (error) {
    console.error('Get return by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching return'
    });
  }
};

// ==================== ADMIN ENDPOINTS ====================

// @desc    Get all return requests (Admin)
// @route   GET /api/admin/returns
// @access  Private/Admin
export const getAllReturns = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, qcStatus } = req.query;

    const query = {};
    if (status) query.status = status;
    if (qcStatus) query.qcStatus = qcStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const returns = await Return.find(query)
      .populate('order', 'orderNumber status totalAmount')
      .populate('user', 'name email')
      .populate('qcCheckedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Return.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        returns,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all returns error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching returns'
    });
  }
};

// @desc    Approve return request (Admin)
// @route   PUT /api/admin/returns/:returnId/approve
// @access  Private/Admin
export const approveReturn = async (req, res) => {
  try {
    const { returnId } = req.params;
    const { pickupDate, pickupAddress } = req.body;

    const returnRequest = await Return.findById(returnId)
      .populate('order')
      .populate('user', 'name email');

    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found'
      });
    }

    if (returnRequest.status !== 'requested') {
      return res.status(400).json({
        success: false,
        message: `Return request cannot be approved. Current status: ${returnRequest.status}`
      });
    }

    // Check if return window is still valid
    if (!returnRequest.isWithinReturnWindow()) {
      return res.status(400).json({
        success: false,
        message: 'Return window has expired'
      });
    }

    // Update return status
    returnRequest.status = 'approved';
    returnRequest.pickupScheduledAt = pickupDate ? new Date(pickupDate) : null;
    returnRequest.pickupAddress = pickupAddress || returnRequest.order.shippingAddress;
    await returnRequest.save();

    // Update order return request status
    const order = await Order.findById(returnRequest.order._id);
    if (order) {
      order.returnRequest.status = 'approved';
      order.returnRequest.processedAt = new Date();
      await order.save();
    }

    // Send email notification
    try {
      await sendReturnStatusEmail(
        returnRequest.user.email,
        returnRequest.user.name,
        order.orderNumber,
        'approved',
        returnRequest.reason
      );
    } catch (emailError) {
      console.error('Error sending return status email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Return request approved successfully',
      data: {
        return: returnRequest
      }
    });
  } catch (error) {
    console.error('Approve return error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while approving return'
    });
  }
};

// @desc    Reject return request (Admin)
// @route   PUT /api/admin/returns/:returnId/reject
// @access  Private/Admin
export const rejectReturn = async (req, res) => {
  try {
    const { returnId } = req.params;
    const { rejectedReason } = req.body;
    const adminId = req.userId;

    const returnRequest = await Return.findById(returnId)
      .populate('order')
      .populate('user', 'name email');

    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found'
      });
    }

    if (returnRequest.status !== 'requested') {
      return res.status(400).json({
        success: false,
        message: `Return request cannot be rejected. Current status: ${returnRequest.status}`
      });
    }

    // Update return status
    returnRequest.status = 'rejected';
    returnRequest.rejectedReason = rejectedReason || 'Return request rejected by admin';
    returnRequest.rejectedAt = new Date();
    returnRequest.rejectedBy = adminId;
    await returnRequest.save();

    // Update order return request status
    const order = await Order.findById(returnRequest.order._id);
    if (order) {
      order.returnRequest.status = 'rejected';
      order.returnRequest.processedAt = new Date();
      await order.save();
    }

    // Send email notification
    try {
      await sendReturnStatusEmail(
        returnRequest.user.email,
        returnRequest.user.name,
        order.orderNumber,
        'rejected',
        rejectedReason || 'Return request rejected'
      );
    } catch (emailError) {
      console.error('Error sending return status email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Return request rejected',
      data: {
        return: returnRequest
      }
    });
  } catch (error) {
    console.error('Reject return error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while rejecting return'
    });
  }
};

// @desc    Mark return as picked up (Admin)
// @route   PUT /api/admin/returns/:returnId/pickup
// @access  Private/Admin
export const markPickupComplete = async (req, res) => {
  try {
    const { returnId } = req.params;

    const returnRequest = await Return.findById(returnId)
      .populate('order')
      .populate('user', 'name email');

    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found'
      });
    }

    if (returnRequest.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: `Return must be approved before pickup. Current status: ${returnRequest.status}`
      });
    }

    returnRequest.status = 'picked_up';
    returnRequest.pickupDate = new Date();
    await returnRequest.save();

    // Send email notification
    try {
      await sendReturnStatusEmail(
        returnRequest.user.email,
        returnRequest.user.name,
        returnRequest.order.orderNumber,
        'picked_up',
        'Your return has been picked up and is being processed'
      );
    } catch (emailError) {
      console.error('Error sending return status email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Return marked as picked up',
      data: {
        return: returnRequest
      }
    });
  } catch (error) {
    console.error('Mark pickup complete error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating pickup status'
    });
  }
};

// @desc    Update QC status (Admin)
// @route   PUT /api/admin/returns/:returnId/qc
// @access  Private/Admin
export const updateQCStatus = async (req, res) => {
  try {
    const { returnId } = req.params;
    const { qcStatus, qcNotes } = req.body;
    const adminId = req.userId;

    if (!qcStatus || !['passed', 'failed'].includes(qcStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Valid QC status (passed/failed) is required'
      });
    }

    const returnRequest = await Return.findById(returnId)
      .populate('order')
      .populate('user', 'name email');

    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found'
      });
    }

    if (returnRequest.status !== 'picked_up') {
      return res.status(400).json({
        success: false,
        message: `Return must be picked up before QC. Current status: ${returnRequest.status}`
      });
    }

    returnRequest.qcStatus = qcStatus;
    returnRequest.qcNotes = qcNotes || null;
    returnRequest.qcCheckedAt = new Date();
    returnRequest.qcCheckedBy = adminId;

    if (qcStatus === 'passed') {
      returnRequest.status = 'qc_passed';
    } else {
      returnRequest.status = 'qc_failed';
    }

    await returnRequest.save();

    // If QC failed, release inventory back
    if (qcStatus === 'failed') {
      const order = await Order.findById(returnRequest.order._id).populate('items.product');
      if (order) {
        for (const item of order.items) {
          const inventory = await Inventory.findOne({ product: item.product._id || item.product });
          if (inventory) {
            inventory.reservedQuantity = Math.max(0, inventory.reservedQuantity - item.quantity);
            await inventory.save();
          }
        }
      }
    }

    // Send email notification
    try {
      await sendReturnStatusEmail(
        returnRequest.user.email,
        returnRequest.user.name,
        returnRequest.order.orderNumber,
        qcStatus === 'passed' ? 'qc_passed' : 'qc_failed',
        qcNotes || `QC ${qcStatus}`
      );
    } catch (emailError) {
      console.error('Error sending return status email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: `QC status updated to ${qcStatus}`,
      data: {
        return: returnRequest
      }
    });
  } catch (error) {
    console.error('Update QC status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating QC status'
    });
  }
};

// @desc    Process refund (Admin)
// @route   PUT /api/admin/returns/:returnId/refund
// @access  Private/Admin
export const processRefund = async (req, res) => {
  try {
    const { returnId } = req.params;
    const { refundAmount, refundTransactionId } = req.body;

    const returnRequest = await Return.findById(returnId)
      .populate('order')
      .populate('user', 'name email');

    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found'
      });
    }

    if (returnRequest.status !== 'qc_passed') {
      return res.status(400).json({
        success: false,
        message: `Refund can only be processed after QC passes. Current status: ${returnRequest.status}`
      });
    }

    // Get payment
    const payment = await Payment.findOne({ order: returnRequest.order._id });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for this order'
      });
    }

    // Calculate refund amount (default to full refund)
    const amountToRefund = refundAmount || returnRequest.refundAmount || payment.amount;

    // Process refund with payment gateway (Razorpay example)
    let razorpayRefund = null;
    if (payment.paymentGateway === 'razorpay' && payment.transactionId) {
      try {
        const razorpay = (await import('razorpay')).default;
        const Razorpay = new razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        razorpayRefund = await Razorpay.payments.refund(payment.transactionId, {
          amount: Math.round(amountToRefund * 100), // Convert to paise
          notes: {
            returnId: returnRequest._id.toString(),
            orderNumber: returnRequest.order.orderNumber
          }
        });

        returnRequest.refundTransactionId = razorpayRefund.id;
      } catch (razorpayError) {
        console.error('Razorpay refund error:', razorpayError);
        return res.status(500).json({
          success: false,
          message: 'Error processing refund with payment gateway'
        });
      }
    }

    // Update return status
    returnRequest.status = 'refunded';
    returnRequest.refundAmount = amountToRefund;
    returnRequest.refundStatus = 'completed';
    returnRequest.refundedAt = new Date();
    await returnRequest.save();

    // Update payment
    payment.refundAmount = (payment.refundAmount || 0) + amountToRefund;
    payment.refundedAt = new Date();
    if (payment.refundAmount >= payment.amount) {
      payment.status = 'refunded';
    }
    await payment.save();

    // Update order
    const order = await Order.findById(returnRequest.order._id);
    if (order) {
      order.status = 'refunded';
      order.paymentStatus = 'refunded';
      order.returnRequest.status = 'completed';
      order.returnRequest.processedAt = new Date();
      await order.save();
    }

    // Release inventory
    const orderWithItems = await Order.findById(returnRequest.order._id).populate('items.product');
    if (orderWithItems) {
      for (const item of orderWithItems.items) {
        const inventory = await Inventory.findOne({ product: item.product._id || item.product });
        if (inventory) {
          inventory.quantity += item.quantity;
          inventory.reservedQuantity = Math.max(0, inventory.reservedQuantity - item.quantity);
          await inventory.save();
        }
      }
    }

    // Send email notification
    try {
      await sendReturnStatusEmail(
        returnRequest.user.email,
        returnRequest.user.name,
        returnRequest.order.orderNumber,
        'refunded',
        `Refund of ₹${amountToRefund} has been processed`
      );
    } catch (emailError) {
      console.error('Error sending return status email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        return: returnRequest,
        refund: razorpayRefund
      }
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while processing refund'
    });
  }
};

