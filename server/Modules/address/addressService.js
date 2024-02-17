const ModelServices = require("../../Services/ModelService");
const customerAddress = require("./customerAddress");
const model = new ModelServices(customerAddress);

const customerAddressService = {
  createDocument: async (data) => {
    const document = await model.createDocument(data.body);
    return document;
  },

  getAllDocument: async (data) => {
    const query = {};

    const document = await model.getAllDocuments(query, data.body);

    const count = await model.totalCounts(query);

    return { document, count };
  },

  updateDocument: async (data) => {
    const filter = { _id: data.body.customerAddressId };
    const payload = { ...data };
    const options = { new: true };
    const document = await model.updateDocument(filter, payload, options);

    return document;
  },

  getById: async (data) => {
    const query = { _id: data.body.customerAddressId };
    const document = await model.getDocumentById(query);
    return document;
  },

  deleteDoc: async (data) => {
    const filter = { _id: data.body.customerAddressId };
    const document = await model.deleteDocument(filter);
    return document;
  },
};

module.exports = customerAddressService;
