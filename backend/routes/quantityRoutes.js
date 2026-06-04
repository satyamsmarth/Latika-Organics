const express = require("express");
const router = express.Router();
const Quantity = require("../models/Quantity");

/* ================= GET ================= */
router.get("/", async (req, res) => {
  const data = await Quantity.find().sort({ createdAt: -1 });
  res.json(data);
});

/* ================= ADD ================= */
router.post("/", async (req, res) => {
  const newItem = new Quantity({ label: req.body.label });
  await newItem.save();
  res.json(newItem);
});

/* ================= UPDATE ================= */
router.put("/:id", async (req, res) => {
  const updated = await Quantity.findByIdAndUpdate(
    req.params.id,
    { label: req.body.label },
    { new: true }
  );
  res.json(updated);
});

/* ================= DELETE ================= */
router.delete("/:id", async (req, res) => {
  await Quantity.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;