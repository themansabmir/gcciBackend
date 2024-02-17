const { AsyncHandler } = require("../../middleware/asyncHandler");
const successResponse = require("../../middleware/helper");
const customerAddressService = require("./addressService");
const CustomerAddress = require("./customerAddress");

const addressCtrl = {
  createAddress: AsyncHandler(async (req, res, next) => {
    const payload = { body: req.body, user: req.user };
    const document = await customerAddressService.createDocument(payload);

    return successResponse({
      data: document,
      msg: "Address created Successfully ",
    });
  }),
  getAllAddress: AsyncHandler(async (req, res, next) => {
    const payload = { body: req.body, user: req.user };
    const documents = await customerAddressService.getAllDocument(payload);

    return successResponse({
      res,
      data: documents.document,
      count: documents.count,
      msg: "All address",
    });
  }),

  getbyid: AsyncHandler(async (req, res, next) => {
    const payload = { body: req.body, user: req?.user };
    const document = await customerAddressService.getById(payload);
    return successResponse({
      res,
      data: document,
      msg: "Customer address By Id",
    });
  }),
  deleteAddress: AsyncHandler(async (req, res, next) => {
    const payload = { body: req.body, user: req?.user };

    const deletedDoc = await customerAddressService.deleteDoc(payload);

    return successResponse({
      res,
      msg: "Address deleted successfully ",
      data: deletedDoc,
    });
  }),
  updateDoc: AsyncHandler(async (req, res, next) => {
    const payload = { body: req.body, user: req?.user };

    const updatedDoc = await customerAddressService.updateDocument(payload);
    return successResponse({ res, data: updatedDoc, msg: "Address Updated" });
  }),
};

module.exports = addressCtrl;
