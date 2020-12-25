const { notFound, deleted } = require("./contact.helpers");
const { ErrorHandler } = require("./contact.errorHeandler");
const contactModel = require("./contacts.models");

class ContactsController {
  async getContacts(req, res, next) {
    try {
      const contacts = await contactModel.find();
      return res.status(200).send(contacts);
    } catch (error) {
      next(error);
    }
  }

  async getContactById(req, res, next) {
    try {
      const id = req.params.contactId;
      const findContactById = await contactModel.findById(id);
      if (!findContactById) {
        throw new ErrorHandler(notFound.message, 404);
      }
      return res.status(200).send(findContactById);
    } catch (error) {
      next(error);
    }
  }

  async createContact(req, res, next) {
    try {
      const addedContact = await contactModel.create(req.body);
      return res.status(201).send(addedContact);
    } catch (error) {
      next(eror);
    }
  }

  async removeContacts(req, res, next) {
    try {
      const id = req.params.contactId;
      const removeContact = await contactModel.findByIdAndRemove(id);
      if (!removeContact) {
        throw new ErrorHandler(notFound.message, 404);
      }
      return res.status(200).send(deleted);
    } catch (error) {
      next(error);
    }
  }

  async patchContact(req, res, next) {
    try {
      const id = req.params.contactId;
      const updateData = await contactModel.updateContact(id, req.body);
      if (!updateData) {
        throw new ErrorHandler(notFound.message, 404);
      }
      return res.status(200).send(updateData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContactsController();
