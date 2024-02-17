const router = require("express").Router();

const addressCtrl = require("./addressCtrl");

router

  .post("/create", addressCtrl.createAddress)
  .post("/getall", addressCtrl.getAllAddress)
  .post("/getbyid", addressCtrl.getbyid)
  .post("/delete", addressCtrl.deleteAddress)
  .post("/update", addressCtrl.updateDoc);

const addressRouter = router;
module.exports = { addressRouter };
