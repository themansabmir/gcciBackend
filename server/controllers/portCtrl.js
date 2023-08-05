const { Port, Currency, Airport } = require("../models/portModel");

const portCtrl = {
  createPort: async (req, res) => {
    try {
      const { portName, portCode } = req.body;

      const newPort = await Port.create({
        portName,
        portCode,
      });

      res.status(200).json({ data: newPort });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getPorts: async (req, res) => {
    try {
      const ports = await Port.find();
      res.status(200).json({ data: ports });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const currencyCtrl = {
    createCurrency: async(req,res)=>{
try{
const {currencyName, currencyCode , currencySymbol}= req.body
  const newCurrency = await Currency.create({
  currencyName, currencyCode,currencySymbol

  })

  res.status(200).json({data:newCurrency})

}catch(error){
return res.status(500).json({msg:error.message})
}
  },
  getCurrency: async (req, res) => {
    try {
      const currencies = await Currency.find()
      res.status(200).json({data:currencies})
    } catch (error) {
return res.status(500).json({ msg: error.message });

    }
  }

};

const airportCtrl = {

  createAirprot: async (req, res) => {
    try {
      const { airportName, airportCode } = req.body;
      const newAirport = await Airport.create({
        airportName,
        airportCode,
      });

      // Respond with the created airport object
      res.status(200).json({ data: newAirport });
    } catch (error) {
      return res.status(500).json({ msg: error.message });

    }
  },
  getAirports: async (req, res) => {
    try {
      const airports = await Airport.find();

      // If there are airports found, respond with the airport details
      if (airports.length > 0) {
        res.status(200).json(airports);
      } else {
        // If no airports are found, respond with a 404 status
        res.status(404).json({ error: 'No airports found' });
      }
    } catch (error) {

      return res.status(500).json({ msg: error.message })
    }

  }
}

module.exports ={
    currencyCtrl, portCtrl, airportCtrl
}