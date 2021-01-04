const userModel = require("./userAuth.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ErrorHandler } = require("./userAuthErrorHeandler");
class UserController {
  async createNewUser(req, res, next) {
    const { password, email } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (user) {
        return res.status(409).send({ message: "Email in use" });
      }
      const passwordHash = await bcrypt.hash(password, 6);
      const newUser = await userModel.create({
        ...req.body,
        password: passwordHash,
      });
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
        throw new ErrorHandler("User not found", 400);
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new ErrorHandler("Email or password is wrong", 401);
      }
      const token = await userModel.createToken({ id: user.id });
      await userModel.updateToken(user.id, token);
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
        throw new ErrorHandler("Not authorized", 401);
      }
      await userModel.updateToken(req.user._id, null);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
  async authorize(req, res, next) {
    try {
      if (!req.headers["authorization"]) {
        throw new ErrorHandler("Not authorized", 401);
      }
      const token = await req.headers["authorization"].split(" ")[1];
      const userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        throw new ErrorHandler("Not authorized", 401);
      }
      req.user = user;
      req.token = token;
      next();
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
        throw new ErrorHandler("Not authorized", 401);
      }
      return res.status(200).send({ email, subscription });
    } catch (error) {
      next(error);
    }
  }

  async updateUserSubscription(req, res, next) {
    try {
      const { email, subscription } = await userModel.updateSub(
        req.user._id,
        req.params.sub
      );
      if (!email) {
        throw new ErrorHandler(error.message, 404);
      }
      return res.status(200).send({ email, subscription });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
