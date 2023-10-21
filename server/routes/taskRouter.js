const router = require("express").Router()
const taskCtrl = require("../controllers/taskCtrl")




router.route("/task").post(taskCtrl.createTask).put(taskCtrl.updateTask)
router.route("/taskByShipment").post(taskCtrl.getTaskByShipment)

module.exports = router