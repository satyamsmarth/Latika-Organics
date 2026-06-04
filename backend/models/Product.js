const mongoose = require("mongoose");

/* ================= VARIANT SCHEMA ================= */

const variantSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  }
}, { _id: false });


/* ================= PRODUCT SCHEMA ================= */

const ProductSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  // ✅ KEEP OLD (BACKWARD COMPATIBILITY)
  price: {
    type: Number,
    required: false
  },

  stock: {
    type: Number,
    default: 0
  },

  category: {
    type: String,
    default: "Uncategorized"
  },

  description: String,

  image: String,

  images: [String],

  // ✅ NEW VARIANTS SYSTEM
  variants: {
    type: [variantSchema],
    default: []
  }

}, { timestamps: true });


/* ================= HELPER: AUTO PRICE ================= */

// If variants exist → use first variant price
ProductSchema.pre("save", function (next) {

  if (this.variants && this.variants.length > 0) {
    this.price = this.variants[0].price;
    this.stock = this.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  }

  next();
});

module.exports = mongoose.model("Product", ProductSchema);