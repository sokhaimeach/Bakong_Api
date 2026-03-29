require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");

// Declare routes
const productRoutes = require("./routes/product.route");
const orderRoutes = require("./routes/order.route");
const paymentRoutes = require("./routes/payment.route");

// Initialize MongoDB Connection
connectDB();

// Initialize CORS middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);

module.exports = app;