const mongoose = require("mongoose");

const shipmentInsightModel = mongoose.Schema({
  shippingNumber: String,
  originPortName: String,
  destinationPortName: String,
  chaNumber: String,
  shippingBillDate: String,
  originPortCode: String,
  destinationPortCode: String,
  package: String, // Assuming "Package" is a valid field name, but consider renaming it to follow JavaScript naming conventions (e.g., package)
  grossWeight: String,
  containerNumber: String,
  igstPaid: String,
  gatewayPortName: String,
  gatewayPortCode: String,
  shippingLine: String,
  type: String,
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
});

const ShipmentInsight = mongoose.model("ShipmentInsight", shipmentInsightModel);

module.exports = ShipmentInsight;
