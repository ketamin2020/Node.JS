const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, default: "" },
  avatarURL: { type: String },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  verificationToken: { type: String, required: true },
  status: { type: String, enum: ["Verified", "Created"], default: "Created" },
});

userSchema.methods.verifiedUser = async function () {
  return await this.model("User").findByIdAndUpdate(
    this._id,
    {
      status: "Verified",
      verificationToken: null,
    },
    {
      new: true,
    }
  );
};

userSchema.statics.findeUserByVerificationToken = async function (
  verificationToken
) {
  return await this.findOne({ verificationToken });
};

userSchema.methods.updateToken = async function (newToken) {
  return await this.model("User").findByIdAndUpdate(this._id, {
    token: newToken,
  });
};
userSchema.statics.updateAvatar = async function (req) {
  const { filename } = req.file;
  const { protocol, hostname, user } = req;
  return await this.findByIdAndUpdate(
    user._id,
    {
      $set: {
        avatarURL: `${protocol}://${hostname}:${process.env.PORT}/images/${filename}`,
      },
    },
    {
      new: true,
    }
  );
};

userSchema.methods.checkingPassword = async function (requestPass) {
  return await bcrypt.compare(requestPass, this.password);
};

userSchema.methods.createAndUpdateToken = async function () {
  const newToken = await jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60,
  });
  await this.model("User").findByIdAndUpdate(this.id, { token: newToken });
  return newToken;
};

userSchema.methods.updateSub = async function (newData) {
  return await this.model("User").findByIdAndUpdate(
    this.id,
    {
      $set: { subscription: newData },
    },
    {
      new: true,
    }
  );
};

module.exports = mongoose.model("User", userSchema);
