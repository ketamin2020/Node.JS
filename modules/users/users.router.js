const { Router } = require("express");
const userRouter = Router();
const {
  createNewUser,
  loginUser,
  userLogout,
  currentUserByToken,
  updateUserSubscription,
} = require("./users.controller");
const authorize = require("../../middlewares/authorize");
const { validateUser } = require("./users.validator");

userRouter.post("/register", validateUser, createNewUser);
userRouter.post("/login", validateUser, loginUser);
userRouter.post("/logout", authorize, userLogout);
userRouter.get("/users/current", authorize, currentUserByToken);
userRouter.patch("/users", authorize, updateUserSubscription);

module.exports = userRouter;
