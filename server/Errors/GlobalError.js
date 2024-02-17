module.exports = (err, req, res, next) => {
  err.httpCode = err.httpCode || 500;
  err.status = err.status || "Server error";
  console.log(err)

  if (process.env.NODE_ENV === "production") {
    return productionError(res, err);
  } else if (process.env.NODE_ENV === "development") {
    return developmentError();
  }
  return res.status(500).json({msg:err})
};

const productionError = (res, error) => {
  if (error.isOperational) {
    return res.status(error.httpCode).json({ message: error.msg });
  }

  return res.status(error.httpCode).json({ msg: "Server Error" });
};

const developmentError = (res, error) => {
  if (error.isOperational) {
    return res.status(error.httpCode).json({ message: error.msg });
  }
  return res.status(error.httpCode).json({ msg: error });
};
