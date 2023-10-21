const router = require('express').Router()
const hblCtrl= require('../controllers/hblCtrl')
router.route('/hbl').post(hblCtrl.createHBL).get(hblCtrl.getAllHBL).put(hblCtrl.updateHblById)
router.route('/hblBymbl').post(hblCtrl.getHblByMblId)
router.route('/hblbyshipment').post(hblCtrl.getHblByShipment)

module.exports= router