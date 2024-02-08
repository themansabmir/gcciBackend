const { default: mongoose } = require("mongoose");
const DbService = require("../Services/DbService");
const { Port } = require("../models/portModel");
const ShipmentInsightModel = require("../models/shipmentsInsightsModel");
const database = new DbService(ShipmentInsightModel);

const shipmentInsightCtrl = {
  createInsight: async (req, res) => {
    try {
      const shipments = req.body;
      const savedShipments = [];

      await Promise.all(
        shipments.map(async (shipment) => {
          const { originPortCode, destinationPortCode } = shipment;
          const originPortData = await Port.findOne({
            portCode: originPortCode,
          });
          const destinationPortData = await Port.findOne({
            portCode: destinationPortCode,
          });
          if (!originPortData) {
            const newPort = await Port.create({
              portName: shipment.originPortName,
              portCode: shipment.originPortCode,
            });
            shipment.originPortCode = newPort._id;
          } else {
            shipment.originPortCode = originPortData._id;
          }

          if (!destinationPortData) {
            const newPort = await Port.create({
              portName: shipment.destinationPortName,
              portCode: shipment.destinationPortCode,
            });
            shipment.destinationPortCode = newPort._id;
          } else {
            shipment.destinationPortCode = destinationPortData._id;
          }

          const savedData = await database.add(shipment);
          savedShipments.push(savedData);

          // return savedShipment;
        })
      );

      return res.status(200).json({ data: savedShipments });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getInsight: async (req, res) => {
    try {
      const data = await database.get();
      return res.status(200).json({ data: data });
    } catch (error) {}
  },

  getInsightByQueries: async (req, res) => {
    try {
      const {
        customerId,
        originPortCode,
        destinationPortCode,
        initialDate,
        finalDate,
      } = req.body;

      const matchObj = {
        customerId: new mongoose.Types.ObjectId(customerId),
      };

      const groupStage = {
        $group: {
          _id: {},
          count: { $sum: 1 },
        },
      };

      if (originPortCode && destinationPortCode) {
        groupStage.$group._id.origin = "$originPortData.portName";
        groupStage.$group._id.destinationPortCode = "$destPortData.portName";
      } else if (destinationPortCode) {
        groupStage.$group._id.destinationPortCode = "$destPortData.portName";
      } else if (originPortCode) {
        groupStage.$group._id.origin = "$originPortData.portName";
      }

      const aggregationPipeline = [
        {
          $match: matchObj,
        },
        {
          $lookup: {
            from: "ports",
            localField: "originPortCode",
            foreignField: "_id",
            as: "originPortData",
          },
        },
        {
          $unwind: "$originPortData",
        },
        {
          $lookup: {
            from: "ports",
            localField: "destinationPortCode",
            foreignField: "_id",
            as: "destPortData",
          },
        },
        {
          $unwind: "$destPortData",
        },
        groupStage,

        {
          $project: {
            _id: 0,
            originName: "$_id.origin",
            destination: "$_id.destinationPortCode",
            count: 1,
          },
        },
        {
          $sort: {
            originName: 1,
          },
        },
      ];

      const data = await ShipmentInsightModel.aggregate(aggregationPipeline);

      // const data = await database.getInsightsByAggregate(aggregationPipeline);
      return res.status(200).json({ data: data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = shipmentInsightCtrl;

// db.Insight.aggregate([
//   {
//     $lookup: {
//       from: "Port",
//       localField: "originportCode",
//       foreignField: "_id",
//       as: "originPort",
//     },
//   },
//   {
//     $unwind: "$originPort",
//   },
//   {
//     $lookup: {
//       from: "Port",
//       localField: "destinationPortCode",
//       foreignField: "_id",
//       as: "destinationPort",
//     },
//   },
//   {
//     $unwind: "$destinationPort",
//   },
//   {
//     $group: {
//       _id: {
//         origin: "$originPort.portName",
//         destination: "$destinationPort.portName",
//       },
//       count: { $sum: 1 },
//     },
//   },
//   {
//     $project: {
//       _id: 0,
//       originPortName: "$_id.origin",
//       destinationPortName: "$_id.destination",
//       count: 1,
//     },
//   },
// ]);
