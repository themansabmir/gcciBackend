const CustomerAddress = require("../models/customer/customerAddress");

const addressCtrl = {
  createAddress: async (req, res) => {
    try {
      const { city, state, address, pinCode, country, gstNumber } = req.body;

      const newAddress = await CustomerAddress.create({
        city,
        state,
        address,
        pinCode,
        country,
        gstNumber,
      });
      res.status(200).json({ data: newAddress });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAddress: async (req, res) => {
    try {
      const address = await CustomerAddress.find();
      res.status(200).json({ data: address });
    } catch (error) {}
  },
};


module.exports= addressCtrl