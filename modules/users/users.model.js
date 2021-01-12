const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, default: "" },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
});

userSchema.statics.updateToken = async function (id, newToken) {
  return this.findByIdAndUpdate(id, { token: newToken });
};

userSchema.statics.checkingPassword = async function (requestPass, userPass) {
  return await bcrypt.compare(requestPass, userPass);
};

userSchema.statics.doHashPasswordAndCreateUser = async function (data) {
  const hashPassword = await bcrypt.hash(data.password, 6);
  const newUser = await this.create({
    ...data,
    password: hashPassword,
  });
  return newUser;
};

userSchema.statics.createAndUpdateToken = async function (userId) {
  const newToken = await jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60,
  });
  await this.findByIdAndUpdate(userId, { token: newToken });
  return newToken;
};

userSchema.statics.updateSub = function (id, newData) {
  return this.findByIdAndUpdate(
    id,
    {
      $set: { subscription: newData },
    },
    {
      new: true,
    }
  );
};

module.exports = mongoose.model("User", userSchema);
