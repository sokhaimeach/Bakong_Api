const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    qr: { type: String, required: true },
    md5: { type: String, required: true },
    expiration: { type: Number, required: true },

    // Payment Info return from Bakong API
    bakongHash: { type: String },
    fromAccountId: { type: String },
    toAccountId: { type: String },
    currency: { type: String, enum: ["KHR", "USD"], default: "KHR" },
    amount: { type: Number, required: true },
    description: { type: String },

    // Status
    status: { type: String, enum: ["PENDING", "PAID", "FAILED", "EXPIRED", "CANCELLED"], default: "PENDING" },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    paidAt: { type: Date, default: null }
});

module.exports = mongoose.model("Payment", paymentSchema);