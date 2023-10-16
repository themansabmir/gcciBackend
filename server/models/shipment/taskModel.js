const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  taskName: String,
  taskStatus: {
    type: String,
    default: "pending",
  },
  taskType: String,
});

const Tasks = mongoose.model("Tasks", taskSchema);
module.exports = Tasks;
