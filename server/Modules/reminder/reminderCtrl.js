const Reminders = require("./reminderModel");
const DbService = require("../../Services/DbService");

const database = new DbService(Reminders);
const reminderCtrl = {
  createTask: async (req, res) => {
    try {
      const newReminder = await database.add(req.body);
      return res.status(200).json({ data: newReminder });
    } catch (error) {}
  },
  getReminderByDate: async (req, res) => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const query = {
        dueDate: {
          $gt: today, // greater than today
        },
      };
      const reminders = await database.get(query);
      return res.status(200).json({ data: reminders });
    } catch (error) {
      return error;
    }
  },
};

module.exports = reminderCtrl;
