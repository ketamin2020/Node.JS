const userModel = require("./users.model");
const { ErrorHandler } = require("../../helpers/errorHeandler");
const {
  notAuth,
  usedEmail,
  userNotFound,
  dataWrong,
  invalidSubs,
} = require("../../helpers/messageErrorText");
const SUBSCRIPTION = require("../../helpers/subscription");

class UserController {
  async createNewUser(req, res, next) {
    const { email } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (user) {
        return res.status(409).send({ message: usedEmail });
      }
      const newUser = await userModel.doHashPasswordAndCreateUser(req.body);
      return res.status(201).send({
        user: { email: newUser.email, subscription: newUser.subscription },
      });
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req, res, next) {
    const { password, email } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new ErrorHandler(userNotFound, 400);
      }
      const isValidPassword = await userModel.checkingPassword(
        password,
        user.password
      );
      if (!isValidPassword) {
        throw new ErrorHandler(dataWrong, 401);
      }
      const token = await userModel.createAndUpdateToken(user.id);
      return res.status(200).send({
        token: `Bearer ${token}`,
        user: { email: user.email, subscription: user.subscription },
      });
    } catch (error) {
      next(error);
    }
  }

  async userLogout(req, res, next) {
    try {
      if (!req.user._id) {
        throw new ErrorHandler(notAuth, 401);
      }
      await userModel.updateToken(req.user._id, null);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async currentUserByToken(req, res, next) {
    try {
      const { email, subscription } = await userModel.findOne({
        token: req.user.token,
      });
      if (!email) {
        throw new ErrorHandler(notAuth, 401);
      }
      return res.status(200).send({ email, subscription });
    } catch (error) {
      next(error);
    }
  }

  async updateUserSubscription(req, res, next) {
    try {
      const { subscription } = req.body;
      if (!subscription || !SUBSCRIPTION.includes(subscription)) {
        throw new ErrorHandler(invalidSubs, 400);
      }
      const userWithUpdateSub = await userModel.updateSub(
        req.user._id,
        subscription
      );

      return res.status(200).send({
        subscription: userWithUpdateSub._doc.subscription,
        email: userWithUpdateSub._doc.email,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
