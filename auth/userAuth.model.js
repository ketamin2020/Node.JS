const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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

userSchema.statics.createToken = async function (id) {
  return jwt.sign(id, process.env.JWT_SECRET, {
    expiresIn: 60 * 60,
  });
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
