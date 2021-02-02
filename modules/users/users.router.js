const { Router } = require("express");
const userRouter = Router();
const {
  createNewUser,
  loginUser,
  userLogout,
  currentUserByToken,
  updateUserSubscription,
  replaceAvatar,
  verificationEmail,
} = require("./users.controller");
const authorize = require("../../middlewares/authorize");
const multer = require("../../middlewares/multerStorage");
const minifyImage = require("../../middlewares/minifyImages");
const { validateUser, validateSubscription } = require("./users.validator");

userRouter.post("/register", validateUser, createNewUser);
userRouter.post("/login", validateUser, loginUser);
userRouter.post("/logout", authorize, userLogout);
userRouter.get("/users/current", authorize, currentUserByToken);
userRouter.patch(
  "/users",
  authorize,
  validateSubscription,
  updateUserSubscription
);
userRouter.patch(
  "/users/avatars",
  authorize,
  multer.single("avatar"),
  minifyImage,
  replaceAvatar
);
userRouter.get("/verify/:token", verificationEmail);

module.exports = userRouter;
