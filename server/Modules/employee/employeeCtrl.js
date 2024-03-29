const Employee = require("./employeeModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const employeeCtrl = {
  createEmployee: async (req, res) => {
    try {
      const {
        username,
        fullname,
        email,
        password,
        role,
        employeeId,
        departments,
      } = req.body;

      // Check if the email already exists in the database
      const existingEmployee = await Employee.findOne({
        $or: [
          { email: email },
          { username: username }, // Assuming 'username' is the field you want to check
        ],
      });
      if (existingEmployee) {
        return res.status(409).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a new employee instance
      const newEmployee = new Employee({
        username,
        fullname,
        email,
        password: hashedPassword,
        role,
        employeeId,
        departments,
      });
      await newEmployee.save();
      const findEmployee = await Employee.findById(newEmployee._id);

      const payload = {
        userId: findEmployee._id,
        role: findEmployee.role,
        departments: findEmployee.departments,
        username: findEmployee.username,
      };

      // Save the new employee in the database

      const token = await generateAccessToken(payload);

      res.cookie("accessToken", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      });

      // Return the newly created employee
      res.status(200).json({ token });
    } catch (error) {
      // Handle any error that occurred during the process
      res.status(500).json({ error: error.message });
    }
  },
  getAllEmployee: async (req, res) => {
    try {
      // Retrieve all employees from the database
      const employees = await Employee.find()
      .select("-password");

      // Return the list of employees
      res.status(200).json({ data: employees });
    } catch (error) {
      // Handle any error that occurred during the process
      res.status(500).json({ error: error.message });
    }
  },

  updateEmployee: async (req, res) => {
    try {
      const data = req.body;
      const updatedEmployee = await Employee.findByIdAndUpdate(
        { _id: req.body._id },
        data,
        {
          new: true,
        }
      );
      res.status(200).json({ msg: updatedEmployee });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteEmployee: async (req, res) => {
    try {
      await Employee.findByIdAndDelete(req.params.id);
      return res.status(200).json({ msg: "Employee deleted successfully" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  loginEmployee: async (req, res) => {
    try {
      const { email, password } = req.body;
      const employee = await Employee.findOne({ email });
      if (!employee) return res.status(400).json({ msg: "Email incorrect" });

      const isMatch = await bcrypt.compare(password, employee.password);

      if (isMatch === false)
        return res.status(400).json({ msg: "Email or password is incorrect" });
      const findEmployee = await Employee.findById(employee._id, "-password");

      const payload = {
        userId: findEmployee._id,
        role: findEmployee.role,
        departments: findEmployee.departments,
        username: findEmployee.username,
      };

      const token = await generateAccessToken(payload);

      res.cookie("accessToken", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      });

      // Return the newly created employee
      res.status(200).json({
        token: token,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logoutEmployee: async (req, res) => {
    try {
      res.clearCookie("accessToken");
      return res.status(200).json({ msg: "Logout Sucessfully" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = employeeCtrl;

const generateAccessToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {
      expiresIn: "2d",
    });
  } catch (error) {
    return error.message;
  }
};
