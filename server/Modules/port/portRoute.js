const router = require('express').Router()
const { portCtrl, currencyCtrl, airportCtrl } = require('./portCtrl')

// for ports
router.route('/port').post(portCtrl.createPort).get(portCtrl.getPorts)


// for currencies
router.route('/currency').post(currencyCtrl.createCurrency).get(currencyCtrl.getCurrency)


// for airports

router.route('/airport').post(airportCtrl.createAirprot).get(airportCtrl.getAirports)

const portRouter = router

module.exports= {portRouter}