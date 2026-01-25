import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required'],
    unique: true // One inventory record per product
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  reservedQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Reserved quantity cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Low stock threshold cannot be negative']
  },
  isInStock: {
    type: Boolean,
    default: true
  },
  lastRestocked: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
inventorySchema.index({ product: 1 });
inventorySchema.index({ quantity: 1 });
inventorySchema.index({ isInStock: 1 });
inventorySchema.index({ quantity: 1, lowStockThreshold: 1 }); // For low stock queries

// Virtual for available quantity
inventorySchema.virtual('availableQuantity').get(function() {
  return Math.max(0, this.quantity - this.reservedQuantity);
});

// Ensure virtual fields are serialized
inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

export default mongoose.model('Inventory', inventorySchema);

