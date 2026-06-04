const express = require("express");
const router = express.Router();
const Product = require("../models/Product");



/* ======================================
   GET ALL PRODUCTS
====================================== */

router.get("/", async (req, res) => {
  try {

    const products = await Product.find().sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
});



/* ======================================
   GET SINGLE PRODUCT
====================================== */

router.get("/:id", async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    res.json(product);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
});



/* ======================================
   ADD PRODUCT
====================================== */

router.post("/", async (req, res) => {

  try {

    const {
      name,
      price,
      stock,
      description,
      category,
      image
    } = req.body;


    const product = new Product({

      name,
      price,
      stock,
      description,
      category: category || "Uncategorized",
      image

    });


    const savedProduct = await product.save();

    res.json(savedProduct);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});



/* ======================================
   UPDATE PRODUCT
====================================== */

router.put("/:id", async (req, res) => {

  try {

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProduct);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});



/* ======================================
   DELETE PRODUCT
====================================== */

router.delete("/:id", async (req, res) => {

  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});



module.exports = router;