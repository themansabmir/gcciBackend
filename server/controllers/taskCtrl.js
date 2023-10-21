const Task = require("../models/shipment/taskModel");

const taskCtrl = {
  createTask: async (req, res) => {
    try {
      const data = req.body;
      const newTask = await Task.create(data);
      return res.status(200).json({ data: newTask });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  updateTask: async (req, res) => {
    try {
      const { taskId, ...data } = req.body;
      const updatedTask = await Task.findOneAndUpdate({ _id: taskId }, data, {new:true});
      return res.status(200).json({ data: updatedTask });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  getTaskByShipment: async (req, res) => {
    try {
      const { shipmentId } = req.body;
      const tasks = await Task.find({ shipmentId });
      return res.status(200).json({ data: tasks });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
};

module.exports = taskCtrl;
