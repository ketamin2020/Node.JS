const { Router } = require("express");
const userRouter = Router();
const {
  createNewUser,
  loginUser,
  authorize,
  userLogout,
  currentUserByToken,
  updateUserSubscription,
} = require("./userAuth.controller");
const { validateCreate } = require("./userAuth.validator");

userRouter.post("/register", validateCreate, createNewUser);
userRouter.post("/login", validateCreate, loginUser);
userRouter.post("/logout", authorize, userLogout);
userRouter.get("/users/current", authorize, currentUserByToken);
userRouter.patch("/users/:sub", authorize, updateUserSubscription);

module.exports = userRouter;
