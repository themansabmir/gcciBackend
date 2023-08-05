const router = require("express").Router();
const addressCtrl = require("../controllers/addressCtrl");

router
  .route("/address")
  .post(addressCtrl.createAddress)
  .get(addressCtrl.getAddress);


  module.exports = router