const { Router } = require("express");
const userRouter = Router();
const {
  getContacts,
  getContactById,
  addContact,
  removeContacts,
  updateContact,
} = require("./contacts.controllers");

const { validateCreate, validatePatch } = require("./contacts.validator");

userRouter.get("/", getContacts);

userRouter.get("/:contactId", getContactById);

userRouter.post("/", validateCreate, addContact);

userRouter.delete("/:contactId", removeContacts);

userRouter.patch("/:contactId", validatePatch, updateContact);

module.exports = userRouter;
