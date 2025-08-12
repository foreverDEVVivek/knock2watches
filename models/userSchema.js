const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema(
  {
    username:{
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    resetToken: String,
    resetTokenExpiry: Date,
    role: {
      type: String,
      enum: ['customer', 'admin', 'seller'],
      default: 'customer'
    },
    addresses: [
      {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, default: 'India' }
      }
    ],
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart'
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      }
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Watch'
      }
    ]
  },
  { timestamps: true }
);

// Add username & password fields + hashing via passport-local-mongoose
userSchema.plugin(passportLocalMongoose, { 
  usernameField: 'email',
  usernameUnique: false // prevents index creation on username
});
const User = mongoose.model('User', userSchema);
module.exports = User;
