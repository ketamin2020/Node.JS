const jwt = require("jsonwebtoken");
const userModel = require("../modules/users/users.model");
const { notAuth } = require("../helpers/messageErrorText");
const { ErrorHandler } = require("../helpers/errorHeandler");
module.exports = async function authorize(req, res, next) {
  try {
    const authorizationHeader = await req.get("Authorization");
    const token = await authorizationHeader.replace("Bearer ", "");
    if (!token) {
      throw new ErrorHandler(notAuth, 401);
    }
    const userId = await jwt.verify(token, process.env.JWT_SECRET).id;
    if (!userId) {
      throw new ErrorHandler(notAuth, 401);
    }

    const user = await userModel.findById(userId);
    if (!user || user.token !== token) {
      throw new ErrorHandler(notAuth, 401);
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
