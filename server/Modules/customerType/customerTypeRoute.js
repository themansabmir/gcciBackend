const { customerTypeCtrl } = require("./customerTypeCtrl");

const router = require("express").Router();


router.post("/getall", customerTypeCtrl.getAllCustomerType)
    .post("/create", customerTypeCtrl.createCustomerType)
    .post("/getbyid", customerTypeCtrl.getById)
    .post("/update", customerTypeCtrl.updateCustomerType)

const customerTypeRouter = router;

module.exports = { customerTypeRouter };
