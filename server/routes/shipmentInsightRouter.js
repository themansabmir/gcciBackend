const router = require("express").Router();
const {
  createInsight,
  getInsight,
  getInsightByQueries,
} = require("../controllers/shipmentInsightCtrl");

router.route("/addInsights").post(createInsight);
router.route("/getInsightByDate").post(getInsight);
router.route("/getInsightByCustomer").post(getInsight);
router.route("/getInsightByPorts").post(getInsightByQueries);

module.exports = router;
