import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';

// @desc    Get all coupons (Admin)
// @route   GET /api/admin/coupons
// @access  Private/Admin
export const getAllCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, isActive } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const coupons = await Coupon.find(query)
      .populate('applicableCategories', 'name')
      .populate('applicableProducts', 'name')
      .populate('excludedCategories', 'name')
      .populate('excludedProducts', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Coupon.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        coupons,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all coupons error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching coupons'
    });
  }
};

// @desc    Get coupon by ID (Admin)
// @route   GET /api/admin/coupons/:couponId
// @access  Private/Admin
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.couponId)
      .populate('applicableCategories', 'name')
      .populate('applicableProducts', 'name')
      .populate('excludedCategories', 'name')
      .populate('excludedProducts', 'name');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        coupon
      }
    });
  } catch (error) {
    console.error('Get coupon by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching coupon'
    });
  }
};

// @desc    Create coupon (Admin)
// @route   POST /api/admin/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumPurchase,
      maximumDiscount,
      validFrom,
      validUntil,
      usageLimit,
      perUserLimit,
      isActive,
      applicableCategories,
      applicableProducts,
      excludedCategories,
      excludedProducts
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }

    // Validate dates
    if (new Date(validUntil) <= new Date(validFrom)) {
      return res.status(400).json({
        success: false,
        message: 'Valid until date must be after valid from date'
      });
    }

    // Validate discount value
    if (discountType === 'percentage' && discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: 'Percentage discount cannot exceed 100%'
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minimumPurchase: minimumPurchase || 0,
      maximumDiscount,
      validFrom: validFrom || Date.now(),
      validUntil,
      usageLimit,
      perUserLimit: perUserLimit || 1,
      isActive: isActive !== undefined ? isActive : true,
      applicableCategories,
      applicableProducts,
      excludedCategories,
      excludedProducts
    });

    const populatedCoupon = await Coupon.findById(coupon._id)
      .populate('applicableCategories', 'name')
      .populate('applicableProducts', 'name')
      .populate('excludedCategories', 'name')
      .populate('excludedProducts', 'name');

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: {
        coupon: populatedCoupon
      }
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating coupon'
    });
  }
};

// @desc    Update coupon (Admin)
// @route   PUT /api/admin/coupons/:couponId
// @access  Private/Admin
export const updateCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumPurchase,
      maximumDiscount,
      validFrom,
      validUntil,
      usageLimit,
      perUserLimit,
      isActive,
      applicableCategories,
      applicableProducts,
      excludedCategories,
      excludedProducts
    } = req.body;

    const coupon = await Coupon.findById(req.params.couponId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Check if code is being changed and if it already exists
    if (code && code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: 'Coupon code already exists'
        });
      }
    }

    // Validate dates
    const newValidFrom = validFrom || coupon.validFrom;
    const newValidUntil = validUntil || coupon.validUntil;
    if (new Date(newValidUntil) <= new Date(newValidFrom)) {
      return res.status(400).json({
        success: false,
        message: 'Valid until date must be after valid from date'
      });
    }

    // Validate discount value
    if (discountType === 'percentage' && discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: 'Percentage discount cannot exceed 100%'
      });
    }

    // Update fields
    if (code) coupon.code = code.toUpperCase();
    if (description !== undefined) coupon.description = description;
    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (minimumPurchase !== undefined) coupon.minimumPurchase = minimumPurchase;
    if (maximumDiscount !== undefined) coupon.maximumDiscount = maximumDiscount;
    if (validFrom) coupon.validFrom = validFrom;
    if (validUntil) coupon.validUntil = validUntil;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (perUserLimit !== undefined) coupon.perUserLimit = perUserLimit;
    if (isActive !== undefined) coupon.isActive = isActive;
    if (applicableCategories) coupon.applicableCategories = applicableCategories;
    if (applicableProducts) coupon.applicableProducts = applicableProducts;
    if (excludedCategories) coupon.excludedCategories = excludedCategories;
    if (excludedProducts) coupon.excludedProducts = excludedProducts;

    await coupon.save();

    const populatedCoupon = await Coupon.findById(coupon._id)
      .populate('applicableCategories', 'name')
      .populate('applicableProducts', 'name')
      .populate('excludedCategories', 'name')
      .populate('excludedProducts', 'name');

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: {
        coupon: populatedCoupon
      }
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating coupon'
    });
  }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/admin/coupons/:couponId
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.couponId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    await Coupon.findByIdAndDelete(req.params.couponId);

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting coupon'
    });
  }
};

// @desc    Apply coupon (User)
// @route   POST /api/coupons/apply
// @access  Private
export const applyCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const userId = req.user._id;

    if (!code || !subtotal) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and subtotal are required'
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    // Check if coupon is valid
    if (!coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon is not valid or has expired'
      });
    }

    // Check user usage limit
    const userUsageCount = await Order.countDocuments({
      user: userId,
      'coupon.code': coupon.code,
      status: { $ne: 'cancelled' }
    });

    const canUse = coupon.canUse(userId, userUsageCount);
    if (!canUse.valid) {
      return res.status(400).json({
        success: false,
        message: canUse.message
      });
    }

    // Calculate discount
    const discountResult = coupon.calculateDiscount(subtotal);
    if (discountResult.message) {
      return res.status(400).json({
        success: false,
        message: discountResult.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        coupon: {
          _id: coupon._id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          maximumDiscount: coupon.maximumDiscount
        },
        discount: discountResult.discount,
        finalAmount: subtotal - discountResult.discount
      }
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while applying coupon'
    });
  }
};

