const router = require("express").Router()
const mblCtrl = require('./mblCtrl');
const { checkAccess, isAuthenticated } = require("../../middleware/authentication");


router.route('/mbl').post(   mblCtrl.createMBL).get(   checkAccess("MBL", "Read"),mblCtrl.getMbl).put(mblCtrl.updateMbl)
router.route("/mblbyid").post(mblCtrl.getMblById);
router.route('/mblbyshipment').post(mblCtrl.getMblByShipment)


const  mblRouter = router
module.exports= {mblRouter} 