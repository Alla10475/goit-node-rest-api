import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

import Contact from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw HttpError(400, `${id} is not valid id`);

    const contact = await Contact.findById(id);

    if (!contact) throw HttpError(404);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw HttpError(400, `${id} is not valid id`);
    const result = await Contact.findByIdAndDelete(id);
    if (!result) throw HttpError(404);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw HttpError(400, `${id} is not valid id`);

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    if (!req.body || Object.keys(req.body).length === 0)
      throw HttpError(400, "Body must have at least one field");

    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedContact) throw HttpError(404);
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw HttpError(400, `${id} is not valid id`);

    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    if (!req.body || Object.keys(req.body).length === 0)
      throw HttpError(
        400,
        "Body must have an object with key 'favorite' and its value boolean"
      );

    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedContact) throw HttpError(404);
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

