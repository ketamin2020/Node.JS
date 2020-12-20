const fs = require("fs");
const path = require("path");
const { promises: fsPromises } = fs;
const contactsPath = path.join(__dirname, "../", "db", "contact.json");

async function listContacts() {
  const contacts = await fsPromises.readFile(contactsPath, "utf-8");
  const parsedContacts = JSON.parse(contacts);
  return parsedContacts;
}

async function getContactById(id) {
  const contacts = await listContacts();
  const findedUser = contacts.find((contact) => contact.id === id);
  return findedUser;
}

async function removeContact(id) {
  const contacts = await listContacts();
  const filteredContact = contacts.filter((c) => c.id !== id);
  await writeNewData(filteredContact);
}

async function addContact({ name, email, phone }) {
  const contacts = await listContacts();
  const id = await generatorId(contacts);
  const newContactToAdd = { id, name, email, phone };
  await writeNewData([...contacts, newContactToAdd]);
  return newContactToAdd;
}

async function updateContact(id, newData) {
  const contacts = await listContacts();
  const contactIdx = contacts.findIndex((data) => data.id === id);
  if (contactIdx === -1) {
    return;
  }
  const newUpdateData = { ...contacts[contactIdx], ...newData };
  contacts[contactIdx] = newUpdateData;
  await writeNewData(contacts);
  return newUpdateData;
}

async function writeNewData(data) {
  return await fsPromises.writeFile(contactsPath, JSON.stringify(data));
}

async function generatorId(dataArr, idGen = 0) {
  dataArr.forEach(({ id }) => (id > idGen ? (idGen = id) : idGen));
  return idGen + 1;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
