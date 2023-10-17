const shipmentCtrl= require('../controllers/shipmentCtrl');

const router = require('express').Router()



router.route("/shipment").post(shipmentCtrl.createShipment);
router.route("/shipmentbytype").post(shipmentCtrl.getShipmentByType)


module.exports= router