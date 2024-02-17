const mongoose = require("mongoose");

const ShipmentSchema = new mongoose.Schema(
  {
    shipmentType: {
      type: "String",
      required: true,
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
      unique: true,
    },

    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tasks",
      },
    ],
    SOBdate: { type: String },

    createdBy: String,
  },
  { timestamps: true }
);

const Shipment = mongoose.model("Shipment", ShipmentSchema);
module.exports = Shipment;
