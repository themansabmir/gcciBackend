const shipmentCtrl= require('../controllers/shipmentCtrl');

const router = require('express').Router()



router.route("/shipment").post(shipmentCtrl.createShipment);


module.exports= router