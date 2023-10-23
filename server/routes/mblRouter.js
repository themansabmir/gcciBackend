const router = require("express").Router()
const mblCtrl = require('../controllers/mblCtrl');
const { checkAccess, isAuthenticated } = require("../middleware/authentication");


router.route('/mbl').post(   mblCtrl.createMBL).get(   checkAccess("MBL", "Read"),mblCtrl.getMbl).put(mblCtrl.updateMbl)
router.route("/mblbyid").post(mblCtrl.getMblById);
router.route('/mblbyshipment').post(mblCtrl.getMblByShipment)


module.exports= router