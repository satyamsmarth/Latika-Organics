const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");

/* =========================
   GET ALL USERS
========================= */
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-otp -otpExpiry -password");
    res.json(users);
  } catch (err) {
    console.log("GET USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* =========================
   GET SINGLE USER (🔥 FIX)
========================= */
router.get("/:id", async (req, res) => {
  try {

    const user = await User.findById(req.params.id)
      .select("-otp -otpExpiry -password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.log("GET USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* =========================
   UPDATE ROLE
========================= */
router.put("/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    res.json(user);

  } catch (err) {
    console.log("UPDATE ROLE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* =========================
   UPDATE USER DETAILS
========================= */
router.put("/:id", async (req, res) => {
  try {

    const { name, email, phone } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

    console.log("UPDATE DATA:", updateData);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedUser);

  } catch (err) {
    console.log("UPDATE USER ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});


/* =========================
   CHANGE PASSWORD
========================= */
router.put("/:id/password", async (req, res) => {
  try {

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword }
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.log("PASSWORD UPDATE ERROR:", err);
    res.status(500).json({ message: "Password update failed" });
  }
});


/* =========================
   DELETE USER
========================= */
router.delete("/:id", async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    console.log("DELETE USER ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});


module.exports = router;