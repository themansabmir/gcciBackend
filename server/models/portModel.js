const mongoose = require('mongoose')


const portSchema = new mongoose.Schema({
  portName: { type: String, required: true },
  portCode: { type: String, required: true },
});

// Define the Currency schema
const currencySchema = new mongoose.Schema({
  currencyName: { type: String, required: true },
  currencyCode: { type: String, required: true },
  currencySymbol: { type: String, required: true },
});

// Define the Airport schema
const airportSchema = new mongoose.Schema({
  airportName: { type: String, required: true },
  airportCode: { type: String, required: true },
});

// Create and export the models
const Port = mongoose.model("Port", portSchema);
const Currency = mongoose.model("Currency", currencySchema);
const Airport = mongoose.model("Airport", airportSchema);

module.exports = {
  Port,
  Currency,
  Airport,
};