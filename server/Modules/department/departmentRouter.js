const { departmentCtrl } = require("./departmentCtrl");

const router = require("express").Router();

router
  .route("/department")
  .post(departmentCtrl.createDepartment)
  .get(departmentCtrl.getAllDepartments);


const departmentRouter = router
module.exports = {departmentRouter}
