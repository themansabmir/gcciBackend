const router = require("express").Router();
const customerCtrl = require("./customerCtrl");

router
  .post("/create", customerCtrl.createCustomer)
  .post("/getall", customerCtrl.getAllCustomer)
  .post("/getbyid", customerCtrl.getById)
  .post("/delete", customerCtrl.deleteCustomer)
  .post("/update", customerCtrl.updateCustomer);
const customerRouter = router;
module.exports = { customerRouter };
