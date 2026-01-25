import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendReviewNotificationEmail } from '../utils/emailService.js';

// Abuse detection utility functions
const detectAbuse = (comment, title, userId, productId) => {
  const issues = [];

  // Profanity/spam keywords (basic list - can be expanded)
  const spamKeywords = ['spam', 'scam', 'fake', 'cheat', 'fraud'];
  const profanityKeywords = ['bad', 'worst', 'terrible']; // Add actual profanity list

  const textToCheck = `${title || ''} ${comment || ''}`.toLowerCase();

  // Check for spam keywords
  spamKeywords.forEach(keyword => {
    if (textToCheck.includes(keyword)) {
      issues.push(`Contains spam keyword: ${keyword}`);
    }
  });

  // Check for excessive repetition
  const words = textToCheck.split(/\s+/);
  const wordCounts = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  const repeatedWords = Object.entries(wordCounts).filter(([word, count]) => count > 5);
  if (repeatedWords.length > 0) {
    issues.push('Excessive word repetition detected');
  }

  // Check for suspicious patterns (all caps, excessive punctuation)
  if (textToCheck === textToCheck.toUpperCase() && textToCheck.length > 20) {
    issues.push('Suspicious pattern: All caps text');
  }

  const excessivePunctuation = (textToCheck.match(/[!?.]{3,}/g) || []).length;
  if (excessivePunctuation > 2) {
    issues.push('Excessive punctuation detected');
  }

  return {
    isAbusive: issues.length > 0,
    issues
  };
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, orderId, rating, title, comment, images } = req.body;

    // Validation
    if (!productId || !orderId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productId, orderId, and rating'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or is inactive'
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

    // Check if order status is DELIVERED
    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'You can only review products after the order has been delivered. Current order status: ' + order.status
      });
    }

    // Check if the product is in this order
    const orderItem = order.items.find(item => 
      item.product._id.toString() === productId || item.product.toString() === productId
    );

    if (!orderItem) {
      return res.status(400).json({
        success: false,
        message: 'This product is not part of the specified order'
      });
    }

    // Check if review already exists for this product and order (enforced by unique index, but check for better error message)
    const existingReview = await Review.findOne({
      product: productId,
      order: orderId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'This product has already been reviewed for this order'
      });
    }

    // Abuse detection
    const abuseCheck = detectAbuse(comment, title, userId, productId);
    
    // Check for rapid reviews from same user (abuse detection)
    const recentReviews = await Review.find({
      user: userId,
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
    });

    if (recentReviews.length >= 10) {
      return res.status(429).json({
        success: false,
        message: 'Too many reviews submitted recently. Please try again later.'
      });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      product: productId,
      order: orderId,
      rating,
      title: title || null,
      comment: comment || null,
      images: images || [],
      isVerifiedPurchase: true, // Since it's linked to an order
      isApproved: !abuseCheck.isAbusive // Auto-approve if no abuse detected, otherwise require moderation
    });

    // Update product rating average (optional - you might want to calculate this on the fly)
    // For now, we'll just return the review

    // Populate review with user and product details
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name email avatar')
      .populate('product', 'name images');

    // Send email notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || null;
      if (adminEmail) {
        await sendReviewNotificationEmail(
          adminEmail,
          populatedReview.user.name,
          populatedReview.user.email,
          populatedReview.product.name,
          rating,
          comment || '',
          order.orderNumber
        );
      }
    } catch (emailError) {
      console.error('Error sending review notification email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: abuseCheck.isAbusive 
        ? 'Review submitted and pending moderation due to content flags'
        : 'Review created successfully',
      data: {
        review: populatedReview,
        requiresModeration: abuseCheck.isAbusive
      }
    });
  } catch (error) {
    console.error('Create review error:', error);
    
    // Handle unique constraint violation
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This product has already been reviewed for this order'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating review'
    });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, rating, sortBy = 'newest' } = req.query;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Build query
    const query = {
      product: productId,
      isApproved: true // Only show approved reviews
    };

    if (rating) {
      query.rating = parseInt(rating);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sortBy === 'highest') {
      sortOption = { rating: -1 };
    } else if (sortBy === 'lowest') {
      sortOption = { rating: 1 };
    }

    // Get reviews
    const reviews = await Review.find(query)
      .populate('user', 'name email avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Review.countDocuments(query);

    // Calculate rating statistics
    const ratingStats = await Review.aggregate([
      {
        $match: {
          product: product._id,
          isApproved: true
        }
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      }
    ]);

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    ratingStats.forEach(stat => {
      ratingDistribution[stat._id] = stat.count;
    });

    const totalReviews = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);
    const averageRating = totalReviews > 0
      ? ratingStats.reduce((sum, stat) => sum + (stat._id * stat.count), 0) / totalReviews
      : 0;

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        statistics: {
          totalReviews,
          averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          ratingDistribution
        }
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching reviews'
    });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, productId, rating, isApproved, sortBy = 'newest' } = req.query;

    // Build query
    const query = {};
    if (productId) query.product = productId;
    if (rating) query.rating = parseInt(rating);
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sortBy === 'highest') {
      sortOption = { rating: -1 };
    } else if (sortBy === 'lowest') {
      sortOption = { rating: 1 };
    }

    // Get reviews
    const reviews = await Review.find(query)
      .populate('user', 'name email avatar')
      .populate('product', 'name images slug')
      .populate('order', 'orderNumber status')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching reviews'
    });
  }
};

// @desc    Get pending reviews for moderation (Admin)
// @route   GET /api/admin/reviews/pending
// @access  Private/Admin
export const getPendingReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ isApproved: false })
      .populate('user', 'name email avatar')
      .populate('product', 'name images slug')
      .populate('order', 'orderNumber status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ isApproved: false });

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get pending reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching pending reviews'
    });
  }
};

// @desc    Approve review (Admin)
// @route   PUT /api/admin/reviews/:reviewId/approve
// @access  Private/Admin
export const approveReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId)
      .populate('user', 'name email')
      .populate('product', 'name');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Review is already approved'
      });
    }

    review.isApproved = true;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review approved successfully',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while approving review'
    });
  }
};

// @desc    Reject review (Admin)
// @route   PUT /api/admin/reviews/:reviewId/reject
// @access  Private/Admin
export const rejectReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await Review.findById(reviewId)
      .populate('user', 'name email')
      .populate('product', 'name');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Delete the review instead of just marking as rejected
    // This is more appropriate for rejected reviews
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: 'Review rejected and removed',
      data: {
        reviewId: review._id,
        reason: reason || 'Review rejected by admin'
      }
    });
  } catch (error) {
    console.error('Reject review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while rejecting review'
    });
  }
};

