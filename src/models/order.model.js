const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "Product", 
                    require: true
                },
                productName: { type: String, require: true },
                price: { type: Number, require: true },
                quantity: { type: Number, require: true }
            }
        ],
        amount: { type: Number, require: true },
        currency: { type: String, default: "KHR" },
        paid: { type: Boolean, default: false },
        paidAt: { type: Date }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);