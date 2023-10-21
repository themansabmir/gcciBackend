const mongoose = require("mongoose");

const castObjectId = mongoose.ObjectId.cast();
mongoose.ObjectId.cast((v) => (v === "" ? v : castObjectId(v)));
const mblSchema = new mongoose.Schema(
  {
    shipmentMedium: {
      type: String,
      required: true,
    },
    shipmentType: {
      type: String,
      required: true,
    },
    shipmentMode: {
      type: String,
      required: true,
    },
    bookingNumber: {
      type: String,
      required: true,
    },
    MBLtype: {
      type: String,
      required: true,
    },

    shiplineName: { type: "string",  },
    mblNumber: { type: "string", },
    mblDate: { type: "string", },
    receiptPlace: { type: "string",  },
    vessel: { type: "string", },
    voyage: { type: "string", default: "" },
    tradeType: { type: "string",  },
    freightType: { type: "string", },
    exchangeRate: { type: "string", },
    SOBdate: { type: "string",  },
    shippingBillNumber: { type: "string",  },
    shippingBillDate: { type: "string",  },
    billEntryNumber: { type: "string", },
    billEntryDate: { type: "string", },
    freePOL: { type: "string", },
    freePOD: { type: "string",  },
    remarks: { type: String, default: "" },
    containerDetails: [
      {
        containerNumber: { type: "string", },
        containerType: { type: "string", },
        pkgCount: { type: "string",  },
        pkgType: { type: "string", },
        grossWeight: { type: "string",  },
        netWeight: { type: "string",  },
        volume: { type: "string",  },
        lineSeal: { type: "string",  },
        shipperSeal: { type: "string",  },
        customsSeal: { type: "string",  },
        description: { type: "string",  },
        hsCode: { type: String,  },
      },
    ],

    // container details

    shipperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    shipperName: {
      type: String,
    },
    shipperAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerAddress",
    },
    shipperAddress: {
      type:String
    },

    consigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    consigneeName: {
      type: String,
    },
    consigneeAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerAddress",
    },
    consigneeAddress: {
      type: String,
    },
    notifyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    notifyName: {
      type: String,
    },
    notifyAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerAddress",
    },
    notifyAddress: {
      type: String,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    agentName: {
      type: String,
    },
    agentAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerAddress",
    },
    agentAddress: {
      type: String,
    },
    loadingPort: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Port",
    },
    dischargePort: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Port",
    },
    deliveryPlace: {
      type: String,
    },
    etaPod: {
      type: String,
    },
    shipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Shipment"
     },

    hblList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HBL",
        default: "",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MBL = mongoose.model("MBL", mblSchema);

module.exports = MBL;
