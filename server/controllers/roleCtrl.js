const Role = require("../models/roleModel");

const roleCtrl = {
  createRole: async (req, res) => {
    try {
      const { roleName } = req.body;
      const isRole = await Role.findOne({ roleName });
      if (isRole)
        return res.status(409).json({
          msg: "Cannot create multiple roles with same role name, roles must be unique",
        });

      const newRole = await Role.create({ roleName });
      return res.status(200).json({ data: newRole });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getRoles: async (req, res) => {
    try {
      const roles = await Role.find();
      return res.status(200).json({ data: roles });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteRole: async (req, res) => {
    await Role.findByIdAndDelete({ _id: req.params.id });

    res.status(200).json({ msg: "Deleted successfully" });
    try {
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateRole: async (req, res) => {
    try {
      const { roleName } = req.body;

      if (roleName === "")
        return res.status(400).json({ msg: "Empty rolename not allowed" });

      const updatedRole = await Role.findOneAndUpdate(
        { _id: req.params.id },
        { roleName: roleName },
        {
          new: true,
        }
      );

      return res.status(200).json({ msg: updatedRole });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = roleCtrl;
