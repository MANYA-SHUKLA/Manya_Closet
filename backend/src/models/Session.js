import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  refreshToken: {
    type: String,
    required: [true, 'Refresh token is required'],
    unique: true
  },
  accessToken: {
    type: String,
    default: null
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required']
  },
  deviceInfo: {
    userAgent: String,
    ip: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
sessionSchema.index({ user: 1 });
sessionSchema.index({ refreshToken: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-deletion

// Method to check if session is valid
sessionSchema.methods.isValid = function() {
  return this.isActive && new Date() < this.expiresAt;
};

export default mongoose.model('Session', sessionSchema);

