const Customer = require("./customerModel");
const CustomerType = require("../customerType/customertypeModel");
const AddressModel = require("../address/customerAddress");
const { AsyncHandler } = require("../../middleware/asyncHandler");
const CustomerService = require("./customerSerivce");
const successResponse = require("../../middleware/helper");

const customerCtrl = {
  createCustomer: AsyncHandler(async (req, res, next) => {
    const payload = { body: req.body, user: req.user };
    const document = await CustomerService.create(payload);
    return successResponse({
      res,
      data: document,
      msg: "Customer Created Successfully",
    });
  }),
  getAllCustomer: AsyncHandler(async (req, res, next) => {
    const payload = { body: req.body, user: req.user };
    const docuemnts = await CustomerService.getAll(payload);
    return successResponse({
      res,
      data: docuemnts.documents,
      count: docuemnts.count,
      msg: "All Customers",
    });
  }),

  getById: AsyncHandler(async (req, res, next) => {
    const payload = { body: req.body, user: req.user };
    const document = await CustomerService.getbyid(payload);
    return successResponse({ res, data: document, msg: "Customer By id" });
  }),

  updateCustomer: () => {},
  deleteCustomer: () => {},
};

module.exports = customerCtrl;
