import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  compareAtPrice: {
    type: Number,
    default: null,
    min: [0, 'Compare at price cannot be negative']
  },
  images: [{
    type: String,
    required: true
  }],
  sku: {
    type: String,
    unique: true,
    sparse: true, // Allow null values but enforce uniqueness for non-null values
    trim: true,
    uppercase: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  gender: {
    type: String,
    enum: ['men', 'women', 'kids', 'unisex'],
    default: 'unisex'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ tags: 1 });
productSchema.index({ createdAt: -1 }); // For new products
productSchema.index({ name: 'text', description: 'text', tags: 'text' }); // Text search

export default mongoose.model('Product', productSchema);

