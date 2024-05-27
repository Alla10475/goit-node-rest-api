import Joi from "joi";

const subscrList = ["starter", "pro", "business"];

export const userRegistrationSchema = Joi.object({
    password: Joi.string().required().min(8),
    email: Joi.string().email().required(),
    subscription: Joi.string().valid(...subscrList),
    token: Joi.string()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const updateSubscrSchema = Joi.object({
  subscription: Joi.string().valid(...subscrList).required(),
});