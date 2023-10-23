const shipmentCtrl= require('../controllers/shipmentCtrl');
const { checkAccess } = require('../middleware/authentication');

const router = require('express').Router()



router.route("/shipment").post(shipmentCtrl.createShipment);
router.route("/shipmentbytype").post(checkAccess("Shipment","Read"), shipmentCtrl.getShipmentByType)


module.exports= router