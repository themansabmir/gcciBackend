const mongoose = require("mongoose");

const customerTypeSchema = new mongoose.Schema({
  customerType: {
    type: String,
    required: true,
    unique: true,
  },
});

const customerType = mongoose.model("CustomerType", customerTypeSchema);

module.exports = customerType;
