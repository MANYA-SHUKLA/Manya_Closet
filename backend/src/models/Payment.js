import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order is required'],
    unique: true // One payment per order
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true
  },
  method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'netbanking', 'cod', 'wallet', 'razorpay'],
    required: [true, 'Payment method is required']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'paid', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  razorpayOrderId: {
    type: String,
    default: null,
    sparse: true
  },
  transactionId: {
    type: String,
    default: null,
    unique: true,
    sparse: true
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'stripe', 'paypal', 'cod', null],
    default: null
  },
  paymentGatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  paidAt: {
    type: Date,
    default: null
  },
  refundAmount: {
    type: Number,
    default: 0,
    min: [0, 'Refund amount cannot be negative']
  },
  refundedAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ method: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ user: 1, status: 1 });

export default mongoose.model('Payment', paymentSchema);

