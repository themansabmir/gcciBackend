const router = require("express").Router()
const taskCtrl = require("../controllers/taskCtrl")




router.route("/task").post(taskCtrl.createTask)

module.exports = router