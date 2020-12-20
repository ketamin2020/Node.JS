const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("./contacts.models");
const { notFound, deleted, noFields } = require("./contact.helpers");
const { ErrorHandler } = require("./contact.errorHeandler");

class ContactsController {
  async getContacts(req, res) {
    const contacts = await listContacts();
    return res.status(200).send(contacts);
  }

  async getContactById(req, res, next) {
    try {
      const id = parseInt(req.params.contactId);
      const filteredContactById = await getContactById(id);
      if (!filteredContactById) {
        throw new ErrorHandler(notFound.message, 404);
      }
      return res.status(200).send(filteredContactById);
    } catch (error) {
      next(error);
    }
  }

  async createContact(req, res) {
    const addedContact = await addContact(req.body);
    return res.status(201).send(addedContact);
  }

  async removeContacts(req, res, next) {
    try {
      const id = parseInt(req.params.contactId);
      const findContact = await getContactById(id);
      if (!findContact) {
        throw new ErrorHandler(notFound.message, 404);
      }
      await removeContact(id);
      return res.status(200).send(deleted);
    } catch (error) {
      next(error);
    }
  }

  async patchContact(req, res, next) {
    try {
      const id = parseInt(req.params.contactId);
      if (Object.keys(req.body).length === 0) {
        throw new ErrorHandler(noFields.message, 400);
      }
      const updateData = await updateContact(id, req.body);
      if (updateData) {
        return res.status(200).send(updateData);
      }
      throw new ErrorHandler(notFound.message, 404);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContactsController();
