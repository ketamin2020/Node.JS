const fs = require("fs");
const path = require("path");
const { promises: fsPromises } = fs;
const contactsPath = path.join(__dirname, "db", "contact.json");

async function listContacts() {
  const contacts = await fsPromises.readFile(contactsPath, "utf-8");
  const parsedContacts = JSON.parse(contacts);
  console.table(parsedContacts);
  return parsedContacts;
}

async function getContactById(id) {
  const contacts = await listContacts();
  const findedUser = contacts.filter((contact) => contact.id === id);
  console.table(findedUser);
  return findedUser;
}

async function removeContact(id) {
  const contacts = await listContacts();
  const filteredContact = contacts.filter((c) => c.id !== id);
  await writeNewData(filteredContact);
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const id = contacts[contacts.length - 1].id + 1;
  const newContactToAdd = { id, name, email, phone };
  await writeNewData([...contacts, newContactToAdd]);
  return newContactToAdd;
}

async function writeNewData(data) {
  return await fsPromises.writeFile(contactsPath, JSON.stringify(data));
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
