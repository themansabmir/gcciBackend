const router = require("express").Router();
const employeeCtrl = require("./employeeCtrl");
const roleCtrl = require("../role/roleCtrl");

router
  .route("/employee")
  .post(employeeCtrl.createEmployee)
  .get(employeeCtrl.getAllEmployee);

router
  .route("/employee/:id")
  .put(employeeCtrl.updateEmployee)
  .delete(employeeCtrl.deleteEmployee);

// employee roles routes and controllers
router.route("/role").post(roleCtrl.createRole).get(roleCtrl.getRoles);
router.route("/role/:id").put(roleCtrl.updateRole).delete(roleCtrl.deleteRole);

//  employee login logout handler routes adn controllers
router.route("/login").post(employeeCtrl.loginEmployee);
router.route("/logout").post(employeeCtrl.logoutEmployee);



const employeeRouter  = router

module.exports = {employeeRouter}
