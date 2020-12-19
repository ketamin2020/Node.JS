const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("./contacts.models");
const { notFound, deleted, noFields } = require("./contact.helpers");

class ContactsController {
  async getContacts(req, res) {
    const contacts = await listContacts();
    res.status(200).send(contacts);
  }

  async getContactById(req, res) {
    const id = parseInt(req.params.contactId);
    const filteredContactById = await getContactById(id);
    if (!filteredContactById.toString()) {
      res.status(404).send(notFound);
    }
    res.status(200).send(filteredContactById);
  }

  async addContact(req, res) {
    const addedContact = await addContact(req.body);
    res.status(201).send(addedContact);
  }
  async removeContacts(req, res) {
    const id = parseInt(req.params.contactId);
    const findContact = await getContactById(id);

    if (!findContact.toString()) {
      res.status(404).send(notFound);
      return;
    }
    removeContact(id);
    res.status(200).send(deleted);
  }

  async updateContact(req, res) {
    const id = parseInt(req.params.contactId);
    const updateData = await updateContact(id, req.body);
    if (updateData === null) {
      res.status(400).send(noFields);
      return;
    }
    if (!updateData) {
      res.status(404).send(notFound);
      return;
    }
    res.status(200).send(updateData);
  }
}

module.exports = new ContactsController();
