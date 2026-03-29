const { errorResponse, warningResponse, successResponse } = require("../helpers/response.helper");
const Order = require("../models/order.model");
const Product = require("../models/product.model");

// POST : api/v1/orders Create new order
const createNewOrder = async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || items.length === 0) {
            return warningResponse(res, "Items are required");
        }

        const productIds = items.map(item => item.productId);
        const productsDetails = await Product.find({_id: { $in: productIds }});
        if (productsDetails.length !== items.length) {
            return warningResponse(res, "Some products are not found");
        }

        const orderItems = productsDetails.map((product, index) => {
            const item = items.find(i => i.productId === product._id.toString());
            return {
                productId: product._id,
                productName: product.name,
                price: product.price,
                quantity: item.quantity
            };
        });

        const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        const order = await Order.create({
            items: orderItems,
            amount: totalAmount,
            currency: productsDetails[0].currency // Assuming all products have the same currency
        });

        if (!order) {
            return warningResponse(res, "Failed to create order");
        }

        successResponse(res, "Order created successfully", order);
    } catch(error) {
        errorResponse(res, "Error create new order", error.message);
    }
};

// GET : api/v1/orders/:id Get order by id
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return warningResponse(res, "Order not found");
        }

        successResponse(res, "Order retrieved successfully", order);
    } catch(error) {
        errorResponse(res, "Error get order by id", error.message);
    }
};

// GET : api/v1/orders Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        if (!orders || orders.length === 0) {
            return warningResponse(res, "No orders found");
        }

        successResponse(res, "Orders retrieved successfully", orders);
    } catch(error) {
        errorResponse(res, "Error get all orders", error.message);
    }
};

module.exports = {
    createNewOrder,
    getOrderById,
    getAllOrders
};