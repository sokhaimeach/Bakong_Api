const Product = require("../models/product.model");
const { errorResponse, successResponse, warningResponse } = require("../helpers/response.helper");

// POST : api/v1/products Create new product
const createNewProduct = async (req, res) => {
    try {
        const { name, description, price, currency, images, stock } = req.body;

        const product = await Product.create({ name, description, price, currency, images, stock });

        return successResponse(res, "Create Prodcut Successfully", product);
    } catch(error) {
        errorResponse(res, "Error create new product", error.message);
    }
};

// GET : api/v1/products Get All products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({createdAt: -1});
        if(products.length === 0) {
            return warningResponse(res, "Products not found", 404);
        }

        successResponse(res, "Get all products successfully", products);
    } catch(error) {
        errorResponse(res, "Error get all products", error.message);
    }
}

// PUT : api/v1/products/:id Update product info
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, currency, images, stock } = req.body;

        const product = await Product.findByIdAndUpdate(id, { name, description, price, currency, images, stock });
        if(!product) {
            return warningResponse(res, "Product not found");
        }

        successResponse(res, "Update product successfully", product);
    } catch(error) {
        errorResponse(res, "Error update product", error.message);
    }
};

// DELETE : api/v1/products/:id Delete product by id
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);
        if(!product) {
            return warningResponse(res, "Product not found");
        }

        successResponse(res, "Product delete successfully", product);
    } catch(error) {
        errorResponse(res, "Error delete product", error.message);
    }
}

module.exports = {
    createNewProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
}