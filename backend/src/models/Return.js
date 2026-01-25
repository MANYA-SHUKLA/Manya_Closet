import mongoose from 'mongoose';

const returnSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  reason: {
    type: String,
    required: [true, 'Return reason is required'],
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order.items'
  }],
  status: {
    type: String,
    enum: ['requested', 'approved', 'rejected', 'picked_up', 'qc_passed', 'qc_failed', 'refunded', 'cancelled'],
    default: 'requested'
  },
  returnWindow: {
    type: Date,
    required: true
  },
  returnWindowExpiresAt: {
    type: Date,
    required: true
  },
  pickupDate: {
    type: Date,
    default: null
  },
  pickupScheduledAt: {
    type: Date,
    default: null
  },
  pickupAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    default: null
  },
  qcStatus: {
    type: String,
    enum: ['pending', 'passed', 'failed'],
    default: 'pending'
  },
  qcNotes: {
    type: String,
    maxlength: [1000, 'QC notes cannot exceed 1000 characters'],
    default: null
  },
  qcCheckedAt: {
    type: Date,
    default: null
  },
  qcCheckedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  refundAmount: {
    type: Number,
    default: 0,
    min: [0, 'Refund amount cannot be negative']
  },
  refundStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  refundedAt: {
    type: Date,
    default: null
  },
  refundTransactionId: {
    type: String,
    default: null
  },
  rejectedReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    default: null
  }
}, {
  timestamps: true
});

// Indexes
returnSchema.index({ order: 1 });
returnSchema.index({ user: 1 });
returnSchema.index({ status: 1 });
returnSchema.index({ returnWindowExpiresAt: 1 });
returnSchema.index({ qcStatus: 1 });
returnSchema.index({ refundStatus: 1 });
returnSchema.index({ createdAt: -1 });
returnSchema.index({ user: 1, status: 1 });

// Method to check if return window is still valid
returnSchema.methods.isWithinReturnWindow = function() {
  return new Date() <= this.returnWindowExpiresAt;
};

// Method to check if return is eligible
returnSchema.methods.isEligibleForReturn = function() {
  return this.status === 'requested' && this.isWithinReturnWindow();
};

export default mongoose.model('Return', returnSchema);

