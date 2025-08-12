const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Watch', // Product being reviewed
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Registered user
      required: true
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      default: 3,
      min: 1,
      max: 5
    }
  },
  { timestamps: true }
);

// Ensure a user can only review a product once
ReviewSchema.index({ product: 1, author: 1 }, { unique: true });

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
