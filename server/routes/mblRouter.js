const router = require("express").Router()
const mblCtrl= require('../controllers/mblCtrl')
router.route('/mbl').post(mblCtrl.createMBL).get(mblCtrl.getMbl).put(mblCtrl.updateMbl)
router.route("/mblbyid").post(mblCtrl.getMblById);
router.route('/mblbyshipment').post(mblCtrl.getMblByShipment)


module.exports= router