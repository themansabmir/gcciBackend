const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },

  telephoneNumber: { type: String },
  mobileNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  fax: { type: String },
  panNumber: { type: String },
  customerAddress: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerAddress",
      required: true,
    },
  ],
  customerType: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerType", // Reference to the 'CustomerType' schema
      required: true,
    },
  ],
});

module.exports = mongoose.model("Customer", customerSchema);
