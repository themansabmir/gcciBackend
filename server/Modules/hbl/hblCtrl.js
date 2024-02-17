const HBL = require("./hblModel");
const MBL = require("../mbl/mblModel");
const Shipment = require("../shipment/shipmentModel");

const hblCtrl = {
  createHBL: async (req, res) => {
    try {
      const data = req.body;

      const newHBL = await HBL.create(data);

      const shipment = await Shipment.findById({ _id: data?.shipmentId });
      shipment.hblList.push(newHBL._id);
      shipment.save();

      // await MBL.findOne({ mblNumber: mblNumber })
      //   .exec()
      //   .then((existingMbl) => {
      //     if (!existingMbl) {
      //       throw new Error("No MBL exists with this MBL Number");
      //     }
      //     existingMbl.hblList.push(newHBL._id);

      //     existingMbl.save();
      //   });

      // await newHBL.populate([
      //   `shipperName shipperAddress consigneeName loadingPort dischargePort notifyAddress deliveryAgent deliveryAddress consigneeAddress notifyName`,
      // ]);

      return res.status(200).json({ data: newHBL });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getHBLbyId: async (req, res) => {
    try {
      const id = req.parms.id;
      const hblDocument = await HBL.findById({ _id: id });
      return res.status(200), json({ data: hblDocument });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllHBL: async (req, res) => {
    try {
      const hblDocuments = await HBL.find()
      //   .populate([
      //   {
      //     path: "ShipperName",

      //     populate: [
      //       {
      //         path: "customerAddress",
      //       },
      //       {
      //         path: "customerType",
      //       },
      //     ],
      //   },
      // ]);
      return res.status(200).json({ data: hblDocuments });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getHblByMblId: async (req, res) => {
    try {
      const { mblId } = req.body;
      const isMbl = await MBL.findOne({ _id: mblId });
      const hblData = await HBL.find({ mblNumber: isMbl.mblNumber }).populate(
        `shipperName shipperAddress consigneeName consigneeAddress notifyName notifyAddress loadingPort dischargePort`
      );
      return res.json({ data: hblData });
    } catch (error) {}
  },

  getHblByShipment: async (req, res) => {
    try {
      const { shipmentId } = req.body;
      const hbls = await HBL.find({ shipmentId: shipmentId });

      return res.status(200).json({ data: hbls });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateHblById: async (req, res) => {
    try {
      const data = req.body;
      const updatedHbl = await HBL.findOneAndUpdate({ _id: data._id }, data);
      return res.status(200).json({ data: updatedHbl });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = hblCtrl;
