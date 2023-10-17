const MBL = require("../models/shipment/mblModel");
const Shipment = require("../models/shipment/shipmentModel");

const mblCtrl = {
  createMBL: async (req, res) => {
    try {
      const data = req.body;

      const newMbl = await MBL.create(data).then((mbl) => {
        return Shipment.findOneAndUpdate(
          { _id: data.shipmentId },
          { mbl: mbl._id }
        ).then((newmbl) => {
          return mbl;
        });
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

      console.log(mbl);

      return res.status(200).json({ data: mbl });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getMblByShipment: async (req, res) => {
    try {
      const { shipmentId } = req.body;
      const mbl = await MBL.find({ shipmentId: shipmentId });

      return res.status(200).json({ data: mbl });
    } catch (error) {}
  },
  updateMbl: async (req, res) => {
    try {
      const data = req.body;

      console.log(data)

      const updatedMbl = await MBL.findOneAndUpdate(
        { _id: data._id },
        data
      ).then(data=> data);
      return res.status(200).json({ data: updatedMbl });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = mblCtrl;
