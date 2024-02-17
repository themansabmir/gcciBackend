const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema(
  {
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
    employeeId: {
      type: String,
    },
    role: {
      type: String,
    },
    departments: [
      {
        departmentName: {
          type: String,
        },
        permissions: {
          type: [String],
       
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
