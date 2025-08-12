const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const watchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Analog', 'Digital', 'Smartwatch', 'Luxury', 'Sports', 'Other']
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String }
      }
    ],
    price: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number, // percentage
      default: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    tags: [String], // for search/filter (e.g., "waterproof", "stainless steel")
    specifications: {
      caseMaterial: String,
      strapMaterial: String,
      waterResistance: String,
      movementType: String,
      dialColor: String,
      strapColor: String,
      weight: String,
      dimensions: String
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WatchReview'
      }
    ],
    isFeatured: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Watches = mongoose.model('Watch', watchSchema);

module.exports = Watches;
