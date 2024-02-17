const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  taskName: String,
  taskStatus: {
    type: String,
    default: "pending",
  },
  taskType: String,
  shipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Shipment'
  }
});

const Tasks = mongoose.model("Tasks", taskSchema);
module.exports = Tasks;
