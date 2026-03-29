const router = require("express").Router();
const { createNewOrder } = require("../controllers/order.controller");

router.post("/", createNewOrder);

module.exports = router;