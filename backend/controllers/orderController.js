const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);

    const io = req.app.get("io");

    console.log("📡 Emitting real order:", order._id);
    io.emit("newOrder", order);

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};