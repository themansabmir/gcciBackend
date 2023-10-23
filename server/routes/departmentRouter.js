const { departmentCtrl } = require("../controllers/departmentCtrl");

const router = require("express").Router();

router
  .route("/department")
  .post(departmentCtrl.createDepartment)
  .get(departmentCtrl.getAllDepartments);
module.exports = router;
