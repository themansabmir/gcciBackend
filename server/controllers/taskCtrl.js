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
};

module.exports = taskCtrl;
