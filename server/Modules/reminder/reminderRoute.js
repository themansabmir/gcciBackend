const router = require("express").Router();
const reminderCtrl = require("../controllers/reminderCtrl");

router.route("/reminder").post(reminderCtrl.createTask).get(reminderCtrl.getReminderByDate);



const reminderRouter = router
module.exports = {reminderRouter}
