const mongoose = require("mongoose");

const remindersSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  decription: {
    type: String,
  },
  dueDate: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: String,
  },
  priorityFlag: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "",
  },
});

const Reminders = mongoose.model("Reminders", remindersSchema);
module.exports = Reminders;
