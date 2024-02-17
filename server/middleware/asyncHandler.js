const AsyncHandler = (func) => {
  return (req, res, next) => {
    return func(req, res, next).catch((err) => next(err));
  };
};

const mongoHandler = (func) => {
  return (...data) => {
    return func(...data).catch((err) => err

    );
  };
};

module.exports = { AsyncHandler, mongoHandler };
