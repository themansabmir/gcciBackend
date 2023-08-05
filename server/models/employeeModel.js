const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Role'

    }],
    required: true,
    validate: {
      validator:(value) => value.length>0
    },
    message:"Atleast one Role is required for employee"
  }
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
