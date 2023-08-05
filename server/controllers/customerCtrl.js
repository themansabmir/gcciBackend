const Customer = require("../models/customer/customerModel");
const CustomerAddress = require('../models/customer/customerAddress')

const CustomerType = require("../models/customer/customertypeModel");

const customerCtrl = {
  createCustomer: async (req, res) => {
    try {

      const {
        companyName,

        telephoneNumber,
        mobileNumber,
        email,
        fax,
        customerAddress,
        panNumber,
        customerType,
      } = req.body;

      const newCustomer = await Customer.create({
        companyName,

        telephoneNumber,
        mobileNumber,
        email,
        fax,

        panNumber,
        customerAddress,
        customerType,
      });
      await newCustomer.populate("customerType customerAddress");

      res.status(200).json({ data: newCustomer });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllCustomer: async (req, res) => {
    try {
      const query = req.query.q;
      const regex = new RegExp(query, "i");


      const customers = await Customer.find({ companyName: regex }).populate('customerAddress').populate('customerType')



      res.status(200).json({data:customers})
    } catch (error) {

    }
  },
  updateCustomer: () => {},
  deleteCustomer: () => {},

  createCustomerType: async (req, res) => {
    try {
      const { customerType } = req.body;

      const isCustomerType = await CustomerType.findOne({ customerType });
      if (isCustomerType)
        return res.status(409).json({ msg: "Data already exists" });

      const newCustomerType = await CustomerType.create({
        customerType,
      });

      res.status(200).json({ newCustomerType });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getCustomerType: async (req, res) => {
    try {
      const customerType = await CustomerType.find();
      res.status(200).json({ data: customerType });
    } catch (error) {}
  },
  updateCustomerType: () => {},
  deleteCustomerType: () => {},
};

module.exports = customerCtrl;
