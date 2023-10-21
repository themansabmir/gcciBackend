const mongoose = require("mongoose");

 const castObjectId = mongoose.ObjectId.cast();
 mongoose.ObjectId.cast((v) => (v === "" ? v : castObjectId(v)));
const hblSchema = new mongoose.Schema(
  {
    shiplineName: { type: "string" },
    mblNumber: { type: "string" },
    HBLtype: { type: "string" },

    hblNumber: { type: "string" },
    hblDate: { type: "string" },
    receiptPlace: { type: "string" },
    vessel: { type: "string" },
    voyage: { type: "string" },
    tradeType: { type: "string" },
    freightType: { type: "string" },
    exchangeRate: { type: "string" },
    transhipmentPort: { type: "string" },

    SOBdate: { type: "string" },
    shippingBillNumber: { type: "string" },
    shippingBillDate: { type: "string" },
    billEntryNumber: { type: "string" },
    billEntryDate: { type: "string" },
    freePOL: { type: "string" },
    freePOD: { type: "string" },
    goodsType: { type: "string" },
    containerDetails: [
      {
        containerNumber: { type: "string" },
        containerType: { type: "string" },
        pkgCount: { type: "string" },
        pkgType: { type: "string" },
        grossWeight: { type: "string" },
        netWeight: { type: "string" },
        volume: { type: "string" },
        lineSeal: { type: "string" },
        shipperSeal: { type: "string" },
        customsSeal: { type: "string" },
        description: { type: "string" },
        hsCode: { type: String },
      },
    ],

    shipperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default:null
    },
    ShipperName: {
      type: String,

    },
    shipperAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerAddress",
    },
    shipperAddress: {
      type: String,
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
      default: "",
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
    shipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
      required: false,
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
  },
  { timestamps: true }
);

const HBL = mongoose.model("HBL", hblSchema);

module.exports = HBL;
