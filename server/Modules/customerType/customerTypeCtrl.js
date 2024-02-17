const { AsyncHandler } = require("../../middleware/asyncHandler");
const successResponse = require("../../middleware/helper");
const customerTypeService = require("./customerTypeService");

const customerTypeCtrl = {
  getAllCustomerType: AsyncHandler(async (req, res, next) => {
    const data = await customerTypeService.getAllDocument(req.body);

    successResponse({ res, count: data.count, data: data.document });
  }),
  createCustomerType: AsyncHandler(async (req, res, next) => {
    const createdDocument = await customerTypeService.createDocument(req.body);

    return successResponse({
      res,
      data: createdDocument,
      msg: "Customer Type created sucessfully",
    });
  }),

  updateCustomerType: AsyncHandler(async (req, res, next) => {
    const document = await customerTypeService.updateDocument(req.body);

    return successResponse({
      res,
      data: document,
      msg: "Customer Type Updated Successfully",
    });
  }),

  getById: AsyncHandler(async (req, res, next) => {
    const document = await customerTypeService.getById(req.body);
    return successResponse({ res, data: document });
  }),
  delete: AsyncHandler(async (req, res, next) => {
    const document = await customerTypeService.deleteDoc(req.body);
    return successResponse({
      res,
      data: document,
      msg: "Deleted Successsfully",
    });
  }),
};
module.exports = { customerTypeCtrl };
