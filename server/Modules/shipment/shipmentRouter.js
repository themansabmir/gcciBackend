const shipmentCtrl = require("./shipmentCtrl");
const { checkAccess } = require("../../middleware/authentication");

const router = require("express").Router();

router.route("/shipment").post(shipmentCtrl.createShipment);
router.route("/shipmentbytype").post(shipmentCtrl.getShipmentByType);
router.route("/shipmentBydate").post(shipmentCtrl.getShipmentsByDate);

const shipmentRouter = router;
module.exports = { shipmentRouter };
