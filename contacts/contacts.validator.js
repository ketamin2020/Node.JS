const Joi = require("joi");
const { ErrorHandler } = require("./contact.errorHeandler");

class ValidatorData {
  validateCreate(req, res, next) {
    const createContact = Joi.object({
      name: Joi.string().min(1).required(),
      email: Joi.string().email().min(1).required(),
      phone: Joi.string().min(4).required(),
      subscription: Joi.string(),
      password: Joi.string().min(4).required(),
      token: Joi.string(),
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
      phone: Joi.string().min(4),
      password: Joi.string(),
      subscription: Joi.string(),
    });

    const result = createContact.validate(req.body);

    if (result.error) {
      throw new ErrorHandler(result.error.details[0].message, 404);
    }
    next();
  }
}

module.exports = new ValidatorData();
