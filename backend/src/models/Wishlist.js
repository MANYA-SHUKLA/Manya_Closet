import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  _id: true
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    unique: true // One wishlist per user
  },
  items: [wishlistItemSchema]
}, {
  timestamps: true
});

// Indexes
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ 'items.product': 1 });

// Prevent duplicate products in wishlist
wishlistSchema.methods.addProduct = function(productId) {
  const existingItem = this.items.find(item => item.product.toString() === productId.toString());
  if (!existingItem) {
    this.items.push({ product: productId });
  }
  return this;
};

wishlistSchema.methods.removeProduct = function(productId) {
  this.items = this.items.filter(item => item.product.toString() !== productId.toString());
  return this;
};

export default mongoose.model('Wishlist', wishlistSchema);

