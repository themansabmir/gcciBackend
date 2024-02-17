const router = require("express").Router();
const { addressRouter } = require("./address/addressRoute");
const { customerRouter } = require("./customer/customerRoute");
const { customerTypeRouter } = require("./customerType/customerTypeRoute");
const { departmentRouter } = require("./department/departmentRouter");
const { employeeRouter } = require("./employee/employeeRouter");
const { shipmentRouter } = require("./shipment/shipmentRouter");
router.use("/shipment", shipmentRouter);

router.use("/address", addressRouter);
router.use("/customer", customerRouter);
router.use("/customerType", customerTypeRouter);
router.use("/department", departmentRouter);
router.use("/employee", employeeRouter);
// router.use("hbl");
// router.use("insight");
// router.use("mbl");
// router.use("port");
// router.use("reminder");
// router.use("role");

// router.use("task");

module.exports = router;

// app.use("/api", require("./server/routes/shipmentRouter"));
// app.use("/api", require("./server/routes/employeeRouter"));
// app.use("/api", require("./server/routes/addressRoute"));
// app.use("/api", require("./server/routes/portRoute"));
// app.use("/api", require("./server/routes/hblrouter"));
// app.use("/api", require("./server/routes/shipmentRouter"));
// app.use("/api", require("./server/routes/taskRouter"));
// app.use("/api", require("./server/routes/mblRouter"));
// app.use("/api", require("./server/routes/departmentRouter"));
// app.use("/api", require("./server/routes/reminderRoute"));
// app.use("/api", require("./server/routes/shipmentInsightRouter"));
// app.use("/api", require("./server/routes/customerTypeRoute"));

// app.use("/api", require("./server/routes/customerRoute"));
