const { default: mongoose } = require("mongoose");
const DbService = require("../Services/DbService");
const ShipmentInsightModel = require("../models/shipmentsInsightsModel");
const database = new DbService(ShipmentInsightModel);

const shipmentInsightCtrl = {
  createInsight: async (req, res) => {
    try {
      console.log(req.body);
      const newInsights = await database.add(req.body);
      return res.status(200).json({ data: newInsights });
    } catch (error) {
      return res.status(500).json({ msg: error });
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
      const { customerId } = req.body;

        const aggregationPipeline = [
          {
            $match: { customerId: new mongoose.Types.ObjectId(customerId) },
          },
          {
            $group: {
              _id: {
                originPortCode: "$originPortCode",
                destinationPortCode: "$destinationPortCode",
              },
              count: { $sum: 1 },
            },
          },

          // Match documents for the specific customer
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
