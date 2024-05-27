import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {

  try {
    const contacts = await Contact.find({ owner: req.user.id });

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
      throw HttpError(404, "Contact not found");
    }

    if (contact.owner.toString() !== req.user.id) {
      throw HttpError(404, "Contact not found");
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });

    if (!contact) {
      throw HttpError(404);
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    owner: req.user.id,
  };

  try {
    const newContact = await Contact.create(contact);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0)
      throw HttpError(400, "Body must have at least one field");

    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updatedContact.owner.toString() !== req.user.id) {
      throw HttpError(404, "Contact not found");
    }

    if (!updatedContact) throw HttpError(404);
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0)
      throw HttpError(
        400,
        "Body must have an object with key 'favorite' and its value boolean"
      );

    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedContact.owner.toString() !== req.user.id) {
      throw HttpError(404, "Contact not found");
    }

    if (!updatedContact) throw HttpError(404);
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
