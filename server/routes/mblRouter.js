const router = require("express").Router()
const mblCtrl= require('../controllers/mblCtrl')
router.route('/mbl').post(mblCtrl.createMBL).get(mblCtrl.getMbl)


module.exports= router