import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  name: {
    type: String,
    required: true // Store product name at time of order
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  }
}, {
  _id: true
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  items: [orderItemSchema],
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: [true, 'Shipping address is required']
  },
  billingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: [true, 'Billing address is required']
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: [0, 'Shipping cost cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  coupon: {
    code: {
      type: String,
      default: null
    },
    discount: {
      type: Number,
      default: 0
    }
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null
  },
  trackingNumber: {
    type: String,
    default: null
  },
  returnRequest: {
    requestedAt: {
      type: Date,
      default: null
    },
    reason: {
      type: String,
      default: null
    },
    items: [{
      type: mongoose.Schema.Types.ObjectId
    }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: null
    },
    processedAt: {
      type: Date,
      default: null
    }
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ user: 1, createdAt: -1 });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);

