const { mongoHandler } = require("../middleware/asyncHandler");

class ModelServices {
  constructor(database) {
    this.database = database;
  }

  createDocument = mongoHandler(async (data, options = {}) => {
    const documents = await this.database.create(data);

    return documents;
  });

  createMany = mongoHandler(async (data) => {
    const documents = await this.database.insertMany(data);
    return documents;
  });

  getAllDocuments = mongoHandler(async (query, options = {}) => {
    const { limit, sort, skip, populate } = options;

    const customQuery = this.database.find(query);

    if (skip!=="" && limit!=="") {
      customQuery.limit(limit).skip(skip);
    }

    if (sort) {
      customQuery.sort({ [sort]: -1 });
    } else {
      customQuery.sort({ createdAt: -1 });
    }

    // if (populate && Array.isArray(populate)) {
    //   populate.forEach((item) => {
    //     customQuery.populate(item);
    //   });
    // }
    const documents = await customQuery.exec();

    return documents;
  });

  updateDocument = mongoHandler(async (filter, data, options) => {
    const document = await this.database.update(filter, data, options);
    return document;
  });

  getDocumentById = mongoHandler(async (query) => {
    const document = await this.database.findOne(query);
    return document;
  });

  deleteDocument = mongoHandler(async (data) => {
    const deletedDocumnent = await this.database.delete(data);
    return deletedDocumnent;
  });

  totalCounts = mongoHandler(async (query) => {
    const count = await this.database.countDocuments(query);
    return count;
  });

  aggregation = mongoHandler(async (pipeline) => {
    const documents = await this.database.aggregate(pipeline);
    return documents;
  });
}

module.exports = ModelServices;
