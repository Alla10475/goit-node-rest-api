import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  phone: Joi.string().required().min(7),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  phone: Joi.string().min(7),
});

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})
