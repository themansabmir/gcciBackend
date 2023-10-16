const router = require('express').Router()
const hblCtrl= require('../controllers/hblCtrl')
router.route('/hbl').post(hblCtrl.createHBL).get(hblCtrl.getAllHBL)
router.route('/hblBymbl').post(hblCtrl.getHblByMblId)

module.exports= router