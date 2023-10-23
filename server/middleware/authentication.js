const jwt = require("jsonwebtoken");

const checkAccess = (departmentName, permissionType) => {
  return (req, res, next) => {
    try {
      const userDepartments = req.user.departments;
      const obj = userDepartments.find(
        (item) => item.departmentName === departmentName
      );
      if (!obj) return res.status(403).json({ msg: "Access Denied" });

      console.log(obj)

      const hasPermission = obj.permissions.includes(permissionType);
      if (hasPermission) {
        return next();
      }

      return res.status(403).json({ msg: "Permission Denied" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
    //   console.log()
    // console.log("check acces", userDepartments);
  };
};

const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.headers;

    const user = jwt.verify(token, process.env.ACCESS_SECRET_KEY);

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ msg: error.message });
  }
};

module.exports = { checkAccess, isAuthenticated };
