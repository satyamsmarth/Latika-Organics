const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  name: {
    type: String,
    default: ""
  },

  email: {
    type: String,
    default: ""
  },

  items: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],

  total: {
    type: Number,
    required: true,
    default: 0
  },

  status: {
    type: String,
    default: "Order Placed"
  },

  // ✅ FIXED ADDRESS STRUCTURE
  address: {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" }
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);