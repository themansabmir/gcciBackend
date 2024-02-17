const Shipment = require("./shipmentModel");
const Task = require("../task/taskModel");

const shipmentCtrl = {
  createShipment: async (req, res) => {
    try {
      const data = req.body;
      var count = 0;

      const {
        shipmentMode,
        loadingPort,
        dischargePort,
        shiplineName,
        deliveryPlace,
        etaPod,
        referenceNumber,
        SOBdate,
      } = data;

      let shipmentTasks = {
        shipmentType:shipmentMode,
        loadingPort,
        dischargePort,
        shiplineName,
        deliveryPlace,
        etaPod,
        referenceNumber,
        SOBdate,
      };

      const newShipment = await Shipment.create(shipmentTasks);
      const { _id} = newShipment
      const importTaskList = [
        {
          taskName: "Liner BL",
          taskStatus: "pending",
          taskType: "import",
          shipmentId: newShipment?._id,
        },
        {
          taskName: "House BL",
          taskStatus: "pending",
          taskType: "import",

          shipmentId: newShipment?._id,
        },
        {
          taskName: "IGM Filing",
          taskStatus: "pending",
          taskType: "import",
          shipmentId: newShipment?._id,
        },
        {
          taskName: "Purchase Invoice",
          taskStatus: "pending",
          taskType: "import",
          shipmentId: newShipment?._id,
        },
        {
          taskName: "Sales Invoice",
          taskStatus: "pending",
          taskType: "import",
          shipmentId: newShipment?._id,
        },
      ];
      const exportTaskList = [
        {
          taskName: "House Draft BL",
          taskStatus: "pending",
          taskType: "export",
          shipmentId: newShipment?._id,
        },
        {
          taskName: "Liner Draft BL",
          taskStatus: "pending",
          taskType: "export",
          shipmentId: newShipment?._id,
        },
        {
          taskName: "Shipping Instruction",
          taskStatus: "pending",
          taskType: "export",
          shipmentId: newShipment?._id,
        },
        {
          taskName: "VGM",
          taskStatus: "pending",
          taskType: "export",
          shipmentId: newShipment?._id,
        },
        {
          taskName: "TR Handover",
          taskStatus: "pending",
          taskType: "export",
          shipmentId: newShipment?._id,
        },
        {
          taskName: "Raise TAX Invoice",
          taskStatus: "pending",
          taskType: "export",
          shipmentId: newShipment?._id,
        },
        {
          taskName: "Purchase Invoice",
          taskStatus: "pending",
          taskType: "export",
          shipmentId: newShipment?._id,
        },
      ];
      let tasksList = "";
      if (shipmentMode=== "import") {
        tasksList = await Task.insertMany(importTaskList);
        count = await Shipment.countDocuments({ shipmentType: "import" });
      } else {
        tasksList = await Task.insertMany(exportTaskList);
        count = await Shipment.countDocuments({
          shipmentType: "export",
        });
      }
      const val = await Promise.resolve(tasksList).then((data) => {
        return data;
      });
      newShipment.tasks = val;
      if (data.shipmentType === "import") {
        newShipment.referenceNumber = "IMP" + ++count;
      } else {
        newShipment.referenceNumber = "EXP" + ++count;
      }
      // newShipment.referenceNumber = count(await newShipment).save();
      newShipment.save();

      return res.status(200).json({ data: newShipment });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // import or export type of shipment
  getShipmentByType: async (req, res) => {
    try {
      const { shipmentType } = req.body;
      console.log(shipmentType);
      const shipments = await Shipment.find({ shipmentType });

      if (!shipments)
        return res.status(400).json({ msg: "Data does not exist " });

      return res.status(200).json({ data: shipments });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  // get estimated time of arrival or SOB
  getShipmentsByDate: async (req, res) => {
    try {
      const { shipmentType, userDate } = req.body;

      const todaysDate = new Date();
      const dateThreshold = new Date(todaysDate);
      dateThreshold.setDate(dateThreshold.getDate() + 10);

      const query = {
        shipmentType: shipmentType,
      };
      if (shipmentType === "import") {
        query.etaPod = {
          $gte: todaysDate.toISOString().split("T")[0],
          $lte: dateThreshold.toISOString(),
        };
      } else {
        query.SOBdate = {
          $gte: todaysDate.toISOString().split("T")[0],
          $lte: dateThreshold.toISOString(),
        };
      }

      const shipments = await Shipment.find(query);

      return res.status(200).json({ data: shipments });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = shipmentCtrl;
