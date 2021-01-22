const bcrypt = require("bcryptjs");
const userModel = require("./users.model");
const { promises: fsPromises } = require("fs");
const { ErrorHandler } = require("../../helpers/errorHeandler");
const generateAvatar = require("../../helpers/avatarGenerator");
const {
  notAuth,
  usedEmail,
  userNotFound,
  dataWrong,
} = require("../../helpers/messageErrorText");

class UserController {
  async createNewUser(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (user) {
        return res.status(409).send({ message: usedEmail });
      }
      const avatarURL = await generateAvatar();
      const passwordHash = await bcrypt.hash(password, 6);
      const newUser = await userModel.create({
        ...req.body,
        password: passwordHash,
        avatarURL: avatarURL.filePath,
      });
      await fsPromises.unlink(avatarURL.dest);
      return res.status(201).send({
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatar: avatarURL.filePath,
        },
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
      const isValidPassword = await user.checkingPassword(password);
      if (!isValidPassword) {
        throw new ErrorHandler(dataWrong, 401);
      }
      const token = await user.createAndUpdateToken();
      return res.status(200).send({
        token,
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

      await req.user.updateToken(null);

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
      const userWithUpdateSub = await req.user.updateSub(req.body.subscription);
      return res.status(200).send({
        subscription: userWithUpdateSub._doc.subscription,
        email: userWithUpdateSub._doc.email,
      });
    } catch (error) {
      next(error);
    }
  }

  async replaceAvatar(req, res, next) {
    try {
      await req.user.updateAvatar(req.file.path);
    } catch (err) {
      next(err);
    }
    res.status(200).send({ avatarURL: req.file.path });
  }
}

module.exports = new UserController();
