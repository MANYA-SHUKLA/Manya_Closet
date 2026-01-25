import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create
// @access  Private
export const createPayment = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Get order
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      paymentStatus: 'pending'
    }).populate('shippingAddress billingAddress');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or already paid'
      });
    }

    // Check if payment already exists
    let payment = await Payment.findOne({ order: orderId });

    if (payment && payment.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order already paid'
      });
    }

    // Create or update payment record
    if (!payment) {
      payment = await Payment.create({
        order: orderId,
        user: userId,
        amount: order.totalAmount,
        currency: 'INR',
        method: 'razorpay',
        paymentGateway: 'razorpay',
        status: 'pending'
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        userId: userId.toString()
      }
    });

    // Update payment with Razorpay order ID
    payment.razorpayOrderId = razorpayOrder.id;
    await payment.save();

    res.status(200).json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
        paymentId: payment._id
      }
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating payment'
    });
  }
};

// @desc    Verify Razorpay webhook signature
// @param   {String} razorpaySignature - X-Razorpay-Signature header
// @param   {String} webhookBody - Raw webhook body
// @returns {Boolean} - True if signature is valid
const verifyWebhookSignature = (razorpaySignature, webhookBody) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    
    if (!webhookSecret) {
      console.error('Razorpay webhook secret not configured');
      return false;
    }

    const generatedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(webhookBody)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(razorpaySignature),
      Buffer.from(generatedSignature)
    );
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
};

// @desc    Verify payment webhook
// @route   POST /api/payment/verify
// @access  Public (webhook from Razorpay)
export const verifyPayment = async (req, res) => {
  try {
    // Handle raw body (Buffer) from express.raw() middleware
    let webhookBody;
    let bodyData;
    
    if (Buffer.isBuffer(req.body)) {
      webhookBody = req.body.toString('utf8');
      bodyData = JSON.parse(webhookBody);
    } else {
      webhookBody = JSON.stringify(req.body);
      bodyData = req.body;
    }

    const razorpaySignature = req.headers['x-razorpay-signature'];

    // Verify webhook signature if present (for webhook events)
    if (razorpaySignature) {
      const isValidSignature = verifyWebhookSignature(razorpaySignature, webhookBody);
      
      if (!isValidSignature) {
        console.error('Invalid webhook signature');
        return res.status(401).json({
          success: false,
          message: 'Invalid webhook signature'
        });
      }
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = bodyData;

    // Handle webhook events (payment.captured, payment.failed, etc.)
    if (bodyData.event) {
      const event = bodyData.event;
      const payload = bodyData.payload;

      if (event === 'payment.captured') {
        const paymentEntity = payload.payment?.entity;
        
        if (paymentEntity) {
          const razorpayOrderId = paymentEntity.order_id;
          const razorpayPaymentId = paymentEntity.id;

          // Find payment by Razorpay order ID
          const payment = await Payment.findOne({ razorpayOrderId });

          if (payment && payment.status !== 'paid') {
            // Verify payment signature
            const generatedSignature = crypto
              .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
              .update(`${razorpayOrderId}|${razorpayPaymentId}`)
              .digest('hex');

            // Update payment record
            payment.transactionId = razorpayPaymentId;
            payment.status = 'paid';
            payment.paidAt = new Date();
            payment.paymentGatewayResponse = payload;
            await payment.save();

            // Update order status
            const order = await Order.findById(payment.order)
              .populate('user', 'name email');
            
            if (order) {
              order.paymentStatus = 'paid';
              order.payment = payment._id;
              order.status = 'confirmed';
              await order.save();

              // Send order confirmation email
              try {
                const adminEmail = process.env.ADMIN_EMAIL || null;
                await sendOrderConfirmationEmail(
                  order.user.email,
                  order.user.name,
                  order.orderNumber,
                  order.totalAmount,
                  adminEmail
                );
              } catch (emailError) {
                console.error('Error sending order confirmation email:', emailError);
              }
            }
          }
        }
      } else if (event === 'payment.failed') {
        const paymentEntity = payload.payment?.entity;
        
        if (paymentEntity) {
          const razorpayOrderId = paymentEntity.order_id;
          const payment = await Payment.findOne({ razorpayOrderId });

          if (payment) {
            payment.status = 'failed';
            payment.paymentGatewayResponse = payload;
            await payment.save();

            // Update order status
            const order = await Order.findById(payment.order);
            if (order) {
              order.paymentStatus = 'failed';
              await order.save();
            }
          }
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Webhook processed successfully'
      });
    }

    // Legacy payment verification (for direct payment verification)
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification data'
      });
    }

    // Find payment by Razorpay order ID
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update payment record
    payment.transactionId = razorpay_payment_id;
    payment.status = 'paid';
    payment.paidAt = new Date();
    await payment.save();

    // Update order status
    const order = await Order.findById(payment.order)
      .populate('user', 'name email');
    
    if (order) {
      order.paymentStatus = 'paid';
      order.payment = payment._id;
      order.status = 'confirmed'; // Update order status to confirmed
      await order.save();

      // Send order confirmation email to user and admin
      try {
        // Get admin email from environment or find an admin user
        const adminEmail = process.env.ADMIN_EMAIL || null;
        
        await sendOrderConfirmationEmail(
          order.user.email,
          order.user.name,
          order.orderNumber,
          order.totalAmount,
          adminEmail
        );
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Note: Frontend should never confirm payment - only webhook does this

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while verifying payment'
    });
  }
};

// @desc    Get payment status
// @route   GET /api/payment/status/:orderId
// @access  Private
export const getPaymentStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: userId
    }).populate('payment');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        orderStatus: order.status,
        payment: order.payment
      }
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching payment status'
    });
  }
};

// @desc    Process refund (Admin)
// @route   POST /api/admin/payments/:paymentId/refund
// @access  Private/Admin
export const processRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    // Find payment
    const payment = await Payment.findById(paymentId)
      .populate('order')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if payment is eligible for refund
    if (payment.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment must be completed to process refund'
      });
    }

    if (payment.refundAmount > 0) {
      const remainingAmount = payment.amount - payment.refundAmount;
      if (amount && amount > remainingAmount) {
        return res.status(400).json({
          success: false,
          message: `Refund amount cannot exceed remaining amount: ${remainingAmount}`
        });
      }
    }

    // Determine refund amount (full or partial)
    const refundAmount = amount || (payment.amount - payment.refundAmount);

    if (refundAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount must be greater than 0'
      });
    }

    // Process refund through Razorpay if payment gateway is Razorpay
    let razorpayRefundId = null;
    if (payment.paymentGateway === 'razorpay' && payment.transactionId) {
      try {
        const razorpayRefund = await razorpay.payments.refund(payment.transactionId, {
          amount: Math.round(refundAmount * 100), // Convert to paise
          notes: {
            reason: reason || 'Refund processed by admin',
            orderId: payment.order._id.toString()
          }
        });

        razorpayRefundId = razorpayRefund.id;
      } catch (razorpayError) {
        console.error('Razorpay refund error:', razorpayError);
        // Continue with manual refund if Razorpay fails
        // In production, you might want to handle this differently
      }
    }

    // Update payment record
    payment.refundAmount = (payment.refundAmount || 0) + refundAmount;
    payment.refundedAt = new Date();
    
    if (payment.refundAmount >= payment.amount) {
      payment.status = 'refunded';
    }

    // Store refund details
    if (!payment.paymentGatewayResponse) {
      payment.paymentGatewayResponse = {};
    }
    if (!payment.paymentGatewayResponse.refunds) {
      payment.paymentGatewayResponse.refunds = [];
    }
    payment.paymentGatewayResponse.refunds.push({
      amount: refundAmount,
      refundId: razorpayRefundId,
      reason: reason || 'Refund processed by admin',
      processedAt: new Date()
    });

    await payment.save();

    // Update order status if full refund
    const order = await Order.findById(payment.order._id);
    if (order && payment.refundAmount >= payment.amount) {
      order.status = 'refunded';
      order.paymentStatus = 'refunded';
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        payment: {
          _id: payment._id,
          amount: payment.amount,
          refundAmount: payment.refundAmount,
          status: payment.status,
          refundedAt: payment.refundedAt
        },
        refund: {
          amount: refundAmount,
          refundId: razorpayRefundId,
          reason: reason || 'Refund processed by admin'
        }
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

// @desc    Get all payments (Admin)
// @route   GET /api/admin/payments
// @access  Private/Admin
export const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus, method } = req.query;

    const query = {};
    if (status) query.status = status;
    if (paymentStatus) {
      // Find orders with this payment status and get their payments
      const orders = await Order.find({ paymentStatus }).select('_id');
      query.order = { $in: orders.map(o => o._id) };
    }
    if (method) query.method = method;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const payments = await Payment.find(query)
      .populate('user', 'name email')
      .populate('order', 'orderNumber totalAmount status paymentStatus')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        payments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all payments (admin) error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching payments'
    });
  }
};
