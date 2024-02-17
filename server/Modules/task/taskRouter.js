const router = require("express").Router();
const taskCtrl = require("./taskCtrl");

router.route("/task").post(taskCtrl.createTask).put(taskCtrl.updateTask);
router.route("/taskByShipment").post(taskCtrl.getTaskByShipment);

const taskRouter = router;
module.exports = { taskRouter };
