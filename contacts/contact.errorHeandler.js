const handleError = (err, res) => {
  const { statusCode, message } = err;
  res.status(statusCode).send({
    status: "error",
    statusCode,
    message,
  });
};

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message, statusCode);
    this.statusCode = statusCode;
    this.message = message;
    delete this.stack;
  }
}
module.exports = {
  ErrorHandler,
  handleError,
};
