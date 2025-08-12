const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const querySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    number: {
      type: String, // String to preserve formatting like +91
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

const Query = mongoose.model('Query', querySchema);

module.exports = Query;
