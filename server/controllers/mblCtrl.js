const MBL = require("../models/shipment/mblModel");

const mblCtrl = {
  createMBL: async (req, res) => {
    try {
      const {
        shipmentMedium,
        shipmentType,
        shipmentMode,
        bookingNumber,
        MBLtype,
        shiplineName,
        mblNumber,
        mblDate,
        receiptPlace,
          vessel,
        voyage,
        tradeType,
        freightType,
        exchangeRate,
        SOBdate,
        shippingBillNumber,
        shippingBillDate,
        billEntryNumber,
        billEntryDate,
        freePOL,
        freePOD,
        containerDetails,
        shipperName,
        shipperAddress,
        consigneeName,
        consigneeAddress,
        notifyName,
        notifyAddress,
        agentName,
        agentAddress,
        loadingPort,
        dischargePort,
        deliveryPlace,
        etaPod,
        hblList,
      } = req.body;

      console.log(req.body);
      console.log(containerDetails);
      //  const {
      //    shipmentMedium,
      //    shipmentType,
      //    shipmentMode,
      //    bookingNumber,
      //    MBLtype,
      //    shiplineName,
      //    mblNumber,
      //    mblDate,
      //    receiptPlace,
      //    vessel,
      //    tradeType,
      //    freightType,
      //    exchangeRate,
      //    SOBdate,
      //    shippingBillNumber,
      //    shippingBillDate,
      //    billEntryNumber,
      //    billEntryDate,
      //    freePOL,
      //    freePOD,
      //    containerNumber,
      //    pkgCount,
      //    pkgType,
      //    grossWeight,
      //    netWeight,
      //    volume,
      //    lineSeal,
      //    shipperSeal,
      //    customsSeal,
      //    description,
      //    goodsType,
      //    shipperName,
      //    shipperAddress,
      //    consigneeName,
      //    consigneeAddress,
      //    notifyName,
      //    notifyAddress,
      //    agentName,
      //    agentAddress,
      //    loadingPort,
      //    dischargePort,
      //    deliveryPlace,
      //    etaPod,
      //    hblList,
      //  } = req.body;

      const newMbl = await MBL.create({
        shipmentMedium,
        shipmentType,
        shipmentMode,
        bookingNumber,
        MBLtype,
        shiplineName,
        mblNumber,
        mblDate,
        receiptPlace,
          vessel,
        voyage,
        tradeType,
        freightType,
        exchangeRate,
        SOBdate,
        shippingBillNumber,
        shippingBillDate,
        billEntryNumber,
        billEntryDate,
        freePOL,
        freePOD,
        containerDetails,
        shipperName,
        shipperAddress,
        consigneeName,
        consigneeAddress,
        notifyName,
        notifyAddress,
        agentName,
        agentAddress,
        loadingPort,
        dischargePort,
        deliveryPlace,
        etaPod,
        hblList,
      });

      res.status(200).json({ data: newMbl });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getMbl: async (req, res) => {
    try {
      const mbl = await MBL.find().populate("hblList");
      return res.status(200).json({ data: mbl });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getMblById: async (req, res) => {
    try {
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = mblCtrl;
