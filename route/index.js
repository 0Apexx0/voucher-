const router = require("express").Router();
const voucherController = require("../controller/voucherController")

router.get("/", voucherController.homepage)
router.post("/add", voucherController.addVoucher);
router.post("/voucher-withdraw", voucherController.voucherWithdraw);

module.exports = router ;