const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewWatchesSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Watch', // Reference to watch being reviewed
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to user who wrote the review
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

// Prevent a user from reviewing the same watch twice
reviewWatchesSchema.index({ product: 1, author: 1 }, { unique: true });

const WatchReview = mongoose.model('WatchReview', reviewWatchesSchema);

module.exports = WatchReview;
