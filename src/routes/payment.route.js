const router = require("express").Router();
const { generateQrAndPayment, previewQrByPaymentId } = require("../controllers/payment.controller");

router.post("/", generateQrAndPayment);
router.get("/:id/preview", previewQrByPaymentId);

module.exports = router;