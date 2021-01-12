const { notFound, deleted } = require("../../helpers/messageErrorText");
const { ErrorHandler } = require("../../helpers/errorHeandler");
const contactModel = require("../contacts/contacts.models");

class ContactsController {
  async getContactBySubsription(req, res, next) {
    try {
      if (!req.query.sub) {
        next();
      }
      const sortData = await contactModel.find({
        subscription: req.query.sub,
      });
      if (sortData.length === 0) {
        throw new ErrorHandler(notFound.message, 404);
      }
      return res.status(200).send(sortData);
    } catch (error) {
      next(error);
    }
  }

  async getContacts(req, res, next) {
    try {
      const contact = await contactModel.paginate({}, req.query);
      return res.status(200).send(contact);
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
      next(error);
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
