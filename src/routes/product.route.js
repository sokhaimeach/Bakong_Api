const router = require("express").Router();
const { createNewProduct, getAllProducts, updateProduct, deleteProduct } = require("../controllers/product.controller");

router.post("/", createNewProduct);
router.get("/", getAllProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;