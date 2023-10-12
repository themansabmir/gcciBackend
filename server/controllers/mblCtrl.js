const MBL = require("../models/shipment/mblModel");

const mblCtrl = {
  createMBL: async (req, res) => {
    try {

      console.log(req.body.etaPod)
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
        remarks,
        dischargePort,
        deliveryPlace,
        etaPod,
        hblList,
      } = req.body;

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
        remarks,
        hblList,
      });

      res.status(200).json({ data: newMbl });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getMbl: async (req, res) => {
    try {
      const mbl = await MBL.find().populate(`loadingPort dischargePort`);
      return res.status(200).json({ data: mbl });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getMblById: async (req, res) => {
    try {
      const { mblId } = req.body;

      const mbl = await MBL.findOne({ _id: mblId }).populate([
        {
          path: "shipperName",
          select: "companyName mobileNumber email panNumber",
        },
        {
          path: "shipperAddress",
          select: "state country gstNumber",
        },
        {
          path: "consigneeName",
          select: "companyName mobileNumber email panNumber",
        },
        {
          path: "consigneeAddress",
          select: "state country gstNumber",
        },
        {
          path: "loadingPort",
          select: "portName portCode",
        },
        {
          path: "dischargePort",
          select: "portName portCode",
        },
        {
          path: "notifyName",
          select: "companyName mobileNumber email panNumber",
        },
        {
          path: "notifyAddress",
          select: "state country gstNumber",
        },
      ]);


      console.log(mbl)

      return res.status(200).json({ data: mbl });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = mblCtrl;
