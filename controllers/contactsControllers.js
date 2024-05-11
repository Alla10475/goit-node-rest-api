import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  editContact,
} from "../services/contactsServices.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = (req, res) => {
  listContacts().then((contacts) => res.status(200).json(contacts));
};

export const getOneContact = (req, res) => {
  const { id } = req.params;
  getContactById(id)
    .then((contact) => {
      if (contact) {
        return res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((error) => {
      console.error("error: ", error);
    });
};

export const deleteContact = (req, res) => {
  const { id } = req.params;
  removeContact(id)
    .then((contact) => {
      if (contact) {
        return res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((error) => {
      console.error("error: ", error);
    });
};

export const createContact = (req, res) => {
  const { name, email, phone } = req.body;
  const cont = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };
  const { error } = createContactSchema.validate(cont, {
    abortEarly: false,
  });
  if (error) {
    res.status(400).send({ message: error.message });
  } else {
    addContact(name, email, phone)
      .then((contact) => {
        res.status(201).json(contact);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  }
};

export const updateContact = (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .send({ message: "Body must have at least one field" });
  }
  const { error, value } = updateContactSchema.validate(updateData, {
    abortEarly: false,
  });
  if (error) {
    res.status(400).send({ message: error.message });
  } else {
    editContact(id, updateData)
      .then((contact) => {
        if (contact) {
          res.status(200).json(contact);
        } else {
          res.status(404).json({ message: "Not found" });
        }
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  }
};
