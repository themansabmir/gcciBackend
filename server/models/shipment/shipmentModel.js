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
    loadingPort: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Port",
    },
    dischargePort: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Port",
    },
    shiplineName: {
      type: String,
      required: true,
    },
    deliveryPlace: {
      type: String,
    },
    etaPod: {
      type: String,
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
