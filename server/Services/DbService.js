 class ModelServices {
  constructor(database) {
    this.database = database;
  }

  async add(data) {
    try {
      const savedDocument = await this.database.create(data);
      return savedDocument;
    } catch (error) {
      return error;
    }
  }

  async get(query) {
    try {
      const allDocs = await this.database.find(query).exec();
      return allDocs;
    } catch (error) {
      return error;
    }
  }
}



module.exports = ModelServices;