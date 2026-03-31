const router = require("express").Router();
const { generateQrAndPayment, previewQrByPaymentId, checkPaymentStatus } = require("../controllers/payment.controller");

router.post("/", generateQrAndPayment);
router.get("/:id/preview", previewQrByPaymentId);
router.get("/:id/status", checkPaymentStatus);

module.exports = router;