const successResponse = ({ res, data, msg = "", code = 200, count = 0 }) => {
  return res.status(code).json({ data: data, count: count, msg: msg });
};
module.exports = successResponse;
