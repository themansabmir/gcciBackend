const Department = require("../models/departmentModel");

const departmentCtrl = {
  createDepartment: async (req, res) => {
    try {
      const { departmentName } = req.body;
      const isDepartment = await Department.findOne({ departmentName });
      if (isDepartment)
        return res.status(403).json({ msg: "Department already exists" });

      const savedDepartment = await Department.create({ departmentName });
      return res.status(200).json({ data: savedDepartment });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getAllDepartments: async (req, res) => {
    try {
      const departments = await Department.find();
      return res.status(200).json({ data: departments });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = { departmentCtrl };
