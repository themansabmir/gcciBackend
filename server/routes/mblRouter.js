const router = require("express").Router()
const mblCtrl= require('../controllers/mblCtrl')
router.route('/mbl').post(mblCtrl.createMBL).get(mblCtrl.getMbl)
router.route("/mblbyid").post(mblCtrl.getMblById);


module.exports= router