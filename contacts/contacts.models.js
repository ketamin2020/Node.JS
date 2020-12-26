const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  subscription: { type: String, default: "free" },
  token: { type: String, default: "" },
});
contactSchema.statics.updateContact = function (id, newData) {
  return this.findByIdAndUpdate(
    id,
    {
      $set: newData,
    },
    {
      new: true,
    }
  );
};

module.exports = mongoose.model("Contact", contactSchema);
