const mongoose = require('mongoose')


const hblSchema = new mongoose.Schema({
  shiplineName: { type: "string", required: true },
  hblNumber: { type: "string", required: true },
  hblDate: { type: "string", required: true },
  receiptPlace: { type: "string", required: true },
  vessel: { type: "string", required: true },
  tradeType: { type: "string", required: true },
  freightType: { type: "string", required: true },
  exchangeRate: { type: "string", required: true },
  SOBdate: { type: "string", required: true },
  shippingBillNumber: { type: "string", required: true },
  shippingBillDate: { type: "string", required: true },
  billEntryNumber: { type: "string", required: true },
  billEntryDate: { type: "string", required: true },
  freePOL: { type: "string", required: true },
  freePOD: { type: "string", required: true },
  containerNumber: { type: "string", required: true },
  pkgCount: { type: "string", required: true },
  pkgType: { type: "string", required: true },
  grossWeight: { type: "string", required: true },
  netWeight: { type: "string", required: true },
  volume: { type: "string", required: true },
  lineSeal: { type: "string", required: true },
  shipperSeal: { type: "string", required: true },
  customsSeal: { type: "string", required: true },
  description: { type: "string", required: true },
  goodsType: { type: "string", required: true },

  shipperName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  shipperAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomerAddress",
  },
  consigneeName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  consigneeAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomerAddress",
  },
  notifyName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  notifyAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomerAddress",
  },
  deliveryAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  deliveryAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomerAddress",
  },
  loadingPort: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Port"
  },
  dischargePort: {
     type: mongoose.Schema.Types.ObjectId,
     ref:"Port"
  },
  deliveryPlace: {
     type:String
  },
    etaPod: {
      type:String
  },
});

const HBL = mongoose.model("HBL", hblSchema)

module.exports= HBL