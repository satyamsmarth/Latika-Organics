const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    default: ""
  },

  email: {
    type: String,
    default: ""
  },

  phone: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    default: ""
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  otp: String,
  otpExpiry: Date,

  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);