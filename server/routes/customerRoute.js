const router = require("express").Router();
const customerCtrl = require("../controllers/customerCtrl");

// to create customer with address and its types
router.route("/customer").post(customerCtrl.createCustomer)
.get(customerCtrl.getAllCustomer)

// to create customer type ie sha consignee shipper etc
router.route("/customertype").post(customerCtrl.createCustomerType).get(customerCtrl.getCustomerType);

// router.route("/customer").post().get();
// router.route("/customer/:id").put().delete();

module.exports = router;
