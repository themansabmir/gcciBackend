const Customer = require("./customerModel");
const customerAddress = require("../address/customerAddress");
const ModelServices = require("../../Services/ModelService");
const model = new ModelServices(Customer);
const addressModel = new ModelServices(customerAddress);

const CustomerService = {
  create: async (data) => {
    const { body, user } = data;
    const {
      companyName,
      telephoneNumber,
      mobileNumber,
      email,
      fax,
      customerAddress,
      panNumber,
      customerType,
    } = body;
    const newCustomer = await model.createDocument(body);

    const customerAddressWithIds = customerAddress.map((item) => {
      return { ...item, customerId: newCustomer._id };
    });

    const addresses = await addressModel.createMany(customerAddressWithIds);
    return newCustomer;
  },

  update: async (data) => {
    const { body, user } = data;
    const filter = { _id: body.cusotmerId };
    const options = { new: true };
    const documents = await model.update(filter, body, options);
    return documents;
  },

  getAll: async (data) => {
    const { body, user } = data;

    const { limit, skip, keys } = body;
    let documents;
    let count = 0;
    if (keys) {
      const regex = new RegExp(keys, "i");
      const pipeline = [
        {
          $match: { companyName: regex },
        },
        {
          $lookup: {
            from: "customeraddresses",
            localField: "_id",
            foreignField: "customerId",
            as: "customerAddress",
          },
        },
      ];
      documents = await model.aggregation(pipeline);
      documents = await Customer.populate(documents, { path: "customerType" });
    } else {
      const query = {};
      console.log(body)
      documents = await model.getAllDocuments(query, body);

      count = await model.totalCounts();
    }

    return { documents, count };
  },

  getbyid: async (data) => {
    const { body, user } = data;
    const query = { _id: body.customerId };

    const documents = await model.getDocumentById(query);
    return documents;
  },

  delete: async (data) => {
    const { body, user } = data;
    const query = { _id: body.customerId };

    const deletedDocument = await model.deleteDocument(query);
    return deletedDocument;
  },
};
module.exports = CustomerService;
