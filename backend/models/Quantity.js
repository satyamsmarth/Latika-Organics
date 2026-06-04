const mongoose = require("mongoose");

const quantitySchema = new mongoose.Schema({
  label: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Quantity", quantitySchema);