const ModelServices = require("../../Services/ModelService");
const customerType = require("./customertypeModel");
const model = new ModelServices(customerType);

const customerTypeService = {
  createDocument: async (data) => {
    const { customerType } = data;
    const isCustomerType = await model.getDocumentById({ customerType });

    if (isCustomerType) {
      throw new Error("Data Already exists");
    }

    const document = await model.createDocument(data);
    return document;
  },

  getAllDocument: async (data) => {
    const query = {};

    const document = await model.getAllDocuments(query, data);

    const count = await model.totalCounts(query);

    return { document, count };
  },

  updateDocument: async (data) => {
    const filter = { _id: data.customertypeId };
    const payload = { ...data };
    const options = { new: true };
    const document = await model.updateDocument(filter, payload, options);

    return document;
  },

  getById: async (data) => {
    const query = { _id: data.customertypeId };
    const document = await model.getDocumentById(query);
    return document;
  },

  deleteDoc: async (data) => {
    const filter = { _id: data.customertypeId };
    const document = await model.deleteDocument(filter);
    return document;
  },
};

module.exports = customerTypeService;
