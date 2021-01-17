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
};
