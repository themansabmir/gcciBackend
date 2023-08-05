const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
  },
});

var Role = mongoose.model("Role", roleSchema);
module.exports = Role;
