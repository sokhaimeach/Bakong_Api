const Payment = require("../models/payment.model");
const Order = require("../models/order.model");
const { generateQrCode } = require("../services/bakong.service");
const { errorResponse, warningResponse, successResponse } = require("../helpers/response.helper");
const QRCode = require("qrcode");

// POST : api/v1/payments Create new payment for order
const generateQrAndPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return warningResponse(res, "Order ID is required");
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return warningResponse(res, "Order not found");
        }

        const paymentData = {
            amount: order.amount,
            currency: order.currency,
            orderId: order._id.toString()
        };

        const bakongResponse = await generateQrCode(paymentData);

        const existingPayment = await Payment.findOne({ orderId: order._id });

        if (existingPayment && (
            existingPayment.status === "PENDING" || 
            existingPayment.status === "FAILED" ||
            existingPayment.status === "EXPIRED"
        )) {
            existingPayment.qr = bakongResponse.data.qr;
            existingPayment.md5 = bakongResponse.data.md5;
            existingPayment.expiration = bakongResponse.expiresAt;
            existingPayment.status = "PENDING";
            await existingPayment.save();

            return successResponse(res, "Existing payment updated with new QR code", existingPayment);
        };

        if (existingPayment && existingPayment.status === "PAID") {
            return warningResponse(res, "Payment for this order has already been completed", 400);
        }

        if (existingPayment && existingPayment.status === "CANCELLED") {
            return warningResponse(res, "Payment for this order has been cancelled. Please create a new order to proceed.", 400);
        }

        const payment = await Payment.create({
            orderId: order._id,
            qr: bakongResponse.data.qr,
            md5: bakongResponse.data.md5,
            expiration: bakongResponse.expiresAt,
            currency: order.currency,
            amount: order.amount
        });

        return successResponse(res, "Create payment successfully", payment);
    } catch(error) {
        errorResponse(res, "Error create new payment", error.message);
    }
};

// GET : /api/v1/payments/:id/preview
const previewQrByPaymentId = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id);
        if (!payment) {
            return warningResponse(res, "Payment not found");
        }

        const dataURL = await QRCode.toDataURL(payment.qr, {
            errorCorrectionLevel: "M",
            width: 320,
            margin: 2
        });

        return res.send(`<!doctype html>
        <html lang="en">
            <head><meta charset="utf-8"><title>Bakong QR Preview</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; margin: 24px;">
                <h1>Bakong QR Preview</h1>
                <p>Order: ${payment.orderId}</p>
                <p>Amount: ${payment.amount} ${payment.currency}</p>
                <img src="${dataURL}" alt="Bakong QR Code" style="max-width: 320px; width: 100%;">
                <p style="margin-top: 1rem;">Scan with Bakong app</p>
                <small>Raw QR string: ${payment.qr}</small>
            </body>
        </html>`);
    } catch (error) {
        console.error("Error preview payment QR:", error);
        errorResponse(res, "Error generating QR preview", error.message);
    }
};

module.exports = {
    generateQrAndPayment,
    previewQrByPaymentId
};