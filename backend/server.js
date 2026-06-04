require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const transporter = require("./config/mailer");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const quantityRoutes = require("./routes/quantityRoutes");

const app = express();
const server = http.createServer(app);

/* ✅ PRODUCTION CORS */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

/* ✅ SOCKET CONFIG */
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
  transports: ["polling", "websocket"],
  allowEIO3: true,
});

app.set("io", io);

/* ✅ SOCKET EVENTS */
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("🔴 Client disconnected:", socket.id, "Reason:", reason);
  });
});

/* ✅ MAIL VERIFY */
transporter.verify((error) => {
  if (error) {
    console.log("MAIL SERVER ERROR ❌:", error);
  } else {
    console.log("MAIL SERVER READY ✅");
  }
});

/* ✅ ROUTES */
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/quantities", quantityRoutes);

/* ✅ DATABASE */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB ERROR ❌:", err.message));

/* ✅ SERVER */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});