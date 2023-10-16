const mongoose = require("mongoose");

const ShipmentSchema = new mongoose.Schema(
  {
    shipmentType: {
      type: "String",
      required: true,
    },
    shipmentNumber: {
      type: Number,
      required: false,
      default: null,
    },
    referenceNumber: {
      type: "String",
      required: true,
    },
    mbl: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MBL",
    },
    hblList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HBL",
      },
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tasks",
      },
    ],
    sales: String,
    purchase: String,
    logs: String,
    createdBy: String,
  },
  { timestamps: true }
);

const Shipment = mongoose.model("Shipment", ShipmentSchema);
module.exports = Shipment;