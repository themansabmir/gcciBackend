const Shipment = require("../models/shipment/shipmentModel");
const Task = require("../models/shipment/taskModel");

const shipmentCtrl = {
  createShipment: async (req, res) => {
    try {
      const data = req.body;

      const importTaskList = [
        {
          taskName: "Liner BL",
          taskStatus: "pending",
          taskType: "import",
        },
        {
          taskName: "House BL",
          taskStatus: "pending",
          taskType: "import",
        },
        {
          taskName: "IGM Filing",
          taskStatus: "pending",
          taskType: "import",
        },
        {
          taskName: "Purchase Invoice",
          taskStatus: "pending",
          taskType: "import",
        },
        {
          taskName: "Sales Invoice",
          taskStatus: "pending",
          taskType: "import",
        },
      ];
      const exportTaskList = [
        {
          taskName: "House Draft BL",
          taskStatus: "pending",
          taskType: "export",
        },
        {
          taskName: "Liner Draft BL",
          taskStatus: "pending",
          taskType: "export",
        },
        {
          taskName: "Shipping Instruction",
          taskStatus: "pending",
          taskType: "export",
        },
        {
          taskName: "VGM",
          taskStatus: "pending",
          taskType: "export",
        },
        {
          taskName: "TR Handover",
          taskStatus: "pending",
          taskType: "export",
        },
        {
          taskName: "Raise TAX Invoice",
          taskStatus: "pending",
          taskType: "export",
        },
        {
          taskName: "Purchase Invoice",
          taskStatus: "pending",
          taskType: "export",
        },
      ];
      let tasksList = "";
      let count = 1
      if (data.shipmentType === "import") {
        tasksList = await Task.insertMany(importTaskList);
        count = (await Shipment.find({ shipmentType :"import"})).length;
      } else {
        tasksList = await Task.insertMany(exportTaskList);
        count = (await Shipment.find({shipmentType:"export"})).length
      }
      const val = await Promise.resolve(tasksList).then((data) => {
        return data;
      });

      let shipmentTasks = { ...data };
      shipmentTasks.tasks = val;
      if (data.shipmentType === "import") {
        shipmentTasks.referenceNumber = "IMP" + ++count;
      } else {
        shipmentTasks.referenceNumber = "EXP" + ++count;

      }

      const newShipment = await Shipment.create(shipmentTasks);

      return res.status(200).json({ data: newShipment });
    } catch (error) {
  return res.status(500).json({msg: error.message})
    }
  },

  getShipmentByType: async (req, res) => {
    try {
      const {shipmentType} = req.body

      const shipments = await Shipment.find({ shipmentType })
      if (!shipments) return res.status(400).json({ msg: "Data does not exist " })

      return res.status(200).json({data:shipments})
    } catch (error) {
return res.status(500).json({msg:error})
    }
  }
};

module.exports = shipmentCtrl;
