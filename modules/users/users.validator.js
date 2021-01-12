const { ErrorHandler } = require("../../helpers/errorHeandler");
const Joi = require("joi");
class ValidateData {
  validateUser(req, res, next) {
    const createContact = Joi.object({
      email: Joi.string().email().min(1).required(),
      password: Joi.string().min(4).required(),
    });

    const result = createContact.validate(req.body);
    if (result.error) {
      throw new ErrorHandler(result.error.details[0].message, 400);
    }
    next();
  }
}

module.exports = new ValidateData();
