const Joi = require("joi");
const { handleError, ErrorHandler } = require("./contact.errorHeandler");

class ValidatorData {
  validateCreate(req, res, next) {
    const createContact = Joi.object({
      name: Joi.string().min(1).required(),
      email: Joi.string().email().min(1).required(),
      number: Joi.string().min(4).required(),
    });

    const result = createContact.validate(req.body);
    if (result.error) {
      throw new ErrorHandler(result.error.details[0].message, 404);
    }
    next();
  }

  validatePatch(req, res, next) {
    const createContact = Joi.object({
      name: Joi.string().min(1),
      email: Joi.string().email().min(1),
      number: Joi.string().min(4),
    });

    const result = createContact.validate(req.body);

    if (result.error) {
      throw new ErrorHandler(result.error.details[0].message, 404);
    }
    next();
  }
}

module.exports = new ValidatorData();
