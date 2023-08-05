const mongoose = require("mongoose");

const customerAddress = mongoose.Schema({
  city: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  pinCode: { type: String, required: true },
  country: { type: String, required: true },
  gstNumber: { type: String },
});

const CustomerAddress= mongoose.model("CustomerAddress", customerAddress);
module.exports = CustomerAddress